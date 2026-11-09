import { useEffect } from "react";

/** Sets the document title per route. */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
