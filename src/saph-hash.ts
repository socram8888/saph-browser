
/**
 * Saph hash.
 */
export class SaphHash {

	/**
	 * Hash as bytes.
	 */
	public bytes: Uint8Array;

	/**
	 * Creates a new instance with the given bytes.
	 * @param bytes hash bytes
	 */
	public constructor(bytes: Uint8Array) {
		this.bytes = bytes;
	}

	/**
	 * Converts the hash to hexadecimal.
	 * @param uppercase true if characters should be uppercase
	 * @return the hash in hexadecimal form.
	 */
	public toHex(uppercase = false): string {
		let chars = '0123456789abcdef';
		if (uppercase) {
			chars = '0123456789ABCDEF';
		}

		let hex = '';
		for (const b of this.bytes) {
			hex += chars[b >> 4];
			hex += chars[b & 0xF];
		}

		return hex;
	}

	/**
	 * Converts the hash to base 64.
	 * @return the hash represented as base64.
	 */
	public toBase64(): string {
		return btoa(String.fromCharCode.apply(null, <number[]> <unknown> this.bytes));
	}
}
