// @flow

import React from 'react';
import { FlatList, Text, StyleSheet } from 'react-native';
import Paper from './Paper';
import TouchableRipple from './TouchableRipple';
import ThemedPortal from './Portal/ThemedPortal';
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
};

const ITEM_HEIGHT = 48;

class SimpleMenu extends React.Component<Props> {
  static renderDataItem(dataItem: string | DataItem) {
    return (
      <Text>{typeof dataItem === 'string' ? dataItem : dataItem.label}</Text>
    );
  }

  static keyExtractor(item: string | DataItem) {
    return typeof item === 'string' ? item : item.key || item.label;
  }

  static labelExtractor(item: string | DataItem) {
    return typeof item === 'string' ? item : item.label;
  }

  render() {
    const { data, selectedItemKey, theme } = this.props;
    const height = data.length * ITEM_HEIGHT + 8;
    const selectedItemStyle = { backgroundColor: theme.colors.disabled };

    return (
      <ThemedPortal position={-1}>
        <Paper elevation={2} style={{ height }}>
          <FlatList
            style={styles.container}
            contentContainerStyle={styles.content}
            data={data}
            keyExtractor={SimpleMenu.keyExtractor}
            renderItem={({ item }) => {
              const key = SimpleMenu.keyExtractor(item);
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
                  {SimpleMenu.renderDataItem(item)}
                </TouchableRipple>
              );
            }}
          />
        </Paper>
      </ThemedPortal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
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
