const path = require('path');

module.exports = {
	mode: 'production',
	entry: './src/index.ts',
	devtool: 'sourcemap',
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader'
			}
		]
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ],
	},
	output: {
		filename: 'saph.js'
	}
}
