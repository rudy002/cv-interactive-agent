import type { ReactNode } from "react";

/**
 * Minimal, dependency-free renderer for the subset of Markdown the agent emits.
 *
 * Everything goes through React elements (never `dangerouslySetInnerHTML`), so
 * arbitrary model output cannot inject markup.
 *
 * Supported: paragraphs, ordered/unordered lists, headings, bold, italic,
 * inline code, Markdown links and bare URLs — including `mailto:` links, which
 * the welcome message explicitly promises.
 */

/** Schemes we are willing to turn into a clickable anchor. */
const SAFE_SCHEMES = ["http:", "https:", "mailto:", "tel:"];

const BARE_LINK_SOURCE = String.raw`(?:https?:\/\/|mailto:|tel:)[^\s<>()]+`;
const MD_LINK_SOURCE = String.raw`\[[^\]\n]+\]\((?:https?:\/\/|mailto:|tel:)[^\s)]+\)`;

const BARE_LINK_REGEX = new RegExp(`^${BARE_LINK_SOURCE}$`, "i");
const MD_LINK_REGEX = new RegExp(
  String.raw`^\[([^\]\n]+)\]\(((?:https?:\/\/|mailto:|tel:)[^\s)]+)\)$`,
  "i",
);

/**
 * Emphasis must not start or end on whitespace, exactly like real Markdown.
 * Otherwise "2 * 3 = 6 and 4 ** 2 = 16" turns half the sentence into italics.
 * Every inner group is non-capturing: `split` would emit captured groups as
 * separate segments and duplicate the text.
 */
const BOLD_SOURCE = String.raw`\*\*(?!\s)(?:[^*\n]*[^\s*])?\*\*`;
const ITALIC_SOURCE = String.raw`\*(?!\s)(?:[^*\n]*[^\s*])?\*`;
const CODE_SOURCE = String.raw`\`[^\`\n]+\``;

/**
 * The outer capturing group is load-bearing: `String.prototype.split` only
 * keeps the separators it matched when they are captured. Without it every
 * link, bold run and code span is silently dropped from the output.
 */
const INLINE_MARKUP_REGEX = new RegExp(
  `(${[BOLD_SOURCE, ITALIC_SOURCE, CODE_SOURCE, MD_LINK_SOURCE, BARE_LINK_SOURCE].join("|")})`,
  "gi",
);

const DOMAIN_LABELS: Record<string, string> = {
  "linkedin.com": "LinkedIn",
  "www.linkedin.com": "LinkedIn",
  "github.com": "GitHub",
  "www.github.com": "GitHub",
  "leetcode.com": "LeetCode",
};

const LINK_CLASS =
  "inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-400 transition-colors";

/**
 * Trailing punctuation (".", ",", ")") is almost always sentence punctuation
 * rather than part of the URL, so we peel it off and render it as text.
 */
function splitTrailingPunctuation(url: string): [string, string] {
  const match = url.match(/[.,;:!?]+$/);
  if (!match) return [url, ""];
  return [url.slice(0, -match[0].length), match[0]];
}

function isSafeHref(href: string): boolean {
  try {
    // A base is required for scheme-relative parsing but is never used here,
    // because every candidate already carries an explicit scheme.
    const parsed = new URL(href);
    return SAFE_SCHEMES.includes(parsed.protocol);
  } catch {
    return false;
  }
}

function labelForUrl(href: string): string {
  try {
    const parsed = new URL(href);
    if (parsed.protocol === "mailto:") return parsed.pathname;
    if (parsed.protocol === "tel:") return parsed.pathname;
    return DOMAIN_LABELS[parsed.hostname] ?? parsed.hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

function renderLink(href: string, label: string, key: string): ReactNode {
  if (!isSafeHref(href)) return <span key={key}>{label}</span>;

  const isExternal = href.startsWith("http");

  return (
    <a
      key={key}
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={LINK_CLASS}
      title={href}
    >
      {label}
    </a>
  );
}

export function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const segments = text.split(INLINE_MARKUP_REGEX).filter(Boolean);

  return segments.map((segment, index) => {
    const key = `${keyPrefix}-inline-${index}`;

    const mdLink = segment.match(MD_LINK_REGEX);
    if (mdLink) {
      const [, label, href] = mdLink;
      return renderLink(href, label, key);
    }

    if (BARE_LINK_REGEX.test(segment)) {
      const [href, trailing] = splitTrailingPunctuation(segment);
      const anchor = renderLink(href, labelForUrl(href), key);
      return trailing ? (
        <span key={key}>
          {anchor}
          {trailing}
        </span>
      ) : (
        anchor
      );
    }

    if (segment.length > 4 && segment.startsWith("**") && segment.endsWith("**")) {
      return <strong key={key}>{segment.slice(2, -2)}</strong>;
    }

    if (segment.length > 2 && segment.startsWith("*") && segment.endsWith("*")) {
      return <em key={key}>{segment.slice(1, -1)}</em>;
    }

    if (segment.length > 2 && segment.startsWith("`") && segment.endsWith("`")) {
      return (
        <code
          key={key}
          className="rounded-sm bg-zinc-200/70 dark:bg-zinc-800 px-1 py-0.5 text-sm break-all"
        >
          {segment.slice(1, -1)}
        </code>
      );
    }

    return <span key={key}>{segment}</span>;
  });
}

const ORDERED_ITEM_REGEX = /^\d+[.)]\s+/;
const UNORDERED_ITEM_REGEX = /^[-*•]\s+/;
const HEADING_REGEX = /^(#{1,4})\s+(.*)$/;

export function renderBlock(block: string, keyPrefix: string): ReactNode {
  const lines = block
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return null;

  const heading = lines[0].match(HEADING_REGEX);
  if (heading && lines.length === 1) {
    return (
      <p
        key={`${keyPrefix}-h`}
        className="text-base font-semibold text-zinc-900 dark:text-zinc-100"
      >
        {renderInline(heading[2], `${keyPrefix}-h`)}
      </p>
    );
  }

  if (lines.every((line) => ORDERED_ITEM_REGEX.test(line))) {
    return (
      <ol
        key={`${keyPrefix}-ol`}
        className="list-decimal pl-6 space-y-1.5 marker:text-zinc-500 dark:marker:text-zinc-400"
      >
        {lines.map((line, index) => (
          <li key={`${keyPrefix}-ol-${index}`} className="text-base leading-relaxed">
            {renderInline(line.replace(ORDERED_ITEM_REGEX, ""), `${keyPrefix}-ol-${index}`)}
          </li>
        ))}
      </ol>
    );
  }

  if (lines.every((line) => UNORDERED_ITEM_REGEX.test(line))) {
    return (
      <ul
        key={`${keyPrefix}-ul`}
        className="list-disc pl-6 space-y-1.5 marker:text-zinc-500 dark:marker:text-zinc-400"
      >
        {lines.map((line, index) => (
          <li key={`${keyPrefix}-ul-${index}`} className="text-base leading-relaxed">
            {renderInline(line.replace(UNORDERED_ITEM_REGEX, ""), `${keyPrefix}-ul-${index}`)}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p key={`${keyPrefix}-p`} className="text-base leading-relaxed">
      {renderInline(lines.join(" "), `${keyPrefix}-p`)}
    </p>
  );
}

export function renderMessageContent(content: string, messageId: string): ReactNode {
  const blocks = content.trim().split(/\n\s*\n/);

  return (
    <div className="space-y-3 text-base leading-relaxed">
      {blocks.map((block, index) => renderBlock(block, `${messageId}-block-${index}`))}
    </div>
  );
}
