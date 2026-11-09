"use client";

/*
 * GlowTree — the hero's living tree.
 *
 * A canvas-rendered blossom tree: a thick dark trunk with root flares and
 * bark ticks, gnarled boughs, and a crown that reads as real masses of
 * rose/magenta blossom — layered cloud depths behind the branches, dense
 * glowing clusters on top. Petals fall continuously (gusts shake loose
 * whole bursts), fireflies drift through the crown, a soft pulse of light
 * travels from trunk to twig tips, and the whole canopy sways and bends
 * in the wind. The crown reflects faintly in the ground fog.
 *
 * Structure is generated once per resize with a seeded RNG (deterministic
 * silhouette). Rendering recurses through the limb hierarchy each frame:
 * wind rotates whole branches and flexes their curvature — twigs whip more
 * than the trunk. Blossoms are pre-rendered sprites drawn additively;
 * petals and fireflies are pooled particles.
 *
 * Accessibility/perf: static frame under prefers-reduced-motion, paused when
 * the hero leaves the viewport or the tab is hidden, DPR capped at 2, all
 * listeners/observers cleaned up on unmount.
 */

import { useEffect, useRef } from "react";

/* ---------- palette (rose/magenta only — no amber anywhere) ---------- */
const TRUNK_BASE_RGB = [18, 5, 13] as const;
const TRUNK_TOP_RGB = [74, 22, 52] as const;
const BOUGH_DEEP = "#2a0d22";
const BOUGH_MID = "#331028";
const BOUGH_FINE = "#3a1330";
const RIM_GLOW = "rgba(255, 110, 165, 0.14)";
const BARK_TICK = "rgba(0, 0, 0, 0.5)";

/* blossom sprite hues: deep interior → hot → soft → pale highlight */
const BLOSSOM_HUES = ["178, 18, 79", "255, 45, 120", "255, 92, 154", "255, 143, 184", "255, 194, 221"];
const PETAL_HUES = ["255, 127, 176", "255, 92, 154", "255, 45, 120"];

/* ---------- seeded RNG so the silhouette is stable across loads ---------- */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type LeafAnchor = { t: number; r: number; sprite: number; size: number; flick: number; delay: number; d: number };
type Limb = {
  len: number;
  w0: number;
  w1: number;
  curve: number;
  angOff: number; // fan offset relative to the parent's tip direction
  depth: number;
  birth: number;
  growDur: number;
  phase: number;
  children: Limb[];
  leaves: LeafAnchor[];
};

type Vec = { x: number; y: number };
type CloudAnchor = { x: number; y: number; w: number; phase: number; sprite: number };

interface TreeData {
  root: Limb;
  roots: Limb[]; // root flares at the base, drawn like short boughs
  canopy: Vec[]; // rest positions of blossom anchors, tree units — petal/firefly source
  clouds: CloudAnchor[]; // crown cloud anchors (mass-of-blossom depths)
  maxDist: number; // longest trunk→tip path, for the travelling light pulse
  bounds: { minX: number; maxX: number; minY: number; maxY: number }; // rest bbox, tree units
}

const GROW_DUR_S = 0.3; // per-limb growth duration
const MAX_DEPTH_DESKTOP = 6;
const MAX_DEPTH_MOBILE = 4;

