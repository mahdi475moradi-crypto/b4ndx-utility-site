/**
 * Single source of truth for product facts, links, and copy used across the site.
 *
 * Honesty rules enforced here:
 *  - No stats, uptime, member counts, testimonials, or pricing claims.
 *  - All command examples are labeled as previews by the components that render them.
 *  - Invite URL: scopes `bot applications.commands`, no Administrator permission.
 */

const CLIENT_ID = "1542513806255853688";

export const SUPPORT_SERVER_URL = "https://discord.gg/bpE7tcwNCV";

export interface BotPermission {
  /** Official Discord permission name. */
  name: string;
  /** Discord API permission bit. */
  bit: number;
  why: string;
}

/** Minimal permission set requested by the invite. No Administrator (bit 1 << 3) is present. */
export const BOT_PERMISSIONS: BotPermission[] = [
  { name: "View Channels", bit: 1 << 10, why: "See the channels it is configured to work in." },
  { name: "Send Messages", bit: 1 << 11, why: "Reply to commands and post welcome, goodbye, log, and giveaway messages." },
  { name: "Embed Links", bit: 1 << 14, why: "Rich embeds for tickets, logs, giveaways, and polls." },
  { name: "Read Message History", bit: 1 << 16, why: "Work with message context, such as ranged purges." },
  { name: "Add Reactions", bit: 1 << 6, why: "Entry and voting reactions for giveaways and polls." },
  { name: "Manage Messages", bit: 1 << 13, why: "Bulk-delete messages when staff run a purge." },
  { name: "Manage Channels", bit: 1 << 4, why: "Create and close private channels for support tickets." },
  { name: "Kick Members", bit: 1 << 1, why: "Run kick commands issued by your staff." },
  { name: "Ban Members", bit: 1 << 2, why: "Run ban commands issued by your staff." },
  { name: "Moderate Members", bit: 2 ** 40, why: "Apply timeouts issued by your staff." }, // 2**40, not 1<<40 — JS shifts are 32-bit
  { name: "View Audit Log", bit: 1 << 7, why: "Correlate log entries with the server actions behind them." },
];

/** 1099511721174 — derived from the list above, never hard-coded. */
const PERMISSIONS_INTEGER = BOT_PERMISSIONS.reduce((acc, p) => acc + p.bit, 0);

export const INVITE_URL =
  `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}` +
  `&scope=bot+applications.commands&permissions=${PERMISSIONS_INTEGER}`;

export const NAV_LINKS = [
  { label: "Features", href: "/#modules" },
  { label: "How it works", href: "/#install" },
  { label: "FAQ", href: "/#faq" },
  { label: "Support", href: SUPPORT_SERVER_URL, external: true },
] as const;

export interface FeatureGroup {
  index: string;
  name: string;
  thesis: string;
  capabilities: { title: string; detail: string }[];
}

export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    index: "01",
    name: "Protect",
    thesis: "Rules that hold without someone watching over them.",
    capabilities: [
      {
        title: "Moderation actions with reasons",
        detail: "Timeout, kick, ban, and message purge commands so staff can act fast and consistently.",
      },
      {
        title: "A record of every action",
        detail: "Configurable log channels keep moderation events readable instead of scattered across mentions.",
      },
      {
        title: "Permission-aware staff routes",
        detail: "Actions stay scoped to the people you trust to run them.",
      },
    ],
  },
  {
    index: "02",
    name: "Support",
    thesis: "One private thread per problem, instead of public ping-pong.",
    capabilities: [
      {
        title: "Ticket channels opened by members",
        detail: "Support requests become private channels with your staff — no DMs, no lost context.",
      },
      {
        title: "A clean open-and-close flow",
        detail: "Tickets close when they are done, and the trail lands in your log channels.",
      },
    ],
  },
  {
    index: "03",
    name: "Community",
    thesis: "Presence and rituals, without the manual work.",
    capabilities: [
      {
        title: "Welcome and goodbye messages",
        detail: "New members get a proper first impression; departures are noted where you choose.",
      },
      {
        title: "Timed giveaways",
        detail: "Run a giveaway from start to winner without a spreadsheet.",
      },
      {
        title: "Quick polls",
        detail: "Ask a question, collect options, get an answer instead of a thread.",
      },
    ],
  },
  {
    index: "04",
    name: "Manage",
    thesis: "The everyday jobs, handled by command.",
    capabilities: [
      {
        title: "Configured inside Discord",
        detail: "Channels, messages, and modules are set up with slash commands — right where your team already works.",
      },
      {
        title: "Everyday server utilities",
        detail: "The small recurring tasks of running a server, reduced to a command and a reply.",
      },
    ],
  },
];

