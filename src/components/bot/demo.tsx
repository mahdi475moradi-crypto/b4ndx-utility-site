"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Hash,
  Volume2,
  SendHorizontal,
  Plus,
  Gift,
  Sticker,
  Smile,
  Bell,
  Pin,
  Users,
  Search,
  Inbox,
  CircleHelp,
  BadgeCheck,
  ChevronDown,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  A short, very typical Discord moment: someone asks what the bot    */
/*  does, someone else answers, and the bot backs them up.             */
/* ------------------------------------------------------------------ */

const HELP_CMD = "!help";

const USERS = {
  aaru: { name: "aaru", bg: "#f0b232", fg: "#3b2c0f" },
  jazz: { name: "jazz", bg: "#eb459e", fg: "#ffffff" },
  ricky: { name: "ricky", bg: "#1abc9c", fg: "#0b2b26" },
  meera: { name: "meera", bg: "#e67e22", fg: "#2b1600" },
} as const;

type UserName = keyof typeof USERS;

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 pb-0.5">
      <span className="typing-dot size-1.5 rounded-full bg-[#b5bac1]" />
      <span className="typing-dot size-1.5 rounded-full bg-[#b5bac1]" />
      <span className="typing-dot size-1.5 rounded-full bg-[#b5bac1]" />
    </span>
  );
}

function ChatMessage({
  who,
  text,
  time,
}: {
  who: UserName;
  text: string;
  time: string;
}) {
  const user = USERS[who];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
      className="flex gap-3 px-4 py-0.5 mt-2 hover:bg-black/10"
    >
      <span
        className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full font-display text-sm font-bold"
        style={{ background: user.bg, color: user.fg }}
      >
        {user.name[0].toUpperCase()}
      </span>
      <div className="min-w-0">
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-semibold text-[#f2f3f5]">{user.name}</span>
          <span className="text-[11px] text-[#949ba4]">{time}</span>
        </p>
        <p className="break-words text-[15px] leading-snug text-[#dbdee1]">
          {text}
        </p>
      </div>
    </motion.div>
  );
}

