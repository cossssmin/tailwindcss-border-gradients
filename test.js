const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const gradientsPlugin = require('./index.js');
const cssMatcher = require('jest-matcher-css');
const defaultConfig = require('tailwindcss/defaultConfig')();

const disabledModules = {};
Object.keys(defaultConfig.modules).forEach(module => {
  disabledModules[module] = false;
});

const generatePluginCss = (options = {}) => {
  return postcss(tailwindcss({
    modules: disabledModules,
    plugins: [gradientsPlugin(options)],
  })).process('@tailwind utilities;', {
    from: undefined,
  }).then(result => {
    return result.css;
  });
};

expect.extend({
  toMatchCss: cssMatcher,
});

test('there is no output by default', () => {
  return generatePluginCss().then(css => {
    expect(css).toMatchCss(``);
  });
});

test('there is no output without directions', () => {
  return generatePluginCss({
    directions: {},
    gradients: {
      'red': '#f00',
      'green': '#0f0',
      'blue': '#00f',
    },
  }).then(css => {
    expect(css).toMatchCss(``);
  });
});

test('there is no output without gradients', () => {
  return generatePluginCss({
    directions: {
      't': 'to top',
      'r': 'to right',
      'b': 'to bottom',
      'l': 'to left',
    },
    gradients: {},
  }).then(css => {
    expect(css).toMatchCss(``);
  });
});

test('there are default directions', () => {
  return generatePluginCss({
    gradients: {
      'red': '#f00',
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-gradient-t-red {
        border-image: linear-gradient(to top, transparent, #f00) 1;
      }
      .border-gradient-tr-red {
        border-image: linear-gradient(to top right, transparent, #f00) 1;
      }
      .border-gradient-r-red {
        border-image: linear-gradient(to right, transparent, #f00) 1;
      }
      .border-gradient-br-red {
        border-image: linear-gradient(to bottom right, transparent, #f00) 1;
      }
      .border-gradient-b-red {
        border-image: linear-gradient(to bottom, transparent, #f00) 1;
      }
      .border-gradient-bl-red {
        border-image: linear-gradient(to bottom left, transparent, #f00) 1;
      }
      .border-gradient-l-red {
        border-image: linear-gradient(to left, transparent, #f00) 1;
      }
      .border-gradient-tl-red {
        border-image: linear-gradient(to top left, transparent, #f00) 1;
      }
    `);
  });
});

test('directions can be customized', () => {
  return generatePluginCss({
    directions: {
      'to-top': 'to top',
    },
    gradients: {
      'red': '#f00',
      'green': '#0f0',
      'blue': '#00f',
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-gradient-to-top-red {
        border-image: linear-gradient(to top, transparent, #f00) 1;
      }
      .border-gradient-to-top-green {
        border-image: linear-gradient(to top, transparent, #0f0) 1;
      }
      .border-gradient-to-top-blue {
        border-image: linear-gradient(to top, transparent, #00f) 1;
      }
    `);
  });
});

test('gradients can have multiple colors', () => {
  return generatePluginCss({
    directions: {
      'to-bottom': 'to bottom',
    },
    gradients: {
      'red-green': ['#f00', '#0f0'],
      'red-green-blue': ['#f00', '#0f0', '#00f'],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-gradient-to-bottom-red-green {
        border-image: linear-gradient(to bottom, #f00, #0f0) 1;
      }
      .border-gradient-to-bottom-red-green-blue {
        border-image: linear-gradient(to bottom, #f00, #0f0, #00f) 1;
      }
    `);
  });
});

test('multiple directions and multiple gradients can be used together', () => {
  return generatePluginCss({
    directions: {
      'to-top': 'to top',
      'to-bottom': 'to bottom',
    },
    gradients: {
      'red': ['#f00'],
      'green': ['#0f0'],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-gradient-to-top-red {
        border-image: linear-gradient(to top, transparent, #f00) 1;
      }
      .border-gradient-to-bottom-red {
        border-image: linear-gradient(to bottom, transparent, #f00) 1;
      }
      .border-gradient-to-top-green {
        border-image: linear-gradient(to top, transparent, #0f0) 1;
      }
      .border-gradient-to-bottom-green {
        border-image: linear-gradient(to bottom, transparent, #0f0) 1;
      }
    `);
  });
});

test('variants are supported', () => {
  return generatePluginCss({
    variants: ['hover', 'active'],
    directions: {
      't': 'to top',
    },
    gradients: {
      'red': '#f00',
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-gradient-t-red {
        border-image: linear-gradient(to top, transparent, #f00) 1;
      }
      .hover\\:border-gradient-t-red:hover {
        border-image: linear-gradient(to top, transparent, #f00) 1;
      }
      .active\\:border-gradient-t-red:active {
        border-image: linear-gradient(to top, transparent, #f00) 1;
      }
    `);
  });
});
