import * as babelParser from "@babel/parser";
import { default as generate } from "@babel/generator";
import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import traverse from "@babel/traverse";
import express from "express";
import prettier from "prettier";

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
      if (
        path.node.leadingComments &&
        path.node.leadingComments.some(
          (comment: babel.types.Comment) => comment.value.trim() === "tsx"
        )
      ) {
        path.node.declarations.forEach((declaration) => {
          if (declaration.init && declaration.init.type === "TemplateLiteral") {
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
    const cleanedCode = code.replace(/\/\*tsx\*\//g, '');

    const ast = babelParser.parse(cleanedCode, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });

    const promises: Promise<void>[] = [];

    traverse(ast, {
      TaggedTemplateExpression(path) {
        if (
          path.node.tag.type === "Identifier" &&
          path.node.tag.name === "tsx"
        ) {
          const original = path.toString();
          const contentToLint = path.get("quasi").getSource();
          promises.push(
            lint(contentToLint).then((formattedContent) => {
              path.replaceWithSourceString(`\`${formattedContent}\``);
            })
          );
        }
      },
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
  const testCases = [
    {
      description: "Nested Template Literals",
      code: `/*tsx*/ const outerComponent = \`<div>\${<div style={{margin: "20px"}}>\${"Content inside nested literal"}</div>}</div>\`;`,
    },
    {
      description: "Comments within Template Literals",
      code: `/*tsx*/ const commentedComponent = \`<div>
        {/* This is a JSX comment inside a template literal */}
        <span>\${"Text with comment"}</span>
      </div>\`;`,
    },
    {
      description: "Empty Template Literals",
      code: `/*tsx*/ const emptyComponent = \`\`;`,
    },
    {
      description: "Multiple Template Literals in a Line",
      code: `/*tsx*/ const multiLine = \`<span>\${"First"}</span>\` + /*tsx*/ \`<span>\${"Second"}</span>\`;`,
    },
    {
      description: "No Template Literals",
      code: `
      const regularCode = function() {
        console.log("No template literals here.");
      };`,
    },
  ];

  for (const testCase of testCases) {
    try {
      console.log(`Testing: ${testCase.description}`);
      const lintedCode = await lintCodeWithTemplateLiterals(testCase.code);
      console.log("Linted Code Output:");
      console.log(lintedCode);
    } catch (error) {
      console.error(
        `Failed to lint and log the code for '${testCase.description}': ${error}`
      );
    }
    console.log("-----------------------------------");
  }
}

main();
