/**
 * B4NDX style reminder: Midnight Performance Console — high-contrast Discord-native product UI,
 * Signal Lime actions, luxury Mercedes art direction, asymmetric command-center sections, and
 * purposeful motion that remains fully usable without hover or animation.
 */
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bot,
  ChartNoAxesCombined,
  Check,
  ChevronRight,
  CircleGauge,
  Command,
  Headphones,
  LockKeyhole,
  Menu,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Ticket,
  UsersRound,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MANUS_ASSET_ORIGIN = "https://lumorastud-8uwvhw9u.manus.space";
const DISCORD_INVITE_URL =
  "https://discord.com/oauth2/authorize?client_id=1542513806255853688&scope=bot%20applications.commands&permissions=8";
const DISCORD_SUPPORT_URL = "https://discord.gg/bpE7tcwNCV";

const assetUrls = {
  logo: `${MANUS_ASSET_ORIGIN}/manus-storage/b4ndx-signal-mark_9d65a5fe.png`,
  hero: `${MANUS_ASSET_ORIGIN}/manus-storage/b4ndx-mercedes-hero_b0fb9603.jpg`,
  heroReveal: `${MANUS_ASSET_ORIGIN}/manus-storage/b4ndx-mercedes-reveal_380bff3f.jpg`,
  heroVideo: `${MANUS_ASSET_ORIGIN}/manus-storage/b4ndx-pursuit-mode-hero_1f3b2f65.mp4`,
  consoleArt: `${MANUS_ASSET_ORIGIN}/manus-storage/b4ndx-command-console_165ae927.jpg`,
};

const commands = [
  {
    command: "/moderate scan",
    status: "Security routine",
    response: "4 signals reviewed · no escalation required",
    icon: ShieldCheck,
  },
  {
    command: "/ticket create",
    status: "Support routing",
    response: "Ticket #042 ready · role queue assigned",
    icon: Ticket,
  },
  {
    command: "/server pulse",
    status: "Community health",
    response: "Automation online · activity feed synced",
    icon: Activity,
  },
];

const modules = [
  {
    icon: ShieldCheck,
    number: "01",
    name: "Moderation",
    text: "Build consistent rules, visible checks, and a clear response path for your team.",
    command: "/moderate scan",
    signal: "POLICY SCAN READY",
  },
  {
    icon: Ticket,
    number: "02",
    name: "Tickets",
    text: "Turn support moments into organised private threads with the right people in the loop.",
    command: "/ticket create",
    signal: "ROUTING QUEUE ONLINE",
  },
  {
    icon: MessageSquareText,
    number: "03",
    name: "Welcome flows",
    text: "Make a better first impression with role-aware onboarding and useful next steps.",
    command: "/welcome setup",
    signal: "ROLE PATHS MAPPED",
  },
  {
    icon: ChartNoAxesCombined,
    number: "04",
    name: "Server insight",
    text: "Keep a readable pulse on the actions, members, and systems your community depends on.",
    command: "/server pulse",
    signal: "EVENT FEED SYNCED",
  },
];

const protocol = [
  [
    "01",
    "Command-first",
    "A slash command declares the action, its target, and the status you should expect next.",
  ],
  [
    "02",
    "Built for roles",
    "Permission-aware routes keep admin actions, escalation checks, and staff handoffs explicit.",
  ],
  [
    "03",
    "One control layer",
    "Moderation, support, onboarding, and health checks resolve through one readable bot system.",
  ],
  [
    "04",
    "Designed to stay calm",
    "Live status markers and scoped replies make high-volume server work easier to scan.",
  ],
];

