import { xchacha20poly1305 } from "@noble/ciphers/chacha";
import { argon2id } from "@noble/hashes/argon2";
import { hmac } from "@noble/hashes/hmac";
import { sha256 } from "@noble/hashes/sha2";
import { randomBytes, utf8ToBytes } from "@noble/hashes/utils";

const SESSION_KEY = "pwhash-key";
const VERIFICATION_TEXT = "password-verify";

const defaultKdfOptions = {
  p: 4,
  t: 3,
  m: 65536,
  dkLen: 32,
};

export type KdfOptions = Record<"p" | "t" | "m" | "dkLen", number>;

export class Noble {
  toBase64(bytes: Uint8Array): string {
    return btoa(String.fromCharCode(...bytes));
  }

  fromBase64(str: string): Uint8Array {
    const binaryStr = atob(str);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    return bytes;
  }

  timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
    // Return false immediately if lengths don't match
    if (a.length !== b.length) return false;

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a[i] ^ b[i];
    }
    return result === 0;
  }

  setKey(key: string) {
    sessionStorage.setItem(SESSION_KEY, key);
  }

  getKey(): Uint8Array | null {
    const key = sessionStorage.getItem(SESSION_KEY);
    if (key) return this.fromBase64(key);
    return null;
  }

  deriveKey(args: { password: string; salt?: string; opts?: KdfOptions }): {
    mac: Uint8Array;
    key: Uint8Array;
    salt: Uint8Array;
    opts: Required<KdfOptions>;
  } {
    const _pass = utf8ToBytes(args.password);
    const _salt = args.salt ? this.fromBase64(args.salt) : randomBytes(32);
    const _opts = args.opts ?? defaultKdfOptions;

    const key = argon2id(_pass, _salt, { ..._opts });
    const mac = hmac(sha256, key, VERIFICATION_TEXT);

    return { opts: _opts, key, salt: _salt, mac };
  }

  verifyAuth({
    password,
    salt,
    mac,
    opts,
  }: {
    password: string;
    salt: string;
    mac: string;
    opts: KdfOptions;
  }): string | null {
    const { key, mac: candidateVerifier } = this.deriveKey({
      password,
      salt,
      opts,
    });

    const storedVerifier = this.fromBase64(mac);

    if (this.timingSafeEqual(storedVerifier, candidateVerifier)) {
      const _key = this.toBase64(key);
      return _key;
    }

    return null;
  }

  generateNonce(): Uint8Array {
    return randomBytes(24);
  }

  encrypt(data: string, key: string | Uint8Array, nonce: Uint8Array): string {
    const ciphertext = xchacha20poly1305(
      typeof key === "string" ? this.fromBase64(key) : key,
      nonce
    ).encrypt(utf8ToBytes(data));

    return this.toBase64(ciphertext);
  }

  decrypt(ciphertext: string, key: string, nonce: string): string {
    const decipher = xchacha20poly1305(
      this.fromBase64(key),
      this.fromBase64(nonce)
    );
    const deciphered = decipher.decrypt(this.fromBase64(ciphertext));

    return new TextDecoder().decode(deciphered);
  }
}
