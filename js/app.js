const COINS = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    rankHint: "Maior market cap",
    blurb: "Moeda mais difundida e reconhecida do planeta.",
    tags: ["Reserva digital", "Liquidez global"],
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    rankHint: "2º maior market cap",
    blurb: "Base de contratos inteligentes, DeFi e NFTs.",
    tags: ["Smart contracts", "DeFi"],
  },
  {
    id: "tether",
    symbol: "USDT",
    name: "Tether",
    rankHint: "Stablecoin dominante",
    blurb: "Usada em praticamente todas as exchanges.",
    tags: ["Stablecoin", "Liquidez"],
  },
  {
    id: "binancecoin",
    symbol: "BNB",
    name: "BNB",
    rankHint: "Top 5 em market cap",
    blurb: "Forte difusão via Binance e ecossistema próprio.",
    tags: ["Exchange", "Utilidade"],
  },
  {
    id: "ripple",
    symbol: "XRP",
    name: "XRP",
    rankHint: "Top 10 em market cap",
    blurb: "Foco histórico em pagamentos internacionais.",
    tags: ["Pagamentos", "Cross-border"],
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    rankHint: "Top 10 em market cap",
    blurb: "Performance alta e ecossistema crescente.",
    tags: ["Alta performance", "L1"],
  },
  {
    id: "usd-coin",
    symbol: "USDC",
    name: "USD Coin",
    rankHint: "Top 10 em market cap",
    blurb: "Stablecoin regulada, com presença institucional forte.",
    tags: ["Stablecoin", "Institucional"],
  },
  {
    id: "dogecoin",
    symbol: "DOGE",
    name: "Dogecoin",
    rankHint: "Top 20 em market cap",
    blurb: "Difusão gigantesca por cultura pop e comunidade.",
    tags: ["Comunidade", "Pagamentos leves"],
  },
  {
    id: "zcash",
    symbol: "ZEC",
    name: "Zcash",
    rankHint: "Pioneira em privacidade",
    blurb: "Introduziu zk-SNARKs e influenciou todo o setor.",
    tags: ["Privacidade", "zk-SNARKs"],
  },
  {
    id: "cardano",
    symbol: "ADA",
    name: "Cardano",
    rankHint: "Top 15 em market cap",
    blurb: "Comunidade forte e presença constante no debate técnico.",
    tags: ["Pesquisa", "L1"],
  },
];

const FALLBACK = {
  bitcoin: { price: 395861, ch24: 0.2, ch7: 22.7, rank: 1, mcap: 7945715951550 },
  ethereum: { price: 12421.27, ch24: 1.9, ch7: 29.2, rank: 2, mcap: 1499204054416 },
  tether: { price: 5.14, ch24: 0.0, ch7: 0.1, rank: 3, mcap: 941550019473 },
  ripple: { price: 7.64, ch24: 9.1, ch7: 49.8, rank: 4, mcap: 479332318543 },
  binancecoin: { price: 3560.93, ch24: 2.5, ch7: 13.9, rank: 5, mcap: 474281123932 },
  "usd-coin": { price: 5.14, ch24: 0.0, ch7: 0.0, rank: 6, mcap: 377811281963 },
  solana: { price: 481.94, ch24: 3.7, ch7: 24.9, rank: 7, mcap: 281103479574 },
  dogecoin: { price: 0.466014, ch24: 8.9, ch7: 30.4, rank: 11, mcap: 72518213926 },
  zcash: { price: 4067.29, ch24: 23.2, ch7: 62.3, rank: 12, mcap: 68727576389 },
  cardano: { price: 1.15, ch24: 5.4, ch7: 26.7, rank: 18, mcap: 43273247361 },
};

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const COMPACT = new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 });

const state = {
  market: {},
  active: "bitcoin",
  range: "7d",
  chart: null,
};

function cls(n) {
  if (n > 0) return "up";
  if (n < 0) return "down";
  return "";
}

