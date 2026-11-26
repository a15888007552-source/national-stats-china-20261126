// China in Numbers — the program that hands the site in.
// Node 22, standard library only. It copies this directory's app/ and
// screenshots/ into the output directory and writes dossier.json there with
// the vendored make.fun library, so the judge can read the site's first
// load, its source and its screenshots. Outside the grader's container,
// MAKEFUN_OUTPUT_DIR stands in for /output:
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// The two runs the grader does must write identical bytes, so nothing here
// depends on the time, the machine, or the order the filesystem lists
// entries in: files are copied in sorted name order. The dossier is built
// from the copied output, never from the working directory, so what the
// scorer re-checks is exactly what this program wrote.

import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Copy one directory tree into another, files in sorted order, skipping
// nothing: app/ holds only the site's own files, and screenshots/ holds
// the renders. A missing source directory leaves an empty one behind.
function copyTree(source, target) {
  mkdirSync(target, { recursive: true });
  if (!existsSync(source)) return;
  const names = readdirSync(source).sort();
  for (const name of names) {
    const from = join(source, name);
    const to = join(target, name);
    if (statSync(from).isDirectory()) copyTree(from, to);
    else copyFileSync(from, to);
  }
}

mkdirSync(outDir, { recursive: true });
copyTree(join(here, "app"), join(outDir, "app"));
copyTree(join(here, "screenshots"), join(outDir, "screenshots"));

// The scorer's caps for this competition: at most 4 screenshots of at most
// 256 KiB each, at most 993 files and directories in app/ totalling at most
// 16 MiB, and the dossier text capped at 160 KiB.
writeFileSync(
  join(outDir, "dossier.json"),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
