/* =========================================================================
   DISPATCH HUB — the engine. Nobody needs to edit this file.

   Everything you write lives in plain Markdown:
     nav.md                            the menu (what pages exist and in what order)
     pages/reference/shared-links.md   shared SharePoint links, by name
     pages/                            one .md file per article
   See pages/reference/editing-this-hub.md for the writing guide.
   ========================================================================= */

const REPO = "crystal-jeffers/dispatch-hub";   // used for "Edit this page"
const BRANCH = "main";

/* A page whose Status line starts with any of these words leaves the menu
   and moves to the Archive page automatically. Not case sensitive. */
const ARCHIVE_WORDS = /^(archiv|deprecat|retired|legacy|inactive|obsolete)/i;

const state = { sections: [], pages: [], byPath: {}, bySlug: {}, links: {}, loaded: false };

/* ---------- small helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const slugify = s => s.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function store(key, val) {
  try { if (val === undefined) return JSON.parse(localStorage.getItem(key) || "null"); localStorage.setItem(key, JSON.stringify(val)); }
  catch (e) { return null; }
}
async function getText(url) {
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error(res.status);
  return res.text();
}
function el(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
}
async function copyText(text, btn, label) {
  try { await navigator.clipboard.writeText(text); btn.textContent = "Copied"; btn.classList.add("is-copied"); }
  catch (e) { btn.textContent = "Select and copy"; }
  setTimeout(() => { btn.textContent = label; btn.classList.remove("is-copied"); }, 1800);
}

/* ---------- nav.md: sections, groups, and pages ---------- */
function parseNav(md) {
  let section = null, group = null;
  md.replace(/\r\n/g, "\n").split("\n").forEach(raw => {
    const line = raw.trim();
    let m;
    if ((m = line.match(/^#\s+(.+)/))) {
      section = { title: m[1], slug: slugify(m[1]), blurb: "", groups: [] };
      group = null;
      state.sections.push(section);
    } else if ((m = line.match(/^##\s+(.+)/)) && section) {
      group = { title: m[1], slug: slugify(m[1]), pages: [] };
      section.groups.push(group);
    } else if ((m = line.match(/^[-*]\s+\[(.+?)\]\((.+?)\)/)) && section) {
      if (!group) { group = { title: "", slug: "", pages: [] }; section.groups.push(group); }
      const path = m[2].replace(/^\.?\/?(pages\/)?/, "").replace(/\.md$/, "");
      const page = { title: m[1], path, section, group, meta: {}, archived: section.slug === "archive" };
      group.pages.push(page);
      state.pages.push(page);
      state.byPath[path] = page;
      state.bySlug[path.split("/").pop()] = page;
    } else if (line && section && !group && !section.blurb) {
      section.blurb = line;
    }
  });
}

/* ---------- shared-links.md: shared links by name ---------- */
function parseLinks(md) {
  md.replace(/^[-*]\s+\[(.+?)\]\((\S+?)\)/gm, (_, label, url) => { state.links[slugify(label)] = url; });
}

/* Turn whatever an editor wrote in a link into a real destination. */
function resolveHref(href) {
  if (!href) return { href };
  if (/^(https?:|mailto:|tel:)/i.test(href)) return { href, external: true };
  if (href.startsWith("#/")) return { href };
  const clean = decodeURIComponent(href).replace(/^\.?\.?\/?(pages\/)?/, "").replace(/\.md$/, "").replace(/\/$/, "");
  if (clean === "archive") return { href: "#/archive" };
  if (state.byPath[clean]) return { href: "#/" + clean };
  const last = clean.split("/").pop();
  if (state.bySlug[last]) return { href: "#/" + state.bySlug[last].path };
  const shared = state.links[slugify(last)];
  if (shared) return { href: shared, external: true };
  return { href: "#/" + clean, broken: true };
}

/* ---------- loading every page once: status, search text ---------- */
async function loadPages() {
  await Promise.all(state.pages.map(async p => {
    try {
      p.md = await getText("pages/" + p.path + ".md");
      const { meta, title } = splitMeta(p.md);
      p.meta = meta;
      if (title) p.fullTitle = title;
      if (ARCHIVE_WORDS.test((meta.status || "").trim())) p.archived = true;
      const text = p.md.replace(/!\[[^\]]*\]\([^)]*\)/g, " ").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/^(Platform|Status|Type):.*$/gmi, " ").replace(/[#>*_`|\-\[\]]+/g, " ").replace(/\s+/g, " ").trim();
      p.text = text;
      p.lower = text.toLowerCase();
    } catch (e) { p.text = ""; p.lower = ""; p.missing = true; }
  }));
  state.loaded = true;
}
const activePages = () => state.pages.filter(p => !p.archived);
const archivedPages = () => state.pages.filter(p => p.archived);

/* ---------- sidebar ---------- */
function sideDetails(key, title, cls, defaultOpen) {
  const d = el("details", cls);
  const saved = store("nav-open-" + key);
  d.open = saved === null ? defaultOpen : saved;
  d.dataset.key = key;
  d.addEventListener("toggle", () => store("nav-open-" + key, d.open));
  d.appendChild(el("summary", "", esc(title)));
  return d;
}

function buildSidebar() {
  const side = $("#sidebar");
  side.innerHTML = "";
  const home = el("a", "side-home", "Home");
  home.href = "#/";
  side.appendChild(home);
  state.sections.forEach(sec => {
    const groups = sec.groups.map(g => ({ g, pages: g.pages.filter(p => !p.archived) })).filter(x => x.pages.length);
    if (!groups.length) return;
    const box = sideDetails(sec.slug, sec.title, "side-section", true);
    groups.forEach(({ g, pages }) => {
      let target = box;
      if (g.title) {
        target = sideDetails(sec.slug + "/" + g.slug, g.title, "side-group", false);
        box.appendChild(target);
      }
      pages.forEach(p => {
        const a = el("a", "side-link", esc(p.title));
        a.href = "#/" + p.path;
        a.dataset.path = p.path;
        target.appendChild(a);
      });
    });
    side.appendChild(box);
  });
  const n = archivedPages().length;
  if (n) {
    const a = el("a", "side-archive", 'Archive <span>' + n + "</span>");
    a.href = "#/archive";
    side.appendChild(a);
  }
  side.appendChild(el("div", "side-foot", '<a href="#/reference/editing-this-hub">How to edit this hub</a>'));
}

function markActive(path) {
  const page = state.byPath[path];
  $$(".side-link").forEach(a => {
    const on = a.dataset.path === path;
    a.classList.toggle("active", on);
    if (on) {
      a.setAttribute("aria-current", "page");
      let d = a.parentElement;
      while (d && d.tagName === "DETAILS") { d.open = true; d = d.parentElement; }
    } else a.removeAttribute("aria-current");
  });
  $(".side-home").classList.toggle("active", !path);
  const arc = $(".side-archive");
  if (arc) arc.classList.toggle("active", path === "archive" || !!(page && page.archived));
}

/* ---------- Markdown → page ---------- */
function addSpacers(md) {
  // Extra blank lines in a file become extra space on the page.
  return md.replace(/\n[ \t]*\n((?:[ \t]*\n)+)/g, (m, extra) =>
    "\n\n" + '<div class="spacer"></div>\n\n'.repeat((extra.match(/\n/g) || []).length));
}

function splitMeta(md) {
  // Lines like "Platform: ServiceTitan" or "Status: Active" right under the title become badges.
  const meta = {};
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let i = 0, title = "";
  while (i < lines.length && !lines[i].trim()) i++;
  if (lines[i] && /^#\s+/.test(lines[i])) { title = lines[i].replace(/^#\s+/, "").trim(); i++; }
  while (i < lines.length) {
    const t = lines[i].trim();
    const m = t.match(/^(Platform|Status|Type|Owner|Last reviewed|Updated):\s*(.+)$/i);
    if (m) { meta[m[1].toLowerCase()] = m[2].trim(); i++; }
    else if (!t) i++;
    else break;
  }
  return { title, meta, body: lines.slice(i).join("\n") };
}

const SECTION_KINDS = {
  "when this is used": "when", "when to use": "when", "overview": "when",
  "steps": "steps", "how to do it": "steps",
  "required information": "required", "what you need": "required",
  "common errors": "errors", "common mistakes": "errors", "watch out for": "errors",
  "related articles": "related", "related": "related", "see also": "related"
};
const CALLOUTS = {
  "tip": "tip", "pro tip": "tip", "note": "note", "important": "important", "warning": "warning",
  "heads up": "warning", "example": "example", "why": "why", "why this works": "why", "remember": "note"
};

function renderMarkdown(md) {
  marked.setOptions({ gfm: true, breaks: true });
  return cleanHTML(marked.parse(addSpacers(md)));
}

/* Safety filter: removes scripts and other risky code from page text before it shows. */
function cleanHTML(html) {
  if (typeof DOMPurify === "undefined" || !DOMPurify.isSupported) {
    throw new Error("The safety filter (assets/vendor/purify.min.js) didn't load, so pages can't be shown.");
  }
  return DOMPurify.sanitize(html, { ADD_ATTR: ["target"] })
    .replace(/<img (?![^>]*\bloading=)/g, '<img loading="lazy" decoding="async" ');
}


/* Wrap each "## Heading" and what follows it in its own styled block. */
function wrapSections(root) {
  const kids = Array.from(root.childNodes);
  let current = null;
  const out = document.createDocumentFragment();
  kids.forEach(n => {
    if (n.nodeType === 1 && n.tagName === "H2") {
      const kind = SECTION_KINDS[n.textContent.trim().toLowerCase().replace(/[:?]$/, "")] || "plain";
      current = el("section", "sec sec-" + kind);
      current.appendChild(n);
      out.appendChild(current);
    } else if (current) current.appendChild(n);
    else out.appendChild(n);
  });
  root.innerHTML = "";
  root.appendChild(out);
  // Blank lines typed just before a "## Heading" add space between the cards,
  // not inside the bottom of the card above.
  $$(".sec", root).forEach(sec => {
    let last = sec.lastElementChild;
    while (last && last.classList.contains("spacer")) {
      sec.after(last);
      last = sec.lastElementChild;
    }
  });
}

/* Numbered lists keep counting across groups: a list that starts at 5 shows 5. */
function continueNumbers(root) {
  $$("ol[start]", root).forEach(ol => {
    const s = parseInt(ol.getAttribute("start"), 10);
    if (s > 1) ol.style.counterReset = "step " + (s - 1);
  });
}

/* "Field: value" at the start of a list item → the field name is bolded. */
function boldLabels(root) {
  $$("li, .quote p, td", root).forEach(node => {
    const first = node.firstChild;
    if (!first || first.nodeType !== 3) return;
    const m = first.textContent.match(/^(\s*)([A-Z][A-Za-z0-9&/#'’() .-]{1,34}?):(\s|$)/);
    if (!m || /https?$/i.test(m[2])) return;
    if (m[2].trim().split(/\s+/).length > 5) return;
    const strong = el("span", "label", esc(m[2]) + ":");
    first.textContent = first.textContent.slice(m[0].length - m[3].length);
    node.insertBefore(strong, first);
    if (m[1]) node.insertBefore(document.createTextNode(m[1]), strong);
  });
}

function styleCallouts(root) {
  $$("blockquote", root).forEach(bq => {
    const p = bq.querySelector("p");
    const text = p ? p.textContent.trim() : "";
    const m = text.match(/^([A-Za-z ]{2,16}):/);
    const kind = m && CALLOUTS[m[1].toLowerCase().trim()];
    if (kind) {
      bq.className = "callout callout-" + kind;
      const first = p.firstChild;
      if (first && first.nodeType === 3) first.textContent = first.textContent.replace(/^\s*[A-Za-z ]{2,16}:\s*/, "");
      bq.insertBefore(el("div", "callout-label", esc(m[1].trim())), bq.firstChild);
    } else {
      // A plain quote is a template: show it as a card with a Copy button.
      bq.className = "quote";
      const btn = el("button", "copy-btn", "Copy");
      btn.type = "button";
      btn.addEventListener("click", () => {
        const text = Array.from(bq.children).filter(c => c !== btn).map(c => c.innerText).join("\n\n");
        copyText(text, btn, "Copy");
      });
      bq.appendChild(btn);
    }
  });
}

function styleLinks(root) {
  $$("a[href]", root).forEach(a => {
    const raw = a.getAttribute("href");
    if (raw.startsWith("#") && !raw.startsWith("#/")) return;
    const r = resolveHref(raw);
    a.setAttribute("href", r.href);
    if (r.external) { a.target = "_blank"; a.rel = "noopener"; }
    if (r.broken) { a.classList.add("broken"); a.title = "This page doesn't exist yet"; }
    if (/sharepoint\.com/i.test(r.href)) {
      a.classList.add("sp-link");
      a.title = "Opens SharePoint. Southland login required.";
    }
  });
}

/* Pictures: one on its own is a figure. Back-to-back pictures become a slideshow. */
function styleImages(root) {
  $$("p", root).forEach(p => {
    if (p.querySelector("img") && !p.textContent.trim()) p.classList.add("figure-row");
  });
  $$("img", root).forEach(img => {
    const src = img.getAttribute("src") || "";
    if (src && !/[\/:]/.test(src)) img.setAttribute("src", "assets/img/" + src);
    img.loading = "lazy";
    const fig = el("figure", "shot");
    img.replaceWith(fig);
    fig.appendChild(img);
    if (img.alt) fig.appendChild(el("figcaption", "", esc(img.alt)));
    img.addEventListener("click", () => openLightbox(img));
    img.addEventListener("error", () => {
      fig.classList.add("missing");
      fig.insertBefore(el("div", "missing-note", "Picture not found: " + esc(src.replace(/^assets\/img\//, ""))), img);
      img.remove();
    }, { once: true });
  });
  $$("p.figure-row", root).forEach(r => {
    if (!r.parentNode) return;
    const figs = [];
    let n = r;
    while (n && n.tagName === "P" && n.classList.contains("figure-row")) {
      figs.push(...$$("figure", n));
      const next = n.nextElementSibling;
      if (n !== r) n.remove();
      n = next;
    }
    if (figs.length === 1) r.replaceWith(figs[0]);
    else if (figs.length > 1) r.replaceWith(buildSlideshow(figs));
  });
}

function buildSlideshow(figs) {
  const box = el("div", "slides");
  box.tabIndex = 0;
  box.setAttribute("role", "group");
  box.setAttribute("aria-label", "Slideshow, " + figs.length + " pictures");
  const stage = el("div", "slides-stage");
  figs.forEach(f => stage.appendChild(f));
  const prev = el("button", "slides-arrow prev", "<span aria-hidden='true'>‹</span>");
  const next = el("button", "slides-arrow next", "<span aria-hidden='true'>›</span>");
  prev.type = next.type = "button";
  prev.setAttribute("aria-label", "Previous picture");
  next.setAttribute("aria-label", "Next picture");
  stage.append(prev, next);
  const bar = el("div", "slides-bar");
  const count = el("span", "slides-count");
  const dots = el("div", "slides-dots");
  figs.forEach((_, i) => {
    const d = el("button", "slides-dot");
    d.type = "button";
    d.setAttribute("aria-label", "Picture " + (i + 1));
    d.addEventListener("click", () => go(i));
    dots.appendChild(d);
  });
  bar.append(count, dots);
  box.append(stage, bar);
  let at = 0;
  function go(i) {
    at = Math.max(0, Math.min(figs.length - 1, i));
    figs.forEach((f, k) => f.classList.toggle("is-current", k === at));
    $$(".slides-dot", dots).forEach((d, k) => d.classList.toggle("active", k === at));
    count.textContent = (at + 1) + " of " + figs.length;
    prev.disabled = at === 0;
    next.disabled = at === figs.length - 1;
  }
  prev.addEventListener("click", () => go(at - 1));
  next.addEventListener("click", () => go(at + 1));
  box.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(at - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(at + 1); }
  });
  let x0 = null;
  stage.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) go(at + (dx < 0 ? 1 : -1));
    x0 = null;
  });
  go(0);
  return box;
}

function openLightbox(img) {
  const box = el("div", "lightbox");
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-label", img.alt || "Picture");
  const big = el("img");
  big.src = img.src; big.alt = img.alt || "";
  const close = el("button", "lb-close", "×");
  close.setAttribute("aria-label", "Close");
  box.append(close, big);
  if (img.alt) box.appendChild(el("p", "", esc(img.alt)));
  const shut = () => { box.remove(); document.removeEventListener("keydown", onKey); };
  const onKey = e => { if (e.key === "Escape") shut(); };
  box.addEventListener("click", shut);
  document.addEventListener("keydown", onKey);
  document.body.appendChild(box);
  close.focus();
}

function wrapTables(root) {
  $$("table", root).forEach(t => {
    const w = el("div", "table-wrap");
    t.replaceWith(w);
    w.appendChild(t);
  });
}

/* Decision trees: a line ending in "?" followed by "### If ..." headings.
   An "### In every case" heading after the branches joins them back together. */
function buildTrees(root) {
  $$("p", root).forEach(p => {
    if (!p.parentNode || !/\?\s*$/.test(p.textContent.trim())) return;
    const branches = [];
    let n = p.nextElementSibling;
    const grab = head => {
      const part = { head, body: [] };
      let m = head.nextElementSibling;
      while (m && !/^H[23]$/.test(m.tagName)) { part.body.push(m); m = m.nextElementSibling; }
      return [part, m];
    };
    while (n && n.tagName === "H3" && /^if\b/i.test(n.textContent.trim())) {
      const [part, after] = grab(n);
      branches.push(part);
      n = after;
    }
    if (branches.length < 2) return;
    let join = null;
    if (n && n.tagName === "H3" && /^(in every case|in all cases|either way|always|then|after that)/i.test(n.textContent.trim())) join = grab(n)[0];

    const tree = el("div", "tree");
    tree.appendChild(el("div", "tree-q", p.innerHTML));
    p.replaceWith(tree);
    const row = el("div", "tree-branches tree-" + branches.length);
    branches.forEach(b => {
      const c = el("div", "tree-branch");
      c.appendChild(el("div", "tree-cond", b.head.innerHTML));
      b.head.remove();
      b.body.forEach(x => c.appendChild(x));
      row.appendChild(c);
    });
    tree.appendChild(row);
    if (join) {
      const j = el("div", "tree-join");
      j.appendChild(el("div", "tree-cond", join.head.innerHTML));
      join.head.remove();
      join.body.forEach(x => j.appendChild(x));
      tree.appendChild(j);
    }
  });
}

/* Forms ("Type: Form"): "- Label: ___" becomes a box to type in.
   Eight or more underscores make a bigger box. Checkboxes aren't saved. */
function buildForm(root) {
  let n = 0;
  $$("li", root).forEach(li => {
    if (li.querySelector("input, ul, ol")) return;
    const m = li.textContent.match(/^([\s\S]*?)[:\s]*(_{3,})\s*$/);
    if (!m) return;
    const label = m[1].trim(), id = "field-" + (++n);
    li.className = "form-field" + (m[2].length >= 8 ? " is-long" : "");
    li.innerHTML = '<label for="' + id + '">' + esc(label) + "</label>" +
      (m[2].length >= 8 ? '<textarea id="' + id + '" rows="3"></textarea>' : '<input type="text" id="' + id + '">');
  });
  $$("ul", root).forEach(ul => {
    const lis = $$(":scope > li", ul);
    if (lis.length && lis.every(li => li.classList.contains("form-field"))) ul.classList.add("form-grid");
  });
  const bar = el("div", "form-toolbar",
    '<button type="button" class="btn" data-act="print">Print or save as PDF</button>' +
    '<button type="button" class="btn btn-quiet" data-act="clear">Clear the form</button>' +
    '<span class="form-hint">Nothing you type here is saved or sent anywhere.</span>');
  bar.addEventListener("click", e => {
    const act = e.target.dataset && e.target.dataset.act;
    if (act === "print") window.print();
    if (act === "clear") {
      $$("input[type=text], textarea", root).forEach(i => (i.value = ""));
      $$("input[type=checkbox]", root).forEach(i => (i.checked = false));
    }
  });
  root.prepend(bar);
}

/* Task lists: a question heading (ends in "?") makes a quiz, otherwise a checklist. */
function buildChecklistsAndQuizzes(root, path, isForm) {
  $$("ul", root).forEach((ul, listIndex) => {
    const items = $$(":scope > li", ul).filter(li => li.querySelector(":scope > input[type=checkbox], :scope > p > input[type=checkbox]"));
    if (!items.length) return;
    let prev = ul.previousElementSibling;
    while (prev && prev.tagName === "P" && !prev.textContent.trim()) prev = prev.previousElementSibling;
    const isQuiz = !isForm && prev && /^H[3-4]$/.test(prev.tagName) && /\?\s*$/.test(prev.textContent);
    if (isQuiz) {
      const wrap = el("div", "quiz");
      prev.replaceWith(wrap);
      wrap.appendChild(prev);
      prev.classList.add("quiz-q");
      const opts = el("div", "quiz-options");
      let why = ul.nextElementSibling;
      if (!(why && why.tagName === "BLOCKQUOTE")) why = null;
      items.forEach(li => {
        const box = li.querySelector("input");
        const right = box.checked;
        box.remove();
        const b = el("button", "quiz-opt", li.innerHTML.trim());
        b.type = "button";
        b.dataset.right = right ? "1" : "0";
        b.addEventListener("click", () => {
          if (wrap.classList.contains("answered")) return;
          wrap.classList.add("answered");
          b.classList.add(right ? "is-right" : "is-wrong");
          $$(".quiz-opt", opts).forEach(o => { if (o.dataset.right === "1") o.classList.add("is-answer"); o.disabled = true; });
          const res = el("div", "quiz-result " + (right ? "ok" : "no"), right ? "That's right." : "Not quite. The right answer is marked.");
          wrap.insertBefore(res, why && why.parentElement === wrap ? why : null);
          if (why) why.hidden = false;
          scoreQuiz();
        });
        opts.appendChild(b);
      });
      ul.replaceWith(wrap);
      wrap.appendChild(opts);
      if (why) { wrap.appendChild(why); why.hidden = true; }
    } else {
      ul.classList.add("checklist");
      items.forEach((li, i) => {
        const box = li.querySelector("input");
        const key = "check:" + path + ":" + listIndex + ":" + i;
        box.disabled = false;
        box.checked = isForm ? false : !!store(key);
        li.classList.toggle("done", box.checked);
        const label = el("label", "check-row");
        box.replaceWith(label);
        label.appendChild(box);
        const span = el("span", "check-text");
        while (label.nextSibling) span.appendChild(label.nextSibling);
        label.appendChild(span);
        box.addEventListener("change", () => {
          if (!isForm) store(key, box.checked);
          li.classList.toggle("done", box.checked && !isForm);
          updateProgress();
        });
      });
      if (isForm) ul.classList.add("form-choices");
    }
  });
  if (!isForm) updateProgress();
}

function updateProgress() {
  const boxes = $$("#content .checklist:not(.form-choices) input[type=checkbox]");
  const bar = $("#content .progress");
  if (boxes.length < 4) { if (bar) bar.remove(); return; }
  const done = boxes.filter(b => b.checked).length;
  let p = bar;
  if (!p) {
    p = el("div", "progress", '<div class="progress-row"><span class="progress-text"></span><button type="button" class="progress-clear">Clear all</button></div><div class="progress-track"><div class="progress-fill"></div></div>');
    $("#content .page-head").after(p);
    $(".progress-clear", p).addEventListener("click", () => {
      $$("#content .checklist input[type=checkbox]").forEach(b => { if (b.checked) { b.checked = false; b.dispatchEvent(new Event("change")); } });
    });
  }
  $(".progress-text", p).textContent = done + " of " + boxes.length + " done";
  $(".progress-fill", p).style.width = (100 * done / boxes.length) + "%";
}

function scoreQuiz() {
  const all = $$("#content .quiz"), done = all.filter(q => q.classList.contains("answered"));
  if (all.length < 2) return;
  const right = done.filter(q => q.querySelector(".is-right")).length;
  let s = $("#content .quiz-score");
  if (!s) { s = el("div", "quiz-score"); $("#content .article").appendChild(s); }
  s.textContent = "Score: " + right + " of " + done.length + " answered (" + all.length + " questions)";
  if (done.length === all.length) {
    s.textContent = "You got " + right + " of " + all.length + " right. " + (right === all.length ? "Nice work." : "Review the linked articles and try again.");
    const again = el("button", "btn", "Start over");
    again.addEventListener("click", () => route());
    s.appendChild(again);
  }
}

function kickerFor(page) { return page.archived ? "Archive" : page.section.title; }

function relatedCards(root) {
  $$(".sec-related ul", root).forEach(ul => {
    ul.classList.add("cards");
    $$("li", ul).forEach(li => {
      const a = li.querySelector("a");
      if (a && li.textContent.trim() === a.textContent.trim()) {
        a.classList.add("card-link");
        const page = state.byPath[(a.getAttribute("href") || "").replace(/^#\//, "")];
        if (page) a.insertAdjacentHTML("afterbegin", '<span class="card-kicker">' + esc(kickerFor(page)) + "</span>");
      }
    });
  });
}

function headingIds(root) {
  const used = {};
  $$("h2, h3", root).forEach(h => {
    let id = slugify(h.textContent) || "section";
    used[id] = (used[id] || 0) + 1;
    if (used[id] > 1) id += "-" + used[id];
    h.id = id;
  });
}

function buildToc(root) {
  const toc = $("#toc");
  toc.innerHTML = "";
  const hs = $$(".article h2", root);
  if (hs.length < 3) return;
  toc.appendChild(el("div", "toc-title", "On this page"));
  hs.forEach(h => {
    const a = el("a", "", esc(h.textContent));
    a.href = "#" + h.id;
    a.addEventListener("click", e => { e.preventDefault(); h.scrollIntoView({ behavior: "smooth", block: "start" }); });
    toc.appendChild(a);
  });
}

function inPageAnchors(root) {
  $$('a[href^="#"]:not([href^="#/"])', root).forEach(a => {
    a.addEventListener("click", e => {
      const t = document.getElementById(a.getAttribute("href").slice(1));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth" }); }
    });
  });
}

/* Run every enhancement on a block of rendered Markdown. */
function enhance(box, path, isForm) {
  styleCallouts(box);
  styleImages(box);
  wrapTables(box);
  styleLinks(box);
  wrapSections(box);
  buildTrees(box);
  continueNumbers(box);
  if (isForm) buildForm(box);
  boldLabels(box);
  relatedCards(box);
  headingIds(box);
  inPageAnchors(box);
}

/* ---------- pages ---------- */
function chip(text, cls) { return '<span class="chip ' + cls + '">' + esc(text) + "</span>"; }

async function renderArticle(path) {
  const main = $("#content");
  const page = state.byPath[path];
  let md = page && page.md;
  if (!md) {
    try { md = await getText("pages/" + path + ".md"); }
    catch (e) {
      main.innerHTML = '<div class="article"><div class="page-head"><h1>Page not found</h1></div>' +
        "<p>There's no file at <code>pages/" + esc(path) + ".md</code>. Check the spelling, or search for what you need.</p>" +
        '<p><a href="#/">Back to the home page</a></p></div>';
      document.title = "Not found · Dispatch Hub";
      return;
    }
  }
  const { title, meta, body } = splitMeta(md);
  const shownTitle = title || (page && page.title) || path;
  const archived = (page && page.archived) || ARCHIVE_WORDS.test(meta.status || "");
  const isForm = /^form/i.test(meta.type || "");

  const art = el("article", "article" + (archived ? " is-archived" : "") + (isForm ? " is-form" : ""));
  let crumbs = "";
  if (page) {
    const parts = archived ? ["Archive", meta.platform || page.group.title] : [page.section.title, page.group.title];
    crumbs = '<div class="crumbs">' + parts.filter(Boolean).map(t => "<span>" + esc(t) + "</span>").join("") + "</div>";
  }
  let chips = "";
  if (meta.platform) chips += chip(meta.platform, "chip-platform chip-" + slugify(meta.platform));
  if (meta.status) chips += chip(meta.status, "chip-status " + (archived ? "chip-archived" : "chip-" + slugify(meta.status.split(/\s/)[0])));
  const edit = '<a class="edit-link" target="_blank" rel="noopener" href="https://github.com/' + REPO + "/edit/" + BRANCH + "/pages/" + path + '.md">Edit this page</a>';
  art.innerHTML = '<div class="page-head">' + crumbs + "<h1>" + esc(shownTitle) + "</h1>" +
    '<div class="meta-row">' + chips + edit + "</div></div>" +
    (archived ? '<div class="archive-banner"><strong>Archived.</strong> This is a legacy workflow, kept for reference on older jobs. It is no longer maintained.</div>' : "");
  const bodyBox = el("div", "article-body", renderMarkdown(body));
  art.appendChild(bodyBox);
  enhance(bodyBox, path, isForm);

  // How to link here, for editors.
  const linkName = path.split("/").pop();
  const foot = el("div", "page-foot",
    '<span>Link name for this page: <code>' + esc(linkName) + '</code></span>' +
    '<button type="button" class="copy-mini">Copy</button>' +
    '<span class="page-file">File: pages/' + esc(path) + ".md</span>");
  $(".copy-mini", foot).addEventListener("click", e => copyText("[" + shownTitle + "](" + linkName + ")", e.target, "Copy"));
  art.appendChild(foot);

  // Previous / next, in menu order, among pages of the same kind.
  if (page) {
    const list = state.pages.filter(p => !!p.archived === !!archived);
    const i = list.indexOf(page);
    const prev = list[i - 1], next = list[i + 1];
    const pn = el("nav", "prev-next");
    pn.setAttribute("aria-label", "Previous and next page");
    pn.innerHTML = (prev ? '<a class="pn prev" href="#/' + prev.path + '"><small>Previous</small>' + esc(prev.title) + "</a>" : "<span></span>") +
                   (next ? '<a class="pn next" href="#/' + next.path + '"><small>Next</small>' + esc(next.title) + "</a>" : "<span></span>");
    art.appendChild(pn);
  }

  main.innerHTML = "";
  main.appendChild(art);
  buildChecklistsAndQuizzes(bodyBox, path, isForm);
  buildToc(main);
  document.title = shownTitle + " · Dispatch Hub";
}

function renderArchiveIndex() {
  const main = $("#content");
  $("#toc").innerHTML = "";
  const groups = {};
  archivedPages().forEach(p => {
    const key = p.meta.platform || "General";
    (groups[key] = groups[key] || []).push(p);
  });
  const order = Object.keys(groups).sort((a, b) => (a === "General") - (b === "General") || groups[b].length - groups[a].length);
  const blocks = order.map(k =>
    '<section class="sec sec-related archive-group"><h2>' + esc(k) + " <small>" + groups[k].length + "</small></h2>" +
    '<ul class="cards">' + groups[k].map(p => '<li><a class="card-link" href="#/' + p.path + '"><span class="card-kicker">' +
      esc(p.group.title || "Archive") + "</span>" + esc(p.title) + "</a></li>").join("") + "</ul></section>").join("");
  main.innerHTML = '<article class="article is-archived"><div class="page-head"><div class="crumbs"><span>Archive</span></div><h1>Archive</h1></div>' +
    '<div class="archive-banner"><strong>Legacy workflows.</strong> Kept for reference on older jobs. These pages are no longer maintained.</div>' +
    '<div class="article-body"><p>Any page whose status is set to Archived lands here automatically and leaves the menu.</p>' + blocks + "</div></article>";
  document.title = "Archive · Dispatch Hub";
}

async function renderHome() {
  const main = $("#content");
  $("#toc").innerHTML = "";
  const cards = state.sections.map((s, i) => {
    const pages = s.groups.flatMap(g => g.pages.filter(p => !p.archived));
    if (!pages.length) return "";
    const groups = s.groups.filter(g => g.title && g.pages.some(p => !p.archived)).map(g => esc(g.title)).slice(0, 7).join(" · ");
    return '<a class="home-card' + (i === 0 ? " is-primary" : "") + '" href="#/' + pages[0].path + '">' +
      '<span class="home-card-count">' + pages.length + " pages</span>" +
      "<h2>" + esc(s.title) + "</h2>" +
      (s.blurb ? "<p>" + esc(s.blurb) + "</p>" : "") +
      (groups ? '<span class="home-card-groups">' + groups + "</span>" : "") + "</a>";
  }).join("");
  const arch = archivedPages().length;
  const archCard = arch ? '<a class="home-card is-archive" href="#/archive"><span class="home-card-count">' + arch + " pages</span><h2>Archive</h2>" +
    "<p>Legacy ServiceTrade and COINS workflows, kept for reference on older jobs.</p></a>" : "";
  main.innerHTML =
    '<section class="hero"><div class="hero-inner">' +
    '<p class="hero-kicker">NorCal Service · Dispatch</p>' +
    "<h1>Dispatch Hub</h1>" +
    '<p class="hero-sub">Every step of the job, from the first call to Ready to Bill. Built for new dispatchers, handy for everyone.</p>' +
    '<button class="hero-search" type="button" id="hero-search">Search ' + state.pages.length + " pages <kbd>/</kbd></button>" +
    "</div></section>" +
    '<section class="home-cards">' + cards + archCard + "</section>" +
    '<div class="article home-notes"><div class="article-body" id="home-body"></div></div>';
  $("#hero-search").addEventListener("click", () => $("#search").focus());
  try {
    const md = await getText("pages/home.md");
    const box = $("#home-body");
    box.innerHTML = renderMarkdown(splitMeta(md).body);
    enhance(box, "home", false);
  } catch (e) { /* home.md is optional */ }
  document.title = "Dispatch Hub";
}

async function route() {
  const path = decodeURIComponent(location.hash.replace(/^#\/?/, "")).replace(/\/$/, "");
  closeMenu();
  closeSearch();
  markActive(path);
  if (!path) await renderHome();
  else if (path === "archive") renderArchiveIndex();
  else await renderArticle(path);
  window.scrollTo(0, 0);
  $("#content").focus({ preventScroll: true });
}

/* ---------- search ----------
   Every word typed must appear on the page. Each word scores 10 points if
   it's in the page title, plus 1 point per mention in the text (up to 5).
   Active pages always rank above archived pages. */
function runSearch(q) {
  const box = $("#search-results");
  q = q.trim().toLowerCase();
  if (q.length < 2 || !state.loaded) { box.hidden = true; return; }
  const terms = q.split(/\s+/).map(t => t.length > 4 ? t.replace(/(ing|ed|es|s|e)$/, "") : t);
  const hits = state.pages.map(p => {
    const t = p.title.toLowerCase() + " " + (p.fullTitle || "").toLowerCase();
    let score = 0;
    for (const term of terms) {
      const inTitle = t.includes(term);
      const n = p.lower.split(term).length - 1;
      if (!n && !inTitle) return null;
      score += (inTitle ? 10 : 0) + Math.min(n, 5);
    }
    return { p, score };
  }).filter(Boolean)
    .sort((a, b) => (a.p.archived - b.p.archived) || (b.score - a.score))
    .slice(0, 8);
  if (!hits.length) { box.innerHTML = '<div class="sr-empty">No pages match "' + esc(q) + '".</div>'; box.hidden = false; return; }
  const re = new RegExp("(" + terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")", "ig");
  box.innerHTML = hits.map(({ p }) => {
    const at = p.lower.indexOf(terms[0]);
    const start = Math.max(0, at - 50);
    let snip = at >= 0 ? (start ? "…" : "") + p.text.slice(start, at + 90) + "…" : "";
    snip = esc(snip).replace(re, "<mark>$1</mark>");
    return '<a class="sr' + (p.archived ? " is-archived" : "") + '" href="#/' + p.path + '"><span class="sr-sec">' + esc(kickerFor(p)) + "</span>" +
      '<span class="sr-title">' + esc(p.title) + "</span>" + (snip ? '<span class="sr-snip">' + snip + "</span>" : "") + "</a>";
  }).join("");
  box.hidden = false;
}
function closeSearch() { const b = $("#search-results"); if (b) b.hidden = true; }

/* ---------- mobile menu ---------- */
function openMenu() { document.body.classList.add("menu-open"); $("#scrim").hidden = false; $("#menu-btn").setAttribute("aria-expanded", "true"); }
function closeMenu() { document.body.classList.remove("menu-open"); $("#scrim").hidden = true; $("#menu-btn").setAttribute("aria-expanded", "false"); }

/* ---------- start ---------- */
(async function start() {
  try {
    parseNav(await getText("nav.md"));
  } catch (e) {
    $("#content").innerHTML = "<p>Couldn't load <code>nav.md</code>. Make sure it's in the top folder of the site.</p>";
    return;
  }
  try { parseLinks(await getText("pages/reference/shared-links.md")); } catch (e) { /* optional */ }
  await loadPages();
  buildSidebar();

  $("#menu-btn").addEventListener("click", () => document.body.classList.contains("menu-open") ? closeMenu() : openMenu());
  $("#scrim").addEventListener("click", closeMenu);
  const input = $("#search");
  let timer;
  input.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(() => runSearch(input.value), 100); });
  input.addEventListener("focus", () => { if (input.value) runSearch(input.value); });
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") { const a = $("#search-results .sr"); if (a) { location.hash = a.getAttribute("href"); input.blur(); } }
    if (e.key === "Escape") { input.value = ""; closeSearch(); input.blur(); }
  });
  document.addEventListener("click", e => { if (!e.target.closest(".search")) closeSearch(); });
  $("#search-results").addEventListener("click", e => { if (e.target.closest(".sr")) { input.value = ""; } });
  document.addEventListener("keydown", e => {
    if (e.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); }
  });

  window.addEventListener("hashchange", route);
  route();
})();
