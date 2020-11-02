import React, { useEffect } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { TileWMS } from 'ol/source';
import WMSServerType from 'ol/source/WMSServerType';
import { Descriptions, notification } from 'antd';

const RoadNet: React.FC = () => {
  useEffect(() => {
    (() => {
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

      const map = new Map({
        view: new View({
          center: fromLonLat([(116.496266 + 116.271389) / 2, (39.989214 + 39.832525) / 2]),
          zoom: 12,
        }),
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          new TileLayer({
            source,
          }),
        ],
        target: 'map',
      });

      map.on('singleclick', (evt) => {
        const view = map.getView();
        const viewResolution = view.getResolution();
        const url = source.getFeatureInfoUrl(evt.coordinate, viewResolution, view.getProjection(), {
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
                        <Descriptions.Item label={key}>{props[key]}</Descriptions.Item>
                      ))}
                    </Descriptions>
                  ),
                });
              }
            });
        }
      });
    })();
  }, []);
  return (
    <div id="map" className="map" style={{ height: '800px' }} />
  );
};

export default RoadNet;
