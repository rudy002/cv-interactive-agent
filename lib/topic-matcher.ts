/**
 * Routes a chat message to the browser tab it talks about.
 *
 * The previous implementation used `text.includes(keyword)`, which matched on
 * raw substrings: the keyword "ai" fired on "em(ai)l", "m(ai)n", "av(ai)lable",
 * "ag(ai)n", "det(ai)ls"… Because the first matching tab won, almost every
 * message resolved to the chat tab and auto-navigation silently did nothing.
 *
 * Here we tokenize both sides and require whole-token matches, then score every
 * candidate so the most specific tab wins instead of the first one declared.
 */

export interface TopicCandidate {
  id: string;
  keywords: string[];
}

export interface TopicMatch {
  id: string;
  score: number;
  /** Keywords that actually matched, useful for debugging and tests. */
  matched: string[];
}

/**
 * Lowercase and strip Latin diacritics so "expérience" matches "experience".
 * Hebrew niqqud lives outside U+0300–U+036F and is left untouched.
 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Split into alphanumeric tokens across scripts (Latin, Hebrew, digits).
 * "Next.js" -> ["next", "js"], "CI/CD" -> ["ci", "cd"].
 */
export function tokenize(text: string): string[] {
  return normalize(text).match(/[\p{L}\p{N}]+/gu) ?? [];
}

const HEBREW_LETTER = /^[\u0590-\u05ff]+$/;
/**
 * Hebrew glues its definite article and prepositions onto the following word,
 * so "כישורים" (skills) shows up as "הכישורים" in a real question. Allow one or
 * two of those clitics in front of a Hebrew keyword.
 */
const HEBREW_PREFIXES = ["ה", "ו", "ב", "ל", "מ", "כ", "ש"];

function tokenMatches(token: string, keywordToken: string): boolean {
  if (token === keywordToken) return true;

  if (!HEBREW_LETTER.test(keywordToken)) return false;

  for (const first of HEBREW_PREFIXES) {
    if (token === first + keywordToken) return true;

    for (const second of HEBREW_PREFIXES) {
      if (token === first + second + keywordToken) return true;
    }
  }

  return false;
}

/** True when `needle` appears as a contiguous run inside `haystack`. */
function containsSequence(haystack: string[], needle: string[]): boolean {
  if (needle.length === 0 || needle.length > haystack.length) return false;

  for (let i = 0; i <= haystack.length - needle.length; i += 1) {
    let hit = true;
    for (let j = 0; j < needle.length; j += 1) {
      if (!tokenMatches(haystack[i + j], needle[j])) {
        hit = false;
        break;
      }
    }
    if (hit) return true;
  }
  return false;
}

/**
 * Score a single candidate against a message.
 *
 * A keyword is worth its own token count, so "work experience" (2) outranks
 * "work" (1) and multi-word, more specific vocabulary wins ties.
 */
export function scoreCandidate(
  text: string,
  candidate: TopicCandidate,
): TopicMatch {
  const tokens = tokenize(text);
  const matched: string[] = [];
  let score = 0;

  for (const keyword of candidate.keywords) {
    const keywordTokens = tokenize(keyword);
    // Guard against degenerate entries (empty strings, lone punctuation).
    if (keywordTokens.length === 0) continue;

    if (containsSequence(tokens, keywordTokens)) {
      matched.push(keyword);
      score += keywordTokens.length;
    }
  }

  return { id: candidate.id, score, matched };
}

/**
 * Pick the best-matching candidate, or `null` when nothing matches.
 *
 * Ties fall back to declaration order, so callers control the priority by
 * ordering the array they pass in.
 */
export function matchTopic(
  text: string,
  candidates: TopicCandidate[],
): TopicMatch | null {
  if (!text.trim()) return null;

  let best: TopicMatch | null = null;

  for (const candidate of candidates) {
    const result = scoreCandidate(text, candidate);
    if (result.score > 0 && (best === null || result.score > best.score)) {
      best = result;
    }
  }

  return best;
}
