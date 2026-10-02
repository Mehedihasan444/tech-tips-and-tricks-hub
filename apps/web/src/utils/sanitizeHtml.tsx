import parse, { HTMLReactParserOptions } from "html-react-parser";
import type { ReactNode } from "react";

const FORBIDDEN_TAGS = new Set(["script", "style", "iframe", "object", "embed", "form", "link"]);

interface DomLikeNode {
  type?: string;
  name?: string;
  attribs?: Record<string, string>;
}

/**
 * Parse rich-text HTML (Quill output) into safe React nodes.
 * Post content is author-controlled, so it must never reach the DOM
 * unfiltered (stored XSS). Drops executable tags and event-handler /
 * inline-style attributes. Uses duck-typing (not instanceof) because the
 * parser bundles its own domhandler copy. No jsdom involved, so it is
 * safe in Server Components and during `next build` prerendering.
 */
export const parseOptions: HTMLReactParserOptions = {
  replace: (domNode) => {
    const node = domNode as unknown as DomLikeNode;
    if (!node || typeof node.name !== "string") {
      return undefined;
    }
    if (FORBIDDEN_TAGS.has(node.name)) {
      return <></>;
    }
    if (node.attribs) {
      for (const attr of Object.keys(node.attribs)) {
        if (attr.startsWith("on") || attr === "style") {
          delete node.attribs[attr];
        }
      }
    }
    return undefined;
  },
};

export const sanitizeParse = (html: string): ReactNode => parse(html, parseOptions);
