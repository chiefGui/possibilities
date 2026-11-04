export const channel = "rpc";

export type Bridge = {
  platform: string;
  send(message: unknown): void;
  subscribe(listener: (message: unknown) => void): () => void;
};
