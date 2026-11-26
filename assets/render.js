/* Shared renderer for the public site and the admin preview.
   ChanhoSite.mount(rootEl, content) renders the gate (no hash), #me or #work. */
(function () {
  var FONT_CSS = [
    "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css",
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Anton&family=Bebas+Neue&display=swap"
  ];
  /* display font presets: family, letter-case, tracking, weight */
  var FONTS = {
    "Pretendard": ['"Pretendard Variable", Pretendard, -apple-system, sans-serif', "none", "-0.035em", "760"],
    "Cormorant Garamond": ['"Cormorant Garamond", Georgia, serif', "none", "-0.01em", "500"],
    "Anton": ['"Anton", Impact, sans-serif', "uppercase", "0.005em", "400"],
    "Bebas Neue": ['"Bebas Neue", Impact, sans-serif', "uppercase", "0.02em", "400"]
  };
  var TAGS = { now: "NOW", links: "SOCIAL", list: "THE LIST", promos: "CODES", gallery: "WATCH", stats: "NUMBERS", services: "SERVICES", timeline: "RESUME", text: "NOTE", contact: "CONTACT" };

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
  function pad(n) { return String(n).padStart(2, "0"); }
  function ph(item) { return item && item.placeholder ? " ph-mark" : ""; }
  function link(url, cls, inner, extra) {
    var u = safeUrl(url);
    if (!u) return '<div class="' + cls + '"' + (extra || "") + ">" + inner + "</div>";
    var ext = /^https?:/i.test(u) ? ' target="_blank" rel="noopener"' : "";
    return '<a class="' + cls + '" href="' + esc(u) + '"' + ext + (extra || "") + ">" + inner + "</a>";
  }
  function head(s) {
    var tag = s.tag != null && s.tag !== "" ? s.tag : TAGS[s.type] || "";
    if (!s.title && !tag) return "";
    return '<div class="sec-head rv"><div class="glass-pill">' +
      (s.title ? '<h2 class="sec-title">' + esc(s.title) + "</h2>" : "") +
      (tag ? '<span class="sec-tag">' + esc(tag) + "</span>" : "") + "</div></div>";
  }
  function open(s, cls) { return '<section class="sec orb ' + (cls || "") + '" id="s-' + esc(s.id) + '" data-label="' + esc(s.title || s.headline || s.type) + '"><div class="wrap">'; }
  var close = "</div></section>";

  var R = {
    hero: function (s, c) {
      var av = safeUrl(c.profile && c.profile.avatar);
      return '<section class="hero orb' + ph(s) + '" id="s-' + esc(s.id) + '" data-label="' + esc(s.headline) + '"><div class="wrap">' +
        (av ? '<img class="avatar rv" src="' + esc(av) + '" alt="' + esc(c.profile.name) + '">' : "") +
        (s.eyebrow ? '<p class="eyebrow rv">' + esc(s.eyebrow) + "</p>" : "") +
        '<h1 class="rv">' + esc(s.headline) + "</h1>" +
        (s.sub ? '<p class="sub rv">' + esc(s.sub) + "</p>" : "") +
        (c.profile && c.profile.catchphrase ? '<div class="catch rv">' + esc(c.profile.catchphrase) + "</div>" : "") +
        '</div><button class="cue" type="button" data-next aria-label="Scroll down" style="background:none;border:0"><span class="cue-line"><span class="cue-dot"></span></span></button></section>';
    },
    now: function (s) {
      return open(s) + head(s) + '<div class="rows rv">' +
        (s.items || []).map(function (it) {
          var inner = '<span class="k">' + esc(it.label) + '</span><span class="v">' + esc(it.text) + "</span>" +
            '<span class="tag">' + esc(it.badge) + "</span>";
          return link(it.url, "row" + ph(it), inner);
        }).join("") + "</div>" + close;
    },
    links: function (s) {
      var items = s.items || [];
      if (s.style === "grid") {
        return open(s) + head(s) + '<div class="tiles rv">' + items.map(function (it) {
          return link(it.url, "tile" + ph(it), '<span class="k">' + esc(it.label) + "</span><strong>" + esc(it.handle) + "</strong>" + (it.note ? "<small>" + esc(it.note) + "</small>" : ""));
        }).join("") + "</div>" + close;
      }
      return open(s) + head(s) + '<div class="rows rv">' + items.map(function (it) {
        var inner = '<span class="k">' + esc(it.label) + '</span><span class="v"><strong>' + esc(it.handle) + "</strong>" +
          (it.note ? "<small>" + esc(it.note) + "</small>" : "") + '</span><span class="go">' + (safeUrl(it.url) ? "↗" : "") + "</span>";
        return link(it.url, "row" + ph(it), inner);
      }).join("") + "</div>" + close;
    },
    list: function (s) {
      return open(s) + head(s) + (s.intro ? '<p class="intro rv">' + esc(s.intro) + "</p>" : "") +
        '<ul class="checklist rv">' + (s.items || []).map(function (it, i) {
          return '<li class="' + (it.done ? "done" : "") + ph(it) + '"><span class="num">' + pad(i + 1) + '</span><span class="box" role="img" aria-label="' + (it.done ? "Done" : "Not yet") + '"></span><span class="t">' + esc(it.text) + '</span><span class="n">' + esc(it.note) + "</span></li>";
        }).join("") + "</ul>" + close;
    },
    promos: function (s) {
      return open(s) + head(s) + '<div class="promos rv">' + (s.items || []).map(function (it) {
        var h = safeUrl(it.url) ? '<a class="b" href="' + esc(safeUrl(it.url)) + '" target="_blank" rel="noopener">' + esc(it.brand) + " ↗</a>" : '<span class="b">' + esc(it.brand) + "</span>";
        return '<div class="promo' + ph(it) + '">' + h +
          (it.code ? '<button class="code" type="button" data-copy="' + esc(it.code) + '">' + esc(it.code) + "</button>" : "") +
          (it.text ? "<p>" + esc(it.text) + "</p>" : "") + "</div>";
      }).join("") + "</div>" + close;
    },
    gallery: function (s) {
      var cols = Math.max(1, Math.min(4, parseInt(s.columns, 10) || 3));
      var items = s.items || [];
      var rid = "r-" + esc(s.id);
      return '<section class="sec orb" id="s-' + esc(s.id) + '" data-label="' + esc(s.title) + '" style="--ox:66%"><div class="wrap">' + head(s) + "</div>" +
        '<div class="rail-zone rv"><div class="rail" id="' + rid + '" data-cols="' + cols + '">' +
        items.map(function (it, i) {
          var img = safeUrl(it.image);
          var media = '<div class="media">' + (img ? '<img loading="lazy" src="' + esc(img) + '" alt="">' : '<span class="ph">NO IMAGE</span>') + "</div>";
          return link(it.url, "card" + ph(it), media + '<div class="body"><span class="no">' + pad(i + 1) + "</span><strong>" + esc(it.title) + "</strong>" + (it.subtitle ? "<small>" + esc(it.subtitle) + "</small>" : "") + "</div>");
        }).join("") + "</div></div>" +
        '<div class="wrap rv"><div class="rail-ui"><span class="rail-prog" data-prog="' + rid + '"><b>01</b> / ' + pad(items.length) + "</span>" +
        '<div class="rail-arrows"><button class="arrow" type="button" data-step="-1" data-rail="' + rid + '" aria-label="Previous">←</button><button class="arrow" type="button" data-step="1" data-rail="' + rid + '" aria-label="Next">→</button></div></div></div></section>';
    },
    stats: function (s) {
      return open(s) + head(s) + '<div class="statgrid rv">' + (s.items || []).map(function (it) {
        return '<div class="stat' + ph(it) + '"><div class="val">' + esc(it.value) + '</div><div class="lab">' + esc(it.label) + "</div></div>";
      }).join("") + "</div>" + (s.asOf ? '<p class="asof">' + esc(s.asOf) + "</p>" : "") + close;
    },
    services: function (s) {
      return open(s) + head(s) + '<div class="services rv">' + (s.items || []).map(function (it, i) {
        return '<div class="service' + ph(it) + '"><span class="no">' + pad(i + 1) + "</span><h3>" + esc(it.title) + "</h3><p>" + esc(it.text) + "</p></div>";
      }).join("") + "</div>" + close;
    },
    timeline: function (s) {
      return open(s) + head(s) + '<ol class="timeline rv">' + (s.items || []).map(function (it) {
        return '<li class="' + ph(it).trim() + '"><span class="when">' + esc(it.when) + "</span><div><h3>" + esc(it.title) + "</h3><p>" + esc(it.text) + "</p></div></li>";
      }).join("") + "</ol>" + close;
    },
    text: function (s) {
      return open(s) + head(s) + '<div class="prose rv' + ph(s) + '">' + esc(s.body) + "</div>" + close;
    },
    contact: function (s) {
      var cv = safeUrl(s.cvUrl);
      return open(s) + '<div class="contact rv' + ph(s) + '"><p class="eyebrow">' + esc(s.tag || TAGS.contact) + "</p>" +
        (s.title ? "<h2>" + esc(s.title) + "</h2>" : "") + (s.text ? "<p>" + esc(s.text) + "</p>" : "") + '<div class="actions">' +
        (s.email ? '<a class="btn fill" href="mailto:' + esc(s.email) + '">Email me</a><button class="btn" type="button" data-copy="' + esc(s.email) + '">Copy address</button>' : "") +
        (cv ? '<a class="btn" href="' + esc(cv) + '" target="_blank" rel="noopener">' + esc(s.cvLabel || "CV") + "</a>" : "") +
        (s.email ? '<span class="mail">' + esc(s.email) + "</span>" : "") + "</div></div>" + close;
    }
  };

  function applyTheme(c) {
    var st = c.settings || {};
    var root = document.documentElement;
    if (st.mode === "light" || st.mode === "dark") root.setAttribute("data-theme", st.mode);
    else root.removeAttribute("data-theme");
    root.setAttribute("data-corners", st.corners === "sharp" ? "sharp" : "soft");
    root.setAttribute("data-width", st.width === "wide" ? "wide" : "normal");
    if (/^#[0-9a-f]{3,8}$/i.test(st.accent || "")) root.style.setProperty("--accent", st.accent);
    var f = FONTS[st.displayFont] || FONTS.Pretendard;
    root.style.setProperty("--display", f[0]);
    root.style.setProperty("--display-case", f[1]);
    root.style.setProperty("--display-track", f[2]);
    root.style.setProperty("--display-weight", f[3]);
    document.body.classList.toggle("hide-ph", st.showPlaceholders === false);
    if (st.siteTitle) document.title = st.siteTitle;
    FONT_CSS.forEach(function (href, i) {
      if (document.getElementById("cp-font-" + i)) return;
      var l = document.createElement("link");
      l.id = "cp-font-" + i; l.rel = "stylesheet"; l.href = href;
      document.head.appendChild(l);
    });
  }

  function masthead(c, key) {
    var t = c.tracks || {};
    return '<header class="masthead-bar"><div class="inner"><a class="masthead" href="#">' + esc((c.settings && c.settings.masthead) || "CHANHO") + "</a>" +
      (key ? '<nav class="switch" aria-label="Choose page">' +
        '<a href="#me"' + (key === "me" ? ' aria-current="page"' : "") + ">" + esc((t.me || {}).label || "PERSONAL") + "</a>" +
        '<a href="#work"' + (key === "work" ? ' aria-current="page"' : "") + ">" + esc((t.work || {}).label || "WORK") + "</a></nav>" : "") +
      "</div></header>";
  }

  function gate(c) {
    var g = c.gate || {};
    return masthead(c, null) + '<div class="gate orb"><div class="wrap">' +
      '<p class="gate-eyebrow">' + esc(g.eyebrow) + '</p><h1 class="gate-title">' + esc(g.title) + "</h1>" +
      '<p class="gate-q">' + esc(g.question) + '</p><div class="choices">' +
      '<a class="choice primary" href="#me"><span class="no">01</span><b>' + esc(g.personalLabel) + '</b><span class="d">' + esc(g.personalSub) + '</span><span class="go">ENTER →</span></a>' +
      '<a class="choice" href="#work"><span class="no">02</span><b>' + esc(g.workLabel) + '</b><span class="d">' + esc(g.workSub) + '</span><span class="go">ENTER →</span></a>' +
      "</div>" + (c.profile && c.profile.location ? '<p class="gate-foot">' + esc(c.profile.location).toUpperCase() + "</p>" : "") +
      "</div></div>";
  }

  function track(c, key) {
    var t = (c.tracks || {})[key] || { sections: [] };
    var other = key === "me" ? "work" : "me";
    var name = (c.profile && c.profile.name) || "";
    var html = masthead(c, key) + "<main>";
    (t.sections || []).filter(function (s) { return s.visible !== false && R[s.type]; }).forEach(function (s) { html += R[s.type](s, c); });
    html += '</main><nav class="dots" aria-label="Sections"></nav><footer class="site"><div class="wrap"><span>© ' + new Date().getFullYear() + " " + esc(name).toUpperCase() + "</span>" +
      '<a href="#' + other + '">' + (other === "me" ? "JUST CURIOUS ABOUT ME? →" : "BRAND OR PARTNER? →") + "</a></div></footer>";
    return html;
  }

  /* ---------- behaviours ---------- */
  function toast(msg) {
    var t = document.createElement("div");
    t.className = "toast"; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 1800);
  }
  function railCards(r) { return Array.prototype.slice.call(r.querySelectorAll(".card")); }
  function railIndex(r) {
    var cards = railCards(r), best = 0, bd = Infinity, left = r.scrollLeft + parseFloat(getComputedStyle(r).paddingLeft || 0);
    cards.forEach(function (c, i) { var d = Math.abs(c.offsetLeft - left); if (d < bd) { bd = d; best = i; } });
    return best;
  }
  function bindRails(root) {
    root.querySelectorAll(".rail").forEach(function (r) {
      var prog = root.querySelector('[data-prog="' + r.id + '"]');
      var n = railCards(r).length;
      var upd = function () { if (prog) prog.innerHTML = "<b>" + pad(railIndex(r) + 1) + "</b> / " + pad(n); };
      var raf; r.addEventListener("scroll", function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(upd); }, { passive: true });
      var down = false, moved = false, sx = 0, sl = 0;
      r.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = r.scrollLeft; r.classList.add("grabbing"); });
      r.addEventListener("pointermove", function (e) { if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 5) moved = true; r.scrollLeft = sl - dx; });
      var up = function () { if (!down) return; down = false; r.classList.remove("grabbing"); };
      r.addEventListener("pointerup", up); r.addEventListener("pointerleave", up);
      r.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
      upd();
    });
  }
  var io = null;
  function observe(root) {
    if (io) io.disconnect();
    var dots = root.querySelector(".dots");
    var secs = root.querySelectorAll("main > section");
    if (dots) {
      dots.innerHTML = Array.prototype.map.call(secs, function (s) {
        return '<button class="dot" type="button" data-go="' + s.id + '" aria-label="' + esc(s.getAttribute("data-label")) + '"></button>';
      }).join("");
    }
    if (!("IntersectionObserver" in window)) return;
    root.classList.add("js-rv");
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.querySelectorAll(".rv").forEach(function (el) { el.classList.add("in"); });
          if (dots) dots.querySelectorAll(".dot").forEach(function (d) { d.classList.toggle("on", d.getAttribute("data-go") === en.target.id); });
        }
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -20% 0px" });
    secs.forEach(function (s) { io.observe(s); });
    /* anything already on screen is shown immediately */
    secs.forEach(function (s) { var b = s.getBoundingClientRect(); if (b.top < innerHeight) s.querySelectorAll(".rv").forEach(function (el) { el.classList.add("in"); }); });
  }

  function mount(root, content) {
    var state = { c: content };
    function draw() {
      var c = state.c;
      applyTheme(c);
      var h = (location.hash || "").replace("#", "");
      var isTrack = h === "me" || h === "work";
      root.innerHTML = isTrack ? track(c, h) : gate(c);
      if (isTrack) { bindRails(root); observe(root); }
    }
    if (!root.__cpBound) {
      root.__cpBound = true;
      window.addEventListener("hashchange", function () { draw(); window.scrollTo(0, 0); });
      root.addEventListener("click", function (e) {
        var b = e.target.closest("[data-copy],[data-step],[data-go],[data-next]");
        if (!b) return;
        if (b.hasAttribute("data-copy")) {
          var v = b.getAttribute("data-copy");
          try { navigator.clipboard.writeText(v).then(function () { toast("Copied: " + v); }, function () { toast(v); }); } catch (err) { toast(v); }
        } else if (b.hasAttribute("data-step")) {
          var r = document.getElementById(b.getAttribute("data-rail")), cards = railCards(r);
          var i = Math.min(Math.max(railIndex(r) + parseInt(b.getAttribute("data-step"), 10), 0), cards.length - 1);
          if (cards[i]) r.scrollTo({ left: cards[i].offsetLeft - parseFloat(getComputedStyle(r).paddingLeft || 0), behavior: "smooth" });
        } else if (b.hasAttribute("data-go")) {
          var t = document.getElementById(b.getAttribute("data-go")); if (t) t.scrollIntoView({ behavior: "smooth" });
        } else {
          var sec = b.closest("section"), nx = sec && sec.nextElementSibling; if (nx) nx.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
    root.__cpSet = function (c) { state.c = c; var y = window.scrollY; draw(); window.scrollTo(0, y); };
    draw();
  }

  window.ChanhoSite = { mount: mount, esc: esc, update: function (root, c) { if (root.__cpSet) root.__cpSet(c); else mount(root, c); } };
})();
