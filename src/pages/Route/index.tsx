import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Checkbox, Row, Col, Form, Input, Tabs, List } from 'antd';

const FormDemo = () => {
  const [componentSize] = useState('default');

  return (
    <>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
        initialValues={{ size: componentSize }}
      >
        <Form.Item label="交通模式">
          <Checkbox.Group defaultValue={['walking', 'driving', 'taxi', 'public']}>
            <Row>
              <Col span={12}>
                <Checkbox disabled value="walking">
                  步行
                </Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="driving">驾车</Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="taxi">出租车</Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="public">公交地铁</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item label="起点">
          <Input.Group compact>
            <Form.Item
              name={['o', 'lng']}
              noStyle
              rules={[{ required: true, message: 'Province is required' }]}
            >
              <Input style={{ width: '50%' }} defaultValue={116.36363} placeholder="经度" />
            </Form.Item>
            <Form.Item
              name={['o', 'lat']}
              noStyle
              rules={[{ required: true, message: 'Street is required' }]}
            >
              <Input style={{ width: '50%' }} defaultValue={39.98113} placeholder="纬度" />
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item label="终点">
          <Input.Group compact>
            <Form.Item
              name={['d', 'lng']}
              noStyle
              rules={[{ required: true, message: 'Province is required' }]}
            >
              <Input style={{ width: '50%' }} defaultValue={116.36763} placeholder="经度" />
            </Form.Item>
            <Form.Item
              name={['d', 'lat']}
              noStyle
              rules={[{ required: true, message: 'Street is required' }]}
            >
              <Input style={{ width: '50%' }} defaultValue={40.02298} placeholder="纬度" />
            </Form.Item>
          </Input.Group>
        </Form.Item>
      </Form>
    </>
  );
};

const MapView: React.FC = () => {
  const data = [
    {
      title: '方案1',
      time: 22,
      distance: 13.0,
      price: 22.0,
      conversion: 0,
      description: '途径：学院路 > 四环 > 北湖渠路',
      highlighted: true,
    },
    {
      title: '方案2',
      time: 23,
      distance: 17.4,
      price: 27.0,
      conversion: 3,
      description: '途径：西土城路 > 三环 > 京承高速',
      highlighted: false,
    },
    {
      title: '方案3',
      time: 24,
      distance: 13.5,
      price: 23.0,
      conversion: 5,
      description: '途径：四环 > 北辰东路 > 科荟路',
      highlighted: false,
    },
  ];
  return (
    <PageContainer>
      <Card>
        <Row>
          <FormDemo />
        </Row>
        <Row>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="推荐方案" key="1">
              <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item) => (
                  <List.Item key={item.title}>
                    <List.Item.Meta
                      style={{ fontWeight: item.highlighted ? 'bold' : 'normal' }}
                      title={item.title}
                      description={item.description}
                    />
                    约{item.time}分钟 · {item.distance}公里 · 需{item.price}元 · 转乘
                    {item.conversion}次
                  </List.Item>
                )}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="路程最短" key="2">
              Content of Tab Pane 2
            </Tabs.TabPane>
            <Tabs.TabPane tab="耗时最少" key="3">
              Content of Tab Pane 3
            </Tabs.TabPane>
            <Tabs.TabPane tab="费用最低" key="4">
              Content of Tab Pane 3
            </Tabs.TabPane>
            <Tabs.TabPane tab="转乘最少" key="5">
              Content of Tab Pane 3
            </Tabs.TabPane>
          </Tabs>
        </Row>
        {/*  <Image src='tmp/route.png'/>  */}
      </Card>
    </PageContainer>
  );
};

export default MapView;
