const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Problem = require('./models/problem');
const User = require('./models/user');
const { generateSolution, titleToSlug } = require('./utils/generateSolution');
const testcaseData = require('./utils/testcaseData');
const problemDescriptions = require('./utils/problemDescriptions');

dotenv.config();

// ─── Per-problem starter code (problem-specific scaffolding) ─────────────────
// Each entry keyed by slug gives users the correct variable names and
// cin/input parsing that matches the hidden testcase input format.
const starterCodeMap = {
  'two-sum': {
    cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    int target;\n    cin >> target;\n    // Your solution here\n    return 0;\n}',
    java: 'import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int n = Integer.parseInt(br.readLine().trim());\n        StringTokenizer st = new StringTokenizer(br.readLine());\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = Integer.parseInt(st.nextToken());\n        int target = Integer.parseInt(br.readLine().trim());\n        // Your solution here\n    }\n}',
    python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\n# Your solution here',
    javascript: 'const readline = require(\'readline\');\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on(\'line\', line => lines.push(line.trim()));\nrl.on(\'close\', () => {\n    const n = parseInt(lines[0]);\n    const nums = lines[1].split(\' \').map(Number);\n    const target = parseInt(lines[2]);\n    // Your solution here\n});'
  },
  'add-two-numbers': {
    cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    int n1; cin >> n1;\n    vector<int> a(n1);\n    for (int i = 0; i < n1; i++) cin >> a[i];\n    int n2; cin >> n2;\n    vector<int> b(n2);\n    for (int i = 0; i < n2; i++) cin >> b[i];\n    // Add two numbers represented as digit arrays (LSB first)\n    // Output: space-separated digits of the result\n    return 0;\n}',
    java: 'import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int n1 = Integer.parseInt(br.readLine().trim());\n        int[] a = Arrays.stream(br.readLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();\n        int n2 = Integer.parseInt(br.readLine().trim());\n        int[] b = Arrays.stream(br.readLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();\n        // Your solution here\n    }\n}',
    python: 'import sys\ninput = sys.stdin.readline\n\nn1 = int(input())\na = list(map(int, input().split()))\nn2 = int(input())\nb = list(map(int, input().split()))\n# Your solution here',
    javascript: 'const readline = require(\'readline\');\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on(\'line\', line => lines.push(line.trim()));\nrl.on(\'close\', () => {\n    let idx = 0;\n    const n1 = parseInt(lines[idx++]);\n    const a = lines[idx++].split(\' \').map(Number);\n    const n2 = parseInt(lines[idx++]);\n    const b = lines[idx++].split(\' \').map(Number);\n    // Your solution here\n});'
  },
  'longest-substring-without-repeating-characters': {
    cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    string s;\n    cin >> s;\n    // Find length of longest substring without repeating characters\n    // Output: integer\n    return 0;\n}',
    java: 'import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String s = br.readLine().trim();\n        // Your solution here\n    }\n}',
    python: 'import sys\ninput = sys.stdin.readline\n\ns = input().strip()\n# Your solution here',
    javascript: 'const readline = require(\'readline\');\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on(\'line\', line => lines.push(line.trim()));\nrl.on(\'close\', () => {\n    const s = lines[0];\n    // Your solution here\n});'
  },
  'longest-palindromic-substring': {
    cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    string s;\n    cin >> s;\n    // Find the longest palindromic substring\n    // Output: the substring itself\n    return 0;\n}',
    java: 'import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String s = br.readLine().trim();\n        // Your solution here\n    }\n}',
    python: 'import sys\ninput = sys.stdin.readline\n\ns = input().strip()\n# Your solution here',
    javascript: 'const readline = require(\'readline\');\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on(\'line\', line => lines.push(line.trim()));\nrl.on(\'close\', () => {\n    const s = lines[0];\n    // Your solution here\n});'
  },
  'zigzag-conversion': {
    cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    string s;\n    int numRows;\n    cin >> s >> numRows;\n    // Write the characters in zigzag then read row by row\n    // Output: the converted string\n    return 0;\n}',
    java: 'import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String s = br.readLine().trim();\n        int numRows = Integer.parseInt(br.readLine().trim());\n        // Your solution here\n    }\n}',
    python: 'import sys\ninput = sys.stdin.readline\n\ns = input().strip()\nnum_rows = int(input().strip())\n# Your solution here',
    javascript: 'const readline = require(\'readline\');\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on(\'line\', line => lines.push(line.trim()));\nrl.on(\'close\', () => {\n    const s = lines[0];\n    const numRows = parseInt(lines[1]);\n    // Your solution here\n});'
  },
  'reverse-integer': {
    cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    long long x;\n    cin >> x;\n    // Reverse digits of x; return 0 if result overflows 32-bit int\n    return 0;\n}',
    java: 'import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        long x = Long.parseLong(br.readLine().trim());\n        // Your solution here\n    }\n}',
    python: 'import sys\ninput = sys.stdin.readline\n\nx = int(input().strip())\n# Your solution here',
    javascript: 'const readline = require(\'readline\');\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on(\'line\', line => lines.push(line.trim()));\nrl.on(\'close\', () => {\n    const x = parseInt(lines[0]);\n    // Your solution here\n});'
  },
  'container-with-most-water': {
    cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    vector<int> h(n);\n    for (int i = 0; i < n; i++) cin >> h[i];\n    // Find two lines that together with x-axis form container with most water\n    // Output: integer (max area)\n    return 0;\n}',
    java: 'import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int n = Integer.parseInt(br.readLine().trim());\n        int[] h = Arrays.stream(br.readLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();\n        // Your solution here\n    }\n}',
    python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nh = list(map(int, input().split()))\n# Your solution here',
    javascript: 'const readline = require(\'readline\');\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on(\'line\', line => lines.push(line.trim()));\nrl.on(\'close\', () => {\n    const n = parseInt(lines[0]);\n    const h = lines[1].split(\' \').map(Number);\n    // Your solution here\n});'
  },
  '4sum': {
    cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    long long target;\n    cin >> target;\n    // Find all unique quadruplets that sum to target\n    // Output: each quadruplet on a separate line, elements space-separated\n    return 0;\n}',
    java: 'import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int n = Integer.parseInt(br.readLine().trim());\n        StringTokenizer st = new StringTokenizer(br.readLine());\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = Integer.parseInt(st.nextToken());\n        long target = Long.parseLong(br.readLine().trim());\n        // Your solution here\n    }\n}',
    python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\n# Your solution here',
    javascript: 'const readline = require(\'readline\');\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on(\'line\', line => lines.push(line.trim()));\nrl.on(\'close\', () => {\n    const n = parseInt(lines[0]);\n    const nums = lines[1].split(\' \').map(Number);\n    const target = parseInt(lines[2]);\n    // Your solution here\n});'
  }
};

