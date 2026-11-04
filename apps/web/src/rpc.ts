import { Api } from "@possibilities/contract";
import { Cause, Context, Effect, Exit, Layer, ManagedRuntime, Schema } from "effect";
import {
  RpcClient,
  type RpcClientError,
  type RpcMessage,
  type RpcSerialization,
  RpcTest,
} from "effect/rpc";

type Client = RpcClient.FromGroup<typeof Api, RpcClientError.RpcClientError>;

const ipcProtocol = Layer.effect(RpcClient.Protocol)(
  RpcClient.Protocol.make(
    Effect.fnUntraced(function* (writeResponse, clientIds) {
      const bridge = window.desktop;
      if (!bridge) return yield* Effect.die(new Error("Possibilities runs inside the desktop app"));
      const run = Effect.runForkWith(yield* Effect.context<never>());

      yield* Effect.acquireRelease(
        Effect.sync(() =>
          bridge.subscribe((message) =>
            run(
              Effect.forEach(clientIds, (clientId) =>
                writeResponse(clientId, message as RpcMessage.FromServerEncoded),
              ),
            ),
          ),
        ),
        (unsubscribe) => Effect.sync(unsubscribe),
      );

      return {
        send: (_clientId, request) => Effect.sync(() => bridge.send(request)),
        supportsAck: true,
        supportsTransferables: false,
        codecFor: Schema.toCodecJson as RpcSerialization.CodecFor,
      };
    }),
  ),
);

class ApiClient extends Context.Service<ApiClient, Client>()("ApiClient") {
  static readonly layer = Layer.effect(this, RpcClient.make(Api)).pipe(Layer.provide(ipcProtocol));
}

const scenarioClient = () => {
  const name =
    new URLSearchParams(location.search).get("scenario") ??
    sessionStorage.getItem("scenario") ??
    "ready";
  sessionStorage.setItem("scenario", name);
  return Layer.unwrap(
    Effect.promise(() => import("@possibilities/scenarios")).pipe(
      Effect.map((scenarios) =>
        Layer.effect(ApiClient, RpcTest.makeClient(Api)).pipe(Layer.provide(scenarios.layer(name))),
      ),
    ),
  );
};

const runtime = ManagedRuntime.make(
  import.meta.env.DEV && !window.desktop ? scenarioClient() : ApiClient.layer,
);

export async function call<A, E>(f: (api: Client) => Effect.Effect<A, E>): Promise<A> {
  const exit = await runtime.runPromiseExit(
    Effect.gen(function* () {
      return yield* f(yield* ApiClient);
    }),
  );
  if (Exit.isSuccess(exit)) return exit.value;
  throw Cause.squash(exit.cause);
}
