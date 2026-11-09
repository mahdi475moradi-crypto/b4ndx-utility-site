import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { ArrowRight } from "../components/icons";

export function NotFoundPage() {
  useDocumentTitle("Page not found — B4NDX Utility");

  return (
    <main
      id="content"
      className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-5 py-24 lg:px-8"
    >
      <p className="eyebrow">
        <span className="eyebrow-index">404</span>
        <span aria-hidden className="h-px w-6 bg-line-2" />
        Not found
      </p>
      <h1 className="mt-5 font-display text-[clamp(1.9rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-ink-1">
        That route doesn't exist.
      </h1>
      <p className="mt-4 max-w-md text-[0.9375rem] leading-[1.7] text-ink-2">
        The page you tried to open isn't part of this site. The links below
        cover everything that is.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/" className="btn-primary">
          Back to home
          <ArrowRight />
        </Link>
        <Link to="/#modules" className="btn-secondary">
          Browse features
          <ArrowRight />
        </Link>
      </div>
    </main>
  );
}