/** Build the 4-language starterCode array for a given slug. Falls back to generic template. */
function buildStarterCode(slug) {
  const entry = starterCodeMap[slug];
  if (entry) {
    return [
      { language: 'cpp',        initialCode: entry.cpp },
      { language: 'java',       initialCode: entry.java },
      { language: 'python',     initialCode: entry.python },
      { language: 'javascript', initialCode: entry.javascript },
    ];
  }
  // Generic fallback for problems without a specific starter
  return [
    { language: 'cpp',        initialCode: '#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    // Read input from stdin, write output to stdout\n    return 0;\n}' },
    { language: 'java',       initialCode: 'import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        // Read input from stdin, write output to stdout\n    }\n}' },
    { language: 'python',     initialCode: 'import sys\ninput = sys.stdin.readline\n\n# Read input from stdin, write output to stdout\n' },
    { language: 'javascript', initialCode: 'const readline = require(\'readline\');\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on(\'line\', line => lines.push(line.trim()));\nrl.on(\'close\', () => {\n    // lines[0], lines[1], ... contain your input\n    // console.log(answer);\n});\n' },
  ];
}

// ─── Problem Metadata ───────────────────────────────────────────────────────

const availableTags = [
  "Array", "Binary Search", "Sorting", "Hash Table", "Two Pointers",
  "Dynamic Programming", "Stack", "Math", "Basic Operations", "In-place"
];

