import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSrefDatabase } from "./sref-parser.mjs";
import { writeSrefWorkbook } from "./xlsx-writer.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const importDir = path.join(rootDir, "data", "imports");
const jsonPath = path.join(rootDir, "client", "src", "data", "sref-database.json");
const generatedJsonPath = path.join(rootDir, "data", "generated", "sref-database.json");
const excelPath = path.join(rootDir, "data", "generated", "midjourney_sref_database.xlsx");
const publicExcelPath = path.join(rootDir, "client", "public", "data", "midjourney_sref_database.xlsx");

const database = await buildSrefDatabase(importDir);
const json = `${JSON.stringify(database, null, 2)}\n`;

await fs.mkdir(path.dirname(jsonPath), { recursive: true });
await fs.mkdir(path.dirname(generatedJsonPath), { recursive: true });
await fs.writeFile(jsonPath, json, "utf8");
await fs.writeFile(generatedJsonPath, json, "utf8");

const workbook = await writeSrefWorkbook(database, excelPath);
await fs.mkdir(path.dirname(publicExcelPath), { recursive: true });
await fs.writeFile(publicExcelPath, workbook);

console.log(
  `[SREF DB] ${database.stats.uniqueCodes.toLocaleString()} unique codes / ` +
    `${database.stats.totalOccurrences.toLocaleString()} occurrences / ` +
    `${database.stats.sourceFiles} TXT files`
);
console.log(`[SREF DB] JSON: ${path.relative(rootDir, jsonPath)}`);
console.log(`[SREF DB] Excel: ${path.relative(rootDir, excelPath)}`);
