export const documentRoute = "/workspaces/$workspaceId/documents/$";

export const documentParams = (workspaceId: string, path: string) => ({
  workspaceId,
  _splat: path,
});
