import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

export function hashPassword(
  password: string,
): Promise<{ hash: string; salt: string }> {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16).toHex();
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);

      resolve({
        hash: derivedKey.toHex(),
        salt,
      });
    });
  });
}

export function verifyHash(
  pass: string,
  hashedPass: string,
  salt: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    scrypt(pass, salt, 64, (err, derivedKey) => {
      if (err) reject(err);

      const derivedKeyHex = derivedKey.toHex();
      const storeBuffer = Buffer.from(hashedPass, "hex");
      const derivedBuffer = Buffer.from(derivedKeyHex, "hex");

      if (storeBuffer.length !== derivedBuffer.length) {
        return resolve(false);
      }

      const isMatch = timingSafeEqual(storeBuffer, derivedBuffer);
      resolve(isMatch);
    });
  });
}
