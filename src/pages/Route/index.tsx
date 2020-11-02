import React, {useEffect, useState} from 'react';
import {
  Card,
  Checkbox,
  Row,
  Col,
  Form,
  Input,
  Affix,
  DatePicker,
  Button,
  InputNumber,
  Radio,
  Divider,
  Collapse
} from 'antd';
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import {defaults} from "ol/control";
import Popup, {PopupProps} from "@/components/Popup";
import {PageContainer} from "@ant-design/pro-layout";
import {Feature} from "ol";
import {LineString, Point} from "ol/geom";
import {Icon, Stroke, Style} from "ol/style";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {routing} from "./service";
import {RoutingParams, RoutingPlan} from "./data";

const map = new Map({
  controls: defaults({
    attribution: false
  }),
  view: new View({
    center: [(116.496266 + 116.271389) / 2, (39.989214 + 39.832525) / 2],
    zoom: 12,
    projection: 'EPSG:4326'
  }),
  layers: [
    new TileLayer({
      source: new OSM(),
    })
  ],
  target: undefined,
});

const [originPoint, destPoint, trace] = [new Feature(), new Feature(), new Feature()];

originPoint.setStyle(new Style({
  image: new Icon({
    anchor: [0.5, 1],
    scale: 0.25,
    src: '/icons/origin.png',
  })
}));
destPoint.setStyle(new Style({
  image: new Icon({
    anchor: [0.5, 1],
    scale: 0.25,
    src: '/icons/dest.png',
  })
}));
trace.setStyle(new Style({
  stroke: new Stroke({
    color: '#00ffff',
    width: 5
  }),
}));

map.addLayer(new VectorLayer({
  source: new VectorSource({
    features: [originPoint, destPoint, trace],
  })
}));

const MapView: React.FC = () => {

  const [plans, setPlans] = useState((): RoutingPlan[] => []);
  const [popupProps, setPopupProps] = useState((): PopupProps => {
    return {visible: false}
  });

  const [form] = Form.useForm();

  const onReset = () => {
    form.resetFields();
    setPlans([]);
    setPopupProps({
      visible: false
    });
    originPoint.setGeometry(undefined);
    destPoint.setGeometry(undefined);
    trace.setGeometry(undefined);
  };

  const onFinish = (params: RoutingParams) => {
    // console.log(params);
    routing({
      ...params,
      total: 3
    })
      .then(data => {
        setPlans(data.plans);
      });
  }

  const planList = <Collapse
    accordion
    onChange={key => {
      const idx = parseInt(key as string, 10);
      if (idx >= 0 && idx < plans.length) {
        plans[idx].path.forEach(path => {
          trace.setGeometry(new LineString(path.path.coordinates));
        });
      }
    }}
  >
    {plans.map((plan, idx) => (
      // eslint-disable-next-line react/no-array-index-key
      <Collapse.Panel key={idx} header={plan.summary.descriptions}>
        约 {plan.summary.costs.time} 分钟 ·
        共 {plan.summary.costs.distance} 公里 ·
        需 {plan.summary.costs.price} 元 ·
        转乘 {plan.summary.costs.transfer_time} 次
      </Collapse.Panel>))}
  </Collapse>;

  map.on('singleclick', (evt) => {
    setPopupProps({
      visible: true,
      child: <Form
        labelCol={{span: 8}}
        wrapperCol={{span: 16}}
        layout="horizontal"
        size='small'
      >
        <Form.Item label="位置">
          <Input.Group compact>
            <Form.Item noStyle fieldKey={['origin_location', 'lng']}>
              <Input disabled style={{width: '50%'}} value={evt.coordinate[0].toFixed(8)}/>
            </Form.Item>
            <Form.Item noStyle fieldKey={['origin_location', 'lat']}>
              <Input disabled style={{width: '50%'}} value={evt.coordinate[1].toFixed(8)}/>
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item wrapperCol={{offset: 8, span: 16}}>
          <Button
            type="primary"
            htmlType="button"
            onClick={() => {
              form.setFieldsValue({
                origin_location: {
                  'lng': evt.coordinate[0],
                  'lat': evt.coordinate[1],
                }
              });
              originPoint.setGeometry(new Point(evt.coordinate));
              setPopupProps({visible: false});
            }}
          >设为起点</Button>
          <Divider type="vertical"/>
          <Button
            type="primary"
            htmlType="button"
            onClick={() => {
              form.setFieldsValue({
                dest_location: {
                  'lng': evt.coordinate[0],
                  'lat': evt.coordinate[1]
                }
              });
              destPoint.setGeometry(new Point(evt.coordinate));
              setPopupProps({visible: false});
            }}
          >设为终点</Button>
          <Divider type="vertical"/>
          <Button
            htmlType="button"
            onClick={() => {
              setPopupProps({visible: false});
            }}
          >取消</Button>
        </Form.Item>
      </Form>,
      x: evt.pixel[0],
      y: evt.pixel[1],
    });
  });

  useEffect(() => {
    (() => {
        map.setTarget('map');
        return () => map.setTarget(undefined);
      }
    )();
  }, []);

  const inputForm = <Form
    form={form}
    labelCol={{span: 4}}
    wrapperCol={{span: 20}}
    layout="horizontal"
    size='small'
    onFinish={onFinish}
    onReset={onReset}
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
        <Form.Item noStyle fieldKey={['origin_location', 'lng']} required name={['origin_location', 'lng']}>
          <InputNumber style={{width: '50%'}} placeholder="经度"/>
        </Form.Item>
        <Form.Item noStyle fieldKey={['origin_location', 'lat']} required name={['origin_location', 'lat']}>
          <InputNumber style={{width: '50%'}} placeholder="纬度"/>
        </Form.Item>
      </Input.Group>
    </Form.Item>
    <Form.Item label="终点" name='dest_location'>
      <Input.Group compact>
        <Form.Item noStyle fieldKey={['dest_location', 'lng']} required name={['dest_location', 'lng']}>
          <InputNumber style={{width: '50%'}} placeholder="经度"/>
        </Form.Item>
        <Form.Item noStyle fieldKey={['dest_location', 'lat']} required name={['dest_location', 'lat']}>
          <InputNumber style={{width: '50%'}} placeholder="纬度"/>
        </Form.Item>
      </Input.Group>
    </Form.Item>
    <Form.Item label="出发时间" name='timestamp'>
      <DatePicker showTime showNow/>
    </Form.Item>
    <Form.Item label="用户偏好" name='preference'>
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

  return <PageContainer>
    <Card>
      <div id='map' style={{height: '800px'}}>
        <Affix style={{position: 'absolute', zIndex: 10, right: 40, top: 40}}>
          <Card>
            <Row>
              <Col span={24}>
                {inputForm}
              </Col>
            </Row>
            <Row hidden={plans.length === 0}>
              <Col span={24}>
                {planList}
              </Col>
            </Row>
          </Card>
        </Affix>
        <Popup {...popupProps}/>
      </div>
    </Card>
  </PageContainer>
};

export default MapView;
