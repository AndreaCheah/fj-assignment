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
    // second argument is an object of visitors
    // each key of the object is a node type
    // each value is a function invoked for each node of that type aka visitor
    enter(path: NodePath<Node>) {
      // called when entering a node
      if (path.node.leadingComments) {
        // appear before a node e.g. before VariableDeclaration
        path.node.leadingComments.forEach((comment: BabelComment) => {
          // console.log("Leading comment:", comment.value);
          if (
            comment.value.trim() === "tsx" &&
            path.node.type === "TemplateLiteral"
          ) {
            // console.log("Found a tsx comment before this template literal");
            const templateLiteral: TemplateLiteral = path.node;
            templateLiteral.quasis.forEach((element) => {
              if (element.value.cooked !== undefined) {
                // console.log(element.value.cooked);
                templateLiterals.push(element.value.cooked);
              }
            });
          }
        });
      }
      if (path.node.trailingComments) {
        // appear after a node e.g. after VariableDeclaration
        path.node.trailingComments.forEach((comment) => {
          // console.log("Trailing comment:", comment.value);
        });
      }
      if (path.node.innerComments) {
        // appear inside a node e.g. inside FunctionExpression
        path.node.innerComments.forEach((comment) => {
          // console.log("Inner comment:", comment.value);
        });
      }
    },
  });

  return templateLiterals;
}
