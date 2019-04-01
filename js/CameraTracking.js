"use strict";

import React, { Component } from "react";
import { StyleSheet } from "react-native";
import {
  ViroARScene,
  ViroText,
  ViroBox,
  Viro3DObject,
  ViroMaterials,
  ViroARPlaneSelector,
  ViroARPlane,
  ViroAmbientLight,
  ViroAnimations,
  ViroSound,
  ViroNode
} from "react-viro";

export default class CameraTracking extends Component {
  constructor() {
    super();

    // Set initial state here
    this.state = {
      text: 'For testing.',
      count: 1,
      beginTracking: true,
      objPositionArray: [[0,0,0]]
    };

    this.currentSpawnPoint = [0,0,0];

    // bind 'this' to functions
    this._onInitialized = this._onInitialized.bind(this);
    this._onPlaneSelected = this._onPlaneSelected.bind(this);
    this._onCameraTransformUpdate = this._onCameraTransformUpdate.bind(this);
  }

  render() {
    let modelsArray = [];
    

    for (var i = 0; i < this.state.count; i++) {
      modelsArray.push(
        <ViroNode key={"node" + i}>
          <ViroBox
            height={0.12}
            length={0.12}
            width={0.12}
            key={"model+i"}
            position={this.state.objPositionArray[i]}
            opacity={1}
            materials={["floaty"]}
          />
        </ViroNode>
      );
    }

    return (
      <ViroARScene
        onCameraTransformUpdate={this._onCameraTransformUpdate}
        ref="arscene">
        <ViroText text={this.state.text} scale={[.5, .5, .5]} position={[0, 0, -4]} style={styles.helloWorldTextStyle} />
        <ViroAmbientLight color={"#aaaaaa"} />
        <ViroARPlaneSelector
          maxPlanes={3}
          onPlaneSelected={this._onPlaneSelected}>
          {modelsArray}
        </ViroARPlaneSelector>
      </ViroARScene>
    );
  }

  _onPlaneSelected() {
    let objArray = [];

    // Get camera pos+forward view and update state
    setInterval(() => {
      this.refs["arscene"].getCameraOrientationAsync().then(orientation => {
        let direction = [
          orientation.position[0] + (orientation.forward[0]), 
          0, 
          orientation.position[2] + (orientation.forward[2]*1)
        ];
        objArray.push(direction);
        this.setState({
          objPositionArray: objArray,
          count: this.state.count + 1,
          text: direction[2].toString()
        });
      });
    }, 1500);
  }

  _onCameraTransformUpdate() {
    // If user selects an available plane continuously track the forward vector
    if(this.state.beginTracking) {
      this.refs["arscene"].getCameraOrientationAsync().then(orientation => {
          let spawnPosition = [orientation.position[0] + (orientation.forward[0]*1), 0, orientation.position[2] + (orientation.forward[2]*1)];
          this.currentSpawnPoint = spawnPosition;
      });
    }
  }


  _onInitialized(state, reason) {}
}

ViroMaterials.createMaterials({
  grid: {
    diffuseTexture: require("./res/grid_bg.jpg")
  },
  floaty: {
    lightingModel: "Lambert",
    diffuseColor: "rgba(152, 251, 152, 1)"
  }
});

// ViroSound.preloadSounds({
//   "foundAnchor" : resolveAssetSource(require('./res/magic.mp3')),
// });

ViroAnimations.registerAnimations({
  grow: {
    properties: {
      scaleZ: 2,
      scaleX: 2,
      scaleY: 2,
      opacity: 1
    },
    easing: "Bounce",
    duration: 3000
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

module.exports = CameraTracking;