function pct(n) {
  if (n == null || Number.isNaN(n)) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

function mergeMarket(list) {
  const next = {};
  for (const coin of COINS) {
    const live = (list || []).find((item) => item.id === coin.id);
    const fb = FALLBACK[coin.id];
    next[coin.id] = {
      ...coin,
      price: live?.current_price ?? fb.price,
      ch24: live?.price_change_percentage_24h ?? fb.ch24,
      ch7: live?.price_change_percentage_7d_in_currency ?? fb.ch7,
      rank: live?.market_cap_rank ?? fb.rank,
      mcap: live?.market_cap ?? fb.mcap,
      spark: live?.sparkline_in_7d?.price || [],
    };
  }
  state.market = next;
}

function renderTicker() {
  const track = document.getElementById("tickerTrack");
  if (!track) return;
  const bits = COINS.map((coin) => {
    const row = state.market[coin.id];
    return `<span class="tick"><b class="sym">${row.symbol}</b> ${BRL.format(row.price)} <b class="${cls(row.ch24)}">${pct(row.ch24)}</b></span>`;
  }).join("");
  track.innerHTML = bits + bits;
}

function renderTable() {
  const body = document.getElementById("marketBody");
  if (!body) return;
  const rows = Object.values(state.market).sort((a, b) => a.rank - b.rank);
  body.innerHTML = rows
    .map(
      (row) => `
      <tr data-id="${row.id}">
        <td>${row.rank}</td>
        <td>
          <div class="coin-cell">
            <span class="badge">${row.symbol.slice(0, 3)}</span>
            ${row.name}
          </div>
        </td>
        <td>${row.symbol}</td>
        <td class="right">${BRL.format(row.price)}</td>
        <td class="right ${cls(row.ch24)}">${pct(row.ch24)}</td>
        <td class="right ${cls(row.ch7)}">${pct(row.ch7)}</td>
        <td class="right">${COMPACT.format(row.mcap)}</td>
      </tr>`
    )
    .join("");

  body.querySelectorAll("tr").forEach((tr) => {
    tr.classList.toggle("on", tr.dataset.id === state.active);
    tr.addEventListener("click", () => {
      state.active = tr.dataset.id;
      body.querySelectorAll("tr").forEach((row) => row.classList.toggle("on", row.dataset.id === state.active));
      updateHeroMini();
      drawChart();
    });
  });
}

function renderCards() {
  const grid = document.getElementById("coinGrid");
  if (!grid) return;
  grid.innerHTML = COINS.map((coin) => {
    const row = state.market[coin.id];
    const path = sparkPath(row.spark, 120, 42, row.ch7 >= 0);
    return `
      <article class="panel coin reveal">
        <div class="coin-top">
          <div>
            <div class="kicker">${row.rankHint}</div>
            <h3>${row.name} <small style="color:var(--gold-400);font-size:14px">${row.symbol}</small></h3>
            <div class="meta">Rank #${row.rank} · 24h <span class="${cls(row.ch24)}">${pct(row.ch24)}</span></div>
          </div>
          <svg class="spark" viewBox="0 0 120 42" aria-hidden="true">${path}</svg>
        </div>
        <div class="tags">${row.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
        <p class="meta">${row.blurb}</p>
        <strong>${BRL.format(row.price)}</strong>
      </article>`;
  }).join("");
}

function sparkPath(values, w, h, up) {
  if (!values || values.length < 2) {
    return `<path d="M4 28 C 30 8, 60 34, 116 16" fill="none" stroke="${up ? "#3dd68c" : "#ff6b7a"}" stroke-width="2"/>`;
  }
  const sample = values.filter((_, i) => i % 4 === 0);
  const min = Math.min(...sample);
  const max = Math.max(...sample);
  const span = max - min || 1;
  const pts = sample.map((v, i) => {
    const x = (i / (sample.length - 1)) * (w - 8) + 4;
    const y = h - 6 - ((v - min) / span) * (h - 12);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const color = up ? "#3dd68c" : "#ff6b7a";
  return `<path d="M${pts.join(" L")}" fill="none" stroke="${color}" stroke-width="2"/>`;
}

function updateHeroMini() {
  const coin = state.market[state.active];
  const box = document.getElementById("heroMini");
  if (!coin || !box) return;
  box.innerHTML = `
    <div>
      <div class="kicker">${coin.name}</div>
      <strong style="font-size:28px">${BRL.format(coin.price)}</strong>
    </div>
    <div class="${cls(coin.ch24)}" style="font-weight:800">${pct(coin.ch24)} 24h</div>`;
}

function drawChart() {
  const canvas = document.getElementById("priceChart");
  if (!canvas || typeof Chart === "undefined") return;
  const coin = state.market[state.active];
  if (!coin) return;
  const labels = [];
  const data = [];
  const src = coin.spark.length ? coin.spark : syntheticSeries(coin.price, coin.ch7);
  const take = state.range === "24h" ? src.slice(-24) : src;
  take.forEach((v, i) => {
    labels.push(i);
    data.push(v);
  });
  if (state.chart) state.chart.destroy();
  state.chart = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: `${coin.symbol} · BRL`,
          data,
          borderColor: "#d4af37",
          backgroundColor: "rgba(212,175,55,0.12)",
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => BRL.format(ctx.parsed.y),
          },
        },
      },
      scales: {
        x: { display: false },
        y: {
          ticks: { color: "#9aa6bb", callback: (v) => COMPACT.format(v) },
          grid: { color: "rgba(212,175,55,0.08)" },
        },
      },
    },
  });
  const title = document.getElementById("chartTitle");
  if (title) title.textContent = `${coin.name} (${coin.symbol}) · visão ${state.range}`;
}

