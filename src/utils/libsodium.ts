import sodium from "libsodium-wrappers-sumo";

export interface KdfOptions {
  memlimit?: number;
  opslimit?: number;
  algorithm?: number;
}

export class LibSodium {
  ready: boolean;
  constructor() {
    this.ready = false;
  }

  async initialize() {
    await sodium.ready;
    this.ready = true;
    return this;
  }

  setKey(key: string) {
    sessionStorage.setItem("pwhash-key", key);
  }

  getKey(): Uint8Array<ArrayBufferLike> | null {
    const key = sessionStorage.getItem("pwhash-key");

    if (key) {
      return sodium.from_base64(key);
    }

    return null;
  }

  toBase64(input: string | Uint8Array) {
    return sodium.to_base64(input);
  }

  getVerificationMessage(): Uint8Array {
    return sodium.from_string("password-ok");
  }

  deriveKey(
    args: {
      password: string;
      salt?: Uint8Array<ArrayBufferLike>;
    } & KdfOptions
  ): {
    mac: Uint8Array;
    key: Uint8Array;
    salt: Uint8Array;
    opslimit: number;
    memlimit: number;
    algorithm: number;
  } {
    if (!this.ready) throw new Error("sodium is not ready");

    const {
      crypto_pwhash_SALTBYTES,
      crypto_secretbox_KEYBYTES,
      crypto_pwhash_OPSLIMIT_MODERATE,
      crypto_pwhash_MEMLIMIT_MODERATE,
      crypto_pwhash_ALG_ARGON2ID13,
    } = sodium;

    let _salt = args.salt;

    if (!_salt) {
      _salt = sodium.randombytes_buf(crypto_pwhash_SALTBYTES);
    }

    const opslimit = args.opslimit || crypto_pwhash_OPSLIMIT_MODERATE;
    const memlimit = args.memlimit || crypto_pwhash_MEMLIMIT_MODERATE;
    const algorithm = args.algorithm || crypto_pwhash_ALG_ARGON2ID13;

    const key = sodium.crypto_pwhash(
      crypto_secretbox_KEYBYTES,
      args.password,
      _salt,
      opslimit,
      memlimit,
      algorithm
    );

    const mac = sodium.crypto_auth(this.getVerificationMessage(), key);

    return { mac, key, salt: _salt, opslimit, memlimit, algorithm };
  }

  generateNonce() {
    return sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  }

  verifyAuth({
    password,
    salt,
    mac,
    kdfOpts,
  }: {
    password: string;
    salt: string;
    mac: string;
    kdfOpts?: KdfOptions;
  }) {
    const { salt: _salt, key } = this.deriveKey({
      password,
      salt: sodium.from_base64(salt),
      ...kdfOpts,
    });

    const isMatching = sodium.crypto_auth_verify(
      sodium.from_base64(mac),
      this.getVerificationMessage(),
      key
    );

    return {
      isMatching,
      key: sodium.to_base64(key),
    };
  }

  encrypt(
    message: string,
    encryptionParams: Record<"key" | "nonce", Uint8Array | string>
  ) {
    const { key, nonce } = encryptionParams;

    try {
      const ciphertext = sodium.crypto_secretbox_easy(
        message,
        this.generateNonce(),
        typeof key === "string" ? sodium.from_base64(key) : key
      );

      return {
        ciphertext: sodium.to_base64(ciphertext),
        nonce: sodium.to_base64(nonce),
      };
    } catch (error) {
      console.error(error);
    }
  }

  encryptNow(message: string, password: string, kdfOpts?: KdfOptions) {
    const { key } = this.deriveKey({ password, ...kdfOpts });
    return this.encrypt(message, { key, nonce: this.generateNonce() });
  }

  decrypt(
    {
      ciphertext,
      nonce,
      salt,
      kdfOpts,
    }: { ciphertext: string; nonce: string; salt: string } & {
      kdfOpts?: KdfOptions;
    },
    password: string
  ) {
    const { key } = this.deriveKey({
      password,
      salt: sodium.from_base64(salt),
      ...kdfOpts,
    });

    const decrypted = sodium.crypto_secretbox_open_easy(
      sodium.from_base64(ciphertext),
      sodium.from_base64(nonce),
      key
    );

    return sodium.to_string(decrypted);
  }
}
