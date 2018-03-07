/* @flow */

import Expo from 'expo';
import * as React from 'react';
import { StatusBar, View } from 'react-native';
import {
  Provider as PaperProvider,
  DarkTheme,
  DefaultTheme,
} from 'react-native-paper';
import { type Theme } from 'react-native-paper/types';
import SimpleMenu from '../src/components/SimpleMenu';

type State = {
  theme: Theme,
};

class PaperExample extends React.Component<{}, State> {
  state = {
    theme: DefaultTheme,
  };

  componentDidMount() {
    StatusBar.setBarStyle('light-content');
  }

  _toggleTheme = () =>
    this.setState(state => ({
      theme: state.theme === DarkTheme ? DefaultTheme : DarkTheme,
    }));

  render() {
    const data = [
      { label: 'Foo--1', icon: 'home' },
      { label: 'Bar' },
      { label: 'Baz' },
      { label: 'Foo--2' },
      { label: 'Bar2' },
      { label: 'Baz2' },
      { label: 'Foo--3' },
      { label: 'Bar3' },
      { label: 'Baz3' },
    ];

    return (
      <PaperProvider theme={this.state.theme}>
        <View
          style={{
            flex: 0,
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SimpleMenu
            data={data}
            onItemSelected={item => {
              console.log(`SelectedItem: ${item}`);
            }}
            selectedItemKey="Baz"
          />
        </View>
      </PaperProvider>
    );
  }
}

Expo.registerRootComponent(PaperExample);
