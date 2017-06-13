const path = require('path');
const webpack            = require('webpack');
const HtmlWebpackPlugin  = require('html-webpack-plugin');

let webpackLoaders = {
    babelLoader: {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
            loader: 'babel-loader',
            options: { presets: ['es2015'] }
        }]
    },
    sassLoader: {
        test: /\.sass$/,
        loader: ['style-loader', 'css-loader', 'sass-loader']
	},
    assetsLoader: {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        loader: 'file-loader'
	},
    cssLoader: function(ENV) { return null; }
}

exports.setEntry = function (ENV, entryUrl) {
  let entry = ENV === 'test' ? {} : {
    app: entryUrl
  };
  return entry;
};

exports.setOutput = function (ENV, dir, filepath) {
  let output = ENV == 'test' ? {} : {
    path:           path.resolve(dir,filepath),
    publicPath:     ENV === 'prod' ? '/' : 'http://localhost:8080/',
    filename:       ENV === 'prod' ? '[name][hash].js' : '[name].bundle.js',
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
    }
  };
  return devServer;
};

exports.setRules = function(ENV) {
    return [
        webpackLoaders.babelLoader,
        webpackLoaders.assetsLoader,
        webpackLoaders.sassLoader,
        // webpackLoaders.htmlLoader,
        // webpackLoaders.cssLoader(ENV),
    ]; 
}

exports.setPlugins = function(ENV) {
    let plugins = [];
    switch(ENV) {
        case 'dev':
            plugins.push(
                new HtmlWebpackPlugin({
                    entry: 'index.html',
                    template: './index.html',
                    inject: 'body',
                }), 
                new webpack.ProvidePlugin({   
                    jQuery: 'jquery',
                    $: 'jquery',
                    jquery: 'jquery'
                })
            );
        break;
        case 'prod':
            // todo
        break;
        case 'test':
            // todo
        break;
    }
		
		


    return plugins;
}

