import { parse } from "@babel/parser";
import fs from 'fs';
import path from 'path';

export function computeAst() {
    // const code: string = "2 + (4 * 10)";
    const filePath = path.join(__dirname, 'sample.ts');
    const code1 = fs.readFileSync(filePath, 'utf8');
    // console.log(code1);
    const ast = parse(code1, { sourceType: "module", plugins: ["jsx", "typescript"] });
    // console.log(ast);
    // console.log(JSON.stringify(ast, null, 2));
    return ast;
}