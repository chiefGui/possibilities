import {
  type Failure,
  type Input,
  isProcedureName,
  type Output,
  type ProcedureName,
  procedures,
  result,
} from "@possibilities/contract";
import { channel } from "@possibilities/contract/channel";
import { Effect, type ManagedRuntime, Schema } from "effect";
import { ipcMain } from "electron";

export type Handlers<R> = {
  readonly [K in ProcedureName]: (input: Input<K>) => Effect.Effect<Output<K>, Failure<K>, R>;
};

const respond = <R>(handlers: Handlers<R>, name: ProcedureName, input: unknown) => {
  const handler = handlers[name] as (input: unknown) => Effect.Effect<unknown, unknown, R>;
  return Schema.decodeUnknownEffect(procedures[name].input)(input).pipe(
    Effect.orDie,
    Effect.flatMap(handler),
    Effect.exit,
    Effect.flatMap(Schema.encodeUnknownEffect(result(name))),
    Effect.orDie,
  );
};

export const serve = <R>(runtime: ManagedRuntime.ManagedRuntime<R, never>, handlers: Handlers<R>) =>
  ipcMain.handle(channel, (_event, name: unknown, input: unknown) => {
    if (!isProcedureName(name)) throw new Error(`Unknown procedure ${String(name)}`);
    return runtime.runPromise(respond(handlers, name, input));
  });
