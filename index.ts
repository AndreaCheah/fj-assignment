import * as babelParser from "@babel/parser";
import { default as generate } from "@babel/generator";
import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import traverse from '@babel/traverse';
import express from 'express';
import prettier from 'prettier';

type LintOptions = {
  parser: "typescript" | "babel";
};

//EXAMPLE 1
const myTypescriptString = `
/*tsx*/ const myComponent = \`export default function App() {
  return <div style={{width: "100%", height:"90vh", overflow:'hidden', display:"grid", placeItems:"center"}}>\${Date.now()}</div>;
}\`;
`;

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
    }, Math.random() * 1000);
  });
}

async function lintCodeWithTemplateLiterals(code: string): Promise<string> {
  try {
    const ast = babelParser.parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });

    const promises: Promise<void>[] = [];

    traverse(ast, {
      TaggedTemplateExpression(path) {
        if (path.node.tag.type === "Identifier" && path.node.tag.name === "tsx") {
          const original = path.toString();
          const contentToLint = path.get("quasi").getSource();
          promises.push(
            lint(contentToLint).then(formattedContent => {
              path.replaceWithSourceString(`/*tsx*/\`${formattedContent}\``);
            })
          );
        }
      }
    });

    await Promise.all(promises);

    const { code: formattedCode } = generate(ast);
    return formattedCode;
  } catch (error) {
    console.error(`Error during AST parsing and modification: ${error}`);
    throw error;
  }
}

async function main() {
  const myText = `//TODO: Make sure all the processors are available here
const packageJson = {
  dependencies: {
    react: "^18.0.0",
    "react-dom": "^18.0.0",
    "react-scripts": "^4.0.0",
  },
  main: "/index.js",
  devDependencies: {},
};`;

  try {
    const lintedCode = await lintCodeWithTemplateLiterals(myText);
    console.log(lintedCode);
  } catch (error) {
    console.error(`Failed to lint and log the code: ${error}`);
  }
}

main();