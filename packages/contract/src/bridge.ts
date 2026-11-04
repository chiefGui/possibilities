export const channel = "rpc";

export type Bridge = {
  send(message: unknown): void;
  subscribe(listener: (message: unknown) => void): () => void;
};
