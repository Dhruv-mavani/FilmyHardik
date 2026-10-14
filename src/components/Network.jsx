import { useEffect, useRef } from 'react';
import { NET_BRANDS, NET_PLATFORMS, TICKER_BRANDS } from '../data';
import { prefersReducedMotion } from '../hooks';

const INK = '#0A0A08';
const YEL = '#FFD60A';
const PAPER = '#FFF9E0';
const TAU = 6.2832;

// Vibration API (Android/Chrome). iOS Safari has no vibrate(), but toggling a
// hidden `switch` checkbox fires the system haptic on iOS 18+.
let iosSwitch = null;
function haptic(pattern) {
  if (prefersReducedMotion()) return;
  try {
    if (navigator.vibrate) { navigator.vibrate(pattern); return; }
    if (typeof document === 'undefined') return;
    if (!iosSwitch) {
      const label = document.createElement('label');
      label.setAttribute('aria-hidden', 'true');
      label.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.setAttribute('switch', '');
      label.appendChild(input);
      document.body.appendChild(label);
      iosSwitch = label;
    }
    iosSwitch.click();
  } catch { /* haptics are best-effort */ }
}

const BRAND_LOGOS = Object.fromEntries(TICKER_BRANDS.map((b) => [b.name, b.logo]));

// max logo box [w, h] at desktop size, by node importance
function logoBox(n) {
  if (n.type === 'p') return [72, 24];
  if (n.r >= 18) return [78, 30];
  if (n.r >= 14) return [64, 26];
  if (n.r >= 10) return [54, 22];
  if (n.r >= 7) return [46, 18];
  return [42, 16];
}

function buildNodes() {
  const nodes = NET_PLATFORMS.map((p, i) => ({
    type: 'p', short: p[0], label: p[1], sub: p[2], logoSrc: p[3], r: 19, a0: i * Math.PI / 2 + Math.PI / 4,
    ring: 0.36, ring0: 0.36, dir: 1, spd: 0.00009, ph: i * 1.7, flash: 0, x: 0, y: 0, near: 0, d: 9999, R: 19,
  }));
  NET_BRANDS.forEach((b, i) => {
    const inA = i < 8;
    const k = inA ? i : i - 8;
    const cnt = inA ? 8 : 11;
    nodes.push({
      type: 'b', label: b[0], r: b[1], sub: b[2], logoSrc: BRAND_LOGOS[b[0]], a0: k / cnt * Math.PI * 2 + (inA ? 0.3 : 0),
      ring: inA ? 0.64 : 0.9, ring0: inA ? 0.64 : 0.9, dir: inA ? -1 : 1, spd: inA ? 0.00007 : 0.00005, ph: i * 0.9,
      flash: 0, x: 0, y: 0, near: 0, d: 9999, R: b[1],
    });
  });
  return nodes;
}

