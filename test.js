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
      radialBorderGradients: {
        positions: {},
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
      radialBorderGradients: {
        positions: {
          'default': 'center',
          't': 'top',
          'r': 'right',
          'b': 'bottom',
          'l': 'left',
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
        border-image: linear-gradient(to top, rgba(255, 0, 0, 0), #f00)
      }
      .border-gradient-tr-red {
        border-image: linear-gradient(to top right, rgba(255, 0, 0, 0), #f00)
      }
      .border-gradient-r-red {
        border-image: linear-gradient(to right, rgba(255, 0, 0, 0), #f00)
      }
      .border-gradient-br-red {
        border-image: linear-gradient(to bottom right, rgba(255, 0, 0, 0), #f00)
      }
      .border-gradient-b-red {
        border-image: linear-gradient(rgba(255, 0, 0, 0), #f00)
      }
      .border-gradient-bl-red {
        border-image: linear-gradient(to bottom left, rgba(255, 0, 0, 0), #f00)
      }
      .border-gradient-l-red {
        border-image: linear-gradient(to left, rgba(255, 0, 0, 0), #f00)
      }
      .border-gradient-tl-red {
        border-image: linear-gradient(to top left, rgba(255, 0, 0, 0), #f00)
      }
    `);
  });
});

test('radial gradients have default shapes, sizes, and positions', () => {
  return generatePluginCss({
    theme: {
      radialBorderGradients: {
        colors: {
          'red': '#f00',
        },
      },
    },
    variants: {
      linearBorderGradients: [],
      radialBorderGradients: [],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-radial-red {
        border-image: radial-gradient(closest-side, #f00, rgba(255, 0, 0, 0))
      }
      .border-radial-t-red {
        border-image: radial-gradient(closest-side at top, #f00, rgba(255, 0, 0, 0))
      }
      .border-radial-tr-red {
        border-image: radial-gradient(closest-side at top right, #f00, rgba(255, 0, 0, 0))
      }
      .border-radial-r-red {
        border-image: radial-gradient(closest-side at right, #f00, rgba(255, 0, 0, 0))
      }
      .border-radial-br-red {
        border-image: radial-gradient(closest-side at bottom right, #f00, rgba(255, 0, 0, 0))
      }
      .border-radial-b-red {
        border-image: radial-gradient(closest-side at bottom, #f00, rgba(255, 0, 0, 0))
      }
      .border-radial-bl-red {
        border-image: radial-gradient(closest-side at bottom left, #f00, rgba(255, 0, 0, 0))
      }
      .border-radial-l-red {
        border-image: radial-gradient(closest-side at left, #f00, rgba(255, 0, 0, 0))
      }
      .border-radial-tl-red {
        border-image: radial-gradient(closest-side at top left, #f00, rgba(255, 0, 0, 0))
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
      radialBorderGradients: {
        positions: {
          'off-center': '55% 60%',
        },
        colors: {
          'red': '#f00',
        },
      },
    },
    variants: {
      linearBorderGradients: [],
      radialBorderGradients: [],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-gradient-to-top-red {
        border-image: linear-gradient(to top, rgba(255, 0, 0, 0), #f00)
      }
      .border-gradient-to-top-green {
        border-image: linear-gradient(to top, rgba(0, 255, 0, 0), #0f0)
      }
      .border-gradient-to-top-blue {
        border-image: linear-gradient(to top, rgba(0, 0, 255, 0), #00f)
      }
      .border-radial-off-center-red {
        border-image: radial-gradient(closest-side at 55% 60%, #f00, rgba(255, 0, 0, 0))
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
      radialBorderGradients: {
        positions: {
          'default': 'center',
        },
        colors: {
          'red-green': ['#f00', '#0f0'],
          'red-green-blue': ['#f00', '#0f0', '#00f'],
        },
      },
    },
    variants: {
      linearBorderGradients: [],
      radialBorderGradients: [],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-gradient-to-bottom-red-green {
        border-image: linear-gradient(#f00, #0f0)
      }
      .border-gradient-to-bottom-red-green-blue {
        border-image: linear-gradient(#f00, #0f0, #00f)
      }
      .border-radial-red-green {
        border-image: radial-gradient(closest-side, #f00, #0f0)
      }
      .border-radial-red-green-blue {
        border-image: radial-gradient(closest-side, #f00, #0f0, #00f)
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
      radialBorderGradients: {
        positions: {
          'top': 'top',
          'bottom': 'bottom',
        },
        colors: {
          'red': ['#f00'],
          'green': ['#0f0'],
        },
      },
    },
    variants: {
      linearBorderGradients: [],
      radialBorderGradients: [],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-gradient-to-top-red {
        border-image: linear-gradient(to top, rgba(255, 0, 0, 0), #f00)
      }
      .border-gradient-to-bottom-red {
        border-image: linear-gradient(rgba(255, 0, 0, 0), #f00)
      }
      .border-gradient-to-top-green {
        border-image: linear-gradient(to top, rgba(0, 255, 0, 0), #0f0)
      }
      .border-gradient-to-bottom-green {
        border-image: linear-gradient(rgba(0, 255, 0, 0), #0f0)
      }
      .border-radial-top-red {
        border-image: radial-gradient(closest-side at top, #f00, rgba(255, 0, 0, 0))
      }
      .border-radial-bottom-red {
        border-image: radial-gradient(closest-side at bottom, #f00, rgba(255, 0, 0, 0))
      }
      .border-radial-top-green {
        border-image: radial-gradient(closest-side at top, #0f0, rgba(0, 255, 0, 0))
      }
      .border-radial-bottom-green {
        border-image: radial-gradient(closest-side at bottom, #0f0, rgba(0, 255, 0, 0))
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
      radialBorderGradients: [],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-gradient-b-red {
        border-image: linear-gradient(rgba(255, 0, 0, 0), #f00)
      }
      .border-gradient-b-blue {
        border-image: linear-gradient(rgba(0, 0, 255, 0), #00f)
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
      radialBorderGradients: theme => ({
        positions: {
          't': 'top',
        },
        colors: theme('colors'),
      }),
    },
    variants: {
      linearBorderGradients: [],
      radialBorderGradients: [],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-gradient-t-white {
        border-image: linear-gradient(to top, rgba(255, 255, 255, 0), white)
      }
      .border-gradient-t-black {
        border-image: linear-gradient(to top, rgba(0, 0, 0, 0), black)
      }
      .border-gradient-t-transparent {
        border-image: linear-gradient(to top, rgba(0, 0, 0, 0), transparent)
      }
      .border-gradient-t-current {
        border-image: linear-gradient(to top, transparent, currentColor)
      }
      .border-radial-t-white {
        border-image: radial-gradient(closest-side at top, white, rgba(255, 255, 255, 0))
      }
      .border-radial-t-black {
        border-image: radial-gradient(closest-side at top, black, rgba(0, 0, 0, 0))
      }
      .border-radial-t-transparent {
        border-image: radial-gradient(closest-side at top, transparent, rgba(0, 0, 0, 0))
      }
      .border-radial-t-current {
        border-image: radial-gradient(closest-side at top, currentColor, transparent)
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
      radialBorderGradients: theme => ({
        positions: {
          't': 'top',
        },
        colors: theme('colors'),
      }),
    },
    variants: {
      linearBorderGradients: [],
      radialBorderGradients: [],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-gradient-t-red {
        border-image: linear-gradient(to top, rgba(255, 0, 0, 0), #f00)
      }
      .border-radial-t-red {
        border-image: radial-gradient(closest-side at top, #f00, rgba(255, 0, 0, 0))
      }
    `);
  });
});

test('radial gradient shapes and sizes can be customized', () => {
  return generatePluginCss({
    theme: {
      colors: {
        'red': '#f00',
        'green-blue': ['#0f0', '#00f'],
      },
      radialBorderGradients: theme => ({
        shapes: {
          'default': 'circle',
          'ellipse': 'ellipse',
        },
        sizes: {
          'default': 'closest-side',
          'cover': 'farthest-corner',
        },
        positions: {
          'default': 'center',
          'tr': 'top right',
        },
        colors: theme('colors'),
      }),
    },
    variants: {
      radialBorderGradients: [],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-radial-red {
        border-image: radial-gradient(circle closest-side, #f00, rgba(255, 0, 0, 0))
      }
      .border-radial-ellipse-red {
        border-image: radial-gradient(closest-side, #f00, rgba(255, 0, 0, 0))
      }
      .border-radial-cover-red {
        border-image: radial-gradient(circle, #f00, rgba(255, 0, 0, 0))
      }
      .border-radial-ellipse-cover-red {
        border-image: radial-gradient(#f00, rgba(255, 0, 0, 0))
      }
      .border-radial-tr-red {
        border-image: radial-gradient(circle closest-side at top right, #f00, rgba(255, 0, 0, 0))
      }
      .border-radial-ellipse-tr-red {
        border-image: radial-gradient(closest-side at top right, #f00, rgba(255, 0, 0, 0))
      }
      .border-radial-cover-tr-red {
        border-image: radial-gradient(circle at top right, #f00, rgba(255, 0, 0, 0))
      }
      .border-radial-ellipse-cover-tr-red {
        border-image: radial-gradient(at top right, #f00, rgba(255, 0, 0, 0))
      }
      .border-radial-green-blue {
        border-image: radial-gradient(circle closest-side, #0f0, #00f)
      }
      .border-radial-ellipse-green-blue {
        border-image: radial-gradient(closest-side, #0f0, #00f)
      }
      .border-radial-cover-green-blue {
        border-image: radial-gradient(circle, #0f0, #00f)
      }
      .border-radial-ellipse-cover-green-blue {
        border-image: radial-gradient(#0f0, #00f)
      }
      .border-radial-tr-green-blue {
        border-image: radial-gradient(circle closest-side at top right, #0f0, #00f)
      }
      .border-radial-ellipse-tr-green-blue {
        border-image: radial-gradient(closest-side at top right, #0f0, #00f)
      }
      .border-radial-cover-tr-green-blue {
        border-image: radial-gradient(circle at top right, #0f0, #00f)
      }
      .border-radial-ellipse-cover-tr-green-blue {
        border-image: radial-gradient(at top right, #0f0, #00f)
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
      repeatingRadialBorderGradients: theme => ({
        colors: theme('colors'),
      }),
    },
    variants: {
      repeatingLinearBorderGradients: [],
      repeatingRadialBorderGradients: [],
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
      repeatingRadialBorderGradients: theme => ({
        positions: {
          'default': 'center',
        },
        colors: theme('colors'),
        lengths: {
          'sm': '10px',
          'md': '20px',
          'lg': '30px',
        },
      }),
    },
    variants: {
      repeatingLinearBorderGradients: [],
      repeatingRadialBorderGradients: [],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-gradient-t-red-sm {
        border-image: repeating-linear-gradient(to top, rgba(255, 0, 0, 0), #f00 25px)
      }
      .border-gradient-t-blue-sm {
        border-image: repeating-linear-gradient(to top, rgba(0, 0, 255, 0), #00f 25px)
      }
      .border-gradient-t-red-md {
        border-image: repeating-linear-gradient(to top, rgba(255, 0, 0, 0), #f00 50px)
      }
      .border-gradient-t-blue-md {
        border-image: repeating-linear-gradient(to top, rgba(0, 0, 255, 0), #00f 50px)
      }
      .border-gradient-t-red-lg {
        border-image: repeating-linear-gradient(to top, rgba(255, 0, 0, 0), #f00 100px)
      }
      .border-gradient-t-blue-lg {
        border-image: repeating-linear-gradient(to top, rgba(0, 0, 255, 0), #00f 100px)
      }
      .border-radial-red-sm {
        border-image: repeating-radial-gradient(#f00, rgba(255, 0, 0, 0) 10px)
      }
      .border-radial-blue-sm {
        border-image: repeating-radial-gradient(#00f, rgba(0, 0, 255, 0) 10px)
      }
      .border-radial-red-md {
        border-image: repeating-radial-gradient(#f00, rgba(255, 0, 0, 0) 20px)
      }
      .border-radial-blue-md {
        border-image: repeating-radial-gradient(#00f, rgba(0, 0, 255, 0) 20px)
      }
      .border-radial-red-lg {
        border-image: repeating-radial-gradient(#f00, rgba(255, 0, 0, 0) 30px)
      }
      .border-radial-blue-lg {
        border-image: repeating-radial-gradient(#00f, rgba(0, 0, 255, 0) 30px)
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
      radialBorderGradients: {
        positions: {
          'default': 'center',
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
      repeatingRadialBorderGradients: theme => ({
        positions: theme('radialBorderGradients.positions'),
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
      radialBorderGradients: [],
      repeatingLinearBorderGradients: [],
      repeatingRadialBorderGradients: [],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-gradient-r-custom {
        border-image: linear-gradient(to right, #000, #000 45%, #fff 55%, #fff)
      }
      .border-radial-custom {
        border-image: radial-gradient(closest-side, #000, #000 45%, #fff 55%, #fff)
      }
      .border-gradient-r-custom-repeating {
        border-image: repeating-linear-gradient(to right, #000, #000 10px, #fff 10px, #fff 20px)
      }
      .border-radial-custom-repeating {
        border-image: repeating-radial-gradient(#000, #000 10px, #fff 10px, #fff 20px)
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
      radialBorderGradients: {
        positions: {
          'default': 'center',
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
      repeatingRadialBorderGradients: theme => ({
        positions: theme('radialBorderGradients.positions'),
        colors: theme('radialBorderGradients.colors'),
        lengths: {
          'repeating': '10px',
        },
      }),
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-gradient-t-red {
        border-image: linear-gradient(to top, rgba(255, 0, 0, 0), #f00)
      }
      .border-radial-red {
        border-image: radial-gradient(closest-side, #f00, rgba(255, 0, 0, 0))
      }
      .border-gradient-t-red-repeating {
        border-image: repeating-linear-gradient(to top, rgba(255, 0, 0, 0), #f00 20px)
      }
      .border-radial-red-repeating {
        border-image: repeating-radial-gradient(#f00, rgba(255, 0, 0, 0) 10px)
      }
      @media (min-width: 640px) {
        .sm\\:border-gradient-t-red {
          border-image: linear-gradient(to top, rgba(255, 0, 0, 0), #f00)
        }
        .sm\\:border-radial-red {
          border-image: radial-gradient(closest-side, #f00, rgba(255, 0, 0, 0))
        }
        .sm\\:border-gradient-t-red-repeating {
          border-image: repeating-linear-gradient(to top, rgba(255, 0, 0, 0), #f00 20px)
        }
        .sm\\:border-radial-red-repeating {
          border-image: repeating-radial-gradient(#f00, rgba(255, 0, 0, 0) 10px)
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
      radialBorderGradients: {
        positions: {
          'b': 'bottom',
        },
        colors: {
          'blue': '#00f',
        },
      },
      repeatingLinearBorderGradients: theme => ({
        directions: theme('linearBorderGradients.directions'),
        colors: theme('linearBorderGradients.colors'),
        lengths: {
          'repeating': '20px',
        },
      }),
      repeatingRadialBorderGradients: theme => ({
        positions: theme('radialBorderGradients.positions'),
        colors: theme('radialBorderGradients.colors'),
        lengths: {
          'repeating': '10px',
        },
      }),
    },
    variants: {
      linearBorderGradients: ['hover', 'active'],
      radialBorderGradients: ['group-hover'],
      repeatingLinearBorderGradients: ['active'],
      repeatingRadialBorderGradients: ['hover'],
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .border-gradient-t-red {
        border-image: linear-gradient(to top, rgba(255, 0, 0, 0), #f00)
      }
      .hover\\:border-gradient-t-red:hover {
        border-image: linear-gradient(to top, rgba(255, 0, 0, 0), #f00)
      }
      .active\\:border-gradient-t-red:active {
        border-image: linear-gradient(to top, rgba(255, 0, 0, 0), #f00)
      }
      .border-radial-b-blue {
        border-image: radial-gradient(closest-side at bottom, #00f, rgba(0, 0, 255, 0))
      }
      .group:hover .group-hover\\:border-radial-b-blue {
        border-image: radial-gradient(closest-side at bottom, #00f, rgba(0, 0, 255, 0))
      }
      .border-gradient-t-red-repeating {
        border-image: repeating-linear-gradient(to top, rgba(255, 0, 0, 0), #f00 20px)
      }
      .active\\:border-gradient-t-red-repeating:active {
        border-image: repeating-linear-gradient(to top, rgba(255, 0, 0, 0), #f00 20px)
      }
      .border-radial-b-blue-repeating {
        border-image: repeating-radial-gradient(at bottom, #00f, rgba(0, 0, 255, 0) 10px)
      }
      .hover\\:border-radial-b-blue-repeating:hover {
        border-image: repeating-radial-gradient(at bottom, #00f, rgba(0, 0, 255, 0) 10px)
      }
    `);
  });
});