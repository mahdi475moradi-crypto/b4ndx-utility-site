import { useEffect, useRef } from "react";

type Petal = {
  left: string;
  top: string;
  size: string;
  delay: string;
  duration: string;
  drift: string;
};

const petals: Petal[] = [
  { left: "69%", top: "24%", size: "8px", delay: "-1.2s", duration: "8s", drift: "28px" },
  { left: "78%", top: "32%", size: "5px", delay: "-4.8s", duration: "10s", drift: "42px" },
  { left: "87%", top: "39%", size: "7px", delay: "-6.4s", duration: "9s", drift: "34px" },
  { left: "62%", top: "44%", size: "4px", delay: "-2.8s", duration: "11s", drift: "50px" },
  { left: "73%", top: "57%", size: "6px", delay: "-7.2s", duration: "12s", drift: "38px" },
  { left: "91%", top: "51%", size: "5px", delay: "-3.3s", duration: "8.5s", drift: "46px" },
  { left: "58%", top: "64%", size: "4px", delay: "-5.5s", duration: "10.5s", drift: "32px" },
  { left: "82%", top: "68%", size: "8px", delay: "-8s", duration: "13s", drift: "52px" },
  { left: "66%", top: "77%", size: "5px", delay: "-9s", duration: "9.5s", drift: "30px" },
  { left: "94%", top: "72%", size: "4px", delay: "-1.8s", duration: "11.5s", drift: "44px" },
  { left: "54%", top: "31%", size: "6px", delay: "-6.8s", duration: "12.5s", drift: "36px" },
  { left: "88%", top: "19%", size: "4px", delay: "-4.1s", duration: "9.2s", drift: "48px" },
];

export default function GlowTree({ className }: { className?: string }) {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = scene.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        scene.style.setProperty("--tree-mx", `${(x * 10).toFixed(2)}px`);
        scene.style.setProperty("--tree-my", `${(y * 7).toFixed(2)}px`);
      });
    };
    const reset = () => {
      scene.style.setProperty("--tree-mx", "0px");
      scene.style.setProperty("--tree-my", "0px");
    };
    scene.addEventListener("pointermove", onPointerMove, { passive: true });
    scene.addEventListener("pointerleave", reset, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      scene.removeEventListener("pointermove", onPointerMove);
      scene.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <div ref={sceneRef} className={`tree-scene ${className ?? ""}`} aria-hidden="true">
      <div className="tree-atmosphere" />
      <div className="tree-aura tree-aura-back" />
      <img className="tree-art tree-art-glow" src="/b4ndx-tree-hero-a.png" alt="" />
      <img className="tree-art" src="/b4ndx-tree-hero-a.png" alt="" />
      <div className="tree-lens-flare" />
      <div className="tree-ground-haze" />
      {petals.map((petal, index) => (
        <span
          key={index}
          className="tree-petal"
          style={{
            left: petal.left,
            top: petal.top,
            width: petal.size,
            height: petal.size,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            ["--petal-drift" as string]: petal.drift,
          }}
        />
      ))}
    </div>
  );
}