function buildLimb(
  rnd: () => number,
  len: number,
  w0: number,
  depth: number,
  maxDepth: number,
  birth: number,
  childFactor: number,
): Limb {
  const growDur = depth === 0 ? 0.5 : GROW_DUR_S;
  const limb: Limb = {
    len,
    w0,
    w1: w0 * (0.55 + rnd() * 0.15),
    curve: depth === 0 ? (rnd() - 0.5) * 0.5 + 0.1 : (rnd() - 0.5) * (0.3 + depth * 0.12),
    angOff: 0,
    depth,
    birth,
    growDur,
    phase: rnd() * Math.PI * 2,
    children: [],
    leaves: [],
  };

  if (depth >= maxDepth - 1 || len < 0.05) {
    /* outer boughs carry the crown: 2-3 tight blossom clusters per bough,
       gathered around cluster centers so the canopy reads as dense clouds */
    const count = depth >= maxDepth - 1 ? 16 + Math.floor(rnd() * 10) : 3;
    const centers = [0.3 + rnd() * 0.4, 0.6 + rnd() * 0.35, 0.85 + rnd() * 0.15];
    for (let i = 0; i < count; i++) {
      const c = centers[i % centers.length];
      limb.leaves.push({
        t: Math.min(1.05, Math.max(0, c + (rnd() + rnd() - 1) * 0.24)),
        r: (rnd() - 0.5) * 0.85,
        sprite: Math.floor(rnd() * BLOSSOM_HUES.length),
        size: 9 + rnd() * 16,
        flick: 0.5 + rnd() * 1.4,
        delay: rnd() * 0.35,
        d: 0, // filled in by the geometry walk
      });
    }
    /* bright cluster at the tip */
    limb.leaves.push({
      t: 1,
      r: 0,
      sprite: 1 + Math.floor(rnd() * 3),
      size: 18 + rnd() * 22,
      flick: 0.7,
      delay: rnd() * 0.2,
      d: 0,
    });
    return limb;
  }

  /* branching: generous in the outer half, capped at the finest levels so the
     extra depth reads as density, not geometry soup */
  const kids =
    depth === 0
      ? 4 + (rnd() < 0.6 ? 1 : 0)
      : depth <= 2
        ? rnd() < 0.75
          ? 3
          : 2
        : rnd() < 0.6
          ? 2
          : 3;
  /* fan spread: child 0 continues the bough, the rest swing out to the sides.
     This keeps the crown a wide dome instead of a vertical stack. */
  const fan = 0.62 + depth * 0.2;
  for (let i = 0; i < kids; i++) {
    const childLen = len * childFactor * (0.78 + rnd() * 0.42);
    const child = buildLimb(rnd, childLen, w0 * 0.52, depth + 1, maxDepth, birth + growDur * 0.62 + i * 0.04, childFactor);
    if (i === 0) {
      child.angOff = (rnd() - 0.5) * 0.44;
    } else {
      const side = i % 2 === 1 ? -1 : 1;
      child.angOff = side * fan * (0.45 + 0.55 * rnd()) - 0.08;
    }
    limb.children.push(child);
    limb.leaves.push({
      t: Math.min(0.96, 0.5 + (i / kids) * 0.45 + (rnd() - 0.5) * 0.1),
      r: (rnd() - 0.5) * 0.14,
      sprite: 2 + Math.floor(rnd() * 2),
      size: 4 + rnd() * 6,
      flick: 0.8 + rnd() * 1.2,
      delay: rnd() * 0.4,
      d: 0,
    });
  }
  return limb;
}

function buildRootFlare(rnd: () => number, angle: number, w0: number): Limb {
  return {
    len: 0.07 + rnd() * 0.07,
    w0: w0 * 0.55,
    w1: w0 * 0.16,
    curve: (rnd() - 0.5) * 0.3 + (angle > Math.PI ? 0.18 : -0.18),
    angOff: 0,
    depth: 0,
    birth: 0,
    growDur: 0.4,
    phase: rnd() * Math.PI * 2,
    children: [],
    leaves: [],
  };
}

