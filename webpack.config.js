const path = require('path');

module.exports = {
	mode: 'production',
	entry: {
		saph: './lib/index.js'
	},
	output: {
		filename: 'saph.bundle.js'
	}
}