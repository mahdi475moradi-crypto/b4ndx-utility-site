"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";

/* ------------------------------------------------------------------ */
/*  Deterministic random so the tree looks identical on every load     */
/* ------------------------------------------------------------------ */
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

type Seg = { start: THREE.Vector3; end: THREE.Vector3; r0: number; r1: number };
type Tip = { pos: THREE.Vector3; r: number };

function genTree() {
  const rand = mulberry32(20261110);
  const segs: Seg[] = [];
  const tips: Tip[] = [];

  function branch(
    pos: THREE.Vector3,
    dir: THREE.Vector3,
    len: number,
    rad: number,
    depth: number
  ) {
    const end = pos.clone().addScaledVector(dir, len);
    segs.push({ start: pos, end, r0: rad, r1: rad * 0.62 });

    if (depth >= 4 || rad < 0.02) {
      tips.push({ pos: end, r: 0.42 + rand() * 0.4 });
      return;
    }

    const kids = depth === 0 ? 3 : rand() < 0.7 ? 2 : 3;
    for (let i = 0; i < kids; i++) {
      const angle = (depth === 0 ? 0.42 : 0.55) + rand() * 0.34;
      let axis = new THREE.Vector3(
        rand() - 0.5,
        rand() * 0.4,
        rand() - 0.5
      ).cross(dir);
      if (axis.lengthSq() < 1e-5) axis = new THREE.Vector3(1, 0, 0);
      axis.normalize();
      const nd = dir.clone().applyAxisAngle(axis, angle);
      nd.y += depth === 0 ? 0.22 : 0.1;
      nd.normalize();
      branch(end, nd, len * (0.72 + rand() * 0.15), rad * 0.62, depth + 1);
    }

    if (depth > 0 && rand() < 0.55) {
      const nd = dir.clone();
      nd.x += (rand() - 0.5) * 0.25;
      nd.z += (rand() - 0.5) * 0.25;
      nd.normalize();
      branch(end, nd, len * 0.78, rad * 0.55, depth + 1);
    }
  }

  const rootDir = new THREE.Vector3(
    (rand() - 0.5) * 0.14,
    1,
    (rand() - 0.5) * 0.14
  ).normalize();
  branch(new THREE.Vector3(0, 0, 0), rootDir, 0.98, 0.145, 0);

  return { segs, tips, rand };
}

/* ------------------------------------------------------------------ */
/*  Soft radial glow texture for the ground mist                       */
/* ------------------------------------------------------------------ */
function makeGlowTexture(inner: string, outer: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, inner);
  g.addColorStop(0.45, outer);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ------------------------------------------------------------------ */
