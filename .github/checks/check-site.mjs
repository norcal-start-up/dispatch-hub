// =========================================================================
// CHECK-SITE.MJS
// Runs on GitHub every time someone saves a change. If it finds a mistake,
// the site is NOT published and the live site stays on the last good version.
// Each problem is written in plain language, with the file and line.
// You never need to edit this file. To allow a public business phone
// number or email, add it to .github/checks/allowed.txt instead.
// =========================================================================
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const problems = [];   // stop publishing
const warnings = [];   // publish anyway, but mention it

const rel = p => path.relative(ROOT, p).split(path.sep).join("/");
const exists = p => fs.existsSync(path.join(ROOT, p));
const read = p => fs.readFileSync(path.join(ROOT, p), "utf8");
const problem = (file, line, msg) => problems.push({ file, line, msg });
const warn = (file, line, msg) => warnings.push({ file, line, msg });

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === ".git" || e.name === "node_modules") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out); else out.push(rel(full));
  }
  return out;
}
const files = walk(ROOT);
const lineOf = (text, index) => text.slice(0, index).split("\n").length;

const isHub = exists("nav.md");          // Dispatch Hub
const isSops = exists("assets/nav-config.js"); // Start-Up SOPs

// 1. Files the site can't run without -------------------------------------
for (const f of ["index.html", "404.html", "assets/guard.js", "assets/render.js", "assets/style.css", "assets/vendor/purify.min.js"]) {
  if (!exists(f)) problem(f, 0, "This file is missing, and the site needs it. Restore it from the commit history.");
}

// 2. Typing mistakes in the site's code ------------------------------------
for (const f of files.filter(f => f.endsWith(".js") && !f.startsWith("assets/vendor/") && !f.startsWith(".github/"))) {
  try {
    execFileSync(process.execPath, ["--check", f], { stdio: "pipe" });
  } catch (e) {
    const out = String(e.stderr || "");
    const m = out.match(/:(\d+)\n/);
    const why = (out.split("\n").find(l => /Error:/.test(l)) || "Syntax error").trim();
    problem(f, m ? Number(m[1]) : 0,
      "This file has a typing mistake (" + why + "). Look for a missing comma, quote, or bracket on or just above this line.");
  }
}

