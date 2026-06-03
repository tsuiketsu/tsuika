import type React from "react";

interface PropsType {
  when: boolean;
  children: React.ReactNode;
}

export default function Show({ when, children }: PropsType) {
  if (when === false) {
    return null;
  }

  return children;
}
