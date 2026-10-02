import { renderToStaticMarkup } from "react-dom/server";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { sanitizeParse } from "./sanitizeHtml";

const render = (html: string) => renderToStaticMarkup(sanitizeParse(html) as ReactElement);

describe("sanitizeParse", () => {
  it("strips script tags", () => {
    expect(render('<p>hi</p><script>alert("xss")</script>')).toBe("<p>hi</p>");
  });

  it("strips event-handler attributes", () => {
    const out = render('<img src="x" onerror="alert(1)">');
    expect(out).not.toContain("onerror");
    expect(out).toContain('src="x"');
  });

  it("strips iframes", () => {
    expect(render('<p>a</p><iframe src="https://evil.test"></iframe>')).toBe("<p>a</p>");
  });

  it("keeps safe formatting", () => {
    const html = "<h1>Title</h1><p><strong>bold</strong> and <em>italic</em></p>";
    expect(render(html)).toBe(html);
  });
});
