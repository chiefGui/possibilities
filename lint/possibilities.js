function isCursorKey(key) {
  return key.type === "Identifier" ? key.name === "cursor" : key.value === "cursor";
}

function findPointer(value) {
  if (value.type === "Literal") return value.value === "pointer" ? value : null;
  if (value.type !== "ObjectExpression") return null;
  for (const property of value.properties) {
    const found = property.type === "Property" && findPointer(property.value);
    if (found) return found;
  }
  return null;
}

export default {
  meta: { name: "possibilities" },
  rules: {
    "no-pointer-cursor": {
      create(context) {
        return {
          Property(node) {
            if (!isCursorKey(node.key)) return;
            const pointer = findPointer(node.value);
            if (pointer) context.report({ node: pointer, message: "cursor: pointer is banned." });
          },
        };
      },
    },
  },
};
