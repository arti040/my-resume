const path               = require('path');
const webpack            = require('webpack');
const opts    	         = require('./webpack.opts');
const HtmlWebpackPlugin  = require('html-webpack-plugin');
const ExtractTextPlugin  = require('extract-text-webpack-plugin');
const CopyWebpackPlugin  = require('copy-webpack-plugin');
const UglifyJSPlugin     = require('uglifyjs-webpack-plugin');


let webpackLoaders = {
    babelLoader: {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
            loader: 'babel-loader',
            options: { presets: ['env'] }
        }]
    },
    cssLoader: {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader']
    },
    sassLoader: (ENV) => ({
        test: /\.(sass|scss)$/,
        loader: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
    }),
    assetsLoader: {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'file-loader'
    },
    fontsLoader: {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
        loader: "file-loader"
    }
}

exports.setEntry = function (ENV, entryUrl) {
  let entry = ENV === 'test' ? {} : [ entryUrl ];  

  if(opts.frameworks.bootstrap) {
      if(opts.frameworks.gridBootstrapOnly) {
        entry.push(opts.frameworks.sources.grid);
        return entry;
      }
      entry.push(opts.frameworks.sources.bootstrap);
      return entry;
  }
  return entry; 
};

exports.setOutput = function (ENV, dir, filepath) {
  let output = ENV == 'test' ? {} : {
    path:           path.resolve(dir,filepath),
    publicPath:     ENV === 'prod' ? '/' : 'http://localhost:8080/',
    filename:       ENV === 'prod' ? '[name]-[hash].js' : '[name].bundle.js',
  };
  return output;
};

exports.setDevServer = function (dir,filepath) {
  let devServer = {
    contentBase: path.resolve(dir,filepath),
    stats: {
      modules: false,
      cached: false,
      colors: true,
      chunk: false
    },
    compress: true,
    disableHostCheck: true
  };
  return devServer;
};

exports.setRules = function(ENV) {
    return [
        webpackLoaders.babelLoader,
        webpackLoaders.assetsLoader,
        webpackLoaders.fontsLoader,
        webpackLoaders.cssLoader,
        webpackLoaders.sassLoader(ENV),
    ]; 
}

exports.setPlugins = function(ENV, dirpath) {
    let plugins = [];

    plugins.push(
        new webpack.ProvidePlugin({   
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery'
        })
    );

    switch(ENV) {
        case 'dev':
            plugins.push(
                new HtmlWebpackPlugin({
                    template: dirpath + 'index.html'
                })
            );
        break;
        case 'prod':

            let minifyHTML;
            if(opts.settings.prod.minHTML) {
                minifyHTML = {
                    removeAttributeQuotes: true,
                    removeComments: true,
                    collapseInlineTagWhitespace: false,
                    collapseWhitespace: true,
                    conservativeCollapse: false
                }
            } 
            else { minifyHTML = false }

            plugins.push(
                new HtmlWebpackPlugin({
                    template: dirpath + 'index.html',
                    //css: '/style.css',
                    minify: minifyHTML
                }),
                new CopyWebpackPlugin([
                    { from: dirpath + '/' + opts.settings.assetsDir, to: opts.settings.assetsDir }
                ])

            )
            if(opts.settings.prod.minJS) { plugins.push(new UglifyJSPlugin()); }
            
        break;
        case 'test':
            // todo
        break;
    }
	

    return plugins;
}

