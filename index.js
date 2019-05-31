const _ = require('lodash');
const Color = require('color');

const normalizeColors = function(colors, transparentFirst = true) {
  colors = _.castArray(colors);
  const unsupportedColorKeywords = ['inherit', 'initial', 'unset', 'revert'];
  if (_.intersection(unsupportedColorKeywords, colors).length > 0) {
    return null;
  }
  if (colors.length === 1) {
    const color = colors[0];
    let transparentColor = 'transparent';
    try {
      const parsedColor = Color(color);
      transparentColor = parsedColor.alpha(0).rgb().string();
    }
    catch (e) {
    }
    colors = transparentFirst ? [transparentColor, color] : [color, transparentColor];
  }
  return colors;
};

module.exports = function() {
  return ({ theme, variants, e, addUtilities }) => {
    const defaultLinearBorderGradientDirections = {
      't': 'to top',
      'tr': 'to top right',
      'r': 'to right',
      'br': 'to bottom right',
      'b': 'to bottom',
      'bl': 'to bottom left',
      'l': 'to left',
      'tl': 'to top left',
    };
    const defaultLinearBorderGradientColors = {};
    const defaultLinearBorderGradientVariants = ['responsive'];
    const defaultRepeatingLinearBorderGradientDirections = defaultLinearBorderGradientDirections;
    const defaultRepeatingLinearBorderGradientColors = defaultLinearBorderGradientColors;
    const defaultRepeatingLinearBorderGradientLengths = {};
    const defaultRepeatingLinearBorderGradientVariants = ['responsive'];

    const linearBorderGradientDirections = theme('linearBorderGradients.directions', defaultLinearBorderGradientDirections);
    const linearBorderGradientColors = theme('linearBorderGradients.colors', defaultLinearBorderGradientColors);
    const linearBorderGradientVariants = variants('linearBorderGradients', defaultLinearBorderGradientVariants);
    const repeatingLinearBorderGradientDirections = theme('repeatingLinearBorderGradients.directions', defaultRepeatingLinearBorderGradientDirections);
    const repeatingLinearBorderGradientColors = theme('repeatingLinearBorderGradients.colors', defaultRepeatingLinearBorderGradientColors);
    const repeatingLinearBorderGradientLengths = theme('repeatingLinearBorderGradients.lengths', defaultRepeatingLinearBorderGradientLengths);
    const repeatingLinearBorderGradientVariants = variants('repeatingLinearBorderGradients', defaultRepeatingLinearBorderGradientVariants);

    const linearBorderGradientSelector = function(directionKey, colorKey, lengthKey) {
      return `.${e(`border-gradient-${directionKey}-${colorKey}${lengthKey ? `-${lengthKey}` : ''}`)}`;
    };

    const linearBorderGradientValue = function(direction, colors, length) {
      const cssDefaultLinearBorderGradientDirections = ['to bottom', '180deg', '0.5turn', '200grad', '3.1416rad'];
      return `${!_.isNil(length) ? 'repeating-' : ''}linear-gradient(${_.includes(cssDefaultLinearBorderGradientDirections, direction) ? '' : `${direction}, `}${colors.join(', ')}${length ? ` ${length}` : ''}) 1`;
    };

    const linearBorderGradientUtilities = (function() {
      let utilities = {};
      _.forEach(linearBorderGradientColors, (colors, colorKey) => {
        colors = normalizeColors(colors, true);
        if (!colors) {
          return; // continue
        }
        _.forEach(linearBorderGradientDirections, (direction, directionKey) => {
          utilities[linearBorderGradientSelector(directionKey, colorKey)] = {
            borderImage: linearBorderGradientValue(direction, colors),
          };
        });
      });
      return utilities;
    })();

    const repeatingLinearBorderGradientUtilities = (function() {
      let utilities = {};
      _.forEach(repeatingLinearBorderGradientLengths, (length, lengthKey) => {
        _.forEach(repeatingLinearBorderGradientColors, (colors, colorKey) => {
          colors = normalizeColors(colors, true);
          if (!colors) {
            return; // continue
          }
          _.forEach(repeatingLinearBorderGradientDirections, (direction, directionKey) => {
            utilities[linearBorderGradientSelector(directionKey, colorKey, lengthKey)] = {
              borderImage: linearBorderGradientValue(direction, colors, length),
            };
          });
        });
      });
      return utilities;
    })();

    addUtilities(linearBorderGradientUtilities, linearBorderGradientVariants);
    addUtilities(repeatingLinearBorderGradientUtilities, repeatingLinearBorderGradientVariants);
  };
};