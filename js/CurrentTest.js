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

    for(var i=0; i < 1; i++) {
      offset = offset-.5;
      modelsArray.push(
        <ViroNode key = {i+3}>
          {/* <ViroSpotLight key = {i+5} innerAngle={5} outerAngle={90} direction={[0,-1,-.2]}
            position={[0, 5, 1]} color="#ffffff" castsShadow={true} /> */}
          <ViroBox
              key = {i}
              height={1}
              length={1}
              width={1}
              opacity={1}
              materials={["floaty"]}
              // animation={{name: "grow", run: true, loop: false}}
          />
        </ViroNode>
      )
    }

    modelCount = modelCount + modelsArray.length;

    return (
      <ViroARScene ref="arscene"
        anchorDetectionTypes={'PlanesHorizontal'}
        onTrackingUpdated={this._onInitialized} 
        onAnchorFound={this._onAnchorFound}>
        <ViroSpotLight key = {i+5} innerAngle={5} outerAngle={90} direction={[0,-1,-.2]}
            position={[0, 5, 1]} color="#ffffff" castsShadow={true} />
          <ViroARPlaneSelector 
            alignment={'Horizontal'} 
            maxPlanes={1}         
            minWidth={1}
            minHeight={1}>
          <ViroNode>
            <ViroBox
                key = {i}
                height={.01}
                length={.1}
                width={.1}
                opacity={.8}
                materials={["heatmap"]} 
                animation={{name: "rotate", run: true, loop: true}} />
            </ViroNode>
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
      scaleX: 1,
      scaleY: 1,
      opacity:0.8
    },
    easing: "Bounce",
    duration: 1000
  },
  rotate: {
    properties: {
      rotateY: "+=90",
      scaleZ: 10,
      scaleX: 10,
      scaleY: 1 //height
    },
    duration: 1250, //1.25 seconds
  }
});

ViroMaterials.createMaterials({
  heatmap: {
    lightingModel: 'Lambert',
    diffuseColor: 'rgba(152, 251, 152, 1)',
  }
});

module.exports = HelloWorldSceneAR;