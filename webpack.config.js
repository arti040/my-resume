const path = require('path');
const webpack = require('webpack');
const webpackTools    = require('./webpack.tools');
const HtmlWebpackPlugin = require('html-webpack-plugin');


function WebPackConfig(ENV) {
	let config = {}

	config.context 		= path.resolve(__dirname, './app');
	config.entry 		= webpackTools.setEntry(ENV, './app.js');
	config.output 		= webpackTools.setOutput(ENV, __dirname, './dist');
	config.devServer 	= webpackTools.setDevServer(__dirname, './app');
	//config.postCSS 	= null;
	config.module 		= {	rules: webpackTools.setRules(ENV) }
	config.plugins 		= webpackTools.setPlugins(ENV);
	config.resolve		= {
							alias: {
								atomic:           path.resolve(__dirname, 'atomic'),
								atomicAtoms:      path.resolve(__dirname, 'atomic/atoms'),
								atomicMolecules:  path.resolve(__dirname, 'atomic/molecules'),
								atomicOrganisms:  path.resolve(__dirname, 'atomic/organisms')
							},
							extensions: ['.js']
						}

	return config;
}

module.exports = WebPackConfig(process.env.NODE_ENV);

/*	TODO
	- add css minification for prod (postcss)
	- add js minification for prod
	- add karma&jasmine (tests)
*/