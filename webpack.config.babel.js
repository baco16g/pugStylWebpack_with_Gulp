import config from './config';
import path from 'path';
import webpack from 'webpack';

export default {
	devtool: 'inline-source-map',
	target: 'node',
	entry: [
		path.join(__dirname, `${config.tasks.babel.src}/app.js`),
	],
	output: {
		path: path.join(__dirname, config.tasks.babel.dest),
		filename: '[name].js',
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: require.resolve('jquery'),
				exclude: /node_modules/,
				loader: 'expose-loader?$!expose-loader?jQuery',
			},
		],
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
			},
		}),
	],
};
