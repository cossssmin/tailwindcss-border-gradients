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
    const defaultRadialBorderGradientShapes = {
      'default': 'ellipse',
    };
    const defaultRadialBorderGradientSizes = {
      'default': 'closest-side',
    };
    const defaultRadialBorderGradientPositions = {
      'default': 'center',
      't': 'top',
      'tr': 'top right',
      'r': 'right',
      'br': 'bottom right',
      'b': 'bottom',
      'bl': 'bottom left',
      'l': 'left',
      'tl': 'top left',
    };
    const defaultRadialBorderGradientColors = {};
    const defaultRadialBorderGradientVariants = ['responsive'];
    const defaultRepeatingLinearBorderGradientDirections = defaultLinearBorderGradientDirections;
    const defaultRepeatingLinearBorderGradientColors = defaultLinearBorderGradientColors;
    const defaultRepeatingLinearBorderGradientLengths = {};
    const defaultRepeatingLinearBorderGradientVariants = ['responsive'];
    const defaultRepeatingRadialBorderGradientShapes = defaultRadialBorderGradientShapes;
    const defaultRepeatingRadialBorderGradientSizes = {
      'default': 'farthest-corner',
    };
    const defaultRepeatingRadialBorderGradientPositions = defaultRadialBorderGradientPositions;
    const defaultRepeatingRadialBorderGradientColors = defaultRadialBorderGradientColors;
    const defaultRepeatingRadialBorderGradientLengths = {};
    const defaultRepeatingRadialBorderGradientVariants = ['responsive'];

    const linearBorderGradientDirections = theme('linearBorderGradients.directions', defaultLinearBorderGradientDirections);
    const linearBorderGradientColors = theme('linearBorderGradients.colors', defaultLinearBorderGradientColors);
    const linearBorderGradientVariants = variants('linearBorderGradients', defaultLinearBorderGradientVariants);
    const radialBorderGradientShapes = theme('radialBorderGradients.shapes', defaultRadialBorderGradientShapes);
    const radialBorderGradientSizes = theme('radialBorderGradients.sizes', defaultRadialBorderGradientSizes);
    const radialBorderGradientPositions = theme('radialBorderGradients.positions', defaultRadialBorderGradientPositions);
    const radialBorderGradientColors = theme('radialBorderGradients.colors', defaultRadialBorderGradientColors);
    const radialBorderGradientVariants = variants('radialBorderGradients', defaultRadialBorderGradientVariants);
    const repeatingLinearBorderGradientDirections = theme('repeatingLinearBorderGradients.directions', defaultRepeatingLinearBorderGradientDirections);
    const repeatingLinearBorderGradientColors = theme('repeatingLinearBorderGradients.colors', defaultRepeatingLinearBorderGradientColors);
    const repeatingLinearBorderGradientLengths = theme('repeatingLinearBorderGradients.lengths', defaultRepeatingLinearBorderGradientLengths);
    const repeatingLinearBorderGradientVariants = variants('repeatingLinearBorderGradients', defaultRepeatingLinearBorderGradientVariants);
    const repeatingRadialBorderGradientShapes = theme('repeatingRadialBorderGradients.shapes', defaultRepeatingRadialBorderGradientShapes);
    const repeatingRadialBorderGradientSizes = theme('repeatingRadialBorderGradients.sizes', defaultRepeatingRadialBorderGradientSizes);
    const repeatingRadialBorderGradientPositions = theme('repeatingRadialBorderGradients.positions', defaultRepeatingRadialBorderGradientPositions);
    const repeatingRadialBorderGradientColors = theme('repeatingRadialBorderGradients.colors', defaultRepeatingRadialBorderGradientColors);
    const repeatingRadialBorderGradientLengths = theme('repeatingRadialBorderGradients.lengths', defaultRepeatingRadialBorderGradientLengths);
    const repeatingRadialBorderGradientVariants = variants('repeatingRadialBorderGradients', defaultRepeatingRadialBorderGradientVariants);

    const linearBorderGradientSelector = function(directionKey, colorKey, lengthKey) {
      return `.${e(`border-gradient-${directionKey}-${colorKey}${lengthKey ? `-${lengthKey}` : ''}`)}`;
    };

    const linearBorderGradientValue = function(direction, colors, length) {
      const cssDefaultLinearBorderGradientDirections = ['to bottom', '180deg', '0.5turn', '200grad', '3.1416rad'];
      return `${!_.isNil(length) ? 'repeating-' : ''}linear-gradient(${_.includes(cssDefaultLinearBorderGradientDirections, direction) ? '' : `${direction}, `}${colors.join(', ')}${length ? ` ${length}` : ''})`;
    };

    const radialBorderGradientSelector = function(shapeKey, sizeKey, positionKey, colorKey, lengthKey) {
      return `.${e(`border-radial${shapeKey === 'default' ? '' : `-${shapeKey}`}${sizeKey === 'default' ? '' : `-${sizeKey}`}${positionKey === 'default' ? '' : `-${positionKey}`}-${colorKey}${lengthKey ? `-${lengthKey}` : ''}`)}`;
    };

    const radialBorderGradientValue = function(shape, size, position, colors, length) {
      const cssDefaultRadialBorderGradientShape = 'ellipse';
      const cssDefaultRadialBorderGradientSize = 'farthest-corner';
      const cssDefaultRadialBorderGradientPositions = ['center', 'center center', '50%', '50% 50%', 'center 50%', '50% center'];
      let firstArgumentValues = [];
      if (shape !== cssDefaultRadialBorderGradientShape) {
        firstArgumentValues.push(shape);
      }
      if (size !== cssDefaultRadialBorderGradientSize) {
        firstArgumentValues.push(size);
      }
      if (!_.includes(cssDefaultRadialBorderGradientPositions, position)) {
        firstArgumentValues.push(`at ${position}`);
      }
      return `${!_.isNil(length) ? 'repeating-' : ''}radial-gradient(${firstArgumentValues.length > 0 ? `${firstArgumentValues.join(' ')}, ` : ''}${colors.join(', ')}${length ? ` ${length}` : ''})`;
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

    const radialBorderGradientUtilities = (function() {
      let utilities = {};
      _.forEach(radialBorderGradientColors, (colors, colorKey) => {
        colors = normalizeColors(colors, false);
        if (!colors) {
          return; // continue
        }
        _.forEach(radialBorderGradientPositions, (position, positionKey) => {
          _.forEach(radialBorderGradientSizes, (size, sizeKey) => {
            _.forEach(radialBorderGradientShapes, (shape, shapeKey) => {
              utilities[radialBorderGradientSelector(shapeKey, sizeKey, positionKey, colorKey)] = {
                borderImage: radialBorderGradientValue(shape, size, position, colors),
              };
            });
          });
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

    const repeatingRadialBorderGradientUtilities = (function() {
      let utilities = {};
      _.forEach(repeatingRadialBorderGradientLengths, (length, lengthKey) => {
        _.forEach(repeatingRadialBorderGradientColors, (colors, colorKey) => {
          colors = normalizeColors(colors, false);
          if (!colors) {
            return; // continue
          }
          _.forEach(repeatingRadialBorderGradientPositions, (position, positionKey) => {
            _.forEach(repeatingRadialBorderGradientSizes, (size, sizeKey) => {
              _.forEach(repeatingRadialBorderGradientShapes, (shape, shapeKey) => {
                utilities[radialBorderGradientSelector(shapeKey, sizeKey, positionKey, colorKey, lengthKey)] = {
                  borderImage: radialBorderGradientValue(shape, size, position, colors, length),
                };
              });
            });
          });
        });
      });
      return utilities;
    })();

    addUtilities(linearBorderGradientUtilities, linearBorderGradientVariants);
    addUtilities(radialBorderGradientUtilities, radialBorderGradientVariants);
    addUtilities(repeatingLinearBorderGradientUtilities, repeatingLinearBorderGradientVariants);
    addUtilities(repeatingRadialBorderGradientUtilities, repeatingRadialBorderGradientVariants);
  };
};