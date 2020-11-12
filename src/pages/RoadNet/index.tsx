import React from 'react';
import TileLayer from 'ol/layer/Tile';
import {TileWMS} from 'ol/source';
import WMSServerType from 'ol/source/WMSServerType';
import {Descriptions, notification} from 'antd';
import OLMapWrapper from "@/components/OLMap";

const RoadNet: React.FC = () => {
  const source = new TileWMS({
    url: '/geoserver/beijing_traffic/wms',
    params: {
      FORMAT: 'image/png8',
      VERSION: '1.3.0',
      tiled: true,
      STYLES:
        'beijing_traffic:bus_line,beijing_traffic:subway_line,beijing_traffic:bus_stop,beijing_traffic:subway_stop',
      LAYERS:
        'beijing_traffic:bus_lines,beijing_traffic:subway_lines,beijing_traffic:bus_stops,beijing_traffic:subway_stops',
      exceptions: 'application/vnd.ogc.se_inimage',
    },
    serverType: WMSServerType.GEOSERVER,
  });

  const layer = new TileLayer({source});

  return <OLMapWrapper onclick={(coord, _, map) => {

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
              });
            }
          });
      }
    }
  }} layers={[layer]}/>;
};

export default RoadNet;
