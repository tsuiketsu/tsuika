import sodium from "libsodium-wrappers-sumo";

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

  deriveKey(password: string, salt?: Uint8Array<ArrayBufferLike>) {
    if (!this.ready) throw new Error("sodium is not ready");

    const {
      crypto_pwhash_SALTBYTES,
      crypto_secretbox_KEYBYTES,
      crypto_pwhash_OPSLIMIT_MODERATE: opslimit,
      crypto_pwhash_MEMLIMIT_MODERATE: memlimit,
      crypto_pwhash_ALG_ARGON2ID13: algorithm,
    } = sodium;

    let _salt = salt;

    if (!_salt) {
      _salt = sodium.randombytes_buf(crypto_pwhash_SALTBYTES);
    }

    const key = sodium.crypto_pwhash(
      crypto_secretbox_KEYBYTES,
      password,
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

  verifyAuth(password: string, salt: string, mac: string) {
    const { salt: _salt, key } = this.deriveKey(
      password,
      sodium.from_base64(salt)
    );

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
    encryptionParams: Record<"key" | "salt" | "nonce", Uint8Array>
  ) {
    const { key, salt, nonce } = encryptionParams;

    const ciphertext = sodium.crypto_secretbox_easy(
      sodium.from_string(message),
      nonce,
      key
    );

    return {
      ciphertext: sodium.to_base64(ciphertext),
      nonce: sodium.to_base64(nonce),
      salt: sodium.to_base64(salt),
    };
  }

  encryptNow(message: string, password: string) {
    const { key, salt } = this.deriveKey(password);
    return this.encrypt(message, { key, salt, nonce: this.generateNonce() });
  }

  decrypt(
    {
      ciphertext,
      nonce,
      salt,
    }: { ciphertext: string; nonce: string; salt: string },
    password: string
  ) {
    const { key } = this.deriveKey(password, sodium.from_base64(salt));

    const decrypted = sodium.crypto_secretbox_open_easy(
      sodium.from_base64(ciphertext),
      sodium.from_base64(nonce),
      key
    );

    return sodium.to_string(decrypted);
  }
}