function syntheticSeries(price, ch7) {
  const start = price / (1 + (ch7 || 0) / 100);
  return Array.from({ length: 48 }, (_, i) => {
    const t = i / 47;
    const wave = Math.sin(i / 3.4) * price * 0.012;
    return start + (price - start) * t + wave;
  });
}

async function loadMarket() {
  const ids = COINS.map((c) => c.id).join(",");
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&ids=${ids}&order=market_cap_desc&sparkline=true&price_change_percentage=24h,7d`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    mergeMarket(await res.json());
  } catch (err) {
    mergeMarket([]);
  }
  renderTicker();
  renderTable();
  renderCards();
  updateHeroMini();
  drawChart();
  const stamp = document.getElementById("updatedAt");
  if (stamp) stamp.textContent = `Atualizado às ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}


function prefersReduce() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function closeMenu() {
  const menu = document.getElementById("menu");
  const burger = document.getElementById("burger");
  const scrim = document.getElementById("navScrim");
  menu?.classList.remove("open");
  burger?.setAttribute("aria-expanded", "false");
  if (burger) burger.setAttribute("aria-label", "Abrir menu");
  document.body.classList.remove("nav-open");
  if (scrim) scrim.hidden = true;
  document.querySelector(".has-sub")?.classList.remove("open");
  document.getElementById("carteiraTrigger")?.setAttribute("aria-expanded", "false");
}

function openMenu() {
  const menu = document.getElementById("menu");
  const burger = document.getElementById("burger");
  const scrim = document.getElementById("navScrim");
  menu?.classList.add("open");
  burger?.setAttribute("aria-expanded", "true");
  if (burger) burger.setAttribute("aria-label", "Fechar menu");
  document.body.classList.add("nav-open");
  if (scrim) scrim.hidden = false;
}

