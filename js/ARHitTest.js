"use strict";

import React, { Component } from "react";
import { StyleSheet } from "react-native";
import {
  ViroARScene,
  ViroConstants,
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
      count: 1,
      xPositionArray: [0],
      zPositionArray: [0],
      objPositionArray: [[0,0,0]]
    };

    // bind 'this' to functions
    this._onInitialized = this._onInitialized.bind(this);
    this._onAnchorFound = this._onAnchorFound.bind(this);
    this._onPlaneSelected = this._onPlaneSelected.bind(this);
    // this._onCameraARHitTest = this._onCameraARHitTest.bind(this);
  }

  render() {
    let modelsArray = [];

    for (var i = 0; i < this.state.count; i++) {
      modelsArray.push(
        <ViroNode key={"node" + i}>
          <ViroBox
            height={0.1}
            length={0.1}
            width={0.1}
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
        ref="arscene"
        onTrackingUpdated={this._onInitialized}
        onAnchorFound={this._onAnchorFound}
      >
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

    setInterval(() => {
      this.refs["arscene"].getCameraOrientationAsync().then((orientation) => {
        this.refs["arscene"].performARHitTestWithRay(orientation.forward).then((results)=>{
          let pos = orientation.position;
          let angle = orientation.forward;
          let hitResult = results[0];
          objArray.push([1,0,.2]);
        })
      });
    }, 1500);

    // Get new camera coordinates and add these to the array
    // setInterval(() => {
    //   this.refs["arscene"].getCameraOrientationAsync().then(orientation => {
    //     let direction1 = (orientation.forward[0]*1)+(orientation.position[2]);
    //     let direction2 = null
    //     let objPlacement = (orientation.position[2]);
    //     objArray.push(orientation.position);
    //     //objArray.push([orientation.forward[0] * 1, 0, orientation.forward[2] * 3]);

    //     this.setState({
    //       objPositionArray: objArray,
    //       count: this.state.count + 1
    //     });
    //   });
    // }, 1500);
  }

  _onAnchorFound() {}

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

module.exports = CameraTracking;
