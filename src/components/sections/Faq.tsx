import { Link } from "react-router-dom";
import { FAQ_ITEMS } from "../../lib/site";
import { SectionHeader } from "../SectionHeader";
import { ChevronDown } from "../icons";

/** FAQ — native details/summary for zero-JS accessibility. */
export function Faq() {
  return (
    <div id="faq" className="scroll-mt-24">
      <SectionHeader
        index="04"
        label="FAQ"
        title="Practical answers."
      />

      <div className="mt-12 border-t border-line-1">
        {FAQ_ITEMS.map((item) => (
          <details key={item.question} className="group border-b border-line-1">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 transition-colors duration-150 [&::-webkit-details-marker]:hidden hover:text-rose-2">
              <span className="max-w-2xl text-[0.9375rem] font-medium text-ink-1">
                {item.question}
              </span>
              <ChevronDown className="shrink-0 text-ink-3 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="pb-6">
              <p className="max-w-2xl text-sm leading-[1.75] text-ink-2">
                {item.answer}
              </p>
              {item.link && (
                <p className="mt-3">
                  {"external" in item.link && item.link.external ? (
                    <a
                      href={item.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-rose-1 underline-offset-4 transition-colors duration-150 hover:text-rose-2 hover:underline"
                    >
                      {item.link.label}
                    </a>
                  ) : (
                    <Link
                      to={item.link.href}
                      className="text-sm font-medium text-rose-1 underline-offset-4 transition-colors duration-150 hover:text-rose-2 hover:underline"
                    >
                      {item.link.label}
                    </Link>
                  )}
                </p>
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
