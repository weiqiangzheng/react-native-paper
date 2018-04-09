/* @flow */

import Expo from 'expo';
import * as React from 'react';
import { StatusBar, View } from 'react-native';
import {
  Button,
  Provider as PaperProvider,
  DarkTheme,
  DefaultTheme,
} from 'react-native-paper';
import { type Theme } from '../src/types';
import SimpleMenu from '../src/components/SimpleMenu';

type State = {
  theme: Theme,
  menuShown: boolean,
};

class PaperExample extends React.Component<{}, State> {
  state = {
    theme: DefaultTheme,
    menuShown: false,
  };
  _button: any;

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

    this._button;

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
            anchorTo={this._button}
            data={data}
            onItemSelected={item => {
              console.log(`SelectedItem: ${item}`);
            }}
            selectedItemKey="Baz"
            visible={this.state.menuShown}
          >
            <Button
              icon="add-a-photo"
              onPress={() => {
                this.setState(prevState => ({
                  menuShown: !prevState.menuShown,
                }));
              }}
              ref={button => {
                this._button = button;
              }}
            >
              Add a photo
            </Button>
          </SimpleMenu>
        </View>
      </PaperProvider>
    );
  }
}

Expo.registerRootComponent(PaperExample);
