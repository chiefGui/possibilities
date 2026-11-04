interface Window {
  desktop?: {
    send(message: unknown): void;
    subscribe(listener: (message: unknown) => void): () => void;
  };
}
