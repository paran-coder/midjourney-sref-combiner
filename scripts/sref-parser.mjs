import fs from "node:fs/promises";
import path from "node:path";

const SREF_OPTION = /--sref\b/i;
const OPTION_START = /(?:\s|\()--[a-z]/i;
const CODE_WITH_WEIGHT = /(\d+)(?:::(-?\d+(?:\.\d+)?))?/g;
const PLAIN_TOKEN = /^\d+(?:::-?\d+(?:\.\d+)?)?$/;

function valueOrNull(match) {
  return match ? match[1] : null;
}

export function parseSrefLine(rawLine, sourceFile, lineNumber) {
  const line = rawLine.trim();
  if (!line || line.startsWith("#") || line.startsWith("//")) return [];

  const niji = valueOrNull(line.match(/--niji\s+([0-9]+(?:\.[0-9]+)?)/i));
  const version = valueOrNull(line.match(/--v(?:ersion)?\s+([0-9]+(?:\.[0-9]+)?)/i));
  const profile = valueOrNull(line.match(/--profile\s+([A-Za-z0-9_-]+)/i));

  let codeSegment = "";
  const srefMatch = SREF_OPTION.exec(line);

  if (srefMatch) {
    const afterSref = line.slice(srefMatch.index + srefMatch[0].length).trim();
    const optionIndex = afterSref.search(OPTION_START);
    codeSegment = optionIndex >= 0 ? afterSref.slice(0, optionIndex).trim() : afterSref;
  } else {
    // Also accept a simple file containing only numeric codes, one or more per line.
    const withoutInlineComment = line.replace(/\s+#.*$/, "").trim();
    const tokens = withoutInlineComment.split(/[\s,]+/).filter(Boolean);
    if (tokens.length === 0 || !tokens.every((token) => PLAIN_TOKEN.test(token))) {
      return [];
    }
    codeSegment = tokens.join(" ");
  }

  const occurrences = [];
  for (const match of codeSegment.matchAll(CODE_WITH_WEIGHT)) {
    const code = match[1];
    const weight = match[2] === undefined ? null : Number(match[2]);
    if (!/^\d+$/.test(code) || (weight !== null && !Number.isFinite(weight))) continue;

    occurrences.push({
      code,
      weight,
      niji,
      version,
      profile,
      sourceFile,
      line: lineNumber,
      raw: rawLine,
    });
  }

  return occurrences;
}

async function walkTxtFiles(rootDir) {
  const found = [];

  async function walk(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name, "en"));

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".txt")) {
        found.push(fullPath);
      }
    }
  }

  await walk(rootDir);
  return found.sort((a, b) => a.localeCompare(b, "en"));
}

export async function buildSrefDatabase(importDir) {
  const absoluteImportDir = path.resolve(importDir);
  const files = await walkTxtFiles(absoluteImportDir);
  const byCode = new Map();
  const sourceStats = [];
  let totalOccurrences = 0;
  let weightedOccurrences = 0;
  let nijiOccurrences = 0;
  let versionOccurrences = 0;
  let profileOccurrences = 0;

  for (const filePath of files) {
    const relativeFile = path.relative(absoluteImportDir, filePath).split(path.sep).join("/");
    const text = await fs.readFile(filePath, "utf8");
    const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/);
    const fileCodes = new Set();
    let fileOccurrences = 0;

    lines.forEach((rawLine, index) => {
      const occurrences = parseSrefLine(rawLine, relativeFile, index + 1);
      for (const occurrence of occurrences) {
        totalOccurrences += 1;
        fileOccurrences += 1;
        fileCodes.add(occurrence.code);
        if (occurrence.weight !== null) weightedOccurrences += 1;
        if (occurrence.niji !== null) nijiOccurrences += 1;
        if (occurrence.version !== null) versionOccurrences += 1;
        if (occurrence.profile !== null) profileOccurrences += 1;

        if (!byCode.has(occurrence.code)) {
          byCode.set(occurrence.code, {
            code: occurrence.code,
            occurrences: [],
          });
        }
        byCode.get(occurrence.code).occurrences.push(occurrence);
      }
    });

    sourceStats.push({
      file: relativeFile,
      occurrences: fileOccurrences,
      uniqueCodes: fileCodes.size,
    });
  }

  const codes = [...byCode.values()];
  const duplicateOccurrences = totalOccurrences - codes.length;

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    stats: {
      uniqueCodes: codes.length,
      totalOccurrences,
      duplicateOccurrences,
      sourceFiles: files.length,
      weightedOccurrences,
      nijiOccurrences,
      versionOccurrences,
      profileOccurrences,
    },
    sources: sourceStats,
    codes,
  };
}
