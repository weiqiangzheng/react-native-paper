// @flow

import * as React from 'react';
import ReactNative, {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  Text,
  StyleSheet,
  UIManager,
  View,
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
  theme: Theme,
  visible: boolean,
  children: React.Node,
};

type State = {
  size: ?{
    width: number,
    height: number,
  },
  anchorTo?: React.Node,
  heightCap: ?number,
  reveal: Animated.Value,
  itemReveal: Array<Animated.Value>,
};

const MENU_VERTICAL_PADDING = 4;
const MENU_VERTICAL_WINDOW_MARGIN = 8;
const ITEM_HEIGHT = 48;

const MENU_REVEAL_DURATION_MILLIS = 300;
const ITEM_REVEAL_DURATION_MILLIS = 250;

class SimpleMenu extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    const itemReveal = [];
    for (let itemIndex = 0; itemIndex < props.data.length; itemIndex++) {
      itemReveal.push(new Animated.Value(0));
    }

    this.state = {
      size: null,
      heightCap: null,
      reveal: new Animated.Value(0),
      itemReveal,
    };
  }

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
          getItemLayout={(unused, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          renderItem={({ item, index }) => {
            const key = this.keyExtractor(item);
            return (
              <Animated.View style={{ opacity: this.state.itemReveal[index] }}>
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
              </Animated.View>
            );
          }}
        />
      </Paper>
    );
  };

  renderDataItem = (dataItem: string | DataItem) => (
    <Text
      numberOfLines={1}
      ellipsizeMode={Platform.select({
        ios: 'clip',
        default: 'tail',
      })}
    >
      {typeof dataItem === 'string' ? dataItem : dataItem.label}
    </Text>
  );

  render() {
    const { anchorTo, size, heightCap } = this.state;
    const { visible } = this.props;

    return (
      <View>
        <View
          ref={ref => {
            if (ref && !this.state.anchorTo) {
              this.setState(
                prevState => (prevState.anchorTo ? {} : { anchorTo: ref })
              );
            }
          }}
          collapsable={false}
        >
          {this.props.children}
        </View>
        <Anchor
          anchorTo={anchorTo}
          vAlign={VerticalAlignment.TOP_TO_TOP}
          hAlign={HorizontalAlignment.RIGHT_TO_RIGHT}
        >
          <Animated.View
            ref={component => {
              if (component) this.updateMeasure(component);
            }}
            style={
              size
                ? {
                    width: visible
                      ? this.state.reveal.interpolate({
                          inputRange: [0, 0.25],
                          outputRange: [0, size.width],
                          extrapolate: 'clamp',
                        })
                      : 0,
                    height: visible
                      ? this.state.reveal.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, heightCap || size.height],
                        })
                      : 0,
                  }
                : { opacity: 0 }
            }
          >
            {this.renderContent()}
          </Animated.View>
        </Anchor>
      </View>
    );
  }

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
              ({ size }) => (size ? {} : { size: { width, height } }),
              () => {
                const { heightCap } = this.state;
                const actualHeight = heightCap || height;
                const itemsShown = actualHeight / ITEM_HEIGHT;

                Animated.stagger(
                  MENU_REVEAL_DURATION_MILLIS / itemsShown,
                  this.state.itemReveal.map(itemAnimValue =>
                    Animated.timing(itemAnimValue, {
                      duration: ITEM_REVEAL_DURATION_MILLIS,
                      toValue: 1,
                    })
                  )
                ).start();

                Animated.timing(this.state.reveal, {
                  toValue: 1,
                  duration: MENU_REVEAL_DURATION_MILLIS,
                }).start();
              }
            );
          }
        }
      );
    }
  };
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
