const path = require('path');
const webpack = require('webpack');
const htmlWebpack = require('html-webpack-plugin');

module.exports = {
	entry: {
		script: './src/script.js'
	},
	output: {
		path: path.resolve(__dirname, '/'),
		filename: '[name].bundle.js'
	},
	module: {
		rules: [{
			test:/\.js?$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			query: {
				presets: ['env']
			}
		},
		{
			test: /\.css$/,
			use: [
				'style-loader',
				'css-loader'
			]
		},
		{
			test: /\.(png|svg|jpg|gif)$/,
			use: [
				'file-loader'
			]
		}]
	},
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		inline: true,
		stats: 'errors-only'
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		}),
		new htmlWebpack({
			template: path.join(__dirname, 'src', 'index.html'),
			inject: 'body'
		})

	]
};