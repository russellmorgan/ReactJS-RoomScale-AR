'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  ViroARSceneNavigator
} from 'react-viro';

var MiniMap = require('./js/MiniMap');

export default class WifiSceneAR extends Component {

  constructor() {
    super();

    // bind functions
    this._onMarkedPosition = this._onMarkedPosition.bind(this);

    this.state = {
      count: 1,
      coords: [[0,0,0]],
      testCoords: 'ok',
      viroAppProps: {
        _onMarkedPosition: this._onMarkedPosition,
        meshArray: [[0,0,0]]
      }
    }
  }

  render() {
    // Build mini map coordinates
    let mapCoordinates = [];
    for(var i=0; i < this.state.count; i++) {
      let coord = this.state.coords[i];
      let x = Math.floor(coord[0]*10)+75;
      let y = Math.floor(coord[2]*10)+100;
      let pos = { position:'absolute', borderRadius: 10, backgroundColor: '#ff0000', width:10, height:10, top:y, left:x};
      mapCoordinates.push(
        <View style={pos} key = {'coord'+i} />
      )
    };

    return (
      <View style={styles.arContainer}>
        <ViroARSceneNavigator
              initialScene={{
                scene: MiniMap,
              }}
              apiKey={'E8FA9903-56BE-4BC3-908C-D280C6B7E12A'} 
              viroAppProps={this.state.viroAppProps}
              />
          <View style={styles.map}>
          <Text>Z: {this.state.testCoords}</Text>
          {mapCoordinates}
        </View>
      </View>
    );
  }

  _onMarkedPosition(updatedCoordinates) {
    // Check to see how far this new coordinate is from the previous one
    let coordArray = this.state.coords;
    let lastCoord = coordArray[coordArray.length-1];
    let distanceX = Math.abs((updatedCoordinates[0]*10) - (lastCoord[0]*10));
    let distanceZ = Math.abs((updatedCoordinates[2]*10) - (lastCoord[2]*10));
    //Reverse any negative coord space
    if(distanceX < 0) {
      distanceX = distanceX*-1;
    }
    if(distanceZ < 0) {
      distanceZ = distanceZ*-1;
    }
    // If user has moved more thanb 5 metere in AR space update positions
    if(distanceX > 5 || distanceZ > 5) {
      coordArray.push(updatedCoordinates);
      // Manipulate viroAppProps to update AR scene
      let viroAppProps = {...this.state.viroAppProps};
      viroAppProps.meshArray = coordArray;
      // Save user coordinates into state
      this.setState({
        coords : coordArray,
        count: this.state.count + 1,
        viroAppProps: viroAppProps,
        testCoords: distanceZ
      });
    }
  }
}

var styles = StyleSheet.create({
  arContainer: {
    flex: 1,
    backgroundColor: '#000'
  },
  map: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.9)',
    top: 40,
    left: '60%',
    width: 150,
    height: 200,
    right: 20,
    padding: 10,
    borderRadius: 5
  },
  coord: {
    width: 8,
    height: 8,
    backgroundColor: 'rgba(152, 251, 152, 1)',
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 8
  }
});

module.exports = WifiSceneAR;