function generateTree(mobile: boolean): TreeData {
  const rnd = mulberry32(mobile ? 20261109 : 1123581321);
  const maxDepth = mobile ? MAX_DEPTH_MOBILE : MAX_DEPTH_DESKTOP;
  const childFactor = mobile ? 0.55 : 0.66;

  const trunkW = mobile ? 0.075 : 0.062;
  const root = buildLimb(rnd, 1.0, trunkW, 0, maxDepth, 0, childFactor);

  /* root flares: buttress roots spreading into the ground on both sides */
  const roots: Limb[] = [];
  const rootAngles = mobile ? [Math.PI * 0.78, Math.PI * 1.22] : [Math.PI * 0.68, Math.PI * 0.84, Math.PI * 1.18, Math.PI * 1.32];
  for (const angle of rootAngles) {
    const flare = buildRootFlare(rnd, angle, trunkW);
    flare.angOff = angle; // drawLimb receives this as its base direction
    roots.push(flare);
  }

  /* walk rest geometry once: collect blossom anchors + cloud anchors + bbox,
     so the renderer can derive a scale that always fits the stage */
  const canopy: Vec[] = [];
  const clouds: CloudAnchor[] = [];
  const bounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  let maxDist = 0.0001;
  const walk = (limb: Limb, x: number, y: number, angle: number, dist: number) => {
    const steps = 4;
    let cx = x;
    let cy = y;
    let a = angle;
    for (let i = 1; i <= steps; i++) {
      a += limb.curve / steps;
      cx += Math.cos(a) * (limb.len / steps);
      cy += Math.sin(a) * (limb.len / steps);
    }
    bounds.minX = Math.min(bounds.minX, cx, x);
    bounds.maxX = Math.max(bounds.maxX, cx, x);
    bounds.minY = Math.min(bounds.minY, cy, y);
    bounds.maxY = Math.max(bounds.maxY, cy, y);
    const limbEnd = dist + limb.len;
    if (limbEnd > maxDist) maxDist = limbEnd;
    for (const leaf of limb.leaves) {
      const t = Math.max(0, Math.min(1, leaf.t));
      const lx = x + (cx - x) * t + Math.cos(a + Math.PI / 2) * leaf.r;
      const ly = y + (cy - y) * t + Math.sin(a + Math.PI / 2) * leaf.r;
      leaf.d = dist + limb.len * t;
      canopy.push({ x: lx, y: ly });
      bounds.minX = Math.min(bounds.minX, lx);
      bounds.maxX = Math.max(bounds.maxX, lx);
      bounds.minY = Math.min(bounds.minY, ly);
      bounds.maxY = Math.max(bounds.maxY, ly);
    }
    /* crown-cloud anchors: one per depth-2 limb midpoint — the big soft
       masses that sit behind the branches and make the crown read as real */
    if (limb.depth === 2 && !mobile) {
      const mx = x + (cx - x) * 0.6;
      const my = y + (cy - y) * 0.6;
      clouds.push({
        x: mx,
        y: my,
        w: 0.75 + rnd() * 0.6,
        phase: rnd() * Math.PI * 2,
        sprite: Math.floor(rnd() * 3),
      });
    }
    for (const child of limb.children) walk(child, cx, cy, a + child.angOff, limbEnd);
  };
  walk(root, 0, 0, -Math.PI / 2 + 0.03, 0);

  /* cap the cloud count for perf; spread phases so they never pulse in sync */
  while (clouds.length > (mobile ? 0 : 15)) clouds.splice(Math.floor(rnd() * clouds.length), 1);
  for (const c of clouds) c.phase = rnd() * Math.PI * 2;

  return { root, roots, canopy, clouds, maxDist, bounds };
}

