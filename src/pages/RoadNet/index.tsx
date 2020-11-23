import React, {useEffect, useState} from 'react';
import TileLayer from 'ol/layer/Tile';
import {TileWMS} from 'ol/source';
import WMSServerType from 'ol/source/WMSServerType';
import {Affix, Card, Descriptions, Form, notification, Switch} from 'antd';
import OLMapWrapper from "@/components/OLMap";

const RoadNet: React.FC = () => {

  const styles = ['beijing_traffic:bus_line', 'beijing_traffic:subway_line',
    'beijing_traffic:bus_stop', 'beijing_traffic:subway_stop'];
  const layers = ['beijing_traffic:bus_lines', 'beijing_traffic:subway_lines',
    'beijing_traffic:bus_stops', 'beijing_traffic:subway_stops'];

  const [bl, setBL] = useState(true)
  const [sl, setSL] = useState(true)
  const [bs, setBS] = useState(true)
  const [ss, setSS] = useState(true)

  const [source] = useState(new TileWMS({
    url: '/geoserver/beijing_traffic/wms',
    params: {
      FORMAT: 'image/png8',
      VERSION: '1.3.0',
      tiled: true,
      STYLES: styles.join(','),
      LAYERS: layers.join(','),
      exceptions: 'application/vnd.ogc.se_inimage',
    },
    serverType: WMSServerType.GEOSERVER,
  }));

  useEffect(() => {
    source.updateParams({
      STYLES: styles.filter((_, i) => [bl, sl, bs, ss][i]).join(','),
      LAYERS: layers.filter((_, i) => [bl, sl, bs, ss][i]).join(','),
    });
    source.refresh();
  }, [bl, sl, bs, ss])

  const layer = new TileLayer({source});

  return <OLMapWrapper baseMap="simple" onclick={(coord, _, map) => {
    if (map) {

      const view = map.getView();
      const viewResolution = view.getResolution();
      const url = source.getFeatureInfoUrl(coord, viewResolution, view.getProjection(), {
        INFO_FORMAT: 'application/json',
        FEATURE_COUNT: 1,
        propertyName: null,
      });
      if (url) {
        // document.getElementById('nodelist').innerHTML = `<iframe seamless src="${url}"></iframe>`;
        fetch(url)
          .then((data) => data.json())
          .then((data) => {
            if (data.features.length > 0) {
              const props = data.features[0].properties;
              notification.info({
                message: `地理信息-${props.name}`,
                description: (
                  <Descriptions bordered column={1}>
                    {Object.keys(props).map((key) => (
                      <Descriptions.Item key={key} label={key}>{props[key]}</Descriptions.Item>
                    ))}
                  </Descriptions>
                ),
                duration: 10
              });
            }
          });
      }
    }
  }} extraLayers={[layer]}>
    <Affix style={{position: 'absolute', zIndex: 10, left: 40, top: 40}}>
      <Card>
        <Form.Item label='公交线路'>
          <Switch checked={bl} onChange={setBL}/>
        </Form.Item>
        <Form.Item label='地铁线路'>
          <Switch checked={sl} onChange={setSL}/>
        </Form.Item>
        <Form.Item label='公交站点'>
          <Switch checked={bs} onChange={setBS}/>
        </Form.Item>
        <Form.Item label='地铁站点'>
          <Switch checked={ss} onChange={setSS}/>
        </Form.Item>
      </Card>
    </Affix>
  </OLMapWrapper>;
};

export default RoadNet;
