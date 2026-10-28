/* =========================================================================
   GUARD.JS
   Loads first, before every other file. If another file has a mistake
   (a missing comma, a deleted file), this shows a plain message at the top
   of the page that names the file and the line, instead of a blank page.
   You never need to edit this file.
   ========================================================================= */
(function () {
  var problems = [];

  function shortName(url) {
    try {
      var path = new URL(url, location.href).pathname;
      var m = path.match(/(assets\/.*|pages\/.*|sops\/.*|[^\/]+\.(md|js|html))$/);
      return m ? m[1] : path;
    } catch (x) { return url || "a file"; }
  }

  function sameSite(url) {
    try { return new URL(url, location.href).origin === location.origin; } catch (x) { return false; }
  }

  function draw() {
    if (!document.body) { document.addEventListener("DOMContentLoaded", draw); return; }
    var box = document.getElementById("site-problem");
    if (!box) {
      box = document.createElement("div");
      box.id = "site-problem";
      box.setAttribute("role", "alert");
      var s = box.style;
      s.position = "sticky"; s.top = "0"; s.zIndex = "9999";
      s.background = "#111"; s.color = "#fff"; s.borderBottom = "4px solid #f26522";
      s.padding = "12px 16px"; s.font = "15px/1.45 system-ui, sans-serif";
      document.body.insertBefore(box, document.body.firstChild);
    }
    box.textContent = "";
    var head = document.createElement("strong");
    head.textContent = "Part of this site didn't load because of a mistake in a file.";
    box.appendChild(head);
    problems.forEach(function (p) {
      var line = document.createElement("div");
      line.textContent = "File: " + p.file + (p.line ? ", line " + p.line : "") + ". " + p.msg;
      box.appendChild(line);
    });
    var tip = document.createElement("div");
    tip.style.opacity = "0.8";
    tip.textContent = "Fix that line on GitHub, or undo the last change (see Editing This Site).";
    box.appendChild(tip);
  }

  function report(file, line, msg) {
    for (var i = 0; i < problems.length; i++) {
      if (problems[i].file === file && problems[i].line === line) return;
    }
    problems.push({ file: file, line: line, msg: msg });
    draw();
  }

  window.addEventListener("error", function (e) {
    var t = e.target;
    if (t && t !== window && (t.src || t.href)) {
      // A script or stylesheet file is missing.
      if (t.hasAttribute && t.hasAttribute("data-optional")) return;
      if (t.tagName === "IMG") return;
      if (!sameSite(t.src || t.href)) return;
      report(shortName(t.src || t.href), 0, "This file is missing or couldn't load.");
      return;
    }
    if (!e.filename || !sameSite(e.filename)) return;
    var msg = e.message || "Unknown error.";
    if (/Unexpected|missing|expected|Invalid or unexpected|Unterminated/i.test(msg)) {
      msg += " This is usually a missing comma, quote, or bracket on or just above this line.";
    }
    report(shortName(e.filename), e.lineno || 0, msg);
  }, true);

  // Other files can call this to show a problem too.
  window.showSiteProblem = report;
})();
