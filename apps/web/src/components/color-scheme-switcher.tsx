import { useState } from "react";

import { Button } from "@/components/ui/button";
import { colorSchemes, readColorScheme, setColorScheme } from "@/theme/color-scheme";

export function ColorSchemeSwitcher() {
  const [current, setCurrent] = useState(readColorScheme);

  return (
    <div role="group" aria-label="Color scheme">
      {colorSchemes.map((scheme) => (
        <Button
          key={scheme}
          size="sm"
          variant={scheme === current ? "outline" : "ghost"}
          aria-pressed={scheme === current}
          onClick={() => {
            setColorScheme(scheme);
            setCurrent(scheme);
          }}
        >
          {scheme}
        </Button>
      ))}
    </div>
  );
}
