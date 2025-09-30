export const encryptionPresets = {
  standard: {
    name: "Standard (recommended)",
    description: "Balanced security and performance",
    kdf: { p: 1, t: 2, m: 32768, dkLen: 32 },
  },
  high: {
    name: "High Security",
    description: "Stronger protection, slower unlock time",
    kdf: { p: 2, t: 3, m: 65536, dkLen: 32 },
  },
  maximum: {
    name: "Maximum Security",
    description: "Best protection, noticeably slower",
    kdf: { p: 4, t: 4, m: 131072, dkLen: 32 },
  },
};