const companiesList = [
  "Amazon", "Google", "Facebook", "Microsoft", "Apple",
  "Netflix", "Uber", "Tesla", "Adobe", "Yahoo"
];

const difficulties = ["easy", "medium", "hard"];

const problemTitles = [
  "Two Sum", "Add Two Numbers", "Longest Substring Without Repeating Characters",
  "Median of Two Sorted Arrays", "Longest Palindromic Substring",
  "Zigzag Conversion", "Reverse Integer", "String to Integer (atoi)",
  "Palindrome Number", "Regular Expression Matching",
  "Container With Most Water", "Integer to Roman", "Roman to Integer",
  "Longest Common Prefix", "3Sum",
  "3Sum Closest", "Letter Combinations of a Phone Number", "4Sum",
  "Remove Nth Node From End of List", "Valid Parentheses",
  "Merge Two Sorted Lists", "Generate Parentheses", "Merge k Sorted Lists",
  "Swap Nodes in Pairs", "Reverse Nodes in k-Group",
  "Remove Duplicates from Sorted Array", "Remove Element",
  "Find the Index of the First Occurrence in a String", "Divide Two Integers",
  "Substring with Concatenation of All Words",
  "Next Permutation", "Longest Valid Parentheses",
  "Search in Rotated Sorted Array",
  "Find First and Last Position of Element in Sorted Array",
  "Search Insert Position",
  "Valid Sudoku", "Sudoku Solver", "Count and Say",
  "Combination Sum", "Combination Sum II",
  "First Missing Positive", "Trapping Rain Water", "Multiply Strings",
  "Wildcard Matching", "Jump Game II",
  "Permutations", "Permutations II", "Rotate Image",
  "Group Anagrams", "Pow(x, n)"
];

// Specific tag overrides so solutions are routed to the right template
const tagOverrides = {
  "Two Sum":                                       ["Hash Table", "Array"],
  "Add Two Numbers":                               ["Array", "Math"],
  "Longest Substring Without Repeating Characters":["Sliding Window", "Hash Table", "String"],
  "Median of Two Sorted Arrays":                   ["Binary Search", "Array"],
  "Longest Palindromic Substring":                 ["Dynamic Programming", "String"],
  "Zigzag Conversion":                             ["String"],
  "Reverse Integer":                               ["Math"],
  "String to Integer (atoi)":                      ["String", "Math"],
  "Palindrome Number":                             ["Math"],
  "Regular Expression Matching":                   ["Dynamic Programming", "String"],
  "Container With Most Water":                     ["Two Pointers", "Array"],
  "Integer to Roman":                              ["Math", "Hash Table"],
  "Roman to Integer":                              ["Math", "Hash Table"],
  "Longest Common Prefix":                         ["String"],
  "3Sum":                                          ["Two Pointers", "Array", "Sorting"],
  "3Sum Closest":                                  ["Two Pointers", "Array"],
  "Letter Combinations of a Phone Number":         ["Backtracking", "String"],
  "4Sum":                                          ["Two Pointers", "Array", "Sorting"],
  "Remove Nth Node From End of List":              ["Two Pointers"],
  "Valid Parentheses":                             ["Stack", "String"],
  "Merge Two Sorted Lists":                        ["Array", "Sorting"],
  "Generate Parentheses":                          ["Backtracking", "String"],
  "Merge k Sorted Lists":                          ["Array", "Sorting"],
  "Swap Nodes in Pairs":                           ["Array"],
  "Reverse Nodes in k-Group":                      ["Array"],
  "Remove Duplicates from Sorted Array":           ["Two Pointers", "Array"],
  "Remove Element":                                ["Two Pointers", "Array"],
  "Find the Index of the First Occurrence in a String": ["String", "Two Pointers"],
  "Divide Two Integers":                           ["Math", "Bit Manipulation"],
  "Substring with Concatenation of All Words":     ["Sliding Window", "Hash Table", "String"],
  "Next Permutation":                              ["Array", "Two Pointers"],
  "Longest Valid Parentheses":                     ["Dynamic Programming", "Stack"],
  "Search in Rotated Sorted Array":                ["Binary Search", "Array"],
  "Find First and Last Position of Element in Sorted Array": ["Binary Search", "Array"],
  "Search Insert Position":                        ["Binary Search", "Array"],
  "Valid Sudoku":                                  ["Array", "Hash Table"],
  "Sudoku Solver":                                 ["Backtracking", "Array"],
  "Count and Say":                                 ["String"],
  "Combination Sum":                               ["Backtracking", "Array"],
  "Combination Sum II":                            ["Backtracking", "Array"],
  "First Missing Positive":                        ["Array", "In-place"],
  "Trapping Rain Water":                           ["Two Pointers", "Stack", "Array"],
  "Multiply Strings":                              ["Math", "String"],
  "Wildcard Matching":                             ["Dynamic Programming", "String"],
  "Jump Game II":                                  ["Greedy", "Array"],
  "Permutations":                                  ["Backtracking", "Array"],
  "Permutations II":                               ["Backtracking", "Array"],
  "Rotate Image":                                  ["Array", "Math", "In-place"],
  "Group Anagrams":                                ["Hash Table", "String", "Sorting"],
  "Pow(x, n)":                                     ["Math", "Binary Search"],
};

