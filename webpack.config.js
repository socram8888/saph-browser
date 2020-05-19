const packageInfo = require('./package.json');

module.exports = {
	mode: 'production',
	entry: {
		saph: './lib/index.js'
	},
	output: {
		library: 'saph',
		filename: `saph-v${ packageInfo.version }.js`
	}
}
