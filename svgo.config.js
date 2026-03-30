export default {
  plugins: [
    'preset-default',
    'removeDimensions',
    {
      name: 'removeAttrs',
      params: {
        attrs: ['data-.*', 'xmlns'],
      },
    },
    {
      name: 'convertColors',
      params: {
        currentColor: true,
      },
    },
  ],
};
