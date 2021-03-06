import React, {useEffect, useState} from 'react';
import {
  Affix,
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Spin
} from 'antd';
import Popup, {PopupProps} from "@/components/Popup";
import {Feature} from "ol";
import {LineString, Point} from "ol/geom";
import {Icon, Stroke, Style} from "ol/style";
import OLMapWrapper from "@/components/OLMap";
import {Moment} from "moment";
import {routing} from "./service";
import {RoutingParams, RoutingPlan} from "./data";

const [MAX_LNG, MIN_LNG] = [116.495, 116.265];
const [MAX_LAT, MIN_LAT] = [39.995, 39.820];


const RoutingView: React.FC = () => {
  const [trace] = useState<Feature>(new Feature());

  const [plans, setPlans] = useState<RoutingPlan[]>();
  const [popupProps, setPopupProps] = useState<PopupProps>({visible: false});
  const [coord, setCoord] = useState<[number, number]>();
  const [origin] = useState<Feature<Point>>(new Feature());
  const [destination] = useState<Feature<Point>>(new Feature());
  const [loading, setLoading] = useState(false);

  trace.setStyle(new Style({
    stroke: new Stroke({
      color: '#00ffff',
      width: 5
    }),
  }));
  origin.setStyle(new Style({
    image: new Icon({
      anchor: [0.5, 1],
      scale: 0.25,
      src: '/icons/origin.png',
    })
  }));
  destination.setStyle(new Style({
    image: new Icon({
      anchor: [0.5, 1],
      scale: 0.25,
      src: '/icons/dest.png',
    })
  }));

  const [form] = Form.useForm();

  useEffect(() => {
    if (origin.getGeometry()) {
      form.setFieldsValue({
        origin_location: {
          'lng': origin.getGeometry()[0],
          'lat': origin.getGeometry()[1],
        }
      });
    }
  }, [origin]);


  const onclick = ([lng, lat]: [number, number], [x, y]: [number, number]) => {
    setPopupProps({visible: true, x, y});
    setCoord([lng, lat]);
  };

  const onReset = () => {
    setPlans([]);
    setPopupProps({
      visible: false
    });
    origin.setGeometry(undefined);
    destination.setGeometry(undefined);
    trace.setGeometry(undefined);
    form.resetFields();
  };

  const planList = <Collapse
    accordion
    onChange={key => {
      const idx = parseInt(key as string, 10);
      if (plans && idx >= 0 && idx < plans.length) {
        plans[idx].path.forEach(path => {
          trace.setGeometry(new LineString(path.path.coordinates));
        });
      }
    }}
  >
    {plans && plans.map((plan, idx) => (
      // eslint-disable-next-line react/no-array-index-key
      <Collapse.Panel key={idx} header={plan.summary.descriptions}>
        约 {plan.summary.costs.time} 分钟 ·
        共 {plan.summary.costs.distance} 公里 ·
        需 {plan.summary.costs.price} 元 ·
        转乘 {plan.summary.costs.transfer_time} 次
      </Collapse.Panel>))}
  </Collapse>;

  const popupForm = <Form
    labelCol={{span: 8}}
    wrapperCol={{span: 16}}
    layout="horizontal"
    size='small'
  >
    <Form.Item label="位置">
      <Input.Group compact>
        <Form.Item noStyle fieldKey={['origin_location', 'lng']}>
          <Input disabled style={{width: '50%'}} value={coord && coord[0].toFixed(8)}/>
        </Form.Item>
        <Form.Item noStyle fieldKey={['origin_location', 'lat']}>
          <Input disabled style={{width: '50%'}} value={coord && coord[1].toFixed(8)}/>
        </Form.Item>
      </Input.Group>
    </Form.Item>
    <Form.Item wrapperCol={{offset: 8, span: 16}}>
      <Button
        type="primary"
        htmlType="button"
        onClick={() => {
          if (coord) {
            origin.setGeometry(new Point(coord));
            form.setFieldsValue({
              origin_location: {
                'lng': coord[0],
                'lat': coord[1]
              }
            })
          }
          setPopupProps({visible: false})
        }}
      >设为起点</Button>
      <Divider type="vertical"/>
      <Button
        type="primary"
        htmlType="button"
        onClick={() => {
          if (coord) {
            destination.setGeometry(new Point(coord));
            form.setFieldsValue({
              dest_location: {
                'lng': coord[0],
                'lat': coord[1]
              }
            })
          }
          setPopupProps({visible: false})
        }}
      >设为终点</Button>
      <Divider type="vertical"/>
      <Button
        htmlType="button"
        onClick={() => setPopupProps({visible: false})}
      >取消</Button>
    </Form.Item>
  </Form>;

  const inputForm = <Form
    form={form}
    labelCol={{span: 4}}
    wrapperCol={{span: 20}}
    layout="horizontal"
    size='small'
    onFinish={async (params: RoutingParams) => {
      setLoading(true);
      await routing({
        ...params,
        timestamp: (params.timestamp as Moment)?.unix(),
        total: 3
      })
        .then(data => {
          setPlans(data.plans);
        }).catch(reason => {
          message.error(reason.toString());
        });
      setLoading(false);
    }}
    onReset={onReset}
    validateMessages={{
      // eslint-disable-next-line no-template-curly-in-string
      required: '请填写${label}!',
      types: {
        // eslint-disable-next-line no-template-curly-in-string
        email: '${label}不是合法的邮箱地址！',
        // eslint-disable-next-line no-template-curly-in-string
        number: '${label}不是合法的数字！',
      },
      number: {
        // eslint-disable-next-line no-template-curly-in-string
        range: '${label}必须在 ${min} 和 ${max} 之间。',
      },
    }}
  >
    <Form.Item label="交通模式" name='modals' initialValue={['walking', 'driving', 'taxi', 'public']}>
      <Checkbox.Group>
        <Row>
          <Col span={12}>
            <Checkbox disabled value="walking"> 步行 </Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox value="driving"> 驾车 </Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox value="taxi"> 出租车 </Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox value="public"> 公交地铁 </Checkbox>
          </Col>
        </Row>
      </Checkbox.Group>
    </Form.Item>
    <Form.Item label="起点" name='origin_location'>
      <Input.Group compact>
        <Form.Item label='经度' noStyle fieldKey={['origin_location', 'lng']}
                   rules={[{required: true}, {type: 'number', min: MIN_LNG, max: MAX_LNG}]}
                   name={['origin_location', 'lng']}>
          <InputNumber style={{width: '50%'}} placeholder="经度"/>
        </Form.Item>
        <Form.Item label='纬度' noStyle fieldKey={['origin_location', 'lat']}
                   rules={[{required: true}, {type: 'number', min: MIN_LAT, max: MAX_LAT}]}
                   name={['origin_location', 'lat']}>
          <InputNumber style={{width: '50%'}} placeholder="纬度"/>
        </Form.Item>
      </Input.Group>
    </Form.Item>
    <Form.Item label="终点" name='dest_location'>
      <Input.Group compact>
        <Form.Item label='经度' noStyle fieldKey={['dest_location', 'lng']}
                   rules={[{required: true}, {type: 'number', min: MIN_LNG, max: MAX_LNG}]}
                   name={['dest_location', 'lng']}>
          <InputNumber style={{width: '50%'}} placeholder="经度"/>
        </Form.Item>
        <Form.Item label='纬度' noStyle fieldKey={['dest_location', 'lat']}
                   rules={[{required: true}, {type: 'number', min: MIN_LAT, max: MAX_LAT}]}
                   name={['dest_location', 'lat']}>
          <InputNumber style={{width: '50%'}} placeholder="纬度"/>
        </Form.Item>
      </Input.Group>
    </Form.Item>
    <Form.Item label="出发时间" name='timestamp'>
      <DatePicker showTime showNow/>
    </Form.Item>
    <Form.Item label="用户偏好" name='preference' initialValue='default'>
      <Radio.Group>
        <Radio.Button value="default">推荐方案</Radio.Button>
        <Radio.Button value="distance">路程最短</Radio.Button>
        <Radio.Button value="time">耗时最少</Radio.Button>
        <Radio.Button value="price">费用最低</Radio.Button>
        <Radio.Button value="transfer_time">转乘最少</Radio.Button>
      </Radio.Group>
    </Form.Item>
    <Form.Item wrapperCol={{offset: 6, span: 18}}>
      <Button type="primary" htmlType="submit">查询</Button>
      <Button htmlType="button" onClick={onReset}>重置</Button>
    </Form.Item>
  </Form>;

  return <OLMapWrapper baseMap='OSM' features={[origin, destination, trace]} onclick={onclick}>
    <Affix style={{position: 'absolute', zIndex: 10, right: 40, top: 40}}>
      <Spin spinning={loading}>
        <Card>
          <Row>
            <Col span={24}>
              {inputForm}
            </Col>
          </Row>
          <Row hidden={!plans || plans.length === 0}>
            <Col span={24}>
              {planList}
            </Col>
          </Row>
        </Card>
      </Spin>
    </Affix>

    <Popup {...popupProps}>
      {popupForm}
    </Popup>
  </OLMapWrapper>
};

export default RoutingView;
