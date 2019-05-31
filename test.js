const _ = require('lodash');
const cssMatcher = require('jest-matcher-css');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const gradientsPlugin = require('./index.js');

const generatePluginCss = (config) => {
  return postcss(
    tailwindcss(
      _.merge({
        theme: {
          screens: {
            'sm': '640px',
          },
        },
        corePlugins: false,
        plugins: [
          gradientsPlugin(),
        ],
      }, config)
    )
  )
  .process('@tailwind utilities', {
    from: undefined,
  })
  .then(result => {
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

test('there is no output without directions or positions', () => {
  return generatePluginCss({
    theme: {
      linearBorderGradients: {
        directions: {},
        colors: {
          'red': '#f00',
          'green': '#0f0',
          'blue': '#00f',
        },
      },
    },
  }).then(css => {
    expect(css).toMatchCss(``);
  });
});

test('there is no output without colors', () => {
  return generatePluginCss({
    theme: {
      linearBorderGradients: {
        directions: {
          't': 'to top',
          'r': 'to right',
          'b': 'to bottom',
          'l': 'to left',
        },
        colors: {},
      },
    },
  }).then(css => {
    expect(css).toMatchCss(``);
  });
});

test('linear gradients have default directions', () => {
  return generatePluginCss({
    theme: {
      linearBorderGradients: {
        colors: {
          'red': '#f00',
        },
      },
    },
    variants: {
      linearBorderGradients: [],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-gradient-t-red {
        border-image: linear-gradient(to top, rgba(255, 0, 0, 0), #f00) 1
      }
      .border-gradient-tr-red {
        border-image: linear-gradient(to top right, rgba(255, 0, 0, 0), #f00) 1
      }
      .border-gradient-r-red {
        border-image: linear-gradient(to right, rgba(255, 0, 0, 0), #f00) 1
      }
      .border-gradient-br-red {
        border-image: linear-gradient(to bottom right, rgba(255, 0, 0, 0), #f00) 1
      }
      .border-gradient-b-red {
        border-image: linear-gradient(rgba(255, 0, 0, 0), #f00) 1
      }
      .border-gradient-bl-red {
        border-image: linear-gradient(to bottom left, rgba(255, 0, 0, 0), #f00) 1
      }
      .border-gradient-l-red {
        border-image: linear-gradient(to left, rgba(255, 0, 0, 0), #f00) 1
      }
      .border-gradient-tl-red {
        border-image: linear-gradient(to top left, rgba(255, 0, 0, 0), #f00) 1
      }
    `);
  });
});

test('directions and positions can be customized', () => {
  return generatePluginCss({
    theme: {
      linearBorderGradients: {
        directions: {
          'to-top': 'to top',
        },
        colors: {
          'red': '#f00',
          'green': '#0f0',
          'blue': '#00f',
        },
      },
    },
    variants: {
      linearBorderGradients: [],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-gradient-to-top-red {
        border-image: linear-gradient(to top, rgba(255, 0, 0, 0), #f00) 1
      }
      .border-gradient-to-top-green {
        border-image: linear-gradient(to top, rgba(0, 255, 0, 0), #0f0) 1
      }
      .border-gradient-to-top-blue {
        border-image: linear-gradient(to top, rgba(0, 0, 255, 0), #00f) 1
      }
    `);
  });
});

test('gradients can have multiple colors', () => {
  return generatePluginCss({
    theme: {
      linearBorderGradients: {
        directions: {
          'to-bottom': 'to bottom',
        },
        colors: {
          'red-green': ['#f00', '#0f0'],
          'red-green-blue': ['#f00', '#0f0', '#00f'],
        },
      },
    },
    variants: {
      linearBorderGradients: [],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-gradient-to-bottom-red-green {
        border-image: linear-gradient(#f00, #0f0) 1
      }
      .border-gradient-to-bottom-red-green-blue {
        border-image: linear-gradient(#f00, #0f0, #00f) 1
      }
    `);
  });
});

test('multiple directions/positions and multiple colors can be used together', () => {
  return generatePluginCss({
    theme: {
      linearBorderGradients: {
        directions: {
          'to-top': 'to top',
          'to-bottom': 'to bottom',
        },
        colors: {
          'red': ['#f00'],
          'green': ['#0f0'],
        },
      },
    },
    variants: {
      linearBorderGradients: [],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-gradient-to-top-red {
        border-image: linear-gradient(to top, rgba(255, 0, 0, 0), #f00) 1
      }
      .border-gradient-to-bottom-red {
        border-image: linear-gradient(rgba(255, 0, 0, 0), #f00) 1
      }
      .border-gradient-to-top-green {
        border-image: linear-gradient(to top, rgba(0, 255, 0, 0), #0f0) 1
      }
      .border-gradient-to-bottom-green {
        border-image: linear-gradient(rgba(0, 255, 0, 0), #0f0) 1
      }
    `);
  });
});

test('colors can be referenced from the theme with a closure', () => {
  return generatePluginCss({
    theme: {
      colors: {
        'red': '#f00',
        'blue': '#00f',
      },
      linearBorderGradients: theme => ({
        directions: {
          'b': 'to bottom',
        },
        colors: theme('colors'),
      }),
    },
    variants: {
      linearBorderGradients: [],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-gradient-b-red {
        border-image: linear-gradient(rgba(255, 0, 0, 0), #f00) 1
      }
      .border-gradient-b-blue {
        border-image: linear-gradient(rgba(0, 0, 255, 0), #00f) 1
      }
    `);
  });
});

test('color keywords are accepted', () => {
  return generatePluginCss({
    theme: {
      colors: {
        'white': 'white',
        'black': 'black',
        'transparent': 'transparent',
        'current': 'currentColor',
      },
      linearBorderGradients: theme => ({
        directions: {
          't': 'to top',
        },
        colors: theme('colors'),
      }),
    },
    variants: {
      linearBorderGradients: [],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-gradient-t-white {
        border-image: linear-gradient(to top, rgba(255, 255, 255, 0), white) 1
      }
      .border-gradient-t-black {
        border-image: linear-gradient(to top, rgba(0, 0, 0, 0), black) 1
      }
      .border-gradient-t-transparent {
        border-image: linear-gradient(to top, rgba(0, 0, 0, 0), transparent) 1
      }
      .border-gradient-t-current {
        border-image: linear-gradient(to top, transparent, currentColor) 1
      }
    `);
  });
});

test('some keywords such as inherit are skipped', () => {
  return generatePluginCss({
    theme: {
      colors: {
        'inherit': 'inherit',
        'red': '#f00',
        'initial': 'initial',
        'unset': 'unset',
        'revert': 'revert',
      },
      linearBorderGradients: theme => ({
        directions: {
          't': 'to top',
        },
        colors: theme('colors'),
      }),
    },
    variants: {
      linearBorderGradients: [],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-gradient-t-red {
        border-image: linear-gradient(to top, rgba(255, 0, 0, 0), #f00) 1
      }
    `);
  });
});

test('there is no output for repeating gradients without lengths', () => {
  return generatePluginCss({
    theme: {
      colors: {
        'red': '#f00',
        'blue': '#00f',
      },
      repeatingLinearBorderGradients: theme => ({
        directions: {
          't': 'to top',
        },
        colors: theme('colors'),
      }),
    },
    variants: {
      repeatingLinearBorderGradients: [],
    },
  }).then(css => {
    expect(css).toMatchCss(``);
  });
});

test('lengths can be customized', () => {
  return generatePluginCss({
    theme: {
      colors: {
        'red': '#f00',
        'blue': '#00f',
      },
      repeatingLinearBorderGradients: theme => ({
        directions: {
          't': 'to top',
        },
        colors: theme('colors'),
        lengths: {
          'sm': '25px',
          'md': '50px',
          'lg': '100px',
        },
      }),
    },
    variants: {
      repeatingLinearBorderGradients: [],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-gradient-t-red-sm {
        border-image: repeating-linear-gradient(to top, rgba(255, 0, 0, 0), #f00 25px) 1
      }
      .border-gradient-t-blue-sm {
        border-image: repeating-linear-gradient(to top, rgba(0, 0, 255, 0), #00f 25px) 1
      }
      .border-gradient-t-red-md {
        border-image: repeating-linear-gradient(to top, rgba(255, 0, 0, 0), #f00 50px) 1
      }
      .border-gradient-t-blue-md {
        border-image: repeating-linear-gradient(to top, rgba(0, 0, 255, 0), #00f 50px) 1
      }
      .border-gradient-t-red-lg {
        border-image: repeating-linear-gradient(to top, rgba(255, 0, 0, 0), #f00 100px) 1
      }
      .border-gradient-t-blue-lg {
        border-image: repeating-linear-gradient(to top, rgba(0, 0, 255, 0), #00f 100px) 1
      }
    `);
  });
});

test('color stops can be customized', () => {
  return generatePluginCss({
    theme: {
      linearBorderGradients: {
        directions: {
          'r': 'to right',
        },
        colors: {
          'custom': ['#000', '#000 45%', '#fff 55%', '#fff'],
        },
      },
      repeatingLinearBorderGradients: theme => ({
        directions: theme('linearBorderGradients.directions'),
        colors: {
          'custom': ['#000', '#000 10px', '#fff 10px', '#fff 20px'],
        },
        lengths: {
          'repeating': '',
        },
      }),
    },
    variants: {
      linearBorderGradients: [],
      repeatingLinearBorderGradients: [],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-gradient-r-custom {
        border-image: linear-gradient(to right, #000, #000 45%, #fff 55%, #fff) 1
      }
      .border-gradient-r-custom-repeating {
        border-image: repeating-linear-gradient(to right, #000, #000 10px, #fff 10px, #fff 20px) 1
      }
    `);
  });
});

test('responsive variants are generated by default', () => {
  return generatePluginCss({
    theme: {
      linearBorderGradients: {
        directions: {
          't': 'to top',
        },
        colors: {
          'red': '#f00',
        },
      },
      repeatingLinearBorderGradients: theme => ({
        directions: theme('linearBorderGradients.directions'),
        colors: theme('linearBorderGradients.colors'),
        lengths: {
          'repeating': '20px',
        },
      }),
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-gradient-t-red {
        border-image: linear-gradient(to top, rgba(255, 0, 0, 0), #f00) 1
      }
      .border-gradient-t-red-repeating {
        border-image: repeating-linear-gradient(to top, rgba(255, 0, 0, 0), #f00 20px) 1
      }
      @media (min-width: 640px) {
        .sm\\:border-gradient-t-red {
          border-image: linear-gradient(to top, rgba(255, 0, 0, 0), #f00) 1
        }
        .sm\\:border-gradient-t-red-repeating {
          border-image: repeating-linear-gradient(to top, rgba(255, 0, 0, 0), #f00 20px) 1
        }
      }
    `);
  });
});

test('variants can be customized', () => {
  return generatePluginCss({
    theme: {
      linearBorderGradients: {
        directions: {
          't': 'to top',
        },
        colors: {
          'red': '#f00',
        },
      },
      repeatingLinearBorderGradients: theme => ({
        directions: theme('linearBorderGradients.directions'),
        colors: theme('linearBorderGradients.colors'),
        lengths: {
          'repeating': '20px',
        },
      }),
    },
    variants: {
      linearBorderGradients: ['hover', 'active'],
      repeatingLinearBorderGradients: ['active'],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-gradient-t-red {
        border-image: linear-gradient(to top, rgba(255, 0, 0, 0), #f00) 1
      }
      .hover\\:border-gradient-t-red:hover {
        border-image: linear-gradient(to top, rgba(255, 0, 0, 0), #f00) 1
      }
      .active\\:border-gradient-t-red:active {
        border-image: linear-gradient(to top, rgba(255, 0, 0, 0), #f00) 1
      }
      .border-gradient-t-red-repeating {
        border-image: repeating-linear-gradient(to top, rgba(255, 0, 0, 0), #f00 20px) 1
      }
      .active\\:border-gradient-t-red-repeating:active {
        border-image: repeating-linear-gradient(to top, rgba(255, 0, 0, 0), #f00 20px) 1
      }
    `);
  });
});