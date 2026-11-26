/* Shared renderer for the public site and the admin preview.
   ChanhoSite.mount(rootEl, content) renders the gate (no hash), #me or #work. */
(function () {
  var FONT_URL = "https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;500;600;700&family=Bebas+Neue&family=Archivo+Black&family=Oswald:wght@500;600&family=JetBrains+Mono:wght@400;600&display=swap";
  var FONTS = {
    "Anton": '"Anton", "Oswald", Impact, sans-serif',
    "Bebas Neue": '"Bebas Neue", "Oswald", Impact, sans-serif',
    "Archivo Black": '"Archivo Black", "Archivo", Arial Black, sans-serif',
    "Oswald": '"Oswald", "Arial Narrow", sans-serif'
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function safeUrl(u) {
    u = String(u || "").trim();
    if (!u) return "";
    if (/^(https?:|mailto:|tel:)/i.test(u) || /^[\w./-]+$/.test(u) || /^data:image\//i.test(u)) return u;
    if (/^[\w-]+(\.[\w-]+)+/.test(u)) return "https://" + u;
    return "";
  }
  function ph(item) { return item && item.placeholder ? " ph-mark" : ""; }
  function link(url, cls, inner, extra) {
    var u = safeUrl(url);
    if (!u) return '<div class="' + cls + '"' + (extra || "") + ">" + inner + "</div>";
    var ext = /^https?:/i.test(u) ? ' target="_blank" rel="noopener"' : "";
    return '<a class="' + cls + '" href="' + esc(u) + '"' + ext + (extra || "") + ">" + inner + "</a>";
  }
  function title(s) { return s.title ? '<h2 class="sec-title">' + esc(s.title) + "</h2>" : ""; }

  var R = {
    hero: function (s, c) {
      var av = safeUrl(c.profile && c.profile.avatar);
      return '<section class="sec hero' + ph(s) + '"><div class="wrap">' +
        (av ? '<img class="avatar" src="' + esc(av) + '" alt="' + esc(c.profile.name) + '">' : "") +
        (s.eyebrow ? '<p class="eyebrow">' + esc(s.eyebrow) + "</p>" : "") +
        "<h1>" + esc(s.headline) + "</h1>" +
        (s.sub ? '<p class="sub">' + esc(s.sub) + "</p>" : "") +
        (c.profile && c.profile.catchphrase ? '<div class="catch">' + esc(c.profile.catchphrase) + "</div>" : "") +
        "</div></section>";
    },
    now: function (s) {
      return '<section class="sec"><div class="wrap">' + title(s) + '<div class="rows">' +
        (s.items || []).map(function (it) {
          var inner = '<span class="k">' + esc(it.label) + '</span><span class="v">' + esc(it.text) + "</span>" +
            '<span class="tag">' + esc(it.badge || (safeUrl(it.url) ? "→" : "")) + "</span>";
          return link(it.url, "row" + ph(it), inner);
        }).join("") + "</div></div></section>";
    },
    links: function (s) {
      var items = s.items || [];
      if (s.style === "grid") {
        return '<section class="sec"><div class="wrap">' + title(s) + '<div class="tiles">' +
          items.map(function (it) {
            return link(it.url, "tile" + ph(it), '<span class="k">' + esc(it.label) + "</span><strong>" + esc(it.handle) + "</strong>" + (it.note ? "<small>" + esc(it.note) + "</small>" : ""));
          }).join("") + "</div></div></section>";
      }
      return '<section class="sec"><div class="wrap">' + title(s) + '<div class="rows">' +
        items.map(function (it) {
          var inner = '<span class="k">' + esc(it.label) + '</span><span class="v"><strong>' + esc(it.handle) + "</strong>" +
            (it.note ? "<small>" + esc(it.note) + "</small>" : "") + '</span><span class="go">' + (safeUrl(it.url) ? "↗" : "") + "</span>";
          return link(it.url, "row" + ph(it), inner);
        }).join("") + "</div></div></section>";
    },
    list: function (s) {
      return '<section class="sec"><div class="wrap">' + title(s) +
        (s.intro ? '<p class="intro">' + esc(s.intro) + "</p>" : "") +
        '<ul class="checklist">' + (s.items || []).map(function (it) {
          return '<li class="' + (it.done ? "done" : "") + ph(it) + '"><span class="box" aria-label="' + (it.done ? "Done" : "Not yet") + '"></span><span class="t">' + esc(it.text) + '</span><span class="n">' + esc(it.note) + "</span></li>";
        }).join("") + "</ul></div></section>";
    },
    promos: function (s) {
      return '<section class="sec"><div class="wrap">' + title(s) + '<div class="promos">' +
        (s.items || []).map(function (it) {
          var head = safeUrl(it.url) ? '<a class="b" href="' + esc(safeUrl(it.url)) + '" target="_blank" rel="noopener">' + esc(it.brand) + " ↗</a>" : '<span class="b">' + esc(it.brand) + "</span>";
          return '<div class="promo' + ph(it) + '">' + head +
            (it.code ? '<button class="code" type="button" data-copy="' + esc(it.code) + '">' + esc(it.code) + "</button>" : "") +
            (it.text ? "<p>" + esc(it.text) + "</p>" : "") + "</div>";
        }).join("") + "</div></div></section>";
    },
    gallery: function (s) {
      var cols = Math.max(1, Math.min(4, parseInt(s.columns, 10) || 3));
      return '<section class="sec"><div class="wrap">' + title(s) + '<div class="gallery" style="--cols:' + cols + '">' +
        (s.items || []).map(function (it) {
          var img = safeUrl(it.image);
          var media = '<div class="media">' + (img ? '<img loading="lazy" src="' + esc(img) + '" alt="">' : '<span class="ph">No image</span>') + "</div>";
          return link(it.url, "card" + ph(it), media + "<strong>" + esc(it.title) + "</strong>" + (it.subtitle ? "<small>" + esc(it.subtitle) + "</small>" : ""), ' data-cols="' + cols + '"');
        }).join("") + "</div></div></section>";
    },
    stats: function (s) {
      return '<section class="sec"><div class="wrap">' + title(s) + '<div class="statcard"><div class="statgrid">' +
        (s.items || []).map(function (it) {
          return '<div class="stat' + ph(it) + '"><div class="val">' + esc(it.value) + '</div><div class="lab">' + esc(it.label) + "</div></div>";
        }).join("") + "</div>" + (s.asOf ? '<div class="asof">' + esc(s.asOf) + "</div>" : "") + "</div></div></section>";
    },
    services: function (s) {
      return '<section class="sec"><div class="wrap">' + title(s) + '<div class="services">' +
        (s.items || []).map(function (it) {
          return '<div class="service' + ph(it) + '"><h3>' + esc(it.title) + "</h3><p>" + esc(it.text) + "</p></div>";
        }).join("") + "</div></div></section>";
    },
    timeline: function (s) {
      return '<section class="sec"><div class="wrap">' + title(s) + '<ol class="timeline">' +
        (s.items || []).map(function (it) {
          return '<li class="' + ph(it).trim() + '"><span class="when">' + esc(it.when) + "</span><div><h3>" + esc(it.title) + "</h3><p>" + esc(it.text) + "</p></div></li>";
        }).join("") + "</ol></div></section>";
    },
    text: function (s) {
      return '<section class="sec' + ph(s) + '"><div class="wrap">' + title(s) + '<div class="prose">' + esc(s.body) + "</div></div></section>";
    },
    contact: function (s) {
      var cv = safeUrl(s.cvUrl);
      return '<section class="sec"><div class="wrap"><div class="contact' + ph(s) + '">' + title(s) +
        (s.text ? "<p>" + esc(s.text) + "</p>" : "") + '<div class="actions">' +
        (s.email ? '<a class="btn fill" href="mailto:' + esc(s.email) + '">Email me</a><button class="btn" type="button" data-copy="' + esc(s.email) + '">Copy address</button><span class="mail">' + esc(s.email) + "</span>" : "") +
        (cv ? '<a class="btn" href="' + esc(cv) + '" target="_blank" rel="noopener">' + esc(s.cvLabel || "CV") + "</a>" : "") +
        "</div></div></div></section>";
    },
    divider: function () { return '<div class="wrap"><div class="stitch" role="presentation"></div></div>'; }
  };

  function applyTheme(c) {
    var st = c.settings || {};
    var root = document.documentElement;
    if (st.mode === "light" || st.mode === "dark") root.setAttribute("data-theme", st.mode);
    else root.removeAttribute("data-theme");
    root.setAttribute("data-corners", st.corners === "soft" ? "soft" : "sharp");
    root.setAttribute("data-width", st.width === "wide" ? "wide" : "normal");
    if (/^#[0-9a-f]{3,8}$/i.test(st.accent || "")) root.style.setProperty("--accent", st.accent);
    root.style.setProperty("--display", FONTS[st.displayFont] || FONTS.Anton);
    document.body.classList.toggle("hide-ph", st.showPlaceholders === false);
    if (st.siteTitle) document.title = st.siteTitle;
    if (!document.getElementById("cp-fonts")) {
      var l = document.createElement("link");
      l.id = "cp-fonts"; l.rel = "stylesheet"; l.href = FONT_URL;
      document.head.appendChild(l);
    }
  }

  function gate(c) {
    var g = c.gate || {};
    var words = String(g.title || "").split(/(?<=\.)\s+/).slice(0, 3);
    return '<div class="gate"><div class="gate-bg" aria-hidden="true">' +
      words.concat(words).slice(0, 3).map(function (w) { return "<span>" + esc(w) + "</span>"; }).join("") +
      '</div><div class="wrap"><div class="gate-card" role="dialog" aria-labelledby="gate-title">' +
      '<p class="eyebrow">' + esc(g.eyebrow) + '</p><h1 class="gate-title" id="gate-title">' + esc(g.title) + "</h1>" +
      '<p class="gate-q">' + esc(g.question) + '</p><div class="choices">' +
      '<a class="choice primary" href="#me"><b>' + esc(g.personalLabel) + "</b><span>" + esc(g.personalSub) + '</span><span class="arrow">ENTER →</span></a>' +
      '<a class="choice" href="#work"><b>' + esc(g.workLabel) + "</b><span>" + esc(g.workSub) + '</span><span class="arrow">ENTER →</span></a>' +
      "</div></div></div></div>";
  }

  function track(c, key) {
    var t = (c.tracks || {})[key] || { sections: [] };
    var other = key === "me" ? "work" : "me";
    var name = (c.profile && c.profile.name) || "";
    var html = '<header class="topbar"><div class="wrap"><a class="brand" href="#">' + esc(name) + "</a>" +
      '<nav class="switch" aria-label="Choose page">' +
      '<a href="#me"' + (key === "me" ? ' aria-current="page"' : "") + ">" + esc((c.tracks.me || {}).label || "Personal") + "</a>" +
      '<a href="#work"' + (key === "work" ? ' aria-current="page"' : "") + ">" + esc((c.tracks.work || {}).label || "Work") + "</a>" +
      "</nav></div></header><main>";
    var vis = (t.sections || []).filter(function (s) { return s.visible !== false; });
    vis.forEach(function (s, i) {
      var fn = R[s.type];
      if (!fn) return;
      html += fn(s, c);
      if (i === 0 && s.type === "hero") html += R.divider();
    });
    html += '</main><footer class="site"><div class="wrap"><span>© ' + new Date().getFullYear() + " " + esc(name) + "</span>" +
      '<a href="#' + other + '">' + (other === "me" ? "Just curious about me? →" : "Brand or partner? →") + "</a></div></footer>";
    return html;
  }

  function toast(msg) {
    var t = document.createElement("div");
    t.className = "toast"; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 1600);
  }

  function mount(root, content) {
    var state = { c: content };
    function draw() {
      var c = state.c;
      applyTheme(c);
      var h = (location.hash || "").replace("#", "");
      root.innerHTML = h === "me" || h === "work" ? track(c, h) : gate(c);
      if (h === "me" || h === "work") window.scrollTo(0, 0);
    }
    if (!root.__cpBound) {
      root.__cpBound = true;
      window.addEventListener("hashchange", draw);
      root.addEventListener("click", function (e) {
        var b = e.target.closest("[data-copy]");
        if (!b) return;
        var v = b.getAttribute("data-copy");
        var done = function () { toast("Copied: " + v); };
        try {
          navigator.clipboard.writeText(v).then(done, function () { toast(v); });
        } catch (err) { toast(v); }
      });
    }
    root.__cpSet = function (c) { state.c = c; draw(); };
    draw();
  }

  window.ChanhoSite = { mount: mount, esc: esc, update: function (root, c) { if (root.__cpSet) root.__cpSet(c); else mount(root, c); } };
})();
