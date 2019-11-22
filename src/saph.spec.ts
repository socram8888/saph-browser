
import { equal } from 'assert';
import { Saph } from './saph';
import WebCrypto = require("node-webcrypto-ossl");

// Load polyfill so we can test in on Node

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
global.crypto = new WebCrypto();

function bytes2hex(x: Uint8Array): string {
	return Buffer.from(x).toString('hex');
}

describe('Saph hash test', () => {
	it('should match test vector 1', async () => {
		const saph = new Saph(4, 2);
		const calculated = bytes2hex(await saph.hash('just', 'a', 'test'));
		equal(calculated, '8a6d4f4a170929f264dae967748bf9f8f63ac732093ed439c444b044730109ff');
	});

	it('should match Python two-word test', async () => {
		const saph = new Saph(16384, 8);
		const calculated = bytes2hex(await saph.hash('salt', 'pass'));
		equal(calculated, 'e1530ba599f87e4e62560e908f3db833cbefa97dc6cf9100d55df57a3a9e29ad');
	});

	it('should match Python three-word test', async () => {
		const saph = new Saph(16384, 8);
		const calculated = bytes2hex(await saph.hash('pepper', 'username', 'password'));
		equal(calculated, '38e48e2b1d4418766568e6212e59abb961b876b2a1f7f269752ed84afe6637c0');
	});

	it('should cascade one-letter changes', async () => {
		const saph = new Saph(16384, 8);
		const calculated = bytes2hex(await saph.hash('qepper', 'username', 'password'));
		equal(calculated, 'bb4a74eb50bab2e4cd334d93ee85d84f9c91f454ef33a68a484408747f0f391a');
	});
});
