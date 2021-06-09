
module.exports = {
	mode: 'production',
	entry: './src/index.ts',
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				options: {
					configFile: 'tsconfig-webpack.json'
				}
			}
		]
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ],
	},
	output: {
		filename: 'saph.umd.js',
		libraryTarget: 'umd'
	}
}
