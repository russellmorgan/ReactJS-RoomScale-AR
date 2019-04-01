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
  ViroSpotLight,
  ViroAnimations
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
    let offset = 1;

    for(var i=0; i < 5; i++) {
      offset = offset-.5;
      modelsArray.push(
        <ViroNode key = {i+3}>
          {/* <ViroSpotLight key = {i+5} innerAngle={5} outerAngle={90} direction={[0,-1,-.2]}
            position={[0, 5, 1]} color="#ffffff" castsShadow={true} /> */}
          <ViroSphere
              key = {i}
              radius={.1}
              position={[0, -2, offset]}
              opacity={0}
              materials={["floaty"]}
              animation={{name: "grow", run: true, loop: false}}
          />
        </ViroNode>
      )
    }

    modelCount = modelCount + modelsArray.length;

    return (
      <ViroARScene ref="arscene"
        onTrackingUpdated={this._onInitialized} 
        onAnchorFound={this._onAnchorFound}>
        <ViroAmbientLight color={"#aaaaaa"} />
          <ViroARPlaneSelector>
            { modelsArray }
          </ViroARPlaneSelector>
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

ViroAnimations.registerAnimations({
  grow: {
    properties: {
      scaleZ: 1,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      positionY: -0.5
    },
    easing: "EaseIn",
    duration: 1500
  },
});

ViroMaterials.createMaterials({
  grid: {
    diffuseTexture: require('./res/grid_bg.jpg'),
  },
  floaty: {
    lightingModel: 'Blinn',
    shininess: 0.5,
    diffuseColor: 'rgba(253, 166, 41, 1)',
  }
});

module.exports = HelloWorldSceneAR;