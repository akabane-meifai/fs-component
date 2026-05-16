{
const g = {};
const t = Object.fromEntries(Array.from(
  document.body.querySelectorAll('template[id*="-"]'),
  i => {
    const c = i.content, s = new CSSStyleSheet();
    const e = Array.from(c.querySelectorAll('style'));
    s.replace(e.map(j => { j.remove(); return j.innerHTML}).join("\n"));
    i.remove();
    return [ i.getAttribute('id').toLowerCase(), { c, s, m: new Map(), i: null } ];
  }
));
for (const n in t) customElements.define(
  n,
  class extends HTMLElement{
    constructor() {
      super();
      const {c, s} = t[this.tagName.toLowerCase()], r = this.attachShadow({mode: "open"});
      r.append(c.cloneNode(true));
      r.adoptedStyleSheets = [s];
    }
    connectedCallback() {
      const {m, i} = t[this.tagName.toLowerCase()], a = new AbortController();
      if (typeof i === 'function') {
        i(this, a.signal, g);
      }
      m.set(this, a);
    }
    disconnectedCallback() {
      const {m} = t[this.tagName.toLowerCase()];
      if (m.has(this)) {
        m.get(this).abort();
        m.delete(this);
      }
    }
  }
);
self.components_share = function() { return g; }
self.components_init = function(k, i){
  if (!(k in t) || (typeof i !== 'function')) {
    return;
  }
  const x = t[k];
  for (const e of x.m.entries()) {
    const [j, a] = e;
    i(j, a.signal, g);
  }
  x.i = i;
};
}
