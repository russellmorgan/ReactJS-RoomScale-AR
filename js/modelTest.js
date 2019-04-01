"use strict";

import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import {
  ViroARScene,
  ViroBox,
  Viro3DObject,
  ViroMaterials,
  ViroARPlaneSelector,
  ViroAmbientLight,
  ViroAnimations,
  ViroSound,
  ViroNode
} from "react-viro";

export default class CameraTracking extends Component {
  constructor() {
    super();
  }

  render() {


    return (
      <ViroARScene
        ref="arscene">
        <ViroAmbientLight color={"#ffffff"} />
        <ViroARPlaneSelector
          maxPlanes={1}>
          <Viro3DObject
            source={{uri:"https://gritty.netlify.com/assets/wifi.gltf"}}
            position={[0,0,-5]}
            scale={[1,1,1]}
            rotation={[0, 0, 0]}
            type="GLTF" />
        </ViroARPlaneSelector>
      </ViroARScene>
    );
  }
}



module.exports = CameraTracking;
