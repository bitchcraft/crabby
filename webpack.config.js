const path = require('path');
const webpack = require('webpack');

const config = {
	context: path.resolve(__dirname),
	entry: {
		keyconst: [
			'./src/index.js',
		],
	},
	output: {
		path: path.resolve(__dirname, 'lib'),
		filename: '[name].es5.js',
		library: 'crabby',
		libraryTarget: 'umd',
	},
	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
	],
	module: {
		rules: [
			{
				test: /\.(js|jsx)?$/,
				exclude: /node_modules/,
				use: [{
					loader: 'babel-loader',
					query: {
						cacheDirectory: true,
						babelrc: true,
						plugins: [],
					},
				}],
			},
		],
	},
	resolve: {
		extensions: [ '.js', '.json' ],
	},
	resolveLoader: {
		modules: [ 'node_modules' ],
	},
};

if (process.env.NODE_ENV === 'development') {
	config.devtool = 'inline-source-map';

}

module.exports = config;