/*  Shared point-sprite shader (foliage, petals, dust)                 */
/* ------------------------------------------------------------------ */
function makePointsMaterial(opts: {
  minAlpha: number;
  boost: number;
  swayAmp: number;
  uniforms: Record<string, THREE.IUniform>;
}) {
  return new THREE.ShaderMaterial({
    uniforms: opts.uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      attribute float aSize;
      attribute float aPhase;
      attribute float aSpeed;
      attribute vec3 aColor;
      uniform float uTime;
      uniform float uReveal;
      uniform float uPx;
      uniform float uSwayAmp;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vColor = aColor;
        vec3 p = position;
        float t = uTime * aSpeed + aPhase;
        p.x += (sin(t) + 0.4 * sin(t * 1.71 + 1.3)) * uSwayAmp;
        p.y += cos(t * 0.83 + 0.7) * uSwayAmp * 0.7;
        p.z += cos(t * 1.13 + 2.1) * uSwayAmp * 0.8;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        float tw = 0.82 + 0.22 * sin(uTime * 1.7 + aPhase * 3.1);
        gl_PointSize = clamp(aSize * tw * uPx / -mv.z, 1.5, 90.0);
        vAlpha = uReveal * ${opts.minAlpha.toFixed(2)};
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float a = pow(smoothstep(0.5, 0.0, d), 1.5);
        float core = smoothstep(0.16, 0.0, d) * 0.22;
        gl_FragColor = vec4(vColor * ${opts.boost.toFixed(2)} * (1.0 + core), a * vAlpha);
        if (gl_FragColor.a < 0.003) discard;
      }
    `,
  });
}

export default function TreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const BG = 0x0b0a12;

    /* ---------------- renderer / scene / camera ---------------- */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(BG, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(BG, 0.055);

    const camera = new THREE.PerspectiveCamera(
      40,
      mount.clientWidth / mount.clientHeight,
      0.1,
      60
    );

    const treeGroup = new THREE.Group();
    scene.add(treeGroup);

    /* ---------------- shared uniforms ---------------- */
    const uTime = { value: reduced ? 4 : 0 };
    const uReveal = { value: reduced ? 1 : 0 };
    const uPx = { value: 1 };
    const leafUniforms = { uTime, uReveal, uPx, uSwayAmp: { value: 0.05 } };
    const petalUniforms = { uTime, uReveal, uPx, uSwayAmp: { value: 0 } };
    const dustUniforms = { uTime, uReveal, uPx, uSwayAmp: { value: 0.028 } };

    /* ---------------- lights ---------------- */
    scene.add(new THREE.AmbientLight(0x2b2140, 1.35));
    const key = new THREE.DirectionalLight(0x9d8bff, 0.7);
    key.position.set(-3, 6, 2.5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x6c5ce7, 0.85);
    rim.position.set(1.5, 3.5, -4);
    scene.add(rim);
    const core = new THREE.PointLight(0x8b7cf0, 6.5, 8, 2);
    core.position.set(0.25, 2.5, 0.6);
    treeGroup.add(core);

    /* ---------------- trunk ---------------- */
    const { segs, tips, rand } = genTree();

    /* Every segment gets a "sleeve": the cylinder runs a little past its
       recorded end so child branches start INSIDE the wood, not on a flat
       cap. Plus a small blob at each fork, like real branch collars.
       With the position-based sway below, joints can never split open. */
    const parts: THREE.BufferGeometry[] = [];
    const UP = new THREE.Vector3(0, 1, 0);
    let treeH = 0;
    for (const s of segs) {
      treeH = Math.max(treeH, s.end.y);
      const dir = s.end.clone().sub(s.start);
      const len = dir.length();
      const sleeve = s.r1 * 1.7;
      const g = new THREE.CylinderGeometry(s.r1, s.r0, len + sleeve, 8, 3);
      g.translate(0, (len + sleeve) / 2, 0);
      const q = new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize());
      g.applyQuaternion(q);
      g.translate(s.start.x, s.start.y, s.start.z);
      parts.push(g);

      if (s.r1 > 0.03) {
        const ball = new THREE.SphereGeometry(s.r1 * 1.45, 10, 8);
        ball.translate(s.end.x, s.end.y, s.end.z);
        parts.push(ball);
      }
    }
    const trunkGeo = BufferGeometryUtils.mergeGeometries(parts, false);
    parts.forEach((g) => g.dispose());

    const pos = trunkGeo!.attributes.position;
    const weight = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
      const w = THREE.MathUtils.clamp(pos.getY(i) / (treeH * 0.95), 0, 1);
      weight[i] = w * w * (3 - 2 * w); // smoothstep
    }
    trunkGeo!.setAttribute("aWeight", new THREE.BufferAttribute(weight, 1));

    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x231733,
      roughness: 0.92,
      metalness: 0.05,
      emissive: 0x150b24,
      emissiveIntensity: 0.45,
    });
    trunkMat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uTime;
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `#include <common>
           attribute float aWeight;
           uniform float uTime;`
        )
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
           /* Sway phase is a pure function of VERTEX POSITION, never a
              per-segment random. Vertices that share a position (branch
              joints) move identically, so no gaps can open while it sways. */
           float jph = position.x * 2.17 + position.z * 1.93;
           float swayA = sin(uTime * 1.12 + jph + position.y * 1.35);
           float swayB = sin(uTime * 0.71 + jph * 1.7 + 2.1);
           float amp = aWeight * 0.07;
           transformed.x += (swayA * 0.8 + swayB * 0.45) * amp;
           transformed.z += (swayB * 0.75 - swayA * 0.35) * amp;
           transformed.y -= abs(swayA) * amp * 0.22;`
        );
    };
    const trunk = new THREE.Mesh(trunkGeo!, trunkMat);
    trunk.frustumCulled = false;
    treeGroup.add(trunk);

    /* ---------------- foliage ---------------- */
    const isNarrow = () => mount.clientWidth / mount.clientHeight < 0.85;
    const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4 || isNarrow();

    const PALETTE: [number, number, number][] = [
      [0.42, 0.36, 0.9], // #6c5ce7 — the bot's embed color
      [0.42, 0.36, 0.9],
      [0.55, 0.49, 0.94], // #8b7cf0
      [0.55, 0.49, 0.94],
      [0.65, 0.55, 0.98], // #a78bfa
      [0.3, 0.23, 0.8], // deep violet
      [0.36, 0.28, 0.86],
    ];

    const leafCount = Math.min(
      tips.length * (lowPower ? 18 : 26),
      lowPower ? 1800 : 3200
    );
    const lPos = new Float32Array(leafCount * 3);
    const lCol = new Float32Array(leafCount * 3);
    const lSize = new Float32Array(leafCount);
    const lPhase = new Float32Array(leafCount);
    const lSpeed = new Float32Array(leafCount);

    const gauss = () => (rand() + rand() + rand() - 1.5) * 0.816;
    for (let li = 0; li < leafCount; li++) {
      const tip = tips[Math.floor(rand() * tips.length)];
      const hang = rand() < 0.22; // some blossoms hang below the branch
      lPos[li * 3] = tip.pos.x + gauss() * tip.r * 0.8;
      lPos[li * 3 + 1] =
        tip.pos.y + gauss() * (hang ? tip.r * 0.85 : tip.r * 0.55) - (hang ? 0.18 : 0.02);
      lPos[li * 3 + 2] = tip.pos.z + gauss() * tip.r * 0.8;

      const p = PALETTE[Math.floor(rand() * PALETTE.length)];
      const j = 0.85 + rand() * 0.3;
      lCol[li * 3] = p[0] * j;
      lCol[li * 3 + 1] = p[1] * j;
      lCol[li * 3 + 2] = p[2] * j;

      lSize[li] = 0.052 + rand() * 0.062;
      lPhase[li] = rand() * Math.PI * 2;
      lSpeed[li] = 0.5 + rand() * 0.9;
    }

    const leafGeo = new THREE.BufferGeometry();
    leafGeo.setAttribute("position", new THREE.BufferAttribute(lPos, 3));
    leafGeo.setAttribute("aColor", new THREE.BufferAttribute(lCol, 3));
    leafGeo.setAttribute("aSize", new THREE.BufferAttribute(lSize, 1));
    leafGeo.setAttribute("aPhase", new THREE.BufferAttribute(lPhase, 1));
    leafGeo.setAttribute("aSpeed", new THREE.BufferAttribute(lSpeed, 1));
    const leafMat = makePointsMaterial({
      minAlpha: 0.4,
      boost: 0.88,
      swayAmp: 0.05,
      uniforms: leafUniforms,
    });
    const leaves = new THREE.Points(leafGeo, leafMat);
    leaves.frustumCulled = false;
    treeGroup.add(leaves);

    /* ---------------- falling petals ---------------- */
    const PETALS = lowPower ? 46 : 90;
    const pHomeX = new Float32Array(PETALS);
    const pHomeZ = new Float32Array(PETALS);
    const fallSpeed = new Float32Array(PETALS);
    const pPos = new Float32Array(PETALS * 3);
    const pCol = new Float32Array(PETALS * 3);
    const pSize = new Float32Array(PETALS);
    const pPhase = new Float32Array(PETALS);
    const pSpeed = new Float32Array(PETALS);

    for (let i = 0; i < PETALS; i++) {
      pHomeX[i] = (rand() - 0.5) * 3.4;
      pHomeZ[i] = (rand() - 0.5) * 3.4;
      fallSpeed[i] = 0.13 + rand() * 0.28;
      pPos[i * 3] = pHomeX[i];
      pPos[i * 3 + 1] = rand() * treeH;
      pPos[i * 3 + 2] = pHomeZ[i];
      const c = PALETTE[Math.floor(rand() * PALETTE.length)];
      pCol[i * 3] = c[0];
      pCol[i * 3 + 1] = c[1];
      pCol[i * 3 + 2] = c[2];
      pSize[i] = 0.045 + rand() * 0.05;
      pPhase[i] = rand() * Math.PI * 2;
      pSpeed[i] = 0.6 + rand() * 0.8;
    }
    const petalGeo = new THREE.BufferGeometry();
    petalGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    petalGeo.setAttribute("aColor", new THREE.BufferAttribute(pCol, 3));
    petalGeo.setAttribute("aSize", new THREE.BufferAttribute(pSize, 1));
    petalGeo.setAttribute("aPhase", new THREE.BufferAttribute(pPhase, 1));
    petalGeo.setAttribute("aSpeed", new THREE.BufferAttribute(pSpeed, 1));
    const petalMat = makePointsMaterial({
      minAlpha: 0.7,
      boost: 0.95,
      swayAmp: 0,
      uniforms: petalUniforms,
    });
    const petals = new THREE.Points(petalGeo, petalMat);
    petals.frustumCulled = false;
    treeGroup.add(petals);

    /* ---------------- background dust ---------------- */
    const DUST = lowPower ? 70 : 150;
    const dPos = new Float32Array(DUST * 3);
    const dCol = new Float32Array(DUST * 3);
    const dSize = new Float32Array(DUST);
    const dPhase = new Float32Array(DUST);
    const dSpeed = new Float32Array(DUST);
    for (let i = 0; i < DUST; i++) {
      dPos[i * 3] = (rand() - 0.5) * 12;
      dPos[i * 3 + 1] = rand() * 5.5;
      dPos[i * 3 + 2] = -2.5 - rand() * 5;
      dCol[i * 3] = 0.45;
      dCol[i * 3 + 1] = 0.4;
      dCol[i * 3 + 2] = 0.75;
      dSize[i] = 0.035 + rand() * 0.045;
      dPhase[i] = rand() * Math.PI * 2;
      dSpeed[i] = 0.2 + rand() * 0.5;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3));
    dustGeo.setAttribute("aColor", new THREE.BufferAttribute(dCol, 3));
    dustGeo.setAttribute("aSize", new THREE.BufferAttribute(dSize, 1));
    dustGeo.setAttribute("aPhase", new THREE.BufferAttribute(dPhase, 1));
    dustGeo.setAttribute("aSpeed", new THREE.BufferAttribute(dSpeed, 1));
    const dustMat = makePointsMaterial({
      minAlpha: 0.24,
      boost: 0.62,
      swayAmp: 0.028,
      uniforms: dustUniforms,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    dust.frustumCulled = false;
    scene.add(dust);

    /* ---------------- ground mist ---------------- */
    const mistTex = makeGlowTexture(
      "rgba(139,124,240,0.2)",
      "rgba(108,92,231,0.07)"
    );
    const mistMat = new THREE.MeshBasicMaterial({
      map: mistTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: reduced ? 0.5 : 0,
    });
    const mist = new THREE.Mesh(new THREE.PlaneGeometry(7.4, 7.4), mistMat);
    mist.rotation.x = -Math.PI / 2;
    mist.position.y = 0.012;
    treeGroup.add(mist);

    const coreGlowTex = makeGlowTexture(
      "rgba(196,181,253,0.26)",
      "rgba(139,124,240,0.05)"
    );
    const coreGlowMat = new THREE.MeshBasicMaterial({
      map: coreGlowTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: reduced ? 0.35 : 0,
    });
    const coreGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(3.1, 3.1),
      coreGlowMat
    );
    coreGlow.rotation.x = -Math.PI / 2;
    coreGlow.position.y = 0.014;
    treeGroup.add(coreGlow);

    /* ---------------- postprocessing ---------------- */
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(mount.clientWidth, mount.clientHeight),
      reduced ? 0.32 : 0,
      0.5,
      0.3
    );
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    /* ---------------- layout / framing ---------------- */
    let baseCamY = 1.8;
    let baseRotY = 0;
    let lookX = 0.62;
    let baseScale = 0.98;

    function frame() {
      const aspect = mount.clientWidth / mount.clientHeight;
      if (aspect < 0.85) {
        // mobile: tree centered behind the copy, smaller
        treeGroup.position.set(0, -0.22, 0);
        baseScale = 0.78;
        baseRotY = 0.15;
        camera.position.set(0, 2.15, 8.3);
        lookX = 0;
      } else if (aspect < 1.15) {
        treeGroup.position.set(0.62, -0.08, 0);
        baseScale = 0.82;
        baseRotY = 0.08;
        camera.position.set(0, 1.95, 7.6);
        lookX = 0.35;
      } else {
        // desktop: tree sits right of center, content on the left
        treeGroup.position.set(1.95, -0.05, 0);
        baseScale = 0.92;
        baseRotY = -0.06;
        camera.position.set(0, 1.8, 7.15);
        lookX = 0.62;
      }
      baseCamY = camera.position.y;
      camera.lookAt(lookX, 1.45, 0);
      uPx.value =
        mount.clientHeight /
        (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    }
    frame();

    /* ---------------- interaction state ---------------- */
    let mouseX = 0;
    let mouseY = 0;
    let scrollP = 0;

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scrollP = Math.min(1, window.scrollY / (window.innerHeight * 1.15));
      mount.style.opacity = String(1 - scrollP * 0.8);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloom.setSize(w, h);
      frame();
      if (reduced) composer.render();
    };
    window.addEventListener("resize", onResize);

    /* ---------------- render loop ---------------- */
    const clock = new THREE.Clock();
    const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
    let growT = reduced ? 1 : 0;
    let raf = 0;

    function tick() {
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!document.hidden) uTime.value += dt;

      if (growT < 1) growT = Math.min(1, growT + dt / 1.9);
      const g = easeOutCubic(growT);
      uReveal.value = g;
      bloom.strength = 0.26 * g;
      mistMat.opacity = 0.42 * g;
      coreGlowMat.opacity = 0.3 * g;
      treeGroup.scale.setScalar(baseScale * (0.88 + 0.12 * g));
      core.intensity = 6.5 * (0.4 + 0.6 * g);

      // petals fall (CPU update, cheap)
      const arr = petalGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < PETALS; i++) {
        arr[i * 3 + 1] -= fallSpeed[i] * dt;
        arr[i * 3] = pHomeX[i] + Math.sin(uTime.value * 0.7 + pPhase[i]) * 0.42;
        arr[i * 3 + 2] =
          pHomeZ[i] + Math.cos(uTime.value * 0.55 + pPhase[i] * 1.3) * 0.36;
        if (arr[i * 3 + 1] < -0.15) {
          arr[i * 3 + 1] = treeH * (0.55 + rand() * 0.45);
        }
      }
      petalGeo.attributes.position.needsUpdate = true;

      // scroll parallax on the tree
      treeGroup.rotation.y = baseRotY + scrollP * 0.35;

      // mouse parallax on the camera (soft lerp)
      const targetX = mouseX * 0.28;
      const targetY = baseCamY - mouseY * 0.13 + scrollP * 0.55;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(lookX, 1.45 - scrollP * 0.1, 0);

      composer.render();
      raf = requestAnimationFrame(tick);
    }

    if (reduced) {
      composer.render();
    } else {
      raf = requestAnimationFrame(tick);
    }

    // fade the whole canvas in once the first frames are up,
    // then hand opacity over to the scroll dimmer (no transition lag)
    let fades = 0;
    const fadeTimer = window.setInterval(() => {
      fades++;
      if (fades >= 6) {
        mount.style.transition = "none";
        mount.style.opacity = String(1 - scrollP * 0.8);
        window.clearInterval(fadeTimer);
      }
    }, 100);

    /* ---------------- cleanup ---------------- */
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(fadeTimer);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry?.dispose();
          const m = obj.material as THREE.Material | THREE.Material[];
          if (Array.isArray(m)) m.forEach((x) => x.dispose());
          else m?.dispose();
        }
      });
      mistTex.dispose();
      coreGlowTex.dispose();
      composer.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="fixed inset-0 z-0"
      style={{ opacity: 0, transition: "opacity 1.4s ease" }}
    />
  );
}
