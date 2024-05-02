import { parse } from "@babel/parser";
import { File as BabelFile } from "@babel/types";
import fs from "fs";
import path from "path";

export function computeAst(): BabelFile {
  const filePath: string = path.join(__dirname, "exhibitA.ts");
  const code1: string = fs.readFileSync(filePath, "utf8");
  const ast: BabelFile = parse(code1, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });
  return ast;
}
