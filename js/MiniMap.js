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

export default class MiniMap extends Component {
  constructor() {
    super();

    // bind 'this' to functions
    this._onPlaneSelected = this._onPlaneSelected.bind(this);
  }

  render() {
    let meshArray = this.props.arSceneNavigator.viroAppProps.meshArray;
    let modelsArray = [];

    for (var i = 0; i < meshArray.length; i++) {
      let position = meshArray[i];
      let color = "green";
      // Figure out what color to use by checking forward position
      if(position[2] > 5 || position[2] < -5) {
        color = "yellow";
      }
      if(position[2] > 10 || position[2] < -10) {
        color = "red";
      }      
      modelsArray.push(
        <ViroNode key={"node" + i}>
          <ViroBox
            height={0.12}
            length={0.12}
            width={0.12}
            key={"model+i"}
            position={meshArray[i]}
            materials={[color]}
          />
        </ViroNode>
      );
    }

    modelsArray.push(          
      <ViroSound paused={false}
      key={'sound'+Math.random()}
      muted={false}
      source={'hotspot'}
      loop={false}
      volume={1.0} />
    )

    return (
      <ViroARScene
        ref="arscene">
        <ViroAmbientLight color={"#ffffff"} />
        <ViroARPlaneSelector
          maxPlanes={1}
          onPlaneSelected={this._onPlaneSelected}>
          <Viro3DObject
            source={{uri:"https://gritty.netlify.com/assets/wifi.gltf"}}
            animation={{name: "rotate", run: true, loop: true}}
            position={[0,.2,0]}
            scale={[.1, .1, .1]}
            rotation={[90, 0, 0]}
            type="GLTF" />
          {modelsArray}
        </ViroARPlaneSelector>
      </ViroARScene>
    );
  }

  _onPlaneSelected() {
    setInterval(() => {
      this.refs["arscene"].getCameraOrientationAsync().then(orientation => {
        // Get position of the camera nand the forward/right vector and figure out where the user is pointed
        let spawnPosition = [orientation.position[0] + (orientation.forward[0]*1), 0, orientation.position[2] + (orientation.forward[2]*1)];
        this.props.arSceneNavigator.viroAppProps._onMarkedPosition(spawnPosition)
      });
    }, 3000);
  }

}

ViroMaterials.createMaterials({
  green: {
    lightingModel: "Lambert",
    diffuseColor: "rgba(152, 251, 152, 1)"
  },
  yellow: {
    lightingModel: "Lambert",
    diffuseColor: "rgba(255, 255, 0, 1)"
  },
  red: {
    lightingModel: "Lambert",
    diffuseColor: "rgba(255, 0, 0, 1)"
  }
});

ViroSound.preloadSounds({
  "hotspot" : 'https://gritty.netlify.com/assets/magic.mp3'
});


var styles = StyleSheet.create({
  arContainer: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
});

ViroAnimations.registerAnimations({
  rotate: {
    properties: {
      rotateY: "+=90"
    },
    duration: 2000
  },
});



module.exports = MiniMap;
