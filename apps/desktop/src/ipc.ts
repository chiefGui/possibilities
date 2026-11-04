import { channel } from "@possibilities/contract/bridge";
import { Effect, Layer, Queue, Schema } from "effect";
import { type RpcMessage, type RpcSerialization, RpcServer } from "effect/rpc";
import { type IpcMainEvent, ipcMain, type WebContents } from "electron";

export const ipcProtocol = Layer.effect(RpcServer.Protocol)(
  RpcServer.Protocol.make(
    Effect.fnUntraced(function* (writeRequest) {
      const run = Effect.runForkWith(yield* Effect.context<never>());
      const disconnects = yield* Queue.make<number>();
      const clients = new Map<number, WebContents>();

      const receive = (event: IpcMainEvent, message: RpcMessage.FromClientEncoded) => {
        const { id } = event.sender;
        if (!clients.has(id)) {
          clients.set(id, event.sender);
          event.sender.once("destroyed", () => {
            clients.delete(id);
            run(Queue.offer(disconnects, id));
          });
        }
        run(writeRequest(id, message));
      };

      yield* Effect.acquireRelease(
        Effect.sync(() => ipcMain.on(channel, receive)),
        () => Effect.sync(() => ipcMain.off(channel, receive)),
      );

      return {
        disconnects,
        send: (clientId, response) =>
          Effect.sync(() => clients.get(clientId)?.send(channel, response)),
        end: () => Effect.void,
        clientIds: Effect.sync(() => new Set(clients.keys())),
        initialMessage: Effect.succeedNone,
        supportsAck: true,
        supportsTransferables: false,
        supportsSpanPropagation: true,
        supportsNotifications: false,
        codecFor: Schema.toCodecJson as RpcSerialization.CodecFor,
      };
    }),
  ),
);
