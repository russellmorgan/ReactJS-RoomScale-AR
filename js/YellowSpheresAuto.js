'use strict';

import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import {
  ViroARScene,
  ViroText,
  ViroConstants,
  ViroBox,
  ViroSphere,
  ViroMaterials,
  ViroARPlaneSelector,
  ViroARPlane,
  ViroNode,
  ViroAmbientLight,
  ViroSpotLight
} from 'react-viro';

export default class HelloWorldSceneAR extends Component {

  constructor() {
    super();

    // Set initial state here
    this.state = {
      count: 0,
      text : "Initializing AR..."
    };

    // bind 'this' to functions
    this._onInitialized = this._onInitialized.bind(this);
    this._onAnchorFound = this._onAnchorFound.bind(this);
  }

  render() {
    let modelsArray = [];
    let modelCount = 'Models: ';
    let offset = 0;

    for(var i=0; i < 10; i++) {
      offset = offset-0.07;
      modelsArray.push(
        <ViroARPlane minHeight={.2} minWidth={.2} alignment={"Horizontal"} key = {i+7}>
          <ViroSphere
              radius={.5}
              position={[0, 0, 0]}
              materials={["floaty"]}
          />
        </ViroARPlane>
      )
    }

    modelCount = modelCount + modelsArray.length;

    return (
      <ViroARScene ref="arscene"
        onTrackingUpdated={this._onInitialized} 
        onAnchorFound={this._onAnchorFound}>
        <ViroAmbientLight color={"#aaaaaa"} />
        <ViroSpotLight innerAngle={5} outerAngle={90} direction={[0,-1,-.2]}
          position={[0, 3, 1]} color="#ffffff" castsShadow={true} />
          { modelsArray }
      </ViroARScene>
    );
  }

  _onAnchorFound() {
    // count total anchors, add one geometry to an array
    this.setState({ 
      count: this.state.count + 1, 
      text: 'Anchor Found: ' + this.state.count
    });
  }

  _onInitialized(state, reason) {
    if (state == ViroConstants.TRACKING_NORMAL) {
      this.setState({
        text : "Hello World AR TEXT!"
      });
    } else if (state == ViroConstants.TRACKING_NONE) {
      // Handle loss of tracking
    }
  }
}

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 24,
    color: '#ff0000',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});

ViroMaterials.createMaterials({
  grid: {
    diffuseTexture: require('./res/grid_bg.jpg'),
  },
  floaty: {
    lightingModel: 'Phong',
    diffuseColor: 'rgba(253, 166, 41, .9)',
    bloomThreshold: .5,
  }
});

module.exports = HelloWorldSceneAR;