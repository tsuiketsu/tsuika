export const options = {
  ApiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  alphabetColors: {
    A: { color: "#DC2626", bg: "#FECACA" },
    B: { color: "#EA580C", bg: "#FED7AA" },
    C: { color: "#D97706", bg: "#FDE68A" },
    D: { color: "#CA8A04", bg: "#FEF08A" },
    E: { color: "#65A30D", bg: "#D9F99D" },
    F: { color: "#16A34A", bg: "#BBF7D0" },
    G: { color: "#059669", bg: "#A7F3D0" },
    H: { color: "#0D9488", bg: "#99F6E4" },
    I: { color: "#0891B2", bg: "#A5F3FC" },
    J: { color: "#0284C7", bg: "#BAE6FD" },
    K: { color: "#2563EB", bg: "#BFDBFE" },
    L: { color: "#4F46E5", bg: "#C7D2FE" },
    M: { color: "#7C3AED", bg: "#DDD6FE" },
    N: { color: "#9333EA", bg: "#E9D5FF" },
    O: { color: "#C026D3", bg: "#F5D0FE" },
    P: { color: "#DB2777", bg: "#FCE7F3" },
    Q: { color: "#E11D48", bg: "#FECDD3" },
    R: { color: "#DC2626", bg: "#FECACA" },
    S: { color: "#EA580C", bg: "#FED7AA" },
    T: { color: "#D97706", bg: "#FDE68A" },
    U: { color: "#CA8A04", bg: "#FEF08A" },
    V: { color: "#65A30D", bg: "#D9F99D" },
    W: { color: "#16A34A", bg: "#BBF7D0" },
    X: { color: "#0D9488", bg: "#99F6E4" },
    Y: { color: "#2563EB", bg: "#BFDBFE" },
    Z: { color: "#9333EA", bg: "#E9D5FF" },
  } as const,
  get colorPickerColors() {
    return Object.values(this.alphabetColors).flatMap((value) => [
      value.color,
      value.bg,
    ]);
  },
};

export type Alphabet = keyof typeof options.alphabetColors;
