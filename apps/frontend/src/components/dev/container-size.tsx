import clsx from "clsx";
import { useState } from "react";

export default function ContainerSize() {
  const [disabled, setDisabled] = useState(false);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div
      className={clsx(
        "bg-background fixed bottom-1 left-1 z-50 border p-3 @sm:after:content-['SM'] @md:after:content-['MD'] @lg:after:content-['LG'] @xl:after:content-['XL'] @2xl:after:content-['2XL'] @3xl:after:content-['3XL'] @4xl:after:content-['4XL'] @5xl:after:content-['5XL'] @6xl:after:content-['6XL'] @7xl:after:content-['7XL']",
        { hidden: disabled }
      )}
      onClick={() => setDisabled(true)}
    />
  );
}