const videoMap = {
  "Two Sum": "KLlXCFG5TnA",
  "Add Two Numbers": "wgFPrzTjm7s",
  "Longest Substring Without Repeating Characters": "-zSxTJkcdAo",
  "Median of Two Sorted Arrays": "F9c7LpRZWVQ",
  "Longest Palindromic Substring": "XYQecbcd6_c",
  "Zigzag Conversion": "Q2Tw6gcVEwc",
  "Reverse Integer": "0fwrMYPcGQ0",
  "String to Integer (atoi)": "qZoFJKyHQ98",
  "Palindrome Number": "yubRKwixN-U",
  "Regular Expression Matching": "-zSxTJkcdAo",
  "Container With Most Water": "F9c7LpRZWVQ",
  "Integer to Roman": "0fwrMYPcGQ0",
  "Roman to Integer": "3jdxYj3DD98",
  "Longest Common Prefix": "qZoFJKyHQ98",
  "3Sum": "jzZsG8n2R9A",
  "3Sum Closest": "qBr2hq4daWE",
  "Letter Combinations of a Phone Number": "-zSxTJkcdAo",
  "4Sum": "F9c7LpRZWVQ",
  "Remove Nth Node From End of List": "0fwrMYPcGQ0",
  "Valid Parentheses": "qZoFJKyHQ98",
  "Merge Two Sorted Lists": "XIdigk956u0",
  "Generate Parentheses": "s9fokUqJ76A",
  "Merge k Sorted Lists": "q5a5OiGbT6Q",
  "Swap Nodes in Pairs": "o811TZLAWOo",
  "Reverse Nodes in k-Group": "1UOPsfP85V4",
  "Remove Duplicates from Sorted Array": "-zSxTJkcdAo",
  "Remove Element": "Pcd1ii9P9ZI",
  "Find the Index of the First Occurrence in a String": "F9c7LpRZWVQ",
  "Divide Two Integers": "0fwrMYPcGQ0",
  "Substring with Concatenation of All Words": "qZoFJKyHQ98",
  "Next Permutation": "IhsUbEMfIbY",
  "Longest Valid Parentheses": "-zSxTJkcdAo",
  "Search in Rotated Sorted Array": "U8XENwh8Oy8",
  "Find First and Last Position of Element in Sorted Array": "4sQL7R5ySUU",
  "Search Insert Position": "K-RYzDZkzCI",
  "Valid Sudoku": "TjFXEUCMqI8",
  "Sudoku Solver": "tvP_FZ-D9Ng",
  "Count and Say": "F9c7LpRZWVQ",
  "Combination Sum": "GBKI9VSKdGg",
  "Combination Sum II": "rSA3t6BDDwg",
  "First Missing Positive": "0fwrMYPcGQ0",
  "Trapping Rain Water": "ZI2z5pq0TqA",
  "Multiply Strings": "1vZswirL8Y8",
  "Wildcard Matching": "qZoFJKyHQ98",
  "Jump Game II": "-zSxTJkcdAo",
  "Permutations": "s7AvT7cGdSo",
  "Permutations II": "F9c7LpRZWVQ",
  "Rotate Image": "fMSJSS7eO1w",
  "Group Anagrams": "0fwrMYPcGQ0",
  "Pow(x, n)": "g9YQyYi4IQQ"
};

