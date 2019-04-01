'use strict';

import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import {
  ViroARScene,
  ViroConstants,
  ViroBox,
  ViroMaterials,
  ViroARPlaneSelector,
  ViroARPlane,
  ViroNode,
  ViroAmbientLight,
  ViroSpotLight,
  ViroAnimations,
  ViroText
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
        <ViroARPlaneSelector minHeight={0} minWidth={.2} maxPlanes={1} alignment={"Horizontal"} key = {i+7}>
          <ViroNode key = {i*3}>
          <ViroSpotLight innerAngle={5} outerAngle={90} direction={[0,-1,-.2]}
          position={[0, 3, 1]} color="#ffffff" castsShadow={true} />
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
      )
    }

    modelCount = modelCount + modelsArray.length;

    return (
      <ViroARScene ref="arscene"
        anchorDetectionTypes={'PlanesHorizontal'}
        onTrackingUpdated={this._onInitialized} 
        onAnchorFound={this._onAnchorFound}>
        <ViroText text={this.state.text} width={2} height={2} position={[0, 0, -2]} style={styles.helloWorldTextStyle} />
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
      this.setState({
        text : "No tracking data"
      });
    } else if (state == ViroConstants.TRACKING_LIMITED) {
      this.setState({
        text : "Tracking limited" + reason
      });
    }
  }
}

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

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 20,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',  
  },
});

module.exports = HelloWorldSceneAR;