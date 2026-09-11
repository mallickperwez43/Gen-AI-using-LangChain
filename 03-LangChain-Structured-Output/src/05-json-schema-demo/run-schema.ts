import "dotenv/config";
import * as fs from "fs";
import * as path from "path";

const schemaPath = path.join(import.meta.dirname, "json-schema-demo.json");

const rawData = fs.readFileSync(schemaPath, "utf-8");
const parsedSchema = JSON.parse(rawData);

console.log("Successfully loaded your JSON Schema Structure:\n");
console.log(JSON.stringify(parsedSchema, null, 2));
