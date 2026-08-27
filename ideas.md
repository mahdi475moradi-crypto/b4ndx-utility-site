# B4NDX — Discord Bot Website Design Direction

## Ground-Truth Reference

The supplied video is the authoritative direction for B4NDX: a dark, mobile-first Discord-bot product website with compact utility navigation, strong command-preview cards, technical proof points, and a thumb-friendly mobile navigation bar. The previous Lumora page supplies the requested motion language—staggered text entrances, polished overlays, responsive cards, and a desktop cursor reveal—but not the product identity.

## Chosen Approach: Midnight Performance Console

### Design Movement
**Luxury automotive art direction merged with Discord-native product UI.** B4NDX should feel as immediate as a well-run operations console and as considered as a night-time Mercedes campaign: dark, confident, technical, and deliberately restrained.

### Core Principles
1. **Bot-first clarity:** Every section should state a bot capability, command, result, or reliability benefit instead of using vague studio language.
2. **Dark information hierarchy:** Ink-black is the canvas; charcoal system panels separate functional modules; white typography gives commands and calls to action immediate priority.
3. **Automotive focus:** A premium black Mercedes image replaces the previous portrait in the hero and is treated as a controlled, high-contrast signature visual, not stock decoration.
4. **Responsive performance:** Desktop offers an optional interactive image reveal; mobile prioritises visible content, large touch targets, bottom navigation, and zero performance dependency on the visual effect.

### Color Philosophy
The permanent palette is built around **Midnight Black #090A0C** and **Graphite #15171B**, with **Signal Lime #B8FF37** as a live-status and action color. Steel-gray supports technical metadata. The color choice preserves the punch of dark Discord UI while differentiating B4NDX from Discord’s default purple and keeping the Mercedes hero cinematic.

### Layout Paradigm
The site follows a **command-center sequence** rather than a conventional marketing grid: a hero command window, an always-visible proof strip, a horizontal module rail, an indexed benefit ledger, an automation telemetry panel, and a closing bot invitation. On mobile, this is reflowed as a single-column command feed with a fixed navigation dock.

### Signature Elements
1. **The kinetic cursor reveal:** On pointer devices, a soft Signal Lime cursor ring uncovers a second Mercedes treatment; on touch devices it becomes a static cinematic hero to preserve speed and legibility.
2. **The command console card:** Rounded charcoal panels show real-looking B4NDX slash commands, status dots, and bot replies with sequenced typing/crossfade behavior.
3. **Signal markers:** Lime dots, thin status bars, small command pills, and live-style statistics provide a consistent high-visibility system language.

### Interaction Philosophy
Primary actions are **Invite B4NDX** and **Join Support Server**. Invite actions are safely represented as clear front-end CTAs until the actual Discord OAuth invite URL is provided. Feature cards respond to hover/focus with small lift and edge illumination; menus and drawers must close by Escape, backdrop click, or a visible close control.

### Animation
Use crisp 180–420ms cubic-bezier transitions for interface states. Retain Lumora-style staggered scroll reveals, headline clip reveals, modal entrance, and hover movement. The command console cycles messages with a gentle vertical fade; the telemetry ring fills on entry. Mobile has no hover-only dependency and uses `prefers-reduced-motion` fallbacks that present all information immediately.

### Typography System
Use **Onest** for clear UI and product copy, with 600/700 weights for large headings. Pair command syntax and live metrics with **IBM Plex Mono**. Body text is muted steel-gray; headings are white; lime is never used for long paragraphs.

### Brand Essence
**B4NDX is the high-performance Discord bot for communities that want moderation, automation, and visibility without operational noise.**

**Personality:** Precise, fast, commanding.

### Brand Voice
Headlines speak in direct, technical outcomes. CTAs invite action without empty hype.

> “Run your server without running after it.”

> “Invite B4NDX. Keep the chaos handled.”

### Wordmark & Logo
The B4NDX wordmark is a tight, uppercase Onest construction with a compact Signal Lime spark/radar mark. The symbol should read as a four-point control beacon rather than a decorative star and will be visible in the header, command terminal, and favicon.

### Signature Brand Color
**B4NDX Signal Lime — #B8FF37**

## Style Decisions

- Replace all Lumora-specific copy, studio services, and portfolio content with Discord bot modules, server metrics, slash commands, and support actions.
- Use the user’s video as the structural reference for mobile bottom navigation, bot preview, feature modules, reliability stats, and final invite block.
- Use the Mercedes hero visual as the most prominent generated asset; do not reuse it in other sections.
- Retain the existing smooth motion character, but remove loader dependency and ensure all content remains usable if effects or third-party resources fail.
- Signal Lime is limited to CTAs, live indicators, command artifacts, telemetry rings, and key state values; the midnight automotive composition remains visually dominant.
- Each feature module includes an operational bot artifact and a live-style routing or permission state rather than behaving like a generic SaaS feature tile.
- The telemetry panel presents meaningful operational proof on first paint and still animates its coverage state as the visitor reaches it.
- The hero now uses the approved six-second Pursuit Mode video as the primary experience. Video audio starts muted to comply with browser autoplay rules and has a clear user-controlled sound toggle.
- Motion is layered deliberately: car-video ignition and desktop cursor reveal in the hero; restrained signal passes, command-console pulse, icon sheen, card states, and scroll reveals through the rest of the page. Mobile keeps video and tap feedback but removes expensive hover-dependent decoration.
- The Utility Help Menu is a prominent Discord-style product demonstration: it retains the user’s long-form category structure, a precise lime embed edge, a character-banner panel, and a working category selector that reveals the selected slash command and outcome.
- Hero video sound attempts to start enabled, but immediately falls back to muted playback when browser autoplay policy blocks audio. A persistent in-hero sound control always lets the visitor enable it intentionally.