const helpCategories = [
  {
    value: "stats",
    label: "Server Statistics",
    summary: "View server stats",
    command: "/stats",
    response:
      "Readable server activity, roles, and community signals in one compact status card.",
  },
  {
    value: "welcome",
    label: "Welcome System",
    summary: "Set up welcome messages",
    command: "/welcome setup",
    response:
      "Create role-aware first messages and give new members a clear next step.",
  },
  {
    value: "goodbye",
    label: "Goodbye System",
    summary: "Set up goodbye messages",
    command: "/goodbye setup",
    response:
      "Close member journeys cleanly while retaining useful server context.",
  },
  {
    value: "logging",
    label: "Logging System",
    summary: "Set up server logs",
    command: "/logs configure",
    response:
      "Route important actions to a clear, review-ready moderation log.",
  },
  {
    value: "moderation",
    label: "Moderation",
    summary: "Basic moderation commands",
    command: "/moderate scan",
    response:
      "Run policy checks, document decisions, and keep the next action visible.",
  },
  {
    value: "automod",
    label: "Auto-Moderation",
    summary: "Automation settings",
    command: "/automod configure",
    response:
      "Set guardrails that work quietly in the background of your community.",
  },
  {
    value: "tickets",
    label: "Ticket System",
    summary: "Support tickets",
    command: "/ticket create",
    response:
      "Give support conversations the right privacy, routing, and response path.",
  },
  {
    value: "suggestions",
    label: "Suggestion System",
    summary: "Submit suggestions",
    command: "/suggestion open",
    response:
      "Collect community input in a format your team can review and act on.",
  },
  {
    value: "giveaway",
    label: "Giveaway System",
    summary: "Host giveaways",
    command: "/giveaway launch",
    response:
      "Launch a controlled event with a visible entry and conclusion flow.",
  },
  {
    value: "polls",
    label: "Poll System",
    summary: "Create polls",
    command: "/poll create",
    response:
      "Turn decisions into a focused community vote without message clutter.",
  },
  {
    value: "utility",
    label: "Utility Management",
    summary: "Server and user management",
    command: "/utility member",
    response:
      "Resolve everyday member and channel management through one command layer.",
  },
  {
    value: "fun",
    label: "Fun Commands",
    summary: "Memes, jokes, actions and more",
    command: "/fun",
    response:
      "Keep engagement lightweight with social commands designed for your community’s tone.",
  },
];