export default function Network() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    const reduce = prefersReducedMotion();

    let W = 0, H = 0, dpr = 1, cx = 0, cy = 0, R = 100, sc = 1;
    let pressed = false, hovNode = null, lastBuzz = 0, k = 1;
    let mx = -9999, my = -9999, clock = 0, last = 0, acc = 0, running = false, raf = 0;
    const center = { x: 0, y: 0, r: 30, flash: 0 };
    const nodes = buildNodes();
    const pulses = [];

    // Fit each logo into its box and size the white pill around it.
    // Logos that would render too small fall back to the plain dot.
    function layout() {
      for (const n of nodes) {
        const img = n.img;
        if (!img || !img.naturalWidth) { n.logo = false; continue; }
        const [bw, bh] = logoBox(n);
        const aspect = img.naturalWidth / img.naturalHeight;
        const maxW = bw * k * (aspect > 3 ? 1.4 : 1); // wordmarks get extra width
        let lw = Math.min(maxW, bh * k * aspect);
        let lh = lw / aspect;
        if (lh > bh * k) { lh = bh * k; lw = lh * aspect; }
        // very wide wordmarks (Mamaearth, Garnier) would shrink to a sliver on phones: keep them legible
        if (lh < 11 && aspect > 3) { lh = 11; lw = Math.min(lh * aspect, 82); lh = lw / aspect; }
        n.logo = lh >= 9;
        if (!n.logo) { n.R = n.r * sc; continue; }
        n.lw = lw; n.lh = lh;
        n.pw = lw + 14 * k; n.ph = lh + 10 * k;
        n.R = Math.max(n.pw, n.ph) / 2;
      }
    }

    nodes.forEach((n) => {
      if (!n.logoSrc) return;
      const img = new Image();
      img.onload = () => { n.img = img; layout(); if (!running) { place(clock); draw(clock); } };
      img.src = n.logoSrc;
    });

    function size() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = w; H = h;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cx = W / 2; cy = H / 2; R = Math.min(W, H) / 2 - 26;
      sc = Math.max(0.62, Math.min(1.15, R / 300));
      center.r = Math.max(24, R * 0.115);
      const small = R < 170;
      nodes.forEach((n) => {
        n.R = n.r * sc;
        n.ring = n.type === 'p' ? (small ? 0.5 : 0.36) : n.ring0 + (small && n.ring0 < 0.7 ? 0.1 : 0);
      });
      k = Math.max(0.6, Math.min(1.25, R / 230));
      layout();
      if (!running) { place(clock); draw(clock); }
    }

    function place(t) {
      center.x = cx; center.y = cy;
      for (const n of nodes) {
        const ang = n.a0 + n.dir * t * n.spd;
        const rad = n.ring * R * (1 + 0.035 * Math.sin(t / 900 + n.ph));
        const bx = cx + Math.cos(ang) * rad, by = cy + Math.sin(ang) * rad;
        const dx = mx - bx, dy = my - by, d = Math.sqrt(dx * dx + dy * dy);
        n.d = d;
        n.near = d < 150 ? 1 - d / 150 : 0;
        const pull = n.near * 16;
        n.x = bx + (d > 1 ? dx / d * pull : 0);
        n.y = by + (d > 1 ? dy / d * pull : 0);
      }
      // rectangle push-apart + edge clamp (three passes) so logo pills neither overlap nor get clipped
      for (let pass = 0; pass < 3; pass++) {
        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i];
          if (!a.logo) continue;
          for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j];
            if (!b.logo) continue;
            const dx = b.x - a.x, dy = b.y - a.y;
            const ox = (a.pw + b.pw) / 2 + 3 - Math.abs(dx);
            const oy = (a.ph + b.ph) / 2 + 3 - Math.abs(dy);
            if (ox <= 0 || oy <= 0) continue;
            if (oy < ox) { // separate along the shorter overlap
              const m = (dy >= 0 ? 1 : -1) * oy / 2;
              a.y -= m; b.y += m;
            } else {
              const m = (dx >= 0 ? 1 : -1) * ox / 2;
              a.x -= m; b.x += m;
            }
          }
        }
        for (const n of nodes) {
          if (!n.logo) continue;
          n.x = Math.max(n.pw / 2 + 4, Math.min(W - n.pw / 2 - 4, n.x));
          n.y = Math.max(n.ph / 2 + 4, Math.min(H - n.ph / 2 - 4, n.y));
        }
      }
    }

    function nearestBrand(from) {
      const arr = nodes
        .filter((n) => n.type === 'b')
        .map((n) => ({ n, d: (n.x - from.x) ** 2 + (n.y - from.y) ** 2 }))
        .sort((a, b) => a.d - b.d);
      return arr.length ? arr[Math.floor(Math.random() * Math.min(3, arr.length))].n : null;
    }

    function spawn() {
      const ps = nodes.filter((n) => n.type === 'p');
      const p = ps[Math.floor(Math.random() * ps.length)];
      pulses.push({ a: center, b: p, t: 0, s: 0.0009 + Math.random() * 0.0005 });
    }

    function step(dt) {
      acc += dt;
      if (acc > 520 && pulses.length < 18) { acc = 0; spawn(); }
      for (let k = pulses.length - 1; k >= 0; k--) {
        const u = pulses[k];
        u.t += u.s * dt;
        if (u.t >= 1) {
          u.b.flash = 1;
          if (u.b.type === 'p') {
            const nb = nearestBrand(u.b);
            if (nb) pulses.push({ a: u.b, b: nb, t: 0, s: 0.0008 });
          }
          pulses.splice(k, 1);
        }
      }
      for (const n of nodes) if (n.flash > 0) n.flash = Math.max(0, n.flash - dt / 700);
    }

    function rrect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    function label(txt, x, y, size, color) {
      x = Math.max(46, Math.min(W - 46, x));
      ctx.font = `700 ${size}px "DM Sans",sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round'; ctx.lineWidth = 4; ctx.strokeStyle = INK;
      ctx.strokeText(txt, x, y);
      ctx.fillStyle = color; ctx.fillText(txt, x, y);
    }

    function drawPill(a, isH) {
      const w = a.pw, h = a.ph, x = a.x - w / 2, y = a.y - h / 2;
      ctx.shadowColor = YEL; ctx.shadowBlur = 8 + a.flash * 26 + a.near * 12;
      ctx.fillStyle = '#fff';
      rrect(x, y, w, h, Math.min(h / 2, 12 * k)); ctx.fill(); ctx.shadowBlur = 0;
      ctx.lineWidth = isH ? 3 : 2;
      ctx.strokeStyle = isH ? YEL : a.type === 'p' ? 'rgba(255,214,10,.9)' : 'rgba(255,214,10,.5)';
      ctx.stroke();
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(a.img, a.x - a.lw / 2, a.y - a.lh / 2, a.lw, a.lh);
    }

    function draw(t) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const lim = R * 0.52;
      let i, j, a, b, dx, dy, d, al;

      ctx.lineWidth = 1;
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        for (j = i + 1; j < nodes.length; j++) {
          b = nodes[j]; dx = a.x - b.x; dy = a.y - b.y; d = Math.sqrt(dx * dx + dy * dy);
          if (d < lim) {
            al = (1 - d / lim) * 0.22 + (a.near + b.near) * 0.2;
            ctx.strokeStyle = `rgba(255,214,10,${al.toFixed(3)})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        if (a.type === 'p') { ctx.strokeStyle = 'rgba(255,214,10,.7)'; ctx.lineWidth = 2; }
        else if (a.ring < 0.7) { ctx.strokeStyle = 'rgba(255,249,224,.07)'; ctx.lineWidth = 1; }
        else continue;
        ctx.beginPath(); ctx.moveTo(center.x, center.y); ctx.lineTo(a.x, a.y); ctx.stroke();
      }
      for (i = 0; i < 3; i++) {
        const ph = ((t / 2600) + i / 3) % 1;
        ctx.strokeStyle = `rgba(255,214,10,${((1 - ph) * 0.35).toFixed(3)})`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(center.x, center.y, center.r + ph * R * 0.2, 0, TAU); ctx.stroke();
      }
      for (i = 0; i < pulses.length; i++) {
        const u = pulses[i];
        const px = u.a.x + (u.b.x - u.a.x) * u.t, py = u.a.y + (u.b.y - u.a.y) * u.t;
        ctx.shadowColor = YEL; ctx.shadowBlur = 14; ctx.fillStyle = PAPER;
        ctx.beginPath(); ctx.arc(px, py, 3.2, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
      }

      const hov = findHover();

      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        const isH = a === hov;
        if (a.logo) { drawPill(a, isH); continue; }
        if (a.type === 'b') {
          ctx.shadowColor = YEL; ctx.shadowBlur = 10 + a.flash * 26 + a.near * 14;
          ctx.fillStyle = isH ? PAPER : YEL;
          ctx.beginPath(); ctx.arc(a.x, a.y, a.R + a.flash * 3, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
        } else {
          ctx.shadowColor = YEL; ctx.shadowBlur = 8 + a.flash * 26 + a.near * 10;
          ctx.fillStyle = INK; ctx.strokeStyle = isH ? YEL : PAPER; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(a.x, a.y, a.R + a.flash * 3, 0, TAU); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
          ctx.fillStyle = PAPER; ctx.font = `500 ${Math.round(11 * Math.max(0.8, sc))}px "DM Mono",monospace`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(a.short, a.x, a.y + 1);
        }
      }

      ctx.shadowColor = YEL; ctx.shadowBlur = 30; ctx.fillStyle = YEL;
      ctx.beginPath(); ctx.arc(center.x, center.y, center.r, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
      ctx.fillStyle = INK; ctx.font = `400 ${Math.round(center.r * 0.62)}px "Bowlby One",Impact,sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('FH', center.x, center.y + 1);

      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        if (a.logo) continue;
        if (a.type === 'p') label(a.label, a.x, a.y + a.R + 14, Math.round(12 * Math.max(0.85, sc)), PAPER);
        else if (a.r >= 14) label(a.label, a.x, a.y + a.R + 13, Math.round(12 * Math.max(0.85, sc)), YEL);
      }

      if (hov) {
        const t1 = hov.label, t2 = hov.sub;
        ctx.font = '700 14px "DM Sans",sans-serif'; const w1 = ctx.measureText(t1).width;
        ctx.font = '500 12px "DM Mono",monospace'; const w2 = ctx.measureText(t2).width;
        const bw = Math.max(w1, w2) + 26, bh = 48;
        const bx = Math.min(W - bw - 6, Math.max(6, hov.x - bw / 2));
        let by = hov.y - hov.R - bh - 12;
        if (by < 6) by = hov.y + hov.R + 12;
        ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 14; ctx.fillStyle = YEL;
        rrect(bx, by, bw, bh, 12); ctx.fill(); ctx.shadowBlur = 0;
        ctx.fillStyle = INK; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.font = '700 14px "DM Sans",sans-serif'; ctx.fillText(t1, bx + 13, by + 17);
        ctx.font = '500 12px "DM Mono",monospace'; ctx.fillText(t2, bx + 13, by + 34);
      }
    }

    function findHover() {
      let hov = null, hd = 1e9;
      for (const a of nodes) if (a.d < a.R + 22 && a.d < hd) { hd = a.d; hov = a; }
      return hov;
    }

    function buzz() {
      const now = performance.now();
      const hov = findHover();
      if (hov !== hovNode) {
        hovNode = hov;
        if (hov && now - lastBuzz > 60) { lastBuzz = now; haptic(hov.type === 'p' ? 35 : 18); }
      } else if (pressed && mx > -9000 && now - lastBuzz > 110) {
        lastBuzz = now; haptic(12); // soft ticks while holding and swiping
      }
    }

    function frame(ts) {
      if (!running) return;
      const dt = Math.min(50, ts - last);
      last = ts; clock += dt;
      place(clock); step(dt); draw(clock);
      raf = requestAnimationFrame(frame);
    }
    function start() { if (running || reduce) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); }

    function setPtr(e) {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
      place(clock);
      buzz();
      if (!running) draw(clock);
    }
    function leave() { mx = -9999; my = -9999; if (!running) { place(clock); draw(clock); } }
    function down(e) { pressed = true; setPtr(e); lastBuzz = performance.now(); haptic(28); }
    function up() { pressed = false; }
    function out() { pressed = false; hovNode = null; leave(); }
    canvas.addEventListener('pointermove', setPtr);
    canvas.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    canvas.addEventListener('pointerleave', out);

    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    size();
    if (reduce) { place(0); draw(0); }
    const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? start() : stop())), { threshold: 0 });
    io.observe(canvas);
    if (reduce && document.fonts?.ready) document.fonts.ready.then(() => draw(0));

    return () => {
      stop(); ro.disconnect(); io.disconnect();
      canvas.removeEventListener('pointermove', setPtr);
      canvas.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      canvas.removeEventListener('pointerleave', out);
    };
  }, []);

  return (
    <canvas
      id="net"
      ref={canvasRef}
      role="img"
      aria-label="Animated network connecting Filmyhardik to Instagram, YouTube, Snapchat, Facebook and the brands he has worked with"
    />
  );
}
