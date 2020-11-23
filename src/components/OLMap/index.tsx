import React, {useEffect, useRef, useState} from 'react';
import Map from 'ol/Map'
import View from 'ol/View'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import {Coordinate, toStringXY} from "ol/coordinate";
import './index.css';
import Feature from "ol/Feature";
import Geometry from "ol/geom/Geometry";
import Collection from "ol/Collection";
import BaseLayer from "ol/layer/Base";
import {GeoJSON} from "ol/format";
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";

type OLMapProps = {
  baseMap: 'simple' | 'OSM',
  extraLayers?: BaseLayer[] | BaseLayer,
  features?: Feature<Geometry>[] | Collection<Feature<Geometry>>,
  onclick?: (coord: [number, number], pixel: [number, number], map?: Map) => void
  updateLegend?: (resolution?: number) => void
}

const OLMapWrapper: React.FC<OLMapProps> = (props) => {
  // set intial state
  const [map, setMap] = useState<Map>()
  const [featuresLayer, setFeaturesLayer] = useState<VectorLayer>()
  const [selectedCoord, setSelectedCoord] = useState<Coordinate>()

  // pull refs
  const mapElement = useRef<HTMLDivElement>(null)

  const mapRef = useRef<Map>()
  mapRef.current = map

  // initialize map on first render - logic formerly put into componentDidMount
  useEffect(() => {

    // create and add vector source layer
    const initalFeaturesLayer = new VectorLayer({
      source: new VectorSource()
    })
    const initialLayers: BaseLayer[] = props.baseMap === 'simple' ? [
      new VectorLayer({
        source: new VectorSource({
          format: new GeoJSON(),
          url: '/map/china.geojson'
        }),
        // style: styleFunction,
      }),
      new VectorLayer({
        source: new VectorSource({
          format: new GeoJSON(),
          url: '/map/beijing.geojson'
        }),
        // style: styleFunction,
      }),
    ] : [
      new TileLayer({
        source: new OSM()
      }),
    ];

    const layers = initialLayers;
    if (props.extraLayers) {
      if (Array.isArray(props.extraLayers)) {
        layers.push(...props.extraLayers)
      } else {
        layers.push(props.extraLayers);
      }
    }

    // create map
    const initialMap = new Map({
      target: mapElement.current || undefined,
      layers: layers.concat([initalFeaturesLayer]),
      view: new View({
        center: [(116.496266 + 116.271389) / 2, (39.989214 + 39.832525) / 2],
        zoom: 12,
        projection: 'EPSG:4326'
      }),
      controls: []
    })

    if (props.updateLegend) {
      props.updateLegend(initialMap.getView().getResolution());
    }

    // save map and vector layer references to state
    setMap(initialMap)
    setFeaturesLayer(initalFeaturesLayer)
  }, [])

  // update map if features prop changes - logic formerly put into componentDidUpdate
  useEffect(() => {
    if (props.features && featuresLayer) { // may be null on first render
      // set features to map
      featuresLayer.setSource(
        new VectorSource({
          features: props.features
        })
      )
    }
  }, [props.features, featuresLayer])

  useEffect(() => {
    // set map onclick handler
    if (map) {
      map.on('click', (event) => {
        // get clicked coordinate using mapRef to access current React state inside OpenLayers callback
        //  https://stackoverflow.com/a/60643670

        const clickedCoord = mapRef.current && mapRef.current.getCoordinateFromPixel(event.pixel);

        if (props.onclick) {
          props?.onclick(
            [event.coordinate[0], event.coordinate[1]],
            [event.pixel[0], event.pixel[1]],
            mapRef.current
          );
        }
        // set React state
        setSelectedCoord(clickedCoord);
      })
    }
  }, [props.onclick, map])

  useEffect(() => {
    if (map) {
      map.on('change:resolution', (event) => {
        const resolution = event.target.getResolution();
        if (props.updateLegend) {
          props.updateLegend(resolution);
        }
      })
    }
  }, [props.updateLegend, map])

  // render component
  return (
    <div>
      <div ref={mapElement} className="map-container"/>
      {props.children}
      <div className="clicked-coord-label">
        <p>{(selectedCoord) ? toStringXY(selectedCoord, 5) : ''}</p>
      </div>
    </div>
  )
}

export default OLMapWrapper
