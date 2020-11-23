import React, {useEffect, useState} from 'react';
import OLMapWrapper from "@/components/OLMap";
import {TileWMS} from "ol/source";
import WMSServerType from "ol/source/WMSServerType";
import TileLayer from "ol/layer/Tile";
import {Affix, Button, Card, Col, Image, Radio, Row, Slider} from "antd";
import {PauseCircleOutlined, PlayCircleOutlined} from "@ant-design/icons";


const MapView: React.FC = () => {

  const [legendUrl, setLegendUrl] = useState('#');
  const [playing, setPlaying] = useState(false);
  const [timeIndex, setTimeIndex] = useState(1);
  const [style, setStyle] = useState('beijing_traffic:dynamic_speed')

  const [source] = useState(new TileWMS({
    url: '/geoserver/beijing_traffic/wms',
    params: {
      FORMAT: 'image/png8',
      VERSION: '1.3.0',
      tiled: true,
      STYLES: style,
      LAYERS: 'beijing_traffic:dynamic_road_net',
      TIME: new Date(2018, 7, timeIndex).toISOString(),
      exceptions: 'application/vnd.ogc.se_inimage'
    },
    serverType: WMSServerType.GEOSERVER,
  }));

  const updateLegend = (resolution?: number) => {
    setLegendUrl(source.getLegendUrl(resolution, {
      STYLE: source.getParams().STYLES
    }));
  }

  useEffect(() => {
    source.updateParams({
      STYLES: style,
      TIME: new Date(2018, 7, timeIndex).toISOString()
    });
    updateLegend();
    // source.refresh();
  }, [style, timeIndex]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (playing) {
      interval = setInterval(() => {
        setTimeIndex(_timeIndex => _timeIndex % 31 + 1)
      }, 3000);
    } else if (!playing) {
      clearInterval()
    }
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    };
  }, [playing, timeIndex]);

  const layer = new TileLayer({source});

  return (
    <OLMapWrapper
      baseMap="OSM"
      extraLayers={[layer]}
      onclick={() => {
      }}
      updateLegend={updateLegend}
    >
      <Affix style={{position: 'absolute', zIndex: 10, left: 40, top: 40}}>
        <Image src={legendUrl}/>
      </Affix>
      <Affix style={{position: 'absolute', zIndex: 10, right: 40, top: 40}}>
        <Card>
          <Radio.Group
            buttonStyle='solid'
            defaultValue={style}
            onChange={(e) => {
              setStyle(e.target.value);
            }}
          >
            <Radio.Button value='beijing_traffic:dynamic_speed'>路链速度真实值</Radio.Button>
            <Radio.Button value='beijing_traffic:dynamic_avail'>可用载具真实值</Radio.Button>
            <Radio.Button value='beijing_traffic:dynamic_total'>载具密度真实值</Radio.Button>
            <Radio.Button value='beijing_traffic:dynamic_speed_ha'>路链速度预测值</Radio.Button>
            <Radio.Button value='beijing_traffic:dynamic_avail_ha'>可用载具预测值</Radio.Button>
            <Radio.Button value='beijing_traffic:dynamic_total_ha'>载具密度预测值</Radio.Button>
          </Radio.Group>
        </Card>
      </Affix>
      <Affix style={{position: 'absolute', zIndex: 10, left: 40, bottom: 40}}>
        <Card style={{width: 600}}>
          <Row>
            <Col span={18}>
              <Slider tipFormatter={v => `2018-08-${v?.toString().padStart(2, '0')}`}
                      max={31} min={1} tooltipVisible
                      marks={{1: '2018年8月1日', 31: '8月31日'}}
                      included={false} value={timeIndex}
                      onChange={(v: number) => setTimeIndex(v)}
              />
            </Col>
            <Col span={6}>
              <Button
                style={{margin: '0 50px'}} type='primary'
                icon={playing ? <PauseCircleOutlined/> : <PlayCircleOutlined/>}
                onClick={() => setPlaying(!playing)}
              >
                {playing ? '暂停' : '播放'}
              </Button>
            </Col>
          </Row>
        </Card>
      </Affix>
    </OLMapWrapper>
  );
};

export default MapView;
