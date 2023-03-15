/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { createRef, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
const MAPBOX_TOKEN ='< MAP_BOX_KEY >';
  MapboxGL.setWellKnownTileServer('Mapbox');
  MapboxGL.setAccessToken(MAPBOX_TOKEN)
  const fc = require('./features.json');


  const featureLayerStyles = {
    fillStatusStyles: {
      fillColor: ['match', ['get', 'scanStatus', ['get', 'extraProperties']],
        'pending', 'rgb(204, 37, 53)',
        'inprogress', 'rgb(255, 231, 12)',
        'completed', 'rgb(99, 204, 35)',
        '#ccc'],
      fillOpacity: 1.0,
    },
    fillEmptyStyles: {
      fillOpacity: 1.0,
      fillColor: 'rgb(204, 37, 53)',
    },
  
    fillPolygonStyles: {
      fillColor: ['match', ['get', 'scanStatus', ['get', 'extraProperties']],
        'pending', 'rgb(204, 37, 53)',
        'inprogress', 'rgb(255, 231, 12)',
        'completed', 'rgb(99, 204, 35)',
        '#ccc'],
      fillOpacity: 1.0,
    },
    fillPolygonEmptyStyles: {
      fillOpacity: 1.0,
      fillColor: 'rgb(204, 37, 53)',
    },
  
    clickedFeatureStyle: {
      fillOpacity: 1.0,
      fillColor:"#0000FF",
    }
  };

  const getBoundingBox = (screenCoords:any) => {
    const maxX = Math.max(screenCoords[0][0], screenCoords[1][0]);
    const minX = Math.min(screenCoords[0][0], screenCoords[1][0]);
    const maxY = Math.max(screenCoords[0][1], screenCoords[1][1]);
    const minY = Math.min(screenCoords[0][1], screenCoords[1][1]);
    return [maxY, maxX, minY, minX];
  };
class App extends React.Component<any> {

 mapComponentView:any=null

  onMapPress = (layers:any) => {
    // noinspection JSUnresolvedVariable
    const boundingScreenBox = getBoundingBox([[layers.properties.screenPointX - 10,
      layers.properties.screenPointY - 10], [layers.properties.screenPointX + 10,
      layers.properties.screenPointY + 10]]);

    const featurePointOfVectorsWithinRect = this.mapComponentView.queryRenderedFeaturesInRect(
      boundingScreenBox, null, [
        'fillLineString', 'fillNoStatusLineString',
        'fillPolygon', 'fillNoStatusPolygon',
        'fillThermalNoStatusPolygon', 'fillThermalPolygon',
        'fillLineStringQueuedFeatures', 'fillNoStatusLineStringQueuedFeatures',
        'fillPolygonQueuedFeatures', 'fillNoStatusPolygonQueuedFeatures',
        'fillThermalNoStatusPolygonQueuedFeatures', 'fillThermalPolygonQueuedFeatures',
      ],
    );

    featurePointOfVectorsWithinRect.then((selectedVector:any) => {
      if (selectedVector.features.length > 0) {
        console.log("selectedVector.features", selectedVector.features)
        // center: layers.geometry.coordinates,
      }
      console.warn('selectedVector', selectedVector.features[0]);
    })
      .catch((err:any) => {
        console.warn(err);
      });
  }

  render(): React.ReactNode {
    return (
      <View style={styles.page}>
          <MapboxGL.MapView ref={(component) => {
          this.mapComponentView = component;
        }} style={styles.map}  onPress={layers => this.onMapPress(layers)}>
          <MapboxGL.ShapeSource
        id="featurePointShapeSource"
        shape={fc}
      >
        {/* TERRA SPECIFIC */}
        <MapboxGL.FillLayer
          id="fillLineString"
          filter={['all', ['==', ['geometry-type'], 'LineString'],
          ]}
          style={featureLayerStyles.fillStatusStyles}
        />
        <MapboxGL.FillLayer
          id="fillNoStatusLineString"
          filter={['all',
            ['==', ['geometry-type'], 'LineString'],
            // ['has', 'featureTypeId'],
          ]
          }
          style={featureLayerStyles.fillEmptyStyles}
        />
        <MapboxGL.FillLayer
          id="fillPolygon"
          filter={['all', ['==', ['geometry-type'], 'Polygon']
          ]}
          style={featureLayerStyles.fillStatusStyles}
        />
        <MapboxGL.FillLayer
          id="fillNoStatusPolygon"
          filter={['all',
            ['==', ['geometry-type'], 'Polygon']
          ]
          }
          style={featureLayerStyles.fillEmptyStyles}
        />
  
        {/* THERM SPECIFIC */}
        <MapboxGL.FillLayer
          id="fillThermalPolygon"
          filter={['all', ['==', ['geometry-type'], 'Polygon']]
          }
          style={featureLayerStyles.fillPolygonStyles}
        />
        <MapboxGL.FillLayer
          id="fillThermalNoStatusPolygon"
          filter={['all',['==', ['geometry-type'], 'Polygon']]
          }
          style={featureLayerStyles.fillPolygonEmptyStyles}
        />
      </MapboxGL.ShapeSource>
      <MapboxGL.Camera
            // minZoomLevel={mapMetaData.minzoom}
            zoomLevel={15}
            centerCoordinate={[-76.58174292783569, 36.69282656113484,18]}
            animationMode="flyTo"
          />
          </MapboxGL.MapView>
      </View>
    );
  }
  
}

export default App;

const styles = StyleSheet.create({
  page: {
    flex: 1
  },

  map: {
    flex: 1
  }
});
