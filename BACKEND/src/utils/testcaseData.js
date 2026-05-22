/**
 * testcaseData.js
 * Real visible testcases + hidden testcases for each problem.
 * This replaces the fake "Sample Input 1 / Sample Output 1" placeholders.
 */

module.exports = {
  "Two Sum": {
    visible: [
      { input: "4\n2 7 11 15\n9", output: "0 1", explanation: "nums[0] + nums[1] = 2 + 7 = 9, so return [0, 1]." },
      { input: "3\n3 2 4\n6",     output: "1 2", explanation: "nums[1] + nums[2] = 2 + 4 = 6." }
    ],
    hidden: [
      { input: "2\n3 3\n6",       output: "0 1" },
      { input: "5\n1 2 3 4 5\n9", output: "3 4" }
    ]
  },

  "Add Two Numbers": {
    visible: [
      { input: "3\n2 4 3\n3\n5 6 4", output: "7 0 8", explanation: "342 + 465 = 807." },
      { input: "1\n0\n1\n0",          output: "0",     explanation: "0 + 0 = 0." }
    ],
    hidden: [
      { input: "7\n9 9 9 9 9 9 9\n4\n9 9 9 9", output: "8 9 9 9 0 0 0 1" },
      { input: "1\n5\n1\n5",                    output: "0 1" }
    ]
  },

  "Longest Substring Without Repeating Characters": {
    visible: [
      { input: "abcabcbb", output: "3", explanation: "The answer is 'abc', with length 3." },
      { input: "bbbbb",    output: "1", explanation: "The answer is 'b', with length 1." }
    ],
    hidden: [
      { input: "pwwkew", output: "3" },
      { input: "dvdf",   output: "3" }
    ]
  },

  "Median of Two Sorted Arrays": {
    visible: [
      { input: "2\n1 3\n1\n2",   output: "2.00000", explanation: "Merged: [1,2,3], median is 2." },
      { input: "2\n1 2\n2\n3 4", output: "2.50000", explanation: "Merged: [1,2,3,4], median is (2+3)/2 = 2.5." }
    ],
    hidden: [
      { input: "0\n\n1\n1",       output: "1.00000" },
      { input: "2\n1 3\n2\n2 7",  output: "2.50000" }
    ]
  },

  "Longest Palindromic Substring": {
    visible: [
      { input: "babad", output: "bab", explanation: "'aba' is also valid." },
      { input: "cbbd",  output: "bb",  explanation: "'bb' is the longest palindrome." }
    ],
    hidden: [
      { input: "a",     output: "a" },
      { input: "racecar", output: "racecar" }
    ]
  },

  "Zigzag Conversion": {
    visible: [
      { input: "PAYPALISHIRING\n3", output: "PAHNAPLSIIGYIR", explanation: "3 rows zigzag." },
      { input: "PAYPALISHIRING\n4", output: "PINALSIGYAHRPI", explanation: "4 rows zigzag." }
    ],
    hidden: [
      { input: "A\n1",    output: "A" },
      { input: "AB\n1",   output: "AB" }
    ]
  },

  "Reverse Integer": {
    visible: [
      { input: "123",  output: "321", explanation: "Reverse of 123 is 321." },
      { input: "-123", output: "-321", explanation: "Reverse of -123 is -321." }
    ],
    hidden: [
      { input: "120",        output: "21" },
      { input: "1534236469", output: "0" }
    ]
  },

  "String to Integer (atoi)": {
    visible: [
      { input: "42",         output: "42",   explanation: "The string '42' converts to integer 42." },
      { input: "   -042",    output: "-42",  explanation: "Leading spaces and zeros handled." }
    ],
    hidden: [
      { input: "1337c0d3",   output: "1337" },
      { input: "-91283472332", output: "-2147483648" }
    ]
  },

  "Palindrome Number": {
    visible: [
      { input: "121",  output: "true",  explanation: "121 reads same forward and backward." },
      { input: "-121", output: "false", explanation: "Negative numbers are not palindromes." }
    ],
    hidden: [
      { input: "10",   output: "false" },
      { input: "0",    output: "true"  }
    ]
  },

  "Regular Expression Matching": {
    visible: [
      { input: "aa\na",    output: "false", explanation: "'a' doesn't match 'aa'." },
      { input: "aa\na*",   output: "true",  explanation: "'a*' matches zero or more 'a'." }
    ],
    hidden: [
      { input: "ab\n.*",   output: "true"  },
      { input: "aab\nc*a*b", output: "true" }
    ]
  },

  "Container With Most Water": {
    visible: [
      { input: "9\n1 8 6 2 5 4 8 3 7", output: "49", explanation: "Lines 8 and 7 form the container with max water = 49." },
      { input: "2\n1 1",               output: "1",  explanation: "Only one container possible." }
    ],
    hidden: [
      { input: "4\n4 3 2 1",   output: "4"  },
      { input: "4\n1 2 4 3",   output: "4"  }
    ]
  },

  "Integer to Roman": {
    visible: [
      { input: "3749", output: "MMMDCCXLIX", explanation: "3000=MMM, 700=DCC, 49=XLIX." },
      { input: "58",   output: "LVIII",      explanation: "L=50, V=5, III=3." }
    ],
    hidden: [
      { input: "1994", output: "MCMXCIV" },
      { input: "4",    output: "IV" }
    ]
  },

  "Roman to Integer": {
    visible: [
      { input: "III",     output: "3",    explanation: "I+I+I = 3." },
      { input: "LVIII",   output: "58",   explanation: "L=50, V=5, III=3." }
    ],
    hidden: [
      { input: "MCMXCIV", output: "1994" },
      { input: "IV",      output: "4"    }
    ]
  },

  "Longest Common Prefix": {
    visible: [
      { input: "3\nflower\nflow\nflight", output: "fl",  explanation: "Common prefix is 'fl'." },
      { input: "3\ndog\nracecar\ncar",    output: "",    explanation: "No common prefix." }
    ],
    hidden: [
      { input: "1\nabc",                 output: "abc" },
      { input: "2\ninterspecies\ninterstellar", output: "inters" }
    ]
  },

  "3Sum": {
    visible: [
      { input: "6\n-1 0 1 2 -1 -4", output: "-1 -1 2\n-1 0 1", explanation: "Two triplets sum to 0." },
      { input: "3\n0 1 1",           output: "",                explanation: "No triplet sums to 0." }
    ],
    hidden: [
      { input: "3\n0 0 0",            output: "0 0 0" },
      { input: "5\n-2 0 1 1 2",       output: "-2 0 2\n-2 1 1" }
    ]
  },

  "3Sum Closest": {
    visible: [
      { input: "4\n-1 2 1 -4\n1", output: "2",  explanation: "-1+2+1=2 is closest to 1." },
      { input: "3\n0 0 0\n1",     output: "0",  explanation: "0+0+0=0." }
    ],
    hidden: [
      { input: "4\n1 1 1 0\n-100", output: "2" },
      { input: "5\n-3 -2 -5 3 -4\n-1", output: "-2" }
    ]
  },

  "Letter Combinations of a Phone Number": {
    visible: [
      { input: "23", output: "ad ae af bd be bf cd ce cf", explanation: "All combos of 'abc' and 'def'." },
      { input: "",   output: "",                           explanation: "Empty input gives empty output." }
    ],
    hidden: [
      { input: "2",  output: "a b c" },
      { input: "9",  output: "w x y z" }
    ]
  },

  "4Sum": {
    visible: [
      { input: "6\n1 0 -1 0 -2 2\n0", output: "-2 -1 1 2\n-2 0 0 2\n-1 0 0 1", explanation: "Quadruplets summing to 0." },
      { input: "4\n2 2 2 2 2\n8",     output: "2 2 2 2",                         explanation: "One quadruplet." }
    ],
    hidden: [
      { input: "1\n0\n0", output: "" },
      { input: "4\n-3 -2 -1 0\n-6", output: "-3 -2 -1 0" }
    ]
  },

  "Remove Nth Node From End of List": {
    visible: [
      { input: "5\n1 2 3 4 5\n2", output: "1 2 3 5", explanation: "Remove 4th node (2nd from end)." },
      { input: "1\n1\n1",         output: "",         explanation: "Remove only node." }
    ],
    hidden: [
      { input: "2\n1 2\n1", output: "1" },
      { input: "3\n1 2 3\n3", output: "2 3" }
    ]
  },

  "Valid Parentheses": {
    visible: [
      { input: "()",    output: "true",  explanation: "Single pair is valid." },
      { input: "()[]{}", output: "true", explanation: "All pairs match." }
    ],
    hidden: [
      { input: "(]",   output: "false" },
      { input: "([)]", output: "false" },
      { input: "{[]}",  output: "true"  }
    ]
  },

  "Merge Two Sorted Lists": {
    visible: [
      { input: "3\n1 2 4\n3\n1 3 4", output: "1 1 2 3 4 4", explanation: "Merged sorted list." },
      { input: "0\n\n0\n",           output: "",             explanation: "Both empty." }
    ],
    hidden: [
      { input: "0\n\n3\n1 2 3", output: "1 2 3" },
      { input: "2\n1 3\n2\n2 4", output: "1 2 3 4" }
    ]
  },

  "Generate Parentheses": {
    visible: [
      { input: "3", output: "((()))\n(()())\n(())()\n()(())\n()()()", explanation: "All valid combos for n=3." },
      { input: "1", output: "()",                                      explanation: "Only one valid pair." }
    ],
    hidden: [
      { input: "2", output: "(())\n()()" }
    ]
  },

  "Merge k Sorted Lists": {
    visible: [
      { input: "3\n3\n1 4 5\n3\n1 3 4\n2\n2 6", output: "1 1 2 3 4 4 5 6", explanation: "Merged all three sorted lists." },
      { input: "0",                               output: "",                explanation: "No lists." }
    ],
    hidden: [
      { input: "1\n0\n", output: "" },
      { input: "2\n2\n1 2\n2\n3 4", output: "1 2 3 4" }
    ]
  },

  "Swap Nodes in Pairs": {
    visible: [
      { input: "4\n1 2 3 4", output: "2 1 4 3", explanation: "Pairs swapped." },
      { input: "0\n",        output: "",         explanation: "Empty list." }
    ],
    hidden: [
      { input: "1\n1",       output: "1" },
      { input: "3\n1 2 3",   output: "2 1 3" }
    ]
  },

  "Reverse Nodes in k-Group": {
    visible: [
      { input: "5\n1 2 3 4 5\n2", output: "2 1 4 3 5", explanation: "Reversed in groups of 2." },
      { input: "5\n1 2 3 4 5\n3", output: "3 2 1 4 5", explanation: "Reversed in groups of 3." }
    ],
    hidden: [
      { input: "1\n1\n1", output: "1" },
      { input: "4\n1 2 3 4\n4", output: "4 3 2 1" }
    ]
  },

  "Remove Duplicates from Sorted Array": {
    visible: [
      { input: "3\n1 1 2",    output: "2", explanation: "Two unique elements: [1,2]." },
      { input: "10\n0 0 1 1 1 2 2 3 3 4", output: "5", explanation: "Five unique elements." }
    ],
    hidden: [
      { input: "1\n1",    output: "1" },
      { input: "5\n1 2 3 4 5", output: "5" }
    ]
  },

  "Remove Element": {
    visible: [
      { input: "4\n3 2 2 3\n3", output: "2", explanation: "Remove all 3s, 2 elements remain." },
      { input: "8\n0 1 2 2 3 0 4 2\n2", output: "5", explanation: "Remove all 2s, 5 remain." }
    ],
    hidden: [
      { input: "0\n\n0", output: "0" },
      { input: "3\n1 1 1\n1", output: "0" }
    ]
  },

  "Find the Index of the First Occurrence in a String": {
    visible: [
      { input: "sadbutsad\nsad", output: "0", explanation: "'sad' first occurs at index 0." },
      { input: "leetcode\nleeto", output: "-1", explanation: "'leeto' not found." }
    ],
    hidden: [
      { input: "a\na",    output: "0"  },
      { input: "aaa\naaaa", output: "-1" }
    ]
  },

  "Divide Two Integers": {
    visible: [
      { input: "10\n3",           output: "3",           explanation: "10/3 = 3 (truncated)." },
      { input: "7\n-3",           output: "-2",          explanation: "7/-3 = -2 (truncated)." }
    ],
    hidden: [
      { input: "-2147483648\n-1", output: "2147483647" },
      { input: "0\n1",           output: "0"            }
    ]
  },

  "Substring with Concatenation of All Words": {
    visible: [
      { input: "barfoothefoobarman\n2\nfoo bar", output: "0 9", explanation: "At index 0: 'barfoo', at index 9: 'foobar'." },
      { input: "wordgoodgoodgoodbestword\n2\ngood best", output: "8", explanation: "At index 8: 'goodbest'." }
    ],
    hidden: [
      { input: "barfoofoobarthefoobarman\n3\nbar foo the", output: "6 9 12" }
    ]
  },

  "Next Permutation": {
    visible: [
      { input: "3\n1 2 3", output: "1 3 2", explanation: "Next permutation of [1,2,3] is [1,3,2]." },
      { input: "3\n3 2 1", output: "1 2 3", explanation: "Last permutation wraps to first." }
    ],
    hidden: [
      { input: "1\n1",     output: "1"     },
      { input: "3\n1 1 5", output: "1 5 1" }
    ]
  },

  "Longest Valid Parentheses": {
    visible: [
      { input: "(()",   output: "2", explanation: "Valid: '()'." },
      { input: ")()())", output: "4", explanation: "Valid: '()()'." }
    ],
    hidden: [
      { input: "",     output: "0" },
      { input: "()()", output: "4" }
    ]
  },

  "Search in Rotated Sorted Array": {
    visible: [
      { input: "7\n4 5 6 7 0 1 2\n0", output: "4", explanation: "0 is at index 4." },
      { input: "7\n4 5 6 7 0 1 2\n3", output: "-1", explanation: "3 not found." }
    ],
    hidden: [
      { input: "1\n1\n0",   output: "-1" },
      { input: "2\n3 1\n1", output: "1"  }
    ]
  },

  "Find First and Last Position of Element in Sorted Array": {
    visible: [
      { input: "6\n5 7 7 8 8 10\n8", output: "3 4", explanation: "8 appears at indices 3 and 4." },
      { input: "6\n5 7 7 8 8 10\n6", output: "-1 -1", explanation: "6 not in array." }
    ],
    hidden: [
      { input: "0\n\n0",   output: "-1 -1" },
      { input: "3\n1 1 1\n1", output: "0 2" }
    ]
  },

  "Search Insert Position": {
    visible: [
      { input: "4\n1 3 5 6\n5", output: "2", explanation: "5 is at index 2." },
      { input: "4\n1 3 5 6\n2", output: "1", explanation: "2 would be inserted at index 1." }
    ],
    hidden: [
      { input: "4\n1 3 5 6\n7", output: "4" },
      { input: "4\n1 3 5 6\n0", output: "0" }
    ]
  },

  "Valid Sudoku": {
    visible: [
      { input: "5 3 . . 7 . . . .\n6 . . 1 9 5 . . .\n. 9 8 . . . . 6 .\n8 . . . 6 . . . 3\n4 . . 8 . 3 . . 1\n7 . . . 2 . . . 6\n. 6 . . . . 2 8 .\n. . . 4 1 9 . . 5\n. . . . 8 . . 7 9", output: "true",  explanation: "Valid sudoku board." }
    ],
    hidden: [
      { input: "8 3 . . 7 . . . .\n6 . . 1 9 5 . . .\n. 9 8 . . . . 6 .\n8 . . . 6 . . . 3\n4 . . 8 . 3 . . 1\n7 . . . 2 . . . 6\n. 6 . . . . 2 8 .\n. . . 4 1 9 . . 5\n. . . . 8 . . 7 9", output: "false" }
    ]
  },

  "Sudoku Solver": {
    visible: [
      { input: "5 3 . . 7 . . . .\n6 . . 1 9 5 . . .\n. 9 8 . . . . 6 .\n8 . . . 6 . . . 3\n4 . . 8 . 3 . . 1\n7 . . . 2 . . . 6\n. 6 . . . . 2 8 .\n. . . 4 1 9 . . 5\n. . . . 8 . . 7 9", output: "5 3 4 6 7 8 9 1 2\n6 7 2 1 9 5 3 4 8\n1 9 8 3 4 2 5 6 7\n8 5 9 7 6 1 4 2 3\n4 2 6 8 5 3 7 9 1\n7 1 3 9 2 4 8 5 6\n9 6 1 5 3 7 2 8 4\n2 8 7 4 1 9 6 3 5\n3 4 5 2 8 6 1 7 9", explanation: "Solved board." }
    ],
    hidden: []
  },

  "Count and Say": {
    visible: [
      { input: "1", output: "1",        explanation: "Base case." },
      { input: "4", output: "1211",     explanation: "1->11->21->1211." }
    ],
    hidden: [
      { input: "2", output: "11"   },
      { input: "5", output: "111221" }
    ]
  },

  "Combination Sum": {
    visible: [
      { input: "4\n2 3 6 7\n7", output: "2 2 3\n7", explanation: "2+2+3=7 and 7=7." },
      { input: "4\n2 3 5\n8",   output: "2 2 2 2\n2 3 3\n3 5", explanation: "Three combos." }
    ],
    hidden: [
      { input: "1\n2\n1", output: "" },
      { input: "1\n1\n1", output: "1" }
    ]
  },

  "Combination Sum II": {
    visible: [
      { input: "7\n10 1 2 7 6 1 5\n8", output: "1 1 6\n1 2 5\n1 7\n2 6", explanation: "Unique combos." },
      { input: "5\n2 5 2 1 2\n5",      output: "1 2 2\n5",               explanation: "Two combos." }
    ],
    hidden: [
      { input: "3\n1 1 2\n4", output: "1 1 2" }
    ]
  },

  "First Missing Positive": {
    visible: [
      { input: "3\n1 2 0",    output: "3", explanation: "1 and 2 present, 3 is missing." },
      { input: "4\n3 4 -1 1", output: "2", explanation: "1 present, 2 is missing." }
    ],
    hidden: [
      { input: "1\n7 8 9 11 12", output: "1" },
      { input: "3\n1 2 3",       output: "4" }
    ]
  },

  "Trapping Rain Water": {
    visible: [
      { input: "12\n0 1 0 2 1 0 1 3 2 1 2 1", output: "6", explanation: "6 units of water trapped." },
      { input: "6\n4 2 0 3 2 5",              output: "9", explanation: "9 units trapped." }
    ],
    hidden: [
      { input: "1\n0",     output: "0" },
      { input: "3\n3 0 3", output: "3" }
    ]
  },

  "Multiply Strings": {
    visible: [
      { input: "2\n3",   output: "6",   explanation: "2 * 3 = 6." },
      { input: "123\n456", output: "56088", explanation: "123 * 456 = 56088." }
    ],
    hidden: [
      { input: "0\n0",    output: "0"    },
      { input: "9\n9",    output: "81"   }
    ]
  },

  "Wildcard Matching": {
    visible: [
      { input: "aa\na",   output: "false", explanation: "'a' doesn't match 'aa'." },
      { input: "aa\n*",   output: "true",  explanation: "'*' matches any sequence." }
    ],
    hidden: [
      { input: "cb\n?a",  output: "false" },
      { input: "adceb\n*a*b", output: "true" }
    ]
  },

  "Jump Game II": {
    visible: [
      { input: "5\n2 3 1 1 4", output: "2", explanation: "Jump from 0→1→4 = 2 jumps." },
      { input: "6\n2 3 0 1 4 0", output: "2", explanation: "Jump from 0→1→4 = 2 jumps." }
    ],
    hidden: [
      { input: "1\n0",         output: "0" },
      { input: "3\n1 1 1",     output: "2" }
    ]
  },

  "Permutations": {
    visible: [
      { input: "3\n1 2 3", output: "1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1", explanation: "All 6 permutations." },
      { input: "1\n0",     output: "0",                                          explanation: "Single element." }
    ],
    hidden: [
      { input: "2\n1 2", output: "1 2\n2 1" }
    ]
  },

  "Permutations II": {
    visible: [
      { input: "3\n1 1 2", output: "1 1 2\n1 2 1\n2 1 1", explanation: "Unique permutations only." },
      { input: "1\n1",     output: "1",                   explanation: "Single element." }
    ],
    hidden: [
      { input: "2\n1 1", output: "1 1" }
    ]
  },

  "Rotate Image": {
    visible: [
      { input: "3\n1 2 3\n4 5 6\n7 8 9",       output: "7 4 1\n8 5 2\n9 6 3",       explanation: "90° clockwise rotation." },
      { input: "4\n5 1 9 11\n2 4 8 10\n13 3 6 7\n15 14 12 16", output: "15 13 2 5\n14 3 4 1\n12 6 8 9\n16 7 10 11", explanation: "4x4 rotation." }
    ],
    hidden: [
      { input: "1\n1", output: "1" }
    ]
  },

  "Group Anagrams": {
    visible: [
      { input: "6\neat tea tan ate nat bat", output: "bat\neat tea ate\ntan nat", explanation: "Anagram groups." },
      { input: "1\n",                        output: "",                          explanation: "Empty string." }
    ],
    hidden: [
      { input: "1\na",       output: "a"   },
      { input: "2\nab ba",   output: "ab ba" }
    ]
  },

  "Pow(x, n)": {
    visible: [
      { input: "2.00000\n10",  output: "1024.00000", explanation: "2^10 = 1024." },
      { input: "2.10000\n3",   output: "9.26100",    explanation: "2.1^3 ≈ 9.261." }
    ],
    hidden: [
      { input: "2.00000\n-2",  output: "0.25000" },
      { input: "0.00001\n2147483647", output: "0.00000" }
    ]
  }
};
