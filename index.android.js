'use strict';
import React, { AppRegistry, UIManager } from 'react-native';
import RootView from './app/containers/RootView';
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
AppRegistry.registerComponent('prahappclient', () => RootView);
