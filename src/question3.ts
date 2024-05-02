import prettier from "prettier";
import { traverseAst } from "./question2";

async function lint(code: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const formattedCode = prettier.format(code, { parser: "babel" });
      resolve(formattedCode);
    }, Math.random() * 1000); // random delay between 0 and 1 seconds
  });
}

async function lintAllCodes(): Promise<void> {
  try {
    const output: string[] = traverseAst();
    const formattedCodes: string[] = await Promise.all(output.map(lint));
    formattedCodes.forEach((formattedCode: string, index: number) => {
      console.log(`${formattedCode}`);
    });
  } catch (error: any) {
    console.error("An error occurred:", error);
  }
}

lintAllCodes();
