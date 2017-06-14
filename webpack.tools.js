const path               = require('path');
const webpack            = require('webpack');
const HtmlWebpackPlugin  = require('html-webpack-plugin');
const ExtractTextPlugin  = require('extract-text-webpack-plugin');
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
    sassLoader: (ENV) => ({
        test: /\.sass$/,
        /*
            Use this if you want separate CSS files
        */
        // use: ExtractTextPlugin.extract({
        //     fallback: 'style-loader',
        //     use: [
        //         {
        //             loader: 'css-loader',
        //             query: {
        //                 sourceMap: ENV === 'dev' ? true : false,
        //                 importLoaders: 2,
        //                 minimize: true
        //             }
        //         },
        //         'postcss-loader',
        //         'sass-loader'
        //     ]
        // })
        loader: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
    }),
    assetsLoader: {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        loader: 'file-loader'
    }
}

exports.setEntry = function (ENV, entryUrl) {
  let entry = ENV === 'test' ? {} : [ 'bootstrap-loader', entryUrl ];
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
    }
  };
  return devServer;
};

exports.setRules = function(ENV) {
    return [
        webpackLoaders.babelLoader,
        webpackLoaders.assetsLoader,
        webpackLoaders.sassLoader(ENV),
    ]; 
}

exports.setPlugins = function(ENV) {
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
                    template: 'index.html'
                })
            );
        break;
        case 'prod':
            plugins.push(
                /*
                    Use this if you want separate CSS files
                */
                //new ExtractTextPlugin('style.css'),

                new HtmlWebpackPlugin({
                    template: 'index.html',
                    css: '/style.css',
                    minify: {
                        removeAttributeQuotes: true,
                        removeComments: true,
                        collapseInlineTagWhitespace: true,
                        collapseWhitespace: true,
                        conservativeCollapse: false
                    }
                }),
                new UglifyJSPlugin()
            )
        break;
        case 'test':
            // todo
        break;
    }
		
		


    return plugins;
}

