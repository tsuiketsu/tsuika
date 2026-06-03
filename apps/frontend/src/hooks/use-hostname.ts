import { useEffect, useState } from "react";

export default function useHostName() {
  const [hostname, setHostname] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.location) {
      setHostname(window.location.hostname);
    }
  }, []);

  return hostname;
}