function BotEmbed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      className="flex gap-3 px-4 py-0.5 mt-2 hover:bg-black/10"
    >
      <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#8b7cf0] to-[#6c5ce7] font-display text-sm font-bold text-[#0d0a18]">
        B
      </span>
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-2">
          <span className="font-semibold text-[#f2f3f5]">B4NDX Utility</span>
          <span className="flex items-center gap-0.5 rounded bg-[#5865f2] px-1 py-px text-[10px] font-bold uppercase leading-4 tracking-wide text-white">
            App
            <BadgeCheck className="size-2.5" />
          </span>
          <span className="text-[11px] text-[#949ba4]">Today at 9:41 PM</span>
        </p>
        <div className="mt-1 max-w-md rounded-md border-l-4 border-[#6c5ce7] bg-[#2b2d31] px-3.5 py-3">
          <p className="text-sm font-semibold text-[#f2f3f5]">{HELP_CMD}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-[#dbdee1]">
            Everything this bot can do, listed right here in Discord. The
            list keeps itself current, so new commands show up the moment
            they ship.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#dbdee1]">
            No dashboard to learn, no docs to skim. If you can type, you can
            run it.
          </p>
          <p className="mt-2.5 text-[11px] text-[#949ba4]">
            B4NDX Utility · slash commands work too
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function Member({
  name,
  bg,
  fg,
  offline = false,
}: {
  name: string;
  bg: string;
  fg?: string;
  offline?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-black/20 ${
        offline ? "text-[#949ba4]" : "text-[#c7ccd1]"
      }`}
    >
      <span
        className="relative grid size-6 shrink-0 place-items-center rounded-full font-display text-[10px] font-bold"
        style={{ background: bg, color: fg ?? "#1e1f22" }}
      >
        {name[0].toUpperCase()}
        {!offline && (
          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[#2b2d31] bg-[#23a55a]" />
        )}
      </span>
      <span className="truncate">{name}</span>
    </div>
  );
}

export function Demo() {
  const cardRef = useRef<HTMLDivElement>(null);
  /* the conversation only starts once the card is actually on screen —
     no more watching it play out somewhere above the fold */
  const inView = useInView(cardRef, { once: true, margin: "-5% 0px" });
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState("");
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let t: ReturnType<typeof setTimeout>;
    if (step === 0) t = setTimeout(() => setStep(1), 900);
    else if (step === 1) t = setTimeout(() => setStep(2), 1600);
    else if (step === 2) t = setTimeout(() => setStep(3), 1300);
    else if (step === 3) {
      if (typed.length < HELP_CMD.length) {
        t = setTimeout(() => setTyped(HELP_CMD.slice(0, typed.length + 1)), 240);
      } else {
        t = setTimeout(() => setStep(4), 550);
      }
    } else if (step === 4) t = setTimeout(() => setStep(5), 1500);
    else if (step === 5) t = setTimeout(() => setStep(6), 1600);
    else if (step === 6) t = setTimeout(() => setStep(7), 4800);
    else if (step === 7)
      t = setTimeout(() => {
        setStep(0);
        setTyped("");
        setCycle((c) => c + 1);
      }, 650);
    return () => clearTimeout(t);
  }, [inView, step, typed]);

  return (
    <section id="preview" aria-labelledby="preview-heading" className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-xl"
        >
          <h2 id="preview-heading" className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
            This is the whole <span className="accent-serif">tutorial</span>.
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            One command and the bot explains itself. That's the entire
            learning curve.
          </p>
        </motion.div>

        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 48, rotate: 1.2 }}
          whileInView={{ opacity: 1, y: 0, rotate: -0.35 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1], delay: 0.1 }}
          whileHover={{ rotate: 0 }}
          className="relative mt-10 overflow-x-clip"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#313338] shadow-2xl shadow-black/60">
            <div className="flex">
              {/* server rail — the leftmost strip of the real client */}
              <div className="hidden w-[72px] shrink-0 flex-col items-center gap-2 bg-[#1e1f22] py-3 md:flex">
                <div className="relative">
                  <span className="absolute -left-3.5 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-full bg-[#f2f3f5]" />
                  <div className="grid size-12 place-items-center rounded-[16px] bg-gradient-to-br from-[#8b7cf0] to-[#6c5ce7] font-display text-lg font-bold text-[#0d0a18]">
                    B
                  </div>
                </div>
                <div className="my-0.5 h-0.5 w-8 rounded bg-[#35373c]" />
                {[
                  { l: "L", bg: "#5865f2" },
                  { l: "G", bg: "#3ba55c" },
                  { l: "M", bg: "#eb459e" },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="grid size-12 place-items-center rounded-[16px] font-display text-lg font-bold text-white/90 transition-all duration-200 hover:rounded-[8px]"
                    style={{ background: s.bg }}
                  >
                    {s.l}
                  </div>
                ))}
                <div className="grid size-12 place-items-center rounded-[16px] bg-[#313338] text-[#23a55a] transition-all duration-200 hover:rounded-[8px] hover:bg-[#35373c]">
                  <Plus className="size-6" />
                </div>
              </div>

              {/* channel sidebar */}
              <div className="hidden w-52 shrink-0 flex-col bg-[#2b2d31] md:flex">
                <div className="flex h-12 items-center gap-1.5 border-b border-black/25 px-3">
                  <span className="truncate font-display text-sm font-semibold text-[#f2f3f5]">
                    B4NDX Lounge
                  </span>
                  <ChevronDown className="size-4 shrink-0 text-[#949ba4]" />
                </div>
                <div className="flex-1 space-y-0.5 overflow-hidden p-2">
                  {[
                    { name: "general", active: true },
                    { name: "tickets", active: false },
                    { name: "logs", active: false },
                  ].map((ch) => (
                    <div
                      key={ch.name}
                      className={`flex items-center gap-1.5 rounded px-2 py-1.5 text-sm ${
                        ch.active
                          ? "bg-[#404249] text-[#f2f3f5]"
                          : "text-[#949ba4]"
                      }`}
                    >
                      <Hash className="size-4 shrink-0 text-[#949ba4]" />
                      {ch.name}
                    </div>
                  ))}
                  <p className="px-2 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wide text-[#949ba4]">
                    Voice
                  </p>
                  <div className="flex items-center gap-1.5 rounded px-2 py-1.5 text-sm text-[#949ba4]">
                    <Volume2 className="size-4 shrink-0" />
                    Lounge
                  </div>
                </div>
                <div className="flex items-center gap-2 border-t border-black/25 px-3 py-2.5">
                  <span className="relative grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#8b7cf0] to-[#6c5ce7] font-display text-xs font-bold text-[#0d0a18]">
                    B
                    <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-[#2b2d31] bg-[#23a55a]" />
                  </span>
                  <div className="min-w-0 leading-tight">
                    <p className="truncate text-[13px] font-semibold text-[#f2f3f5]">
                      B4NDX Utility
                    </p>
                    <p className="text-[11px] text-[#23a55a]">Online</p>
                  </div>
                </div>
              </div>

              {/* chat */}
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex h-12 items-center gap-2 border-b border-black/25 px-4">
                  <Hash className="size-5 text-[#949ba4]" />
                  <span className="text-sm font-semibold text-[#f2f3f5]">general</span>
                  <span className="ml-1 hidden truncate border-l border-[#3f4147] pl-2 text-xs text-[#949ba4] lg:block">
                    keep it civil-ish
                  </span>
                  <div className="ml-auto flex items-center gap-4 text-[#b5bac1]">
                    <Bell className="hidden size-5 sm:block" />
                    <Pin className="hidden size-5 sm:block" />
                    <Users className="hidden size-5 md:block" />
                    <Search className="hidden size-5 sm:block" />
                    <Inbox className="hidden size-5 lg:block" />
                    <CircleHelp className="size-5" />
                  </div>
                </div>

                <div className="relative flex min-h-[520px] flex-1 flex-col justify-end overflow-hidden py-4 sm:min-h-[540px]">
                  {/* beginning-of-channel marker, like real Discord */}
                  <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 text-xs text-[#949ba4]">
                    <span className="h-px w-8 bg-[#3f4147]" />
                    Welcome to the beginning of #general
                  </div>

                  <motion.div
                    key={cycle}
                    animate={{ opacity: step === 7 ? 0 : 1 }}
                    transition={{ duration: 0.55 }}
                    className="flex flex-1 flex-col justify-end"
                  >
                    {/* some channel history so it doesn't feel staged */}
                    <ChatMessage who="ricky" text="anyone got a banner idea for the server" time="Yesterday at 11:02 PM" />
                    <ChatMessage who="meera" text="just crop something from the pics channel" time="Yesterday at 11:04 PM" />
                    {step >= 1 && (
                      <div className="relative mx-4 my-3 border-t border-[#3f4147]">
                        <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-[#313338] px-2 text-[11px] font-semibold text-[#949ba4]">
                          Today
                        </span>
                      </div>
                    )}
                    {step >= 1 && (
                      <ChatMessage who="aaru" text="wait what does this bot even do" time="Today at 9:40 PM" />
                    )}
                    {step >= 2 && (
                      <ChatMessage who="jazz" text="lmao just type !help" time="Today at 9:40 PM" />
                    )}
                    {step >= 4 && (
                      <ChatMessage who="aaru" text={HELP_CMD} time="Today at 9:41 PM" />
                    )}
                    {step === 4 && (
                      <div className="mt-1 flex items-center gap-1.5 px-[68px] py-1 text-xs text-[#949ba4]">
                        <TypingDots />
                        B4NDX is typing
                      </div>
                    )}
                    {step >= 5 && <BotEmbed />}
                    {step >= 6 && (
                      <ChatMessage who="jazz" text="see." time="Today at 9:41 PM" />
                    )}
                  </motion.div>
                </div>

                {/* input — like the real composer: attach on the left,
                    gif/sticker/emoji on the right, send only while typing */}
                <div className="px-4 pb-4">
                  <div className="flex h-11 items-center gap-3 rounded-lg bg-[#383a40] px-3">
                    <Plus className="size-5 shrink-0 text-[#b5bac1]" />
                    <span className="min-w-0 flex-1 truncate text-[15px] text-[#dbdee1]">
                      {step === 3 ? (
                        <>
                          {typed}
                          <span className="input-caret ml-px inline-block h-4 w-px translate-y-0.5 bg-[#dbdee1]" />
                        </>
                      ) : (
                        <span className="text-[#6d6f78]">Message #general</span>
                      )}
                    </span>
                    {step === 3 ? (
                      <SendHorizontal className="size-5 shrink-0 text-[#b5bac1]" />
                    ) : (
                      <>
                        <Gift className="size-5 shrink-0 text-[#b5bac1]" />
                        <Sticker className="hidden size-5 shrink-0 text-[#b5bac1] sm:block" />
                        <Smile className="size-5 shrink-0 text-[#b5bac1]" />
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* member list */}
              <div className="hidden w-44 shrink-0 flex-col border-l border-black/25 bg-[#2b2d31] lg:flex">
                <div className="flex-1 overflow-hidden p-2">
                  <p className="px-2 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-[#949ba4]">
                    Online — 3
                  </p>
                  <Member name="B4NDX Utility" bg="#6c5ce7" fg="#0d0a18" />
                  <Member name="aaru" bg="#f0b232" fg="#3b2c0f" />
                  <Member name="jazz" bg="#eb459e" fg="#ffffff" />
                  <p className="px-2 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wide text-[#949ba4]">
                    Offline — 3
                  </p>
                  <Member name="ricky" bg="#3f4147" fg="#949ba4" offline />
                  <Member name="meera" bg="#3f4147" fg="#949ba4" offline />
                  <Member name="void" bg="#3f4147" fg="#949ba4" offline />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-5 text-center text-[13px] text-muted-foreground/70"
        >
          recreated from a real conversation. usernames changed.
        </motion.p>
      </div>
    </section>
  );
}
