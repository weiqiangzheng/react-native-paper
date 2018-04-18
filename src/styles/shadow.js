/* @flow */

import * as Colors from './colors';

export default function shadow(elevation: number) {
  return {
    shadowColor: Colors.black,
    shadowOpacity: 0.0015 * elevation + 0.18,
    shadowRadius: 0.54 * elevation,
    shadowOffset: {
      height: 0.6 * elevation,
      width: 0,
    },
  };
}
