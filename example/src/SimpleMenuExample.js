/* @flow */

import * as React from 'react';
import { View } from 'react-native';
import { Button, SimpleMenu, withTheme } from 'react-native-paper';

type State = {
  menuShown: boolean,
};

class SimpleMenuExample extends React.Component<{}, State> {
  static title = 'Simple menu example';

  _button: any;

  state = {
    menuShown: false,
  };

  data = [
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

  render() {
    return (
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
          data={this.data}
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
              if (button) {
                this._button = button;
              }
            }}
          >
            Add a photo
          </Button>
        </SimpleMenu>
      </View>
    );
  }
}

export default withTheme(SimpleMenuExample);