function scrollToSection(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const telemetryRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [commandIndex, setCommandIndex] = useState(0);
  const [telemetryProgress, setTelemetryProgress] = useState(61);
  const [heroVideoReady, setHeroVideoReady] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [helpCategory, setHelpCategory] = useState("stats");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    document
      .querySelectorAll<HTMLElement>("[data-reveal]")
      .forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    const startWithSound = () => {
      video.muted = false;
      video.volume = 0.42;
      video
        .play()
        .then(() => setSoundOn(true))
        .catch(() => {
          video.muted = true;
          video.play().catch(() => undefined);
          setSoundOn(false);
        });
    };
    if (video.readyState >= 3) startWithSound();
    else video.addEventListener("canplay", startWithSound, { once: true });
    return () => video.removeEventListener("canplay", startWithSound);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCommandIndex(index => (index + 1) % commands.length);
    }, 4200);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const element = telemetryRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const start = performance.now();
        const duration = 1200;
        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          setTelemetryProgress(
            Math.round(61 + (1 - Math.pow(1 - progress, 3)) * 31)
          );
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        observer.disconnect();
      },
      { threshold: 0.45 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const notifyInvite = () =>
    window.open(DISCORD_INVITE_URL, "_blank", "noopener,noreferrer");
  const openSupport = () =>
    window.open(DISCORD_SUPPORT_URL, "_blank", "noopener,noreferrer");

  const toggleHeroSound = () => {
    const video = heroVideoRef.current;
    if (!video) return;
    const shouldEnable = !soundOn;
    video.muted = !shouldEnable;
    video.volume = 0.42;
    video.play().catch(() => {
      toast("Tap sound again to activate audio", {
        description:
          "Your browser needs a direct interaction before it can play hero sound.",
      });
    });
    setSoundOn(shouldEnable);
  };

  const moveReveal = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || !heroRef.current) return;
    const bounds = heroRef.current.getBoundingClientRect();
    heroRef.current.style.setProperty(
      "--reveal-x",
      `${event.clientX - bounds.left}px`
    );
    heroRef.current.style.setProperty(
      "--reveal-y",
      `${event.clientY - bounds.top}px`
    );
    heroRef.current.style.setProperty(
      "--drift-x",
      `${((event.clientX - bounds.left) / bounds.width - 0.5) * -12}px`
    );
    heroRef.current.style.setProperty(
      "--drift-y",
      `${((event.clientY - bounds.top) / bounds.height - 0.5) * -8}px`
    );
    setCursorVisible(true);
  };

  const resetHeroMotion = () => {
    heroRef.current?.style.setProperty("--drift-x", "0px");
    heroRef.current?.style.setProperty("--drift-y", "0px");
    setCursorVisible(false);
  };

  const activeCommand = commands[commandIndex];
  const CommandIcon = activeCommand.icon;
  const activeHelp =
    helpCategories.find(category => category.value === helpCategory) ??
    helpCategories[0];
  const telemetryStyle = {
    "--telemetry-angle": `${telemetryProgress * 3.6}deg`,
  } as CSSProperties;

  return (
    <div className="b4ndx-site">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <button
          className="brand"
          onClick={() => scrollToSection("top")}
          aria-label="B4NDX Utility home"
        >
          <img src={assetUrls.logo} alt="" />
          <span>B4NDX Utility</span>
          <i />
        </button>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <button onClick={() => scrollToSection("modules")}>Modules</button>
          <button onClick={() => scrollToSection("console")}>Console</button>
          <button onClick={() => scrollToSection("protocol")}>Protocol</button>
          <button onClick={() => scrollToSection("support")}>Support</button>
        </nav>
        <div className="header-actions">
          <span className="header-status">
            <i /> SYSTEM READY
          </span>
          <button className="top-invite" onClick={notifyInvite}>
            Invite bot <ArrowUpRight size={14} />
          </button>
          <button
            className="menu-trigger"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      <main id="main">
        <section
          className={`hero ${cursorVisible ? "cursor-active" : ""}`}
          id="top"
          ref={heroRef}
          onPointerMove={moveReveal}
          onPointerLeave={resetHeroMotion}
        >
          <div className="hero-media" aria-hidden="true">
            <img className="hero-image" src={assetUrls.hero} alt="" />
            <video
              className={`hero-video ${heroVideoReady ? "is-ready" : ""}`}
              ref={heroVideoRef}
              autoPlay
              loop
              muted={!soundOn}
              playsInline
              preload="metadata"
              poster={assetUrls.hero}
              onCanPlay={() => setHeroVideoReady(true)}
              onError={() => setHeroVideoReady(false)}
            >
              <source src={assetUrls.heroVideo} type="video/mp4" />
            </video>
            <div className="hero-image-reveal">
              <img src={assetUrls.heroReveal} alt="" />
            </div>
            <div className="hero-shade" />
          </div>
          <div className="reveal-cursor" aria-hidden="true">
            <span>+</span>
          </div>
          <div className="hero-speed-lines" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>

          <div className="hero-shell">
            <div className="hero-copy" data-reveal>
              <div className="eyebrow">
                <span /> DISCORD AUTOMATION / 01
              </div>
              <h1>
                <span>Run your server</span>
                <span>without running</span>
                <em>after it.</em>
              </h1>
              <p>
                B4NDX Utility gives your Discord community a composed control
                layer for moderation, tickets, onboarding, and the moments
                between.
              </p>
              <div className="hero-actions">
                <button className="button primary" onClick={notifyInvite}>
                  Invite B4NDX Utility <ArrowUpRight size={18} />
                </button>
                <button
                  className="button ghost"
                  onClick={() => scrollToSection("console")}
                >
                  See the console <ArrowRight size={18} />
                </button>
              </div>
              <div className="cursor-hint">
                <Sparkles size={14} /> Move to reveal{" "}
                <span className="hide-on-touch">the signal layer</span>
              </div>
            </div>

            <aside className="hero-console" data-reveal>
              <div className="console-topline">
                <span>
                  <i /> B4NDX UTILITY / LIVE PREVIEW
                </span>
                <span>01:48:32</span>
              </div>
              <div className="console-window">
                <div className="bot-avatar">
                  <img src={assetUrls.logo} alt="" />
                </div>
                <div className="console-chat" key={activeCommand.command}>
                  <div className="bot-name">
                    B4NDX Utility <span>APP</span>
                  </div>
                  <div className="command-line">
                    <Command size={15} /> {activeCommand.command}
                  </div>
                  <div className="command-response">
                    <CommandIcon size={16} />
                    <span>
                      <b>{activeCommand.status}</b>
                      {activeCommand.response}
                    </span>
                  </div>
                </div>
              </div>
              <div className="console-pagination">
                {commands.map((command, index) => (
                  <button
                    key={command.command}
                    className={index === commandIndex ? "active" : ""}
                    onClick={() => setCommandIndex(index)}
                    aria-label={`Show ${command.command}`}
                  />
                ))}
                <span>COMMAND PREVIEW</span>
              </div>
            </aside>
          </div>
          <div className="hero-bottom">
            <span>B4NDX UTILITY / BOT OPERATIONS</span>
            <span className="hero-bottom-center">
              DISCIPLINE FOR EVERY CHANNEL
            </span>
            <span>SCROLL TO DEPLOY ↓</span>
          </div>
          <button
            className="video-sound-toggle"
            onClick={toggleHeroSound}
            aria-pressed={soundOn}
          >
            {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span>{soundOn ? "Sound on" : "Enable sound"}</span>
          </button>
          <div className="hero-wordmark" aria-hidden="true">
            B4NDX UTILITY
          </div>
        </section>

        <section
          className="proof-strip"
          aria-label="B4NDX Utility product attributes"
        >
          <div className="proof-item" data-reveal>
            <Zap size={18} />
            <div>
              <b>Command-first</b>
              <span>Built around fast, readable actions</span>
            </div>
          </div>
          <div className="proof-item" data-reveal>
            <UsersRound size={18} />
            <div>
              <b>Role-aware</b>
              <span>Clear routes for every part of your team</span>
            </div>
          </div>
          <div className="proof-item" data-reveal>
            <LockKeyhole size={18} />
            <div>
              <b>Policy-led</b>
              <span>Make server rules visible in the workflow</span>
            </div>
          </div>
          <div className="proof-item" data-reveal>
            <Activity size={18} />
            <div>
              <b>Always observable</b>
              <span>Keep your important signals in view</span>
            </div>
          </div>
        </section>

        <section className="module-section section-shell" id="modules">
          <div className="section-heading" data-reveal>
            <div className="eyebrow">
              <span /> THE B4NDX UTILITY STACK
            </div>
            <h2>
              One command layer.
              <br />
              <em>Every server moment.</em>
            </h2>
            <p>
              Start where your community needs control, then extend the
              operating system with clear modules your team can actually use.
            </p>
          </div>
          <div className="module-grid">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <article
                  className="module-card"
                  data-reveal
                  key={module.name}
                  style={{ transitionDelay: `${index * 70}ms` }}
                >
                  <div className="module-card-top">
                    <span>{module.number}</span>
                    <div className="module-icon">
                      <img
                        className="module-beacon"
                        src={assetUrls.logo}
                        alt=""
                      />
                      <Icon size={19} />
                    </div>
                  </div>
                  <div className="module-card-copy">
                    <h3>{module.name}</h3>
                    <p>{module.text}</p>
                  </div>
                  <div className="module-signal">
                    <i /> {module.signal}
                  </div>
                  <div className="module-command">
                    <Command size={14} /> {module.command}
                    <ChevronRight size={15} />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="console-section" id="console">
          <div className="console-section-media" data-reveal>
            <img
              src={assetUrls.consoleArt}
              alt="Abstract B4NDX command console visual"
            />
            <div className="scanline" />
          </div>
          <div className="console-section-copy" data-reveal>
            <div className="eyebrow lime">
              <span /> SERVER CONSOLE / 24
            </div>
            <h2>
              Clear inputs.
              <br />
              <em>Calm outcomes.</em>
            </h2>
            <p>
              B4NDX Utility is designed to make routine actions legible:
              commands say what they do, status feedback tells you what
              happened, and the next step stays in reach.
            </p>
            <div className="micro-command">
              <span className="prompt">›</span>
              <span className="monospace">/b4ndx status</span>
              <span className="micro-answer">
                <Check size={14} /> all modules ready
              </span>
            </div>
            <button
              className="text-link"
              onClick={() => scrollToSection("protocol")}
            >
              Explore the protocol <ArrowRight size={16} />
            </button>
          </div>
        </section>

        <section className="help-section section-shell" id="help">
          <div className="help-intro" data-reveal>
            <div className="eyebrow">
              <span /> UTILITY HELP MENU / 12
            </div>
            <h2>
              Every command.
              <br />
              <em>One clear path.</em>
            </h2>
            <p>
              The B4NDX Utility Help Menu turns a long command list into a
              clean, Discord-native control surface your community can actually
              browse.
            </p>
            <div className="help-orbit" aria-hidden="true">
              <img src={assetUrls.logo} alt="" />
              <span>MODULE INDEX</span>
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="discord-showcase" data-reveal>
            <div className="discord-titlebar">
              <span>
                <i /> B4NDX UTILITY
              </span>
              <span>
                <b /> <b /> <b />
              </span>
            </div>
            <div className="discord-body">
              <div className="discord-avatar">
                <img src={assetUrls.logo} alt="" />
              </div>
              <article className="help-embed">
                <div className="embed-heading">
                  <Sparkles size={19} />
                  <h3>B4NDX Utility Help Menu</h3>
                </div>
                <p className="embed-lead">
                  Browse the utility categories below to view available modules.{" "}
                  <strong>Select a category to see the command.</strong>
                </p>
                <div className="available-label">
                  <span /> Available Categories
                </div>
                <ul className="help-category-list">
                  {helpCategories.map((category, index) => (
                    <li
                      key={category.value}
                      className={
                        category.value === helpCategory ? "active" : ""
                      }
                      style={{ transitionDelay: `${index * 25}ms` }}
                    >
                      <i>!</i>
                      <span>
                        <b>{category.label}</b> — {category.summary}
                      </span>
                    </li>
                  ))}
                </ul>
                <div
                  className="help-signal-scene"
                  aria-label="B4NDX Utility Layer system visual"
                >
                  <div className="signal-grid" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                  <div className="signal-orb" aria-hidden="true">
                    <img src={assetUrls.logo} alt="" />
                  </div>
                  <div className="signal-readout">
                    <span>B4NDX</span>
                    <b>UTILITY LAYER</b>
                    <em>12 MODULES · INDEXED</em>
                  </div>
                  <div className="signal-bars" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
                <p className="embed-footer">
                  powered by <b>B4NDX Utility</b> <span>◆</span>
                </p>
              </article>
              <div className="help-selector-wrap">
                <Select value={helpCategory} onValueChange={setHelpCategory}>
                  <SelectTrigger
                    className="help-select"
                    aria-label="Select a utility category"
                  >
                    <SelectValue placeholder="Select a utility category" />
                  </SelectTrigger>
                  <SelectContent className="help-select-menu">
                    {helpCategories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="help-command-response" key={activeHelp.value}>
                  <span>
                    <Command size={14} /> {activeHelp.command}
                  </span>
                  <p>
                    <b>{activeHelp.label}</b>
                    {activeHelp.response}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="protocol-section section-shell" id="protocol">
          <div className="protocol-label" data-reveal>
            <div className="eyebrow">
              <span /> OPERATING PRINCIPLES
            </div>
            <p>
              Less noise. More signal. Built for communities that want a
              dependable center of control.
            </p>
          </div>
          <ol className="protocol-list">
            {protocol.map(([number, title, text], index) => (
              <li
                key={number}
                data-reveal
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <ArrowUpRight size={18} />
              </li>
            ))}
          </ol>
        </section>

        <section className="telemetry-section" ref={telemetryRef}>
          <div className="telemetry-shell">
            <div className="telemetry-copy" data-reveal>
              <div className="eyebrow lime">
                <span /> CONTROL ROOM
              </div>
              <h2>
                Keep your community
                <br />
                <em>in the clear.</em>
              </h2>
              <p>
                Every B4NDX Utility interaction is designed to make the state of
                your server easy to scan, act on, and share with your team.
              </p>
              <div className="telemetry-tags">
                <span>
                  <i /> ROUTINES ONLINE
                </span>
                <span>
                  <i /> ESCALATIONS READY
                </span>
              </div>
            </div>
            <div className="telemetry-card" data-reveal>
              <div className="telemetry-header">
                <span>
                  <CircleGauge size={17} /> AUTOMATION COVERAGE
                </span>
                <span>LIVE MAP</span>
              </div>
              <div className="telemetry-visual" style={telemetryStyle}>
                <div>
                  <b>{telemetryProgress}</b>
                  <span>
                    AUTOMATION
                    <br />
                    COVERAGE
                  </span>
                </div>
              </div>
              <div className="telemetry-legend">
                <span>
                  <i /> 12 routines online
                </span>
                <span>
                  <i /> Review channel ready
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="invite-section section-shell" id="support">
          <div className="invite-card" data-reveal>
            <div className="invite-mark">
              <img src={assetUrls.logo} alt="" />
            </div>
            <div>
              <div className="eyebrow">
                <span /> READY WHEN YOUR SERVER IS
              </div>
              <h2>Keep the chaos handled.</h2>
            </div>
            <div className="invite-actions">
              <button className="button primary" onClick={notifyInvite}>
                Invite B4NDX Utility <ArrowUpRight size={18} />
              </button>
              <button className="button ghost light" onClick={openSupport}>
                Join support <Headphones size={18} />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-top">
          <button
            className="brand footer-brand"
            onClick={() => scrollToSection("top")}
          >
            <img src={assetUrls.logo} alt="" />
            <span>B4NDX Utility</span>
            <i />
          </button>
          <p>
            A composed Discord bot system for communities that prefer signal
            over noise.
          </p>
          <div className="footer-links">
            <button onClick={() => scrollToSection("modules")}>Modules</button>
            <button onClick={() => scrollToSection("help")}>Help Menu</button>
            <button onClick={() => scrollToSection("support")}>Support</button>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© MUST</span>
          <span className="must-signature">
            DESIGNED &amp; MADE BY <b>MUST</b>
          </span>
          <span>
            SYSTEM STATUS: READY <i />
          </span>
        </div>
        <div className="footer-wordmark" aria-hidden="true">
          B4NDX UTILITY
        </div>
      </footer>

      <nav className="mobile-dock" aria-label="Mobile navigation">
        <button onClick={() => scrollToSection("top")}>
          <Bot size={17} />
          <span>Overview</span>
        </button>
        <button onClick={() => scrollToSection("modules")}>
          <Command size={17} />
          <span>Modules</span>
        </button>
        <button onClick={() => scrollToSection("help")}>
          <MessageSquareText size={17} />
          <span>Help</span>
        </button>
        <button className="dock-invite" onClick={notifyInvite}>
          <ArrowUpRight size={17} />
          <span>Invite</span>
        </button>
      </nav>

      <div
        className={`mobile-menu ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="mobile-menu-top">
          <button
            className="brand"
            onClick={() => {
              scrollToSection("top");
              setMenuOpen(false);
            }}
          >
            <img src={assetUrls.logo} alt="" />
            <span>B4NDX Utility</span>
            <i />
          </button>
          <button
            className="menu-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>
        <div className="mobile-menu-links">
          <button
            onClick={() => {
              scrollToSection("modules");
              setMenuOpen(false);
            }}
          >
            01 <span>Modules</span>
          </button>
          <button
            onClick={() => {
              scrollToSection("help");
              setMenuOpen(false);
            }}
          >
            02 <span>Help Menu</span>
          </button>
          <button
            onClick={() => {
              scrollToSection("protocol");
              setMenuOpen(false);
            }}
          >
            03 <span>Protocol</span>
          </button>
          <button
            onClick={() => {
              scrollToSection("support");
              setMenuOpen(false);
            }}
          >
            04 <span>Support</span>
          </button>
          <a href="/privacy">
            05 <span>Privacy Policy</span>
          </a>
          <a href="/terms">
            06 <span>Terms of Service</span>
          </a>
        </div>
        <button
          className="button primary menu-invite"
          onClick={() => {
            setMenuOpen(false);
            notifyInvite();
          }}
        >
          Invite B4NDX Utility <ArrowUpRight size={18} />
        </button>
      </div>
    </div>
  );
}