/* ---------- pre-rendered glow sprites ---------- */
function makeGlowSprite(rgb: string, size: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,0.45)");
  grad.addColorStop(0.3, `rgba(${rgb},1)`);
  grad.addColorStop(0.55, `rgba(${rgb},0.34)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

type Petal = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  sprite: number;
  phase: number;
  alpha: number;
  life: number;
};
type Firefly = { ax: number; ay: number; sx: number; sy: number; r: number; phase: number };
type GroundDot = { x: number; y: number; size: number; phase: number; sprite: number };

export default function GlowTree({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let mobile = false;

    let tree: TreeData;
    let scale = 1;
    let baseX = 0;
    let baseY = 0;
    let groundY = 0;

    let blossomSprites: HTMLCanvasElement[] = [];
    let petalSprites: HTMLCanvasElement[] = [];
    let cloudSprites: HTMLCanvasElement[] = [];
    let fireflySprite: HTMLCanvasElement | null = null;
    let fogSprite: HTMLCanvasElement | null = null;

    let petals: Petal[] = [];
    let fireflies: Firefly[] = [];
    let groundDots: GroundDot[] = [];
    const leafBuf: number[] = []; // flat: x, y, size, alpha, spriteIdx per blossom draw
    let waveT = 0; // light-pulse position along trunk→tip distance, set per frame

    let raf = 0;
    let running = false;
    let inView = true;
    let gust = 0.45;
    let gustTarget = 0.45;
    let nextGustAt = 2.5;
    let burst = 0; // petals shaken loose by a fresh gust, pending spawn
    let nextPetalAt = 0;
    let px = 0;
    let py = 0;
    let tx = 0;
    let ty = 0;

    const makeSprites = () => {
      blossomSprites = BLOSSOM_HUES.map((rgb) => makeGlowSprite(rgb, 64));
      petalSprites = PETAL_HUES.map((rgb) => makeGlowSprite(rgb, 32));
      cloudSprites = [BLOSSOM_HUES[0], BLOSSOM_HUES[1], BLOSSOM_HUES[2]].map((rgb) => makeGlowSprite(rgb, 256));
      fireflySprite = makeGlowSprite("255, 205, 228", 24);
      fogSprite = makeGlowSprite("255, 45, 120", 256);
    };

    const canopySample = () => {
      const src = tree.canopy[Math.floor(Math.random() * tree.canopy.length)];
      return src ?? { x: 0, y: -1.2 };
    };

    const resetPetal = (p: Petal, scattered: boolean) => {
      const s = canopySample();
      p.x = baseX + s.x * scale;
      p.y = baseY + s.y * scale + (scattered ? Math.random() * (groundY - (baseY + s.y * scale)) * 0.8 : 0);
      p.vx = (Math.random() - 0.5) * 10;
      p.vy = 16 + Math.random() * 26;
      p.rot = Math.random() * Math.PI * 2;
      p.vr = (Math.random() - 0.5) * 3.4;
      p.size = 3 + Math.random() * 5.5;
      p.sprite = Math.floor(Math.random() * Math.max(1, petalSprites.length));
      p.phase = Math.random() * Math.PI * 2;
      p.alpha = 0;
      p.life = scattered ? Math.random() * 0.6 : 0;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      mobile = W < 1024;

      tree = generateTree(mobile);
      /* derive scale from the tree's measured rest bounding box so the crown
         always fills the stage — taller than the viewport at desktop so the
         tree towers over the hero, base rooted at the bottom edge */
      const unitH = Math.max(0.8, tree.bounds.maxY - tree.bounds.minY);
      const unitW = Math.max(0.8, tree.bounds.maxX - tree.bounds.minX);
      scale = mobile
        ? Math.min((H * 0.76) / unitH, (W * 1.2) / unitW)
        : Math.min((H * 1.24) / unitH, (W * 0.92) / unitW);
      baseX = mobile ? W * 0.55 : W * 0.75;
      baseY = mobile ? H * 0.97 : H * 0.995;
      groundY = baseY;

      makeSprites();

      petals = [];
      const petalCount = mobile ? 64 : 150;
      for (let i = 0; i < petalCount; i++) {
        const p = {} as Petal;
        resetPetal(p, true);
        petals.push(p);
      }

      fireflies = [];
      const ffCount = mobile ? 44 : 110;
      for (let i = 0; i < ffCount; i++) {
        const s = canopySample();
        fireflies.push({
          ax: s.x,
          ay: s.y,
          sx: 0.5 + Math.random() * 1.7,
          sy: 0.4 + Math.random() * 1.5,
          r: 0.08 + Math.random() * 0.2,
          phase: Math.random() * Math.PI * 2,
        });
      }

      groundDots = [];
      const gdCount = mobile ? 20 : 46;
      const spread = mobile ? 0.5 : 1.15;
      for (let i = 0; i < gdCount; i++) {
        groundDots.push({
          x: (Math.random() - 0.5) * spread,
          y: Math.random() * 0.05 - 0.01,
          size: 2.5 + Math.random() * 5,
          phase: Math.random() * Math.PI * 2,
          sprite: Math.floor(Math.random() * petalSprites.length),
        });
      }

      if (reduced) drawFrame(performance.now() + 99_000, 0); // one fully-grown static frame
    };

    /* wind: layered sines + slow gust envelope; deeper limbs swing more */
    const windAt = (depth: number, t: number, phase: number, gustMul: number) => {
      const amp = (0.011 + depth * 0.0115) * (0.55 + gustMul * 0.95);
      return (
        Math.sin(t * 0.9 + phase) * amp +
        Math.sin(t * 1.7 + phase * 1.7) * amp * 0.45 +
        Math.sin(t * 0.31 + phase * 0.5) * amp * 0.8
      );
    };

    const lerp = (a: number, b: number, v: number) => a + (b - a) * v;

    /* ---------- frame ---------- */
    const drawFrame = (now: number, dt: number) => {
      const t = now / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      leafBuf.length = 0;

      gust += (gustTarget - gust) * Math.min(1, dt * 0.8);
      px += (tx - px) * Math.min(1, dt * 3);
      py += (ty - py) * Math.min(1, dt * 3);

      const fadeIn = 1; // tree stands fully grown from the first frame
      /* the whole canopy breathes — a slow shared swell under per-blossom flicker */
      const breathe = 0.85 + 0.15 * Math.sin(t * 0.45);
      /* light pulse travelling trunk → twig tips, looping */
      waveT = ((t * 0.13) % 1.3) * (tree.maxDist / 1.3);

      if (fogSprite) {
        /* luminous ground pool + haze behind the crown */
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        const fogW = scale * (mobile ? 1.4 : 2.1);
        ctx.globalAlpha = (0.46 + 0.06 * Math.sin(t * 0.5)) * fadeIn;
        ctx.drawImage(fogSprite, baseX - fogW / 2, groundY - scale * 0.1, fogW, scale * 0.2);
        ctx.globalAlpha = 0.2 * fadeIn;
        ctx.drawImage(fogSprite, baseX - fogW * 0.3, groundY - scale * 0.17, fogW * 0.6, scale * 0.15);
        ctx.globalAlpha = (0.12 + 0.05 * Math.sin(t * 0.42 + 1.7)) * fadeIn;
        const crownX = baseX + px * 8;
        const crownY = baseY - scale * (tree.bounds.maxY - tree.bounds.minY) * 0.6 + py * 6;
        ctx.drawImage(fogSprite, crownX - scale * 0.66, crownY - scale * 0.34, scale * 1.32, scale * 0.68);
        ctx.restore();
      }

      /* crown reflection: dim mirrored clouds + trunk smear in the ground fog */
      if (cloudSprites.length && tree.clouds.length) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 0.07 * fadeIn;
        for (const c of tree.clouds) {
          const cx = baseX + c.x * scale;
          const cy = groundY + (groundY - (baseY + c.y * scale)) * 0.32;
          const cs = scale * 0.42 * c.w;
          if (cy > groundY + 4) ctx.drawImage(cloudSprites[c.sprite], cx - cs / 2, cy - cs / 4, cs, cs / 2);
        }
        ctx.restore();
      }

      /* glowing petals scattered across the ground */
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const d of groundDots) {
        const pulse = 0.55 + 0.45 * Math.sin(t * 1.4 + d.phase);
        const gx = baseX + d.x * scale * 0.85;
        const gy = groundY + d.y * scale;
        ctx.globalAlpha = (0.22 + 0.28 * pulse) * fadeIn;
        const s = d.size * 3.4;
        ctx.drawImage(petalSprites[d.sprite], gx - s / 2, gy - s / 2, s, s);
      }
      ctx.restore();

      /* crown clouds: soft blossom masses behind the branches */
      if (cloudSprites.length) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        for (const c of tree.clouds) {
          const sway = windAt(2, t, c.phase, gust) * scale;
          const cx = baseX + c.x * scale + sway + px * 5;
          const cy = baseY + c.y * scale + Math.sin(t * 0.5 + c.phase) * scale * 0.012 + py * 4;
          const cs = scale * (0.5 + 0.28 * Math.sin(t * 0.33 + c.phase * 2)) * c.w;
          ctx.globalAlpha = (0.13 + 0.045 * Math.sin(t * 0.4 + c.phase)) * fadeIn;
          ctx.drawImage(cloudSprites[c.sprite], cx - cs / 2, cy - cs / 2, cs, cs);
        }
        ctx.restore();
      }

      /* trunk + boughs: dark silhouette with a faint rose rim */
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (const r of tree.roots) drawLimb(r, baseX, baseY, r.angOff, t, true);
      drawLimb(tree.root, baseX, baseY, -Math.PI / 2 + 0.03 + Math.sin(t * 0.22) * 0.008 + gust * 0.014, t, false);
      ctx.restore();

      /* blossoms collected during recursion, drawn additively */
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < leafBuf.length; i += 5) {
        ctx.globalAlpha = Math.min(1, leafBuf[i + 3] * breathe);
        ctx.drawImage(
          blossomSprites[leafBuf[i + 4]],
          leafBuf[i] - leafBuf[i + 2] / 2,
          leafBuf[i + 1] - leafBuf[i + 2] / 2,
          leafBuf[i + 2],
          leafBuf[i + 2],
        );
      }
      ctx.restore();

      /* falling petals */
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const p of petals) {
        if (p.alpha <= 0.015) continue;
        ctx.globalAlpha = p.alpha * fadeIn;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.drawImage(petalSprites[p.sprite], -p.size, -p.size * 0.6, p.size * 2, p.size * 1.2);
        ctx.rotate(-p.rot);
        ctx.translate(-p.x, -p.y);
      }
      ctx.restore();

      /* fireflies drifting around the crown */
      if (fireflySprite) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        for (const f of fireflies) {
          const fx = baseX + (f.ax + Math.sin(t * f.sx + f.phase) * f.r + px * 0.014) * scale;
          const fy = baseY + (f.ay + Math.cos(t * f.sy + f.phase * 1.3) * f.r * 0.7 + py * 0.014) * scale;
          const pulse = 0.35 + 0.65 * Math.abs(Math.sin(t * 1.1 + f.phase * 2));
          const flare = Math.pow(pulse, 1.6);
          ctx.globalAlpha = flare * 0.8 * fadeIn;
          const s = (mobile ? 7 : 9) * (0.7 + flare * 0.7);
          ctx.drawImage(fireflySprite, fx - s / 2, fy - s / 2, s, s);
        }
        ctx.restore();
      }
    };

    /* recursive limb renderer — collects blossom draw ops into leafBuf.
       The tree is always fully grown; only wind animates it. */
    const drawLimb = (limb: Limb, x: number, y: number, angle: number, t: number, isRoot: boolean) => {
      const wind = windAt(limb.depth, t, limb.phase, gust);
      /* gusts don't just rotate boughs — they bend the curve so twigs whip */
      const bendCurve = limb.curve * (1 + wind * 7);
      const a = angle + wind;
      const steps = limb.depth === 0 ? 5 : 3;
      const drawLen = limb.len * scale; // tree units → px
      const w0 = limb.w0 * scale;
      const w1 = limb.w1 * scale;

      /* rim glow: one soft wide stroke for the whole limb */
      let cx = x;
      let cy = y;
      let ca = a;
      ctx.strokeStyle = RIM_GLOW;
      ctx.lineWidth = Math.max(1.5, w0 * 1.6);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      for (let i = 1; i <= steps; i++) {
        ca += bendCurve / steps;
        cx += Math.cos(ca) * (drawLen / steps);
        cy += Math.sin(ca) * (drawLen / steps);
        ctx.lineTo(cx, cy);
      }
      ctx.stroke();

      /* tapered core strokes */
      cx = x;
      cy = y;
      ca = a;
      for (let i = 1; i <= steps; i++) {
        const t1 = i / steps;
        ca += bendCurve / steps;
        const nx = cx + Math.cos(ca) * (drawLen / steps);
        const ny = cy + Math.sin(ca) * (drawLen / steps);
        const wB = w0 + (w1 - w0) * t1;
        if (limb.depth === 0 || isRoot) {
          const v = t1;
          ctx.strokeStyle = `rgb(${lerp(TRUNK_BASE_RGB[0], TRUNK_TOP_RGB[0], v)}, ${lerp(
            TRUNK_BASE_RGB[1],
            TRUNK_TOP_RGB[1],
            v,
          )}, ${lerp(TRUNK_BASE_RGB[2], TRUNK_TOP_RGB[2], v)})`;
        } else {
          ctx.strokeStyle = limb.depth <= 1 ? BOUGH_DEEP : limb.depth <= 3 ? BOUGH_MID : BOUGH_FINE;
        }
        ctx.lineWidth = Math.max(0.7, wB);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(nx, ny);
        ctx.stroke();
        /* bark ticks: short dark cross-strokes on the trunk only */
        if ((limb.depth === 0 || isRoot) && i < steps) {
          ctx.strokeStyle = BARK_TICK;
          ctx.lineWidth = Math.max(0.6, wB * 0.14);
          const tickA = ca + Math.PI / 2 + (limb.phase - Math.PI);
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(tickA) * wB * 0.28, cy + Math.sin(tickA) * wB * 0.28);
          ctx.lineTo(cx - Math.cos(tickA) * wB * 0.28, cy - Math.sin(tickA) * wB * 0.28);
          ctx.stroke();
        }
        cx = nx;
        cy = ny;
      }

      /* children: first from the tip, the rest anchored along the bough */
      for (let i = 0; i < limb.children.length; i++) {
        const child = limb.children[i];
        if (i === 0) {
          drawLimb(child, cx, cy, ca + child.angOff, t, false);
        } else {
          const tPos = Math.min(0.92, 0.32 + (i / limb.children.length) * 0.5);
          const bx = x + (cx - x) * tPos;
          const by = y + (cy - y) * tPos;
          drawLimb(child, bx, by, a + bendCurve * tPos + child.angOff, t, false);
        }
      }

      /* blossoms along this limb */
      if (limb.leaves.length) {
        for (const leaf of limb.leaves) {
          const flutterX = Math.sin(t * (1.1 + leaf.flick) + leaf.delay * 7) * (2.6 + gust * 3);
          const flutterY = Math.cos(t * (0.9 + leaf.flick * 0.8) + leaf.delay * 9) * (2 + gust * 2.4);
          const lx = x + (cx - x) * leaf.t + Math.cos(a + Math.PI / 2) * leaf.r * scale * 0.4 + flutterX;
          const ly = y + (cy - y) * leaf.t + Math.sin(a + Math.PI / 2) * leaf.r * scale * 0.4 + flutterY;
          const flicker = 0.62 + 0.38 * Math.sin(t * (1.6 + leaf.flick) + leaf.delay * 20);
          /* travelling light pulse brightens clusters as it passes */
          const wave = 1 + 0.6 * Math.exp(-Math.pow(leaf.d - waveT, 2) * 22);
          const alpha = flicker * wave * 0.95;
          leafBuf.push(
            lx + px * (0.005 + limb.depth * 0.0014) * scale,
            ly + py * (0.004 + limb.depth * 0.0014) * scale,
            leaf.size * (mobile ? 0.82 : 1) * (0.9 + 0.14 * wave),
            alpha,
            leaf.sprite,
          );
        }
      }
    };

    /* ---------- particles ---------- */
    const updateParticles = (dt: number, t: number) => {
      if (t > nextGustAt) {
        gustTarget = 0.25 + Math.random() * 1.05;
        nextGustAt = t + 3 + Math.random() * 4;
        /* a strong gust shakes a burst of petals loose */
        if (gustTarget > 0.85) burst += mobile ? 4 : 9;
      }

      const spawnRate = (mobile ? 0.7 : 1.5) * (0.55 + gust);
      nextPetalAt -= dt;
      if (nextPetalAt <= 0) {
        const dead = petals.find((p) => p.life >= 1);
        if (dead) resetPetal(dead, false);
        if (burst > 0) {
          for (let i = 0; i < burst; i++) {
            const d2 = petals.find((p) => p.life >= 1);
            if (d2) resetPetal(d2, false);
          }
          burst = 0;
        }
        nextPetalAt = Math.max(0.03, (1 - spawnRate) * 0.9 + 0.06);
      }

      for (const p of petals) {
        p.life += dt / 13;
        /* wind pushes petals sideways; swirl adds the fluttering drift */
        p.vx += (Math.sin(t * 1.5 + p.phase) * 20 + gust * 26) * dt * 2;
        p.vx = Math.max(-70, Math.min(90, p.vx));
        p.x += (p.vx + Math.sin(t * 1.8 + p.phase) * (16 + gust * 34)) * dt;
        p.y += p.vy * dt * (1 + gust * 0.45);
        p.rot += p.vr * dt;
        const nearGround = Math.max(0, Math.min(1, (p.y - (groundY - scale * 0.16)) / (scale * 0.14)));
        const endFade = Math.max(0, Math.min(1, (p.life - 0.8) / 0.2));
        p.alpha = (1 - endFade) * (0.8 - nearGround * 0.9);
        if (p.life >= 1 || p.y > groundY + 10) resetPetal(p, false);
      }
    };

    /* ---------- main loop ---------- */
    let last = performance.now();
    const loop = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      updateParticles(dt, now / 1000);
      drawFrame(now, dt);
      raf = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (reduced || mobile) return;
      const rect = canvas.getBoundingClientRect();
      tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !document.hidden) startLoop();
        else stopLoop();
      },
      { threshold: 0.02 },
    );
    const onVis = () => {
      if (document.hidden || !inView) stopLoop();
      else startLoop();
    };

    resize();
    io.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    startLoop();

    return () => {
      stopLoop();
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
