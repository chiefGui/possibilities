interface Window {
  desktop?: {
    invoke(name: string, input: unknown): Promise<unknown>;
  };
}
