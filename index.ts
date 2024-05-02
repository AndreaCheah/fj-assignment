import * as babelParser from "@babel/parser";
import { default as generate } from "@babel/generator";
import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import traverse from '@babel/traverse';
import express from 'express';
import prettier from 'prettier';
// const { SandpackBundlerFiles } = require("sandpack");

// The JavaScript code as a string
// const code = `
// // Your JavaScript code here

// import "./styles.css"

//     export default function App() {

//         return (
//           <div className="flex gap-2 w-[300px] h-[400px] bg-slate-500 p-4">
//           <p>This text is big Hmm</p>
//           <div className="bg-blue-400 w-8 h-8" />
//           <div className="bg-red-400 w-8 h-8" />
//           <div className="bg-green-400 w-8 h-8" />
//           </div>
//         )
//     }

// `;


//EXAMPLE 1
const myTypescriptString = `
/*tsx*/ const myComponent = \`export default function App() {
  return <div style={{width: "100%", height:"90vh", overflow:'hidden', display:"grid", placeItems:"center"}}>\${Date.now()}</div>;
}\`;
`;

// Parse the code into an AST
const ast = babelParser.parse(myTypescriptString, {
  sourceType: "module",
  plugins: ["jsx", "typescript"],
});

// console.log(JSON.stringify(ast, null, 2));

function findTemplateLiterals(ast: t.Node) {
  traverse(ast, {
    VariableDeclaration(path: NodePath<t.VariableDeclaration>) {
      console.log("Found a variable declaration.");
      if (
        path.node.leadingComments &&
        path.node.leadingComments.some(
          (comment: babel.types.Comment) => comment.value.trim() === "tsx"
        )
      ) {
        path.node.declarations.forEach((declaration) => {
          if (declaration.init && declaration.init.type === "TemplateLiteral") {
            console.log("Template literal found:");
            console.log(generateSourceCode(declaration.init));
          }
        });
      }
    },
  });
}

// generate source code from AST nodes
function generateSourceCode(node: babel.types.Node) {
  const { code } = generate(node);
  return code;
}

findTemplateLiterals(ast);

async function lint(code: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const formattedCode = prettier.format(code, { parser: "babel" });
      resolve(formattedCode);
    }, Math.random() * 1000); // random delay between 0 and 1 seconds
  });
}

async function applyLinting(ast: t.Node): Promise<void> {
  const promises: Promise<void>[] = [];
  traverse(ast, {
    TemplateLiteral(path: NodePath<babel.types.TemplateLiteral>) {
      console.log("Examining a template literal...");
      if (path.node.leadingComments?.some(comment => comment.value.trim() === 'tsx')) {
        console.log("Template literal has 'tsx' comment.");
        const rawCode = generate(path.node).code as string;
        console.log(`Raw code before formatting: ${rawCode}`);
        promises.push(lint(rawCode).then(formattedCode => {
          console.log("Formatted code:", formattedCode);
          path.replaceWithSourceString(formattedCode as string);
        }));
      }
    }
  });
  await Promise.all(promises); // Wait for all formatting to complete
}

applyLinting(ast).then(() => {
  console.log("All specified template literals have been linted.");
});

