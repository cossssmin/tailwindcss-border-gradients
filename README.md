# Tailwind CSS Border Gradients Plugin

This plugin is based on the [tailwindcss-gradients](https://github.com/benface/tailwindcss-gradients) plugin. Usage is the same, it just outputs `border-image` gradients, instead of `background-image`.

## Installation

```bash
npm install tailwindcss-border-gradients
```

## Usage

```js
// In your Tailwind CSS config

{
  plugins: [
    require('tailwindcss-border-gradients')({
      variants: ['responsive'],
      directions: {
        't': 'to top',
        'r': 'to right',
        'b': 'to bottom',
        'l': 'to left',
      },
      gradients: {
        'red': '#f00',
        'red-blue': ['#f00', '#00f'],
        'red-green-blue': ['#f00', '#0f0', '#00f'],
      },
    }),
  ],
}
```

This plugin generates the following utilities:

```css
/* configurable with the "directions" and "gradients" options */

.border-gradient-[direction-name]-[gradient-name] {
  border-image: linear-gradient([direction-value], [gradient-color-1], [gradient-color-2], [...]) 1;
}
```

`directions` is optional and it defaults to:

```js
{
  't': 'to top',
  'tr': 'to top right',
  'r': 'to right',
  'br': 'to bottom right',
  'b': 'to bottom',
  'bl': 'to bottom left',
  'l': 'to left',
  'tl': 'to top left',
}
```