const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: {
		app: './src/script.js'
	},
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'dist.script.js'
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
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		})
	]
};