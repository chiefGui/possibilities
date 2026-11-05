import { Schema } from "effect";

export class CommandFailed extends Schema.TaggedError<CommandFailed>()("CommandFailed", {
  message: Schema.String,
}) {}
