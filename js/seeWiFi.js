'use strict';

import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { ViroAnimations, ViroARScene, ViroMaterials, ViroConstants, ViroSphere, ViroOmniLight, ViroAmbientLight, ViroARPlaneSelector, ViroBox } from 'react-viro';

export default class MainPage extends Component {
  constructor() {
    super();

    this.state = {
      xPositionArray: [0],
      yPosition: -1,
      zPositionArray: [-1],
      sphereColor: 'sphereGreen',
      sphereCount: 1,
      paused: false,
      paused2: false,
    };

    this._onInitialized = this._onInitialized.bind(this);
    this._onClick = this._onClick.bind(this);
    this.renderNewSphere = this.renderNewSphere.bind(this);
  }



  _planeSelected(anchor) {
    () => this.setState({
      paused : true,
    })
  }

  _planeSelected2(anchor) {
    () => this.setState({
      paused2 : true,
    })
  }

  render() {
    const spheres = [];
    const colors = ['sphereGreen', 'sphereYellow', 'sphereOrange', 'sphereRed'];

    for (var i = 0; i < this.state.sphereCount; i += 1) {
      let xDistance = Math.abs(this.state.xPositionArray[i]);
      let zDistance = Math.abs(this.state.zPositionArray[i]);

      spheres.push(
        <ViroSphere radius = {.127}
                    position = {[this.state.xPositionArray[i], this.state.yPosition, this.state.zPositionArray[i]]}
                    materials = {colors[Math.round((xDistance + zDistance) / 4)]}
                    key = {i}
                    number = {i}
                    animation = {{ name: 'opacityAnimate', run: true, loop: true, easing: 'Linear' }} />
      );
    };

    return (
      <ViroARScene onTrackingUpdated={this._onInitialized} ref='arscene' onClick={this._onClick} >
        <ViroOmniLight intensity={600}
                       position={[-10, 10, 1]}
                       color={"#FFFFFF"}
                       attenuationStartDistance={20}
                       attenuationEndDistance={30} />
        <ViroAmbientLight intensity={300}
                          position={[-10, 10, 1]}
                          color={"#FFFFFF"} />

        {/**<ViroARPlaneSelector minHeight={.5} minWidth={.5} pauseUpdates={this.state.paused} onPlaneSelected={this._planeSelected()}  >
          <ViroBox position={[0, 0, 0]} scale={[.6, .02, .6]} materials={'sphereGray'} />**/}
          <ViroARPlaneSelector minHeight={.2} minWidth={.2} pauseUpdates={this.state.paused2} onPlaneSelected={this._planeSelected2()}  >
    <ViroBox position={[0, 0, 0]} scale={[.2, .5, .5]} materials={'sphereGray'} />
            { spheres }
          </ViroARPlaneSelector>
        {/*</ViroARPlaneSelector>*/}
      </ViroARScene>
    );
  }

  renderNewSphere() {
    this.setState({
      sphereCount: this.state.sphereCount + 1,
    });
  }

  _onClick() {
    this.refs['arscene'].getCameraOrientationAsync().then((orientation) => {
      let position = orientation.position;
      let xPositionArray = [position[0]];
      let zPositionArray = [position[2]];

      setInterval(() => {
        this.refs['arscene'].getCameraOrientationAsync().then((orientation) => {
          let position = orientation.position;

          xPositionArray.push(position[0]);
          zPositionArray.push(position[2]);

          this.setState({
            xPositionArray: xPositionArray,
            zPositionArray: zPositionArray,
          })
          this.renderNewSphere();
        });
      }, 3000);
    });
  }

  _onInitialized(state, reason) {
    if (state == ViroConstants.TRACKING_NORMAL) {
      this.setState({
        text : "Hello World!"
      });
    } else if (state == ViroConstants.TRACKING_NONE) {
      // Handle loss of tracking
    }
  }
}



ViroAnimations.registerAnimations({
  lessOpacity: {
    properties: {
      opacity: .8
    }, duration: 1000 },
  moreOpacity: {
    properties: {
      opacity: 1
    }, duration: 1000 },
  opacityAnimate: [
    ['lessOpacity', 'moreOpacity'],
  ]
});

ViroMaterials.createMaterials({
  sphereGreen: {
    roughness: .8,
    metalness: 0.9,
    lightingModel: 'PBR',
    diffuseColor: 'rgba(50, 225, 201, 1)',
    bloomThreshold: .5,
  },
  sphereGreenBloom: {
    roughness: .8,
    metalness: 0.9,
    lightingModel: 'PBR',
    diffuseColor: 'rgba(243, 228, 65, 1)',
    bloomThreshold: 0,
  },
  sphereYellow: {
    roughness: .7,
    metalness: 1,
    lightingModel: 'PBR',
    diffuseColor: 'rgba(243, 228, 65, 1)',
    bloomThreshold: .5,
  },
  sphereOrange: {
    roughness: .8,
    metalness: 0.9,
    lightingModel: 'PBR',
    diffuseColor: 'rgba(253, 166, 41, 1)',
    bloomThreshold: .5,
  },
  sphereRed: {
    roughness: .8,
    metalness: 0.9,
    lightingModel: 'PBR',
    diffuseColor: 'rgba(248, 89, 73, 1)',
    bloomThreshold: .5,
  },
  sphereGray: {
    roughness: .8,
    metalness: 0.9,
    lightingModel: 'PBR',
    diffuseColor: 'rgba(160, 160, 160, 1)',
    bloomThreshold: .5,
  }
});

module.exports = MainPage;
