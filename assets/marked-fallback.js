/* The publish step adds assets/vendor/marked.min.js (the page-text reader).
   If it's missing, load the same pinned version from cdnjs instead.
   You never need to edit this file. */
if (typeof marked === "undefined") {
  document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.0/marked.min.js"><\/script>');
}
