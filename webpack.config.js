const path = require('path');
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');

const isProd = !process.argv.find((str) => str.includes('development'));

module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? 'source-map' : 'inline-source-map',
  stats: 'minimal',

  output: {
    path: path.join(__dirname, 'dist'),
    clean: true,
  },

  resolve: {
    // use aliases used in sources instead of relative paths like ../../
    alias: {
      '@images': path.join(__dirname, 'src/assets/images/'),
      '@styles': path.join(__dirname, 'src/assets/styles/'),
      '@scripts': path.join(__dirname, 'src/assets/scripts/'),
    },
  },

  plugins: [
    new HtmlBundlerPlugin({
      // verbose: 'auto', // output information about the process to console in development mode only

      entry: {
        // define HTML templates here

        // define the simple template
        index: 'src/index.html', // => dist/index.html
        // define the template with passed external variables
      },

      js: {
        // output filename of compiled JavaScript, used if `inline` option is false (defaults)
        filename: 'assets/js/[name].[contenthash:8].js',
        // inline: true; // inlines JS into HTML
      },

      css: {
        // output filename of extracted CSS, used if `inline` option is false (defaults)
        filename: 'assets/css/[name].[contenthash:8].css',
        // inline: true // inlines CSS into HTML
      },

      // supports template engines: eta, ejs, handlebars, nunjucks, twig
      preprocessor: 'nunjucks', // use the Nunjucks template engine
    }),
  ],

  module: {
    rules: [
      // load styles
      {
        test: /\.(css|scss)$/,
        use: [
          'css-loader', 'sass-loader'
        ],
      },

      // load images from `images` directory only
      {
        test: /[\\/]images[\\/].+(png|jpe?g|svg|webp|ico)$/,
        oneOf: [
          // inline image using `?inline` query
          {
            resourceQuery: /inline/,
            type: 'asset/inline',
          },
          // auto inline by image size
          {
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 1024,
              },
            },
            generator: {
              filename: 'assets/img/[name].[hash:8][ext]',
            },
          },
        ],
      },
    ],
  },

  performance: {
    // don't show the size limit warning when a bundle is bigger than 250 KB
    hints: false,
  },

  devServer: {
    // open browser
    open:
    {
      app: {
        name: 'google chrome'
      }
    },
    compress: true,
    static: {
      directory: path.join(__dirname, './dist'),
    },

    // enable live reload
    watchFiles: {
      paths: ['src/**/*.*'],
      options: {
        usePolling: true,
      },
    },

    // rewrite rules
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/index.html' },
        { from: /./, to: '/404.html' },
      ],
    },
  },
};
