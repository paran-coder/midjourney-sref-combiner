import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { buildSrefDatabase, parseSrefLine } from "./sref-parser.mjs";

const parsed = parseSrefLine(
  "--sref 1235558871::1 2921367196 --niji 7 --v 8.1 --profile op2hwq1",
  "test.txt",
  4
);
assert.equal(parsed.length, 2);
assert.deepEqual(parsed[0], {
  code: "1235558871",
  weight: 1,
  niji: "7",
  version: "8.1",
  profile: "op2hwq1",
  sourceFile: "test.txt",
  line: 4,
  raw: "--sref 1235558871::1 2921367196 --niji 7 --v 8.1 --profile op2hwq1",
});
assert.equal(parsed[1].code, "2921367196");
assert.equal(parsed[1].weight, null);

const profileNote = parseSrefLine(
  "--sref 4371870492 (--profile op2hwq1과 함께)",
  "test.txt",
  5
);
assert.equal(profileNote[0].profile, "op2hwq1");

const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "sref-pipeline-"));
await fs.writeFile(path.join(tmpDir, "a.txt"), "--sref 111 222::0.8 --niji 7\n", "utf8");
await fs.writeFile(path.join(tmpDir, "b.txt"), "--sref 222 333 --v 8.1\n", "utf8");
const db = await buildSrefDatabase(tmpDir);
assert.equal(db.stats.uniqueCodes, 3);
assert.equal(db.stats.totalOccurrences, 4);
assert.equal(db.stats.duplicateOccurrences, 1);
assert.equal(db.codes.find((item) => item.code === "222").occurrences.length, 2);
assert.equal(db.stats.weightedOccurrences, 1);
assert.equal(db.stats.nijiOccurrences, 2);
assert.equal(db.stats.versionOccurrences, 2);

console.log("SREF pipeline tests passed.");
