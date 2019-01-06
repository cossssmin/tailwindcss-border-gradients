module.exports = ({
  variants = {},
  directions = {
    't': 'to top',
    'tr': 'to top right',
    'r': 'to right',
    'br': 'to bottom right',
    'b': 'to bottom',
    'bl': 'to bottom left',
    'l': 'to left',
    'tl': 'to top left',
  },
  gradients = {},
} = {}) => ({ e, addUtilities }) => {
  addUtilities(
    {
      ...(function() {
        const utilities = {};
        Object.entries(gradients).map(([gradientName, gradientColors]) => {
          if (!Array.isArray(gradientColors) || gradientColors.length === 1) {
            gradientColors = ['transparent', Array.isArray(gradientColors) ? gradientColors[0] : gradientColors];
          }
          Object.entries(directions).map(([directionName, directionValue]) => {
            utilities[`.${e(`border-gradient-${directionName}-${gradientName}`)}`] = {
              borderImage: `linear-gradient(${directionValue}, ${gradientColors.join(', ')}) 1`,
            };
          });
        });
        return utilities;
      })(),
    },
    variants,
  );
};
