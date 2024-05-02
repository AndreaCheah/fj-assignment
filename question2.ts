import traverse from "@babel/traverse";
import { computeAst } from "./question1";

const ast = computeAst();

traverse(ast, {
  // second argument is an object of visitors
  // each key of the object is a node type
  // each value is a function invoked for each node of that type aka visitor
  ExpressionStatement(path) {
    // console.log(path.node.expression);
  },
  BinaryExpression(path) {
    // console.log(path.node.operator);
  },
  NumberLiteral(path) {
    // console.log(path.node.value);
  },
  VariableDeclaration(path) {
    // console.log(path.node.declarations);
  },
  enter(path) { // called when entering a node
    if (path.node.leadingComments) {    // appear before a node e.g. before VariableDeclaration
        path.node.leadingComments.forEach((comment) => {
            // console.log("Leading comment:", comment.value);
            if (comment.value.trim() === "tsx" && path.node.type === "TemplateLiteral") {
                console.log("Found a tsx comment before this template literal");
                path.node.quasis.forEach((element) => {
                    console.log(element.value.cooked);
                });
            }
        });
    }
    if (path.node.trailingComments) {   // appear after a node e.g. after VariableDeclaration
        path.node.trailingComments.forEach((comment) => {
            // console.log("Trailing comment:", comment.value);
        });
    }
    if (path.node.innerComments) {  // appear inside a node e.g. inside FunctionExpression
        path.node.innerComments.forEach((comment) => {
            // console.log("Inner comment:", comment.value);
        });
    }
},
});