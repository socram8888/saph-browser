
/**
 * The Stupid Algorithm for Password Hashing.
 */
export class Saph {

	/**
	 * Memory size.
	 */
	private _memory: number = 16384;

	/**
	 * Number of iterations.
	 */
	private _iterations: number = 8;

	/**
	 * Creates a new password hasher.
	 * @param memory memory cost
	 * @param iterations computational cost
	 */
	public constructor(memory = 16384, iterations = 8) {
		this.iterations = iterations;
		this.memory = memory;
	}

	/**
	 * Memory required for calculating the hash.
	 *
	 * <p>The total memory required in bytes will be 64 times this value.
	 *
	 * <p>Please note that generating the memory is done using AES-128. This means that increasing
	 * this value also increases time complexity.
	 */
	public get memory(): number {
		return this._memory;
	}

	public set memory(memory: number) {
		const memoryInt = memory | 0;
		if (memoryInt < 0 || memoryInt !== memory) {
			throw new Error("Memory size must be a positive integer");
		}
		this._memory = memoryInt;
	}

	/**
	 * Number of iterations required for calculating the hash.
	 *
	 * <p>The encrypt-then-hash step will be ran as many times as this value specifies.
	 *
	 * <p>As opposed to the memory parameter, this only affects time complexity, not space
	 * complexity.
	 */
	public get iterations(): number {
		return this._iterations;
	}

	public set iterations(iterations: number) {
		const itersInt = iterations | 0;
		if (itersInt < 0 || itersInt !== iterations) {
			throw new Error("Iterations must be a positive integer");
		}
		this._iterations = itersInt;
	}

	public async hash(... parts: (string | Uint8Array)[]): Promise<Uint8Array> {
		// Calculate initial hash
		let current = await this._hashParts(parts);

		// Create a new, all-zero memory
		let memory = new Uint8Array(this._memory * 64);

		for (let iteration = 0; iteration < this._iterations; iteration++) {
			const key = await crypto.subtle.importKey(
					'raw', // Key format
					current.subarray(0, 16), // Key material,
					'AES-CBC', // Algorithm
					false, // Extractable
					[ 'encrypt' ] // Usages
			);

			const cbcConfig: AesCbcParams = {
				'name': 'AES-CBC',
				'iv': current.subarray(16, 32)
			}

			// Generate hash input by encrypting using AES-CBC all the zeros
			const encryptedBuffer = await crypto.subtle.encrypt(cbcConfig, key, memory);
			const encrypted = new Uint8Array(encryptedBuffer);

			// Generate shuffle map
			const shuffleMap: number[] = [];
			for (let i = 0; i < this._memory; i++) {
				shuffleMap.push(i);
			}

			// Shuffle the indexes
			for (let i = 0; i < this._memory; i++) {
				let j =
						encrypted[i * 64 + 0] <<  0 |
						encrypted[i * 64 + 1] <<  8 |
						encrypted[i * 64 + 2] << 16 |
						encrypted[i * 64 + 3] << 24;
				// Required for converting to unsigned
				j >>>= 0;

				// Cap to memory size
				j %= this._memory;

				const x = shuffleMap[i];
				shuffleMap[i] = shuffleMap[j];
				shuffleMap[j] = x;
			}

			// Now perform the actual shuffling
			for (let i = 0; i < this._memory; i++) {
				const dst = 64 * i;
				const src = 64 * shuffleMap[i];
				memory.set(encrypted.subarray(src, src + 64), dst);
			}

			// Finally calculate the memory hash
			const currentBuffer = await crypto.subtle.digest('SHA-256', memory);
			current = new Uint8Array(currentBuffer);

			// Update memory, removing padding
			memory = encrypted.subarray(0, this._memory * 64);
		}

		return current;
	}

	private async _hashParts(parts: (string | Uint8Array)[]): Promise<Uint8Array> {
		const hashes = new Uint8Array(parts.length * 32);
		const encoder = new TextEncoder();

		for (let i = 0; i < parts.length; i++) {
			let part = parts[i];
			if (typeof part == 'string' || part instanceof String) {
				part = encoder.encode(<string> part);
			}

			const hashBuffer = await crypto.subtle.digest('SHA-256', part);
			const hash = new Uint8Array(hashBuffer);
			hashes.set(hash, i * 32);
		}

		const result = await crypto.subtle.digest('SHA-256', hashes);
		return new Uint8Array(result);
	}
}
