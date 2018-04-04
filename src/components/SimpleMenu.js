// @flow

import * as React from 'react';
import ReactNative, {
  Animated,
  FlatList,
  Text,
  StyleSheet,
  UIManager,
  View,
  Dimensions,
} from 'react-native';
import Anchor, { VerticalAlignment, HorizontalAlignment } from './Anchor';
import Paper from './Paper';
import TouchableRipple from './TouchableRipple';
import withTheme from '../core/withTheme';
import { type Theme } from '../types';

type DataItem = {
  label: string,
  key?: string,
};

type Props = {
  data: Array<string | DataItem>,
  onItemSelected: string => void,
  selectedItemKey?: string,
  anchorTo: React.Node,
  theme: Theme,
};

type State = {
  size: ?{
    width: number,
    height: number,
  },
  heightCap: ?number,
  reveal: Animated.Value,
};

const MENU_VERTICAL_PADDING = 4;
const MENU_VERTICAL_WINDOW_MARGIN = 8;
const ITEM_HEIGHT = 48;

class SimpleMenu extends React.Component<Props, State> {
  state = {
    size: null,
    heightCap: null,
    reveal: new Animated.Value(0),
  };

  renderContent = () => {
    const { data, theme, selectedItemKey } = this.props;
    const selectedItemStyle = { backgroundColor: theme.colors.disabled };
    const { heightCap } = this.state;

    return (
      <Paper style={{ elevation: 2 }}>
        <FlatList
          style={styles.container}
          contentContainerStyle={styles.content}
          data={data}
          keyExtractor={this.keyExtractor}
          showsVerticalScrollIndicator={!!heightCap}
          renderItem={({ item }) => {
            const key = this.keyExtractor(item);
            return (
              <TouchableRipple
                style={[
                  styles.item,
                  selectedItemKey === key && selectedItemStyle,
                ]}
                onPress={() => {
                  this.props.onItemSelected(key);
                }}
              >
                {this.renderDataItem(item)}
              </TouchableRipple>
            );
          }}
        />
      </Paper>
    );
  };

  renderDataItem = (dataItem: string | DataItem) => (
    <Text numberOfLines={1} ellipsizeMode="clip">
      {typeof dataItem === 'string' ? dataItem : dataItem.label}
    </Text>
  );

  keyExtractor = (item: string | DataItem) =>
    typeof item === 'string' ? item : item.key || item.label;

  labelExtractor = (item: string | DataItem) =>
    typeof item === 'string' ? item : item.label;

  updateMeasure = component => {
    if (!this.state.size) {
      UIManager.measureInWindow(
        ReactNative.findNodeHandle(component),
        (x, y, width, height) => {
          if (!width || !height) {
            global.setImmediate(() => {
              this.updateMeasure(component);
            });
          } else {
            const { height: windowHeight } = Dimensions.get('window');
            if (y + height + MENU_VERTICAL_WINDOW_MARGIN > windowHeight) {
              this.setState({
                heightCap: windowHeight - (y + MENU_VERTICAL_WINDOW_MARGIN),
              });
            }

            this.setState(
              ({ size }) => (size ? {} : { size: { width, height } })
            );

            Animated.timing(this.state.reveal, {
              toValue: 1,
              duration: 300,
            }).start();
          }
        }
      );
    }
  };

  render() {
    const { anchorTo } = this.props;
    const { size, heightCap } = this.state;

    return (
      <Anchor
        anchorTo={anchorTo}
        vAlign={VerticalAlignment.TOP_TO_TOP}
        hAlign={HorizontalAlignment.RIGHT_TO_RIGHT}
      >
        {size ? (
          <Animated.View
            style={{
              width: this.state.reveal.interpolate({
                inputRange: [0, 0.25, 1],
                outputRange: [0, size.width, size.width],
              }),
              height: this.state.reveal.interpolate({
                inputRange: [0, 1],
                outputRange: [0, heightCap || size.height],
              }),
            }}
          >
            {this.renderContent()}
          </Animated.View>
        ) : (
          <View
            style={{ opacity: 0 }}
            ref={component => {
              this.updateMeasure(component);
            }}
          >
            {this.renderContent()}
          </View>
        )}
      </Anchor>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: MENU_VERTICAL_PADDING,
  },
  content: {
    alignItems: 'stretch',
  },
  item: {
    height: ITEM_HEIGHT,
    paddingHorizontal: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});

export default withTheme(SimpleMenu);
