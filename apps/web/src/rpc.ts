import { type Input, type Output, type ProcedureName, procedures, result } from "contract";
import { Cause, Exit, Schema } from "effect";

type Arguments<K extends ProcedureName> = Input<K> extends void ? [] : [input: Input<K>];

export async function call<K extends ProcedureName>(
  name: K,
  ...[input]: Arguments<K>
): Promise<Output<K>> {
  if (!window.desktop) throw new Error("Possibilities runs inside the desktop app");
  const encoded = Schema.encodeUnknownSync(procedures[name].input)(input);
  const exit = Schema.decodeUnknownSync(result(name))(await window.desktop.invoke(name, encoded));
  if (Exit.isSuccess(exit)) return exit.value as Output<K>;
  throw Cause.squash(exit.cause);
}
