/**
 * generateSolution.js
 *
 * ROOT CAUSE OF THE PREVIOUS BUG:
 * The old TAG_MAP did fuzzy keyword matching — Zigzag Conversion (tagged "String")
 * matched stringTemplate.js which contained Longest Substring Without Repeating
 * Characters (sliding window) code. Every String-tagged problem got the same
 * wrong solution.
 *
 * FIX:
 * A SLUG_MAP dispatches by exact problem slug FIRST. Only problems with no slug
 * entry fall through to the tag-based rules (for future admin-added problems).
 * This guarantees every seeded problem gets the right solution code.
 */

// ─── Exact per-problem templates ─────────────────────────────────────────────
const zigzagTemplate             = require('./solutionTemplates/zigzagTemplate');
const slidingWindowTemplate      = require('./solutionTemplates/slidingWindowTemplate');
const palindromeSubstringTemplate= require('./solutionTemplates/palindromeSubstringTemplate');
const containerWaterTemplate     = require('./solutionTemplates/containerWaterTemplate');
const reverseIntegerTemplate     = require('./solutionTemplates/reverseIntegerTemplate');
const addTwoNumbersTemplate      = require('./solutionTemplates/addTwoNumbersTemplate');
const regularExpressionTemplate  = require('./solutionTemplates/regularExpressionTemplate');
const fourSumTemplate            = require('./solutionTemplates/fourSumTemplate');
const rotateImageTemplate        = require('./solutionTemplates/rotateImageTemplate');

// ─── Generic / pattern templates (used by slug map + tag fallback) ────────────
const hashMapTemplate      = require('./solutionTemplates/hashMapTemplate');
const dpTemplate           = require('./solutionTemplates/dpTemplate');
const binarySearchTemplate = require('./solutionTemplates/binarySearchTemplate');
const stringTemplate       = require('./solutionTemplates/stringTemplate');
const twoPointersTemplate  = require('./solutionTemplates/twoPointersTemplate');
const backtrackTemplate    = require('./solutionTemplates/backtrackTemplate');
const mathTemplate         = require('./solutionTemplates/mathTemplate');
const greedyTemplate       = require('./solutionTemplates/greedyTemplate');
const stackTemplate        = require('./solutionTemplates/stackTemplate');
const palindromeTemplate   = require('./solutionTemplates/palindromeTemplate');
const arrayTemplate        = require('./solutionTemplates/arrayTemplate');
const fallbackTemplate     = require('./solutionTemplates/fallbackTemplate');

// ─── Slug → exact template map ───────────────────────────────────────────────
// Every seeded LeetCode problem has an entry here so template selection is
// deterministic and never relies on fuzzy keyword guessing.
const SLUG_MAP = {
  // ── LeetCode #1-10 ──────────────────────────────────────────────────────
  'two-sum':                                          hashMapTemplate,
  'add-two-numbers':                                  addTwoNumbersTemplate,
  'longest-substring-without-repeating-characters':   slidingWindowTemplate,
  'median-of-two-sorted-arrays':                      binarySearchTemplate,
  'longest-palindromic-substring':                    palindromeSubstringTemplate,
  'zigzag-conversion':                                zigzagTemplate,
  'reverse-integer':                                  reverseIntegerTemplate,
  'string-to-integer-atoi':                           mathTemplate,
  'palindrome-number':                                palindromeTemplate,
  'regular-expression-matching':                      regularExpressionTemplate,
  // ── LeetCode #11-20 ─────────────────────────────────────────────────────
  'container-with-most-water':                        containerWaterTemplate,
  'integer-to-roman':                                 mathTemplate,
  'roman-to-integer':                                 mathTemplate,
  'longest-common-prefix':                            stringTemplate,
  '3sum':                                             twoPointersTemplate,
  '3sum-closest':                                     twoPointersTemplate,
  'letter-combinations-of-a-phone-number':            backtrackTemplate,
  '4sum':                                             fourSumTemplate,
  'remove-nth-node-from-end-of-list':                 twoPointersTemplate,
  'valid-parentheses':                                stackTemplate,
  // ── LeetCode #21-30 ─────────────────────────────────────────────────────
  'merge-two-sorted-lists':                           arrayTemplate,
  'generate-parentheses':                             backtrackTemplate,
  'merge-k-sorted-lists':                             arrayTemplate,
  'swap-nodes-in-pairs':                              arrayTemplate,
  'reverse-nodes-in-k-group':                         arrayTemplate,
  'remove-duplicates-from-sorted-array':              twoPointersTemplate,
  'remove-element':                                   twoPointersTemplate,
  'find-the-index-of-the-first-occurrence-in-a-string': twoPointersTemplate,
  'divide-two-integers':                              mathTemplate,
  'substring-with-concatenation-of-all-words':        slidingWindowTemplate,
  // ── LeetCode #31-42 ─────────────────────────────────────────────────────
  'next-permutation':                                 arrayTemplate,
  'longest-valid-parentheses':                        stackTemplate,
  'search-in-rotated-sorted-array':                   binarySearchTemplate,
  'find-first-and-last-position-of-element-in-sorted-array': binarySearchTemplate,
  'search-insert-position':                           binarySearchTemplate,
  'valid-sudoku':                                     arrayTemplate,
  'sudoku-solver':                                    backtrackTemplate,
  'count-and-say':                                    stringTemplate,
  'combination-sum':                                  backtrackTemplate,
  'combination-sum-ii':                               backtrackTemplate,
  'first-missing-positive':                           arrayTemplate,
  'trapping-rain-water':                              twoPointersTemplate,
  // ── LeetCode #43-50 ─────────────────────────────────────────────────────
  'multiply-strings':                                 mathTemplate,
  'wildcard-matching':                                dpTemplate,
  'jump-game-ii':                                     greedyTemplate,
  'permutations':                                     backtrackTemplate,
  'permutations-ii':                                  backtrackTemplate,
  'rotate-image':                                     rotateImageTemplate,
  'group-anagrams':                                   hashMapTemplate,
  'powx-n':                                           mathTemplate,
};

