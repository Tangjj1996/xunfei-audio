import fs from "fs";
import path from "path";
const stream = fs.createReadStream(path.resolve(process.cwd(), "./src/asset/1.m4a"));
console.log(stream);