export interface ExplorerModule {
  id: string;
  label: string;
  headline: string;
  description: string;
  points: string[];
  previewCommands: { command: string; detail: string }[];
}

export const EXPLORER_MODULES: ExplorerModule[] = [
  {
    id: "moderation",
    label: "Moderation",
    headline: "Act on problems quickly — and keep the receipts.",
    description:
      "Moderation covers the actions a team needs every day: removing messages, timing members out, and kicking or banning when nothing else works. Actions are run by your staff, with reasons attached, so accountability is explicit rather than reconstructed later.",
    points: [
      "Timeout, kick, and ban commands with recorded reasons",
      "Message purge for cleaning up spam or incidents",
      "Commands stay scoped to the staff you trust with them",
      "Actions surface in your configured log channels",
    ],
    previewCommands: [
      { command: "/timeout @member 10m", detail: "apply a timeout" },
      { command: "/purge 50", detail: "bulk-delete recent messages" },
      { command: "/ban @member", detail: "remove a member permanently" },
    ],
  },
  {
    id: "tickets",
    label: "Tickets",
    headline: "Private support threads instead of public ping-pong.",
    description:
      "When a member needs help, a ticket opens a private channel between them and your staff. The conversation stays in one place, sensitive details stay out of public channels, and closing a ticket ends the thread cleanly instead of leaving it to rot.",
    points: [
      "Members open a ticket without DMing anyone",
      "Each ticket gets its own private channel",
      "Staff handle requests in one organized flow",
      "Closed tickets leave a trail in your logs",
    ],
    previewCommands: [
      { command: "/ticket open", detail: "open a private support channel" },
      { command: "/ticket close", detail: "close a finished ticket" },
    ],
  },
  {
    id: "welcome-goodbye",
    label: "Welcome & Goodbye",
    headline: "A first impression that doesn't depend on whoever is online.",
    description:
      "Welcome and goodbye flows announce arrivals and departures in the channels you choose. New members are greeted the moment they join, and leaves are noted without anyone having to notice and type it out themselves.",
    points: [
      "Welcome messages posted to a channel you configure",
      "Goodbye messages for departures",
      "One-time setup, then it runs on its own",
    ],
    previewCommands: [
      { command: "/welcome set", detail: "configure the welcome message" },
      { command: "/goodbye set", detail: "configure the goodbye message" },
    ],
  },
  {
    id: "logging",
    label: "Logging",
    headline: "A record of what happened, written where you say.",
    description:
      "Logging routes server events into channels you designate — moderation actions, members joining and leaving, message events. Instead of reconstructing an incident from memory, your team reads the log.",
    points: [
      "Separate log channels per category",
      "Moderation actions, joins and leaves, message events",
      "Entries stay readable — no firehose",
    ],
    previewCommands: [
      { command: "/logs set moderation", detail: "route moderation logs" },
      { command: "/logs set members", detail: "route join/leave logs" },
    ],
  },
  {
    id: "giveaways",
    label: "Giveaways",
    headline: "Run the whole giveaway without a spreadsheet.",
    description:
      "Start a giveaway with a duration and a prize, let members enter, and let it run. When the timer ends, the bot settles the giveaway — no manual counting, no editing a message every few hours.",
    points: [
      "Timed giveaways with entry tracking",
      "Winner selection handled by the bot",
      "Reroll when a winner never shows up",
    ],
    previewCommands: [
      { command: "/giveaway start 24h", detail: "start a timed giveaway" },
      { command: "/giveaway reroll", detail: "draw a new winner" },
    ],
  },
  {
    id: "polls",
    label: "Polls",
    headline: "Get an answer instead of a thread.",
    description:
      "Polls turn a question into something members can answer in one tap. Post the options, let votes collect, and read the result — useful for decisions that would otherwise drown in replies.",
    points: [
      "Single-question polls with your options",
      "Voting through reactions or taps",
      "Results are easy to read at a glance",
    ],
    previewCommands: [
      { command: '/poll "Game night Friday?"', detail: "post a poll" },
    ],
  },
];

