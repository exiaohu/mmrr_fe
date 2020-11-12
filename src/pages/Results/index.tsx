import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {Line} from "@ant-design/charts";
import {Button, Card, Col, Row} from "antd";
import {DownloadOutlined} from "@ant-design/icons";
import {queryExperimentResults} from "./service";
import {Data, parseData} from "./data.d";

const COLOR_PLATE_10 = [
  '#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16', '#E8684A', '#6DC8EC', '#9270CA', '#FF9D4D', '#269A99', '#FF99C3',
];

const SHAPE_PLATE_10 = [
  'circle', 'square', 'bowtie', 'diamond', 'tick', 'triangle', 'cross', 'hexagon', 'plus', 'hyphen'
];

const DATASET_NAME = new Map([['speed', '路链速度'], ['available', '载具可用性']])
const METRIC_NAME = new Map([['mae', '平均绝对误差 MAE'], ['rmse', '均方根误差 RMSE'], ['mape', '平均绝对百分比误差 MAPE']])

export default () => {
  const [data, setData] = useState((): Data => new Map());

  useEffect(() => {
    queryExperimentResults()
      .then(res => setData(parseData(res)));
  }, []);

  const refs = {
    speed: {
      'mae': useRef(),
      'mape': useRef(),
      'rmse': useRef(),
    },
    available: {
      'mae': useRef(),
      'mape': useRef(),
      'rmse': useRef(),
    },
  };

  return <PageContainer>
    {Array.from(data)
      .map(([dn, mr]) => <Row key={dn}>
          {Array.from(mr).map(([mn, d]) => {
              const ref = refs[dn][mn];
              return <Col key={mn} span={8}>
                <Card
                  title={`${DATASET_NAME.get(dn)}/${METRIC_NAME.get(mn)}`}
                  extra={<Button
                    type="primary"
                    shape="circle"
                    onClick={() => (ref.current as any)?.downloadImage()}
                    icon={<DownloadOutlined/>}
                  />}
                >
                  <Line
                    chartRef={ref}
                    data={d}
                    xField="timestep"
                    yField="value"
                    seriesField="model"
                    color={COLOR_PLATE_10}
                    point={{shape: SHAPE_PLATE_10}}
                    xAxis={{
                      label: {
                        formatter: (v: string) => `${parseInt(v, 10) + 1}歩`,
                        autoEllipsis: true,
                        autoHide: true
                      },
                    }}
                    yAxis={{
                      min: Math.min(...d.map(di => di.value)),
                      label: {
                        formatter: (v: string) => mn === 'mape' ? `${parseFloat(v) * 100} %` : `${parseFloat(v)}`,
                        autoEllipsis: true,
                        autoHide: true
                      }
                    }}
                  />
                </Card>
              </Col>
            }
          )}
        </Row>
      )}
  </PageContainer>;
};
