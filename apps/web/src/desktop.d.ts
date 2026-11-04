import type { Bridge } from "@possibilities/contract/bridge";

declare global {
  interface Window {
    desktop?: Bridge;
  }
}