// 3. The menu points at pages that exist -----------------------------------
if (isHub) {
  const nav = read("nav.md");
  for (const m of nav.matchAll(/\]\(([^)#\s]+)\)/g)) {
    const target = "pages/" + m[1] + ".md";
    if (!/^https?:/.test(m[1]) && !exists(target)) {
      problem("nav.md", lineOf(nav, m.index), 'The menu links to "' + m[1] + '", but ' + target + " doesn't exist. Check the spelling, or add the page.");
    }
  }
}
if (isSops) {
  const src = read("assets/nav-config.js");
  try {
    const box = {};
    vm.createContext(box);
    vm.runInContext(src + "\n;this.__lib = typeof SOP_LIBRARY === 'undefined' ? null : SOP_LIBRARY;", box);
    if (!Array.isArray(box.__lib)) {
      problem("assets/nav-config.js", 0, "SOP_LIBRARY is missing or isn't a list, so the menu can't be built.");
    } else {
      box.__lib.forEach(item => {
        if (!item || !item.file) return;
        if (!exists(item.file)) {
          const i = src.indexOf(item.file);
          problem("assets/nav-config.js", i >= 0 ? lineOf(src, i) : 0,
            '"' + (item.title || item.file) + '" points to ' + item.file + ", but that file doesn't exist. Check the spelling, or upload the file to /sops.");
        }
      });
    }
  } catch (e) { /* step 2 already reported typing mistakes */ }
}

// 4. Page text: images, links, code, and contact details ------------------
const allowed = exists(".github/checks/allowed.txt")
  ? read(".github/checks/allowed.txt").split("\n").map(s => s.trim().toLowerCase()).filter(s => s && !s.startsWith("#"))
  : [];
const mdFiles = files.filter(f => f.endsWith(".md") && !f.startsWith(".github/") && f !== "README.md");

// Code examples (between backticks) are shown as text, not used, so skip them.
// Line breaks are kept so line numbers stay right.
const blankCode = t => t
  .replace(/```[\s\S]*?```/g, m => m.replace(/[^\n]/g, " "))
  .replace(/`[^`\n]*`/g, m => " ".repeat(m.length));

for (const f of mdFiles) {
  const raw = read(f);
  const text = blankCode(raw);

  // Images
  const imgs = [...text.matchAll(/!\[[^\]]*\]\(([^)\s]+)[^)]*\)/g), ...text.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)];
  for (const m of imgs) {
    const src = decodeURI(m[1]);
    if (/^(https?:|data:)/.test(src)) {
      problem(f, lineOf(text, m.index), "This image comes from another website, which the site blocks for safety. Upload the image to assets/img instead.");
      continue;
    }
    const target = isHub && !/[\/]/.test(src) ? "assets/img/" + src : src;
    if (!exists(target)) problem(f, lineOf(text, m.index), 'The image "' + src + '" can\'t be found. Check the file name (capital letters count) or upload it to ' + (isHub ? "assets/img" : "the right assets/img folder") + ".");
  }

  // Links to other pages in the Hub
  if (isHub) {
    for (const m of text.matchAll(/\]\(#\/([^)#\s]+)\)/g)) {
      if (!exists("pages/" + m[1] + ".md")) problem(f, lineOf(text, m.index), 'This links to the page "' + m[1] + '", which doesn\'t exist. Check the spelling.');
    }
  }

  // Code hidden in page text
  for (const m of text.matchAll(/<script\b|<iframe\b|\son[a-z]+\s*=|javascript:/gi)) {
    problem(f, lineOf(text, m.index), "Pages can't contain code (" + m[0].trim() + "). The safety filter would remove it anyway, so take it out.");
  }

  // Contact details on a public site
  for (const m of raw.matchAll(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g)) {
    const v = m[0].toLowerCase();
    if (/@example\.(com|org)$/.test(v) || allowed.includes(v)) continue;
    problem(f, lineOf(raw, m.index), "This looks like an email address (" + m[0] + "). This site is public, so contact details belong in SharePoint. If it's a public business address, add it to .github/checks/allowed.txt.");
  }
  for (const m of raw.matchAll(/\(?\b[2-9]\d{2}\)?[-. ]\d{3}[-. ]\d{4}\b/g)) {
    const digits = m[0].replace(/\D/g, "");
    if (allowed.some(a => a.replace(/\D/g, "") === digits)) continue;
    problem(f, lineOf(raw, m.index), "This looks like a phone number (" + m[0] + "). This site is public, so contact details belong in SharePoint. If it's a public business number, add it to .github/checks/allowed.txt.");
  }
}

// 5. Large images (a warning only) -----------------------------------------
for (const f of files.filter(f => /\.(png|jpe?g|gif)$/i.test(f))) {
  const kb = Math.round(fs.statSync(path.join(ROOT, f)).size / 1024);
  if (kb > 600) warn(f, 0, "This image is " + kb + " KB, which loads slowly on phones. It still published. Consider shrinking it (tinypng.com is free).");
}

// Report ---------------------------------------------------------------------
const esc = s => String(s).replace(/\|/g, "\\|");
const row = p => "| " + esc(p.file) + " | " + (p.line || "") + " | " + esc(p.msg) + " |";
let summary = "";
for (const p of problems) console.log("::error file=" + p.file + (p.line ? ",line=" + p.line : "") + ",title=Fix before publishing::" + p.msg);
for (const w of warnings) console.log("::warning file=" + w.file + ",title=Worth a look::" + w.msg);

if (problems.length) {
  summary += "## The site was NOT published\n\nThe live site is still showing the last good version, so nobody sees a broken page.\n\n";
  summary += "Fix the " + (problems.length === 1 ? "problem" : problems.length + " problems") + " below and save again. The site publishes on its own once everything passes.\n\n";
  summary += "| File | Line | What to fix |\n|---|---|---|\n" + problems.map(row).join("\n") + "\n\n";
} else {
  summary += "## All checks passed\n\nThe site is publishing now. It's usually live within a minute.\n\n";
}
if (warnings.length) summary += "### Worth a look (didn't stop publishing)\n\n| File | Line | Note |\n|---|---|---|\n" + warnings.map(row).join("\n") + "\n";

if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
console.log("\n" + summary.replace(/\|/g, " "));
process.exit(problems.length ? 1 : 0);
