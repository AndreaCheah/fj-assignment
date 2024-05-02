import traverse, { NodePath } from "@babel/traverse";
import {
  File,
  Comment as BabelComment,
  TemplateLiteral,
  Node,
} from "@babel/types";
import { computeAst } from "./question1";

export function traverseAst(): string[] {
  const ast: File = computeAst();
  const templateLiterals: string[] = [];

  traverse(ast, {
    enter(path: NodePath<Node>) {
      if (path.node.leadingComments) {
        path.node.leadingComments.forEach((comment: BabelComment) => {
          if (
            comment.value.trim() === "tsx" &&
            path.node.type === "TemplateLiteral"
          ) {
            const templateLiteral: TemplateLiteral = path.node;
            templateLiteral.quasis.forEach((element) => {
              if (element.value.cooked !== undefined) {
                templateLiterals.push(element.value.cooked);
              }
            });
          }
        });
      }
    },
  });

  return templateLiterals;
}
