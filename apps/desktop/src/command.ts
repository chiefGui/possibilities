import { CommandFailed } from "@possibilities/contract";
import { Effect, Stream } from "effect";
import { ChildProcess } from "effect/process";

const text = <E>(stream: Stream.Stream<Uint8Array, E>) =>
  stream.pipe(Stream.decodeText(), Stream.mkString);

export const run = Effect.fn("run")(
  function* (command: string, args: ReadonlyArray<string>, cwd?: string) {
    const handle = yield* ChildProcess.make(command, args, { cwd, stdin: "ignore" });
    const [stdout, stderr, exitCode] = yield* Effect.all(
      [text(handle.stdout), text(handle.stderr), handle.exitCode],
      { concurrency: "unbounded" },
    );
    if (exitCode !== 0) {
      return yield* new CommandFailed({
        message: stderr.trim() || `${command} ${args.join(" ")} exited with ${exitCode}`,
      });
    }
    return stdout.trim();
  },
  Effect.scoped,
  Effect.mapError((error) =>
    error instanceof CommandFailed ? error : new CommandFailed({ message: error.message }),
  ),
);

export const succeeds = <R>(effect: Effect.Effect<unknown, unknown, R>) =>
  effect.pipe(
    Effect.as(true),
    Effect.orElseSucceed(() => false),
  );