// ─── Tag-based fallback (for admin-created problems not in SLUG_MAP) ─────────
const TAG_MAP = [
  { keywords: ['palindrome'],                                              template: palindromeTemplate },
  { keywords: ['dynamic programming', 'dp', 'memoization', 'tabulation'], template: dpTemplate },
  { keywords: ['binary search'],                                           template: binarySearchTemplate },
  { keywords: ['backtracking', 'permutation', 'combination', 'subset'],  template: backtrackTemplate },
  { keywords: ['stack', 'monotonic stack'],                               template: stackTemplate },
  { keywords: ['greedy'],                                                  template: greedyTemplate },
  { keywords: ['two pointers', 'sliding window'],                         template: twoPointersTemplate },
  { keywords: ['hash table', 'hash map', 'hashmap'],                      template: hashMapTemplate },
  { keywords: ['math', 'bit manipulation', 'in-place', 'basic operations'], template: mathTemplate },
  { keywords: ['array', 'sorting', 'sort'],                               template: arrayTemplate },
  { keywords: ['string'],                                                  template: stringTemplate },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Convert a problem title to a URL-style slug.
 * Matches the slugs used as keys in SLUG_MAP.
 *   "Zigzag Conversion"      → "zigzag-conversion"
 *   "Pow(x, n)"              → "powx-n"
 *   "3Sum"                   → "3sum"
 *   "String to Integer (atoi)" → "string-to-integer-atoi"
 */
function titleToSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // strip special chars except spaces/hyphens
    .trim()
    .replace(/\s+/g, '-');        // spaces → hyphens
}

/**
 * Select the best template for a problem.
 * Priority: explicit slug entry → tag-based fallback → generic fallback.
 */
function selectTemplate(problem) {
  // 1. Slug-keyed exact match (always correct for seeded problems)
  const slug = problem.slug || titleToSlug(problem.title || '');
  if (slug && SLUG_MAP[slug]) {
    console.log(`[generateSolution] slug match: "${slug}" → ${SLUG_MAP[slug].name || 'template'}`);
    return SLUG_MAP[slug];
  }

  // 2. Tag / title keyword fallback (for future admin-added problems)
  const lowerTags  = (problem.tags  || []).map(t => t.toLowerCase());
  const lowerTitle = (problem.title || '').toLowerCase();
  for (const { keywords, template } of TAG_MAP) {
    if (keywords.some(kw => lowerTags.some(tag => tag.includes(kw)) || lowerTitle.includes(kw))) {
      console.log(`[generateSolution] tag match for "${problem.title}" → keyword hit`);
      return template;
    }
  }

  // 3. Generic fallback
  console.warn(`[generateSolution] no match for "${problem.title}" (slug: ${slug}) — using fallback`);
  return fallbackTemplate;
}

/**
 * Convert the rich solution object into the [{language, completeCode}] array
 * required by the Problem mongoose schema's `referenceSolution` field.
 */
function toReferenceSolution(sol) {
  return [
    { language: 'cpp',        completeCode: sol.code.cpp },
    { language: 'java',       completeCode: sol.code.java },
    { language: 'python',     completeCode: sol.code.python },
    { language: 'javascript', completeCode: sol.code.javascript },
  ];
}

/**
 * Main export: generate a unique, correct solution for a given problem.
 * Returns { referenceSolution, editorial } so seed.js can spread both.
 *
 * @param {Object} problem - must include { title, tags, difficulty } at minimum
 * @returns {{ referenceSolution: Array, editorial: string }}
 */
function generateSolution(problem) {
  const template = selectTemplate(problem);
  const sol      = template(problem);

  const editorial =
    `### Explanation\n${sol.explanation}\n\n` +
    `### Approach\n${sol.approach}\n\n` +
    `### Complexity\n- **Time:** ${sol.timeComplexity}\n- **Space:** ${sol.spaceComplexity}`;

  return {
    referenceSolution: toReferenceSolution(sol),
    editorial,
  };
}

module.exports = { generateSolution, titleToSlug };