export interface InstallStep {
  title: string;
  detail: string;
}

export const INSTALL_STEPS: InstallStep[] = [
  {
    title: "Open the invite",
    detail:
      "Start the Discord authorization with the Invite Bot button. It opens Discord's official OAuth page for B4NDX Utility.",
  },
  {
    title: "Choose your server",
    detail:
      "Pick the server you want the bot in from the dropdown. You need the Manage Server permission there — that's Discord's rule, not ours.",
  },
  {
    title: "Review the permissions",
    detail:
      "Discord shows the exact permission list the bot requests. It is intentionally minimal — every line is explained in the permissions section below.",
  },
  {
    title: "Authorize",
    detail:
      "Confirm the prompt and complete Discord's verification. The bot joins your server within seconds.",
  },
  {
    title: "Configure inside Discord",
    detail:
      "Point the bot at channels and turn modules on with slash commands. Stuck at any step? The support server answers setup questions directly.",
  },
];

export interface FaqItem {
  question: string;
  answer: string;
  link?: { label: string; href: string; external?: boolean };
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Does the bot need Administrator?",
    answer:
      "No. The invite requests a specific, minimal list of eleven permissions — enough for moderation, tickets, welcome flows, logging, giveaways, and polls, and nothing more. Administrator is never requested.",
    link: { label: "See the exact list", href: "/#permissions" },
  },
  {
    question: "Can I grant fewer permissions than the invite asks for?",
    answer:
      "Yes. Discord lets you uncheck permissions during authorization. The bot will still work, but any feature that relies on a permission you removed will not — for example, tickets need Manage Channels.",
  },
  {
    question: "What can B4NDX Utility actually do?",
    answer:
      "Six core modules: moderation, support tickets, welcome and goodbye messages, logging, giveaways, and polls — plus everyday server management, all run through slash commands inside Discord.",
    link: { label: "Browse the modules", href: "/#modules" },
  },
  {
    question: "Is there a dashboard, or is everything in Discord?",
    answer:
      "Everything is configured inside Discord with slash commands. There is nothing extra to sign up for and no second place to keep in sync.",
  },
  {
    question: "Are the commands shown on this site the real ones?",
    answer:
      "They are labeled Preview for a reason: they demonstrate how each module is driven, not a shipped command list. Once the bot is in your server, run its help command for the live list — or ask in the support server.",
    link: { label: "Join the support server", href: SUPPORT_SERVER_URL, external: true },
  },
  {
    question: "Something isn't working. Where do I get help?",
    answer:
      "The support server is the fastest route: ask setup questions, report behavior that looks wrong, or suggest what the bot should do next.",
    link: { label: "Open the support server", href: SUPPORT_SERVER_URL, external: true },
  },
  {
    question: "What data does the bot keep?",
    answer:
      "Only what it needs to operate your configuration — identifiers for servers, channels, and members, plus the settings and log entries your modules produce. The privacy page lays it out without legalese.",
    link: { label: "Read the privacy page", href: "/privacy" },
  },
];

export const FOOTER_YEAR = new Date().getFullYear();
