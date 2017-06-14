module.exports = (ctx) => ({
    map: ctx.env === 'prod' ? false : 'inline',
    plugins: [
      require('autoprefixer')
    ]
  })