function bindUi() {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("menu");
  const scrim = document.getElementById("navScrim");
  const nav = document.getElementById("siteNav");
  const subWrap = document.querySelector(".has-sub");
  const trigger = document.getElementById("carteiraTrigger");

  burger?.addEventListener("click", () => {
    if (menu?.classList.contains("open")) closeMenu();
    else openMenu();
  });
  scrim?.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") closeMenu();
  });
  menu?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", (ev) => {
      if (window.matchMedia("(max-width: 960px)").matches && a.id === "carteiraTrigger") {
        return;
      }
      closeMenu();
    });
  });
  trigger?.addEventListener("click", (ev) => {
    if (window.matchMedia("(max-width: 960px)").matches) {
      ev.preventDefault();
      const open = subWrap.classList.toggle("open");
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    }
  });

  document.querySelectorAll("[data-range]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-range]").forEach((b) => b.classList.remove("on"));
      btn.classList.add("on");
      state.range = btn.dataset.range;
      drawChart();
    });
  });
  document.getElementById("contactForm")?.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const note = document.getElementById("formNote");
    if (note) note.textContent = "Recebido neste navegador. Para falar de verdade, use o WhatsApp ou o e-mail — o formulário ainda não envia mensagem sozinho.";
    ev.target.reset();
  });

  document.querySelectorAll(".layer-hit").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".layer-hit").forEach((b) => b.classList.remove("on"));
      btn.classList.add("on");
      const el = document.getElementById(btn.dataset.target);
      el?.scrollIntoView({ behavior: prefersReduce() ? "auto" : "smooth", block: "center" });
      document.querySelectorAll("[data-layer]").forEach((c) => c.classList.remove("on"));
      el?.classList.add("on");
    });
  });

  const onScroll = () => {
    if (nav) nav.classList.toggle("compact", window.scrollY > 24);
    markNav();
    fillRail();
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  revealOnView();
}

function markNav() {
  if (!document.getElementById("carteira")) return;
  const ids = ["inicio", "carteira", "metodo", "sobre", "contato"];
  let current = "inicio";
  const y = window.scrollY + 90;
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= y) current = id;
  }
  document.querySelectorAll(".menu [data-nav]").forEach((a) => {
    a.classList.toggle("active", a.dataset.nav === current);
  });
}

function fillRail() {
  const fill = document.getElementById("layerFill");
  const layers = [...document.querySelectorAll("[data-layer]")];
  if (!fill || !layers.length) return;
  const mid = window.innerHeight * 0.45;
  let idx = 0;
  layers.forEach((el, i) => {
    if (el.getBoundingClientRect().top < mid) idx = i;
  });
  fill.style.width = `${((idx + 1) / layers.length) * 100}%`;
  layers.forEach((el, i) => el.classList.toggle("on", i === idx));
  document.querySelectorAll(".layer-hit").forEach((btn, i) => btn.classList.toggle("on", i === idx));
}

function revealOnView() {
  const nodes = document.querySelectorAll(".reveal");
  if (prefersReduce()) {
    nodes.forEach((n) => n.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  nodes.forEach((n, i) => {
    n.style.transitionDelay = `${Math.min(i % 6, 5) * 0.06}s`;
    io.observe(n);
  });
}

function neuralNet() {
  const canvas = document.getElementById("neural");
  if (!canvas || prefersReduce()) return;
  const ctx = canvas.getContext("2d");
  const dots = [];
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);
  const n = Math.min(22, Math.floor(window.innerWidth / 70));
  for (let i = 0; i < n; i += 1) {
    dots.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
    });
  }
  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const d of dots) {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
      if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
      ctx.fillStyle = "rgba(212,175,55,0.35)";
      ctx.beginPath();
      ctx.arc(d.x, d.y, 1.1, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let i = 0; i < dots.length; i += 1) {
      for (let j = i + 1; j < dots.length; j += 1) {
        const a = dots[i];
        const b = dots[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 140) {
          ctx.strokeStyle = `rgba(212,175,55,${(1 - dist / 140) * 0.1})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  }
  tick();
}

bindUi();
neuralNet();
mergeMarket([]);
renderTicker();
renderTable();
renderCards();
updateHeroMini();
loadMarket();