// ─── Problem Generator ───────────────────────────────────────────────────────

const generateDummyProblems = () => {
  return problemTitles.map((title, i) => {
    // Use tag overrides when available, otherwise randomise
    const tags = tagOverrides[title] || (() => {
      const shuffled = [...availableTags].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.floor(Math.random() * 3) + 1);
    })();

    const numCompanies = Math.floor(Math.random() * 4) + 1;
    const companies = [...companiesList].sort(() => 0.5 - Math.random()).slice(0, numCompanies);
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    const acceptanceRate = parseFloat((Math.random() * 60 + 20).toFixed(1));

    // Compute slug once — used for SLUG_MAP dispatch and starterCode selection
    const slug = titleToSlug(title);
    // generateSolution dispatches by slug first, tag-based fallback second
    const { referenceSolution, editorial } = generateSolution({ title, slug, tags, difficulty });
    console.log(`[seed] ${title} → slug: "${slug}"`);
    console.log(`[seed]   solution[0] first 60 chars: ${referenceSolution[0]?.completeCode?.slice(0,60).replace(/\n/g,' ')}...`);

    // Real per-problem description and constraints
    const descData = problemDescriptions[title];
    const description = descData?.description ||
      `Given the problem "${title}", implement an efficient solution that satisfies the constraints.`;
    const constraints = descData?.constraints || [];

    // Get real testcases - fall back to safe placeholder only if missing
    const tc = testcaseData[title];
    const visibleTestCases = tc?.visible?.map(t => ({
      input: t.input,
      output: t.output,
      explanation: t.explanation || ''
    })) || [
      { input: 'See problem description for examples', output: 'N/A', explanation: '' }
    ];
    const hiddenTestCases = tc?.hidden?.map(t => ({
      input: t.input,
      output: t.output
    })) || [];

    return {
      title,
      description,
      constraints,
      difficulty,
      tags,
      companies,
      acceptanceRate,
      editorial,
      videoId: videoMap[title] || "",
      visibleTestCases,
      hiddenTestCases,
      starterCode: buildStarterCode(slug),
      // Each problem now gets a UNIQUE solution generated by generateSolution()
      referenceSolution,
    };
  });
};

// ─── Seeder ──────────────────────────────────────────────────────────────────

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT_STRING);
    console.log("Connected to MongoDB for seeding...");

    let admin = await User.findOne({ role: 'admin' }) || await User.findOne();
    if (!admin) {
      console.error("No users found. Please register a user first.");
      process.exit(1);
    }

    const problems = generateDummyProblems();
    let added = 0, updated = 0;

    for (const data of problems) {
      const exists = await Problem.findOne({ title: data.title });
      if (!exists) {
        await new Problem({ ...data, problemCreator: admin._id }).save();
        console.log(`[ADD]    ${data.title}`);
        added++;
      } else {
        await Problem.updateOne({ _id: exists._id }, {
          $set: {
            description:       data.description,
            constraints:       data.constraints,
            tags:              data.tags,
            companies:         data.companies,
            acceptanceRate:    data.acceptanceRate,
            editorial:         data.editorial,
            videoId:           data.videoId,
            starterCode:       data.starterCode,
            referenceSolution: data.referenceSolution,
            visibleTestCases:  data.visibleTestCases,
            hiddenTestCases:   data.hiddenTestCases,
          }
        });
        console.log(`[UPDATE] ${data.title}`);
        updated++;
      }
    }

    console.log(`\nDone! Added: ${added}, Updated: ${updated}`);
    mongoose.disconnect();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedDB();
