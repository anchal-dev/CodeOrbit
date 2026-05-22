/**
 * problemDescriptions.js
 * Real problem descriptions, constraints, and hints for all 50 seeded problems.
 */

module.exports = {
  "Two Sum": {
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ]
  },

  "Add Two Numbers": {
    description: `You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.`,
    constraints: [
      "The number of nodes in each linked list is in the range [1, 100].",
      "0 <= Node.val <= 9",
      "It is guaranteed that the list represents a number that does not have leading zeros."
    ]
  },

  "Longest Substring Without Repeating Characters": {
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ]
  },

  "Median of Two Sorted Arrays": {
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return **the median** of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).`,
    constraints: [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m <= 1000",
      "0 <= n <= 1000",
      "1 <= m + n <= 2000",
      "-10^6 <= nums1[i], nums2[i] <= 10^6"
    ]
  },

  "Longest Palindromic Substring": {
    description: `Given a string \`s\`, return the **longest palindromic substring** in \`s\`.

A **palindrome** is a string that reads the same forward and backward.`,
    constraints: [
      "1 <= s.length <= 1000",
      "s consists of only digits and English letters."
    ]
  },

  "Zigzag Conversion": {
    description: `The string \`"PAYPALISHIRING"\` is written in a zigzag pattern on a given number of rows like this and then read line by line.

Write the code that will take a string and make this conversion given a number of rows.`,
    constraints: [
      "1 <= s.length <= 1000",
      "s consists of English letters (lower-case and upper-case), ',' and '.'.",
      "1 <= numRows <= 1000"
    ]
  },

  "Reverse Integer": {
    description: `Given a signed 32-bit integer \`x\`, return \`x\` with its digits reversed. If reversing \`x\` causes the value to go outside the signed 32-bit integer range \`[-2^31, 2^31 - 1]\`, then return \`0\`.`,
    constraints: [
      "-2^31 <= x <= 2^31 - 1"
    ]
  },

  "String to Integer (atoi)": {
    description: `Implement the \`myAtoi(string s)\` function, which converts a string to a 32-bit signed integer (similar to C/C++'s \`atoi\` function).

The algorithm: read and ignore leading whitespace, determine sign, read digits until non-digit or end, clamp to 32-bit integer range.`,
    constraints: [
      "0 <= s.length <= 200",
      "s consists of English letters, digits, ' ', '+', '-', and '.'."
    ]
  },

  "Palindrome Number": {
    description: `Given an integer \`x\`, return \`true\` if \`x\` is a **palindrome**, and \`false\` otherwise.

An integer is a palindrome when it reads the same forward and backward. For example, \`121\` is a palindrome while \`123\` is not.`,
    constraints: [
      "-2^31 <= x <= 2^31 - 1"
    ]
  },

  "Regular Expression Matching": {
    description: `Given an input string \`s\` and a pattern \`p\`, implement regular expression matching with support for \`'.'\` and \`'*'\` where:

- \`'.'\` Matches any single character.
- \`'*'\` Matches zero or more of the preceding element.

The matching should cover the **entire** input string (not partial).`,
    constraints: [
      "1 <= s.length <= 20",
      "1 <= p.length <= 20",
      "s contains only lowercase English letters.",
      "p contains only lowercase English letters, '.', and '*'.",
      "It is guaranteed for each '*' occurrence there will be a previous valid character to match."
    ]
  },

  "Container With Most Water": {
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i^th\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the **maximum amount of water** a container can store.`,
    constraints: [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4"
    ]
  },

  "Integer to Roman": {
    description: `Roman numerals are represented by seven different symbols: \`I, V, X, L, C, D\` and \`M\`.

Given an integer, convert it to a roman numeral.`,
    constraints: [
      "1 <= num <= 3999"
    ]
  },

  "Roman to Integer": {
    description: `Given a roman numeral, convert it to an integer.

Roman numerals are usually written largest to smallest from left to right. However, when a smaller numeral appears before a larger one, it means subtraction (e.g., \`IV\` = 4, \`IX\` = 9).`,
    constraints: [
      "1 <= s.length <= 15",
      "s contains only the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M').",
      "It is guaranteed that s is a valid roman numeral in the range [1, 3999]."
    ]
  },

  "Longest Common Prefix": {
    description: `Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string \`""\`.`,
    constraints: [
      "1 <= strs.length <= 200",
      "0 <= strs[i].length <= 200",
      "strs[i] consists of only lowercase English letters."
    ]
  },

  "3Sum": {
    description: `Given an integer array \`nums\`, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.`,
    constraints: [
      "3 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5"
    ]
  },

  "3Sum Closest": {
    description: `Given an integer array \`nums\` of length \`n\` and an integer \`target\`, find three integers in \`nums\` such that the sum is closest to \`target\`.

Return the **sum of the three integers**.`,
    constraints: [
      "3 <= nums.length <= 500",
      "-1000 <= nums[i] <= 1000",
      "-10^4 <= target <= 10^4"
    ]
  },

  "Letter Combinations of a Phone Number": {
    description: `Given a string containing digits from \`2-9\` inclusive, return all possible letter combinations that the number could represent. Return the answer in **any order**.

A mapping of digits to letters (just like on the telephone buttons) is given below:
2→abc, 3→def, 4→ghi, 5→jkl, 6→mno, 7→pqrs, 8→tuv, 9→wxyz`,
    constraints: [
      "0 <= digits.length <= 4",
      "digits[i] is a digit in the range ['2', '9']."
    ]
  },

  "4Sum": {
    description: `Given an array \`nums\` of \`n\` integers, return an array of all the **unique** quadruplets \`[nums[a], nums[b], nums[c], nums[d]]\` such that \`nums[a] + nums[b] + nums[c] + nums[d] == target\`.`,
    constraints: [
      "1 <= nums.length <= 200",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9"
    ]
  },

  "Remove Nth Node From End of List": {
    description: `Given the \`head\` of a linked list, remove the \`n^th\` node from the end of the list and return its head.`,
    constraints: [
      "The number of nodes in the list is sz.",
      "1 <= sz <= 30",
      "0 <= Node.val <= 100",
      "1 <= n <= sz"
    ]
  },

  "Valid Parentheses": {
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
- Open brackets must be closed by the same type of brackets.
- Open brackets must be closed in the correct order.
- Every close bracket has a corresponding open bracket of the same type.`,
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ]
  },

  "Merge Two Sorted Lists": {
    description: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`.

Merge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.`,
    constraints: [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 <= Node.val <= 100",
      "Both list1 and list2 are sorted in non-decreasing order."
    ]
  },

  "Generate Parentheses": {
    description: `Given \`n\` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.`,
    constraints: [
      "1 <= n <= 8"
    ]
  },

  "Merge k Sorted Lists": {
    description: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.`,
    constraints: [
      "k == lists.length",
      "0 <= k <= 10^4",
      "0 <= lists[i].length <= 500",
      "-10^4 <= lists[i][j] <= 10^4",
      "lists[i] is sorted in ascending order.",
      "The sum of lists[i].length will not exceed 10^4."
    ]
  },

  "Swap Nodes in Pairs": {
    description: `Given a linked list, swap every two adjacent nodes and return its head. You must solve the problem without modifying the values in the list's nodes (i.e., only nodes themselves may be changed.)`,
    constraints: [
      "The number of nodes in the list is in the range [0, 100].",
      "0 <= Node.val <= 100"
    ]
  },

  "Reverse Nodes in k-Group": {
    description: `Given the \`head\` of a linked list, reverse the nodes of the list \`k\` at a time, and return the modified list.

\`k\` is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of \`k\` then left-out nodes, in the end, should remain as it is.`,
    constraints: [
      "The number of nodes in the list is n.",
      "1 <= k <= n <= 5000",
      "0 <= Node.val <= 1000"
    ]
  },

  "Remove Duplicates from Sorted Array": {
    description: `Given an integer array \`nums\` sorted in **non-decreasing order**, remove the duplicates **in-place** such that each unique element appears only once. The **relative order** of the elements should be kept the same.

Return \`k\` after placing the final result in the first \`k\` slots of \`nums\`.`,
    constraints: [
      "1 <= nums.length <= 3 * 10^4",
      "-100 <= nums[i] <= 100",
      "nums is sorted in non-decreasing order."
    ]
  },

  "Remove Element": {
    description: `Given an integer array \`nums\` and an integer \`val\`, remove all occurrences of \`val\` in \`nums\` **in-place**. The order of the elements may be changed. Then return the number of elements in \`nums\` which are not equal to \`val\`.`,
    constraints: [
      "0 <= nums.length <= 100",
      "0 <= nums[i] <= 50",
      "0 <= val <= 100"
    ]
  },

  "Find the Index of the First Occurrence in a String": {
    description: `Given two strings \`haystack\` and \`needle\`, return the index of the first occurrence of \`needle\` in \`haystack\`, or \`-1\` if \`needle\` is not part of \`haystack\`.`,
    constraints: [
      "1 <= haystack.length, needle.length <= 10^4",
      "haystack and needle consist of only lowercase English characters."
    ]
  },

  "Divide Two Integers": {
    description: `Given two integers \`dividend\` and \`divisor\`, divide two integers **without** using multiplication, division, and mod operator.

The integer division should truncate toward zero, which means losing its fractional part.

Return the **quotient** after dividing \`dividend\` by \`divisor\`. Assume the environment does not allow you to store 64-bit integers.`,
    constraints: [
      "-2^31 <= dividend, divisor <= 2^31 - 1",
      "divisor != 0"
    ]
  },

  "Substring with Concatenation of All Words": {
    description: `You are given a string \`s\` and an array of strings \`words\`. All the strings of \`words\` are of **the same length**.

A **concatenated string** is a string that exactly contains all the strings of any permutation of \`words\` concatenated.

Return an array of the starting indices of all the concatenated substrings in \`s\`.`,
    constraints: [
      "1 <= s.length <= 10^4",
      "1 <= words.length <= 5000",
      "1 <= words[i].length <= 30",
      "s and words[i] consist of lowercase English letters."
    ]
  },

  "Next Permutation": {
    description: `A **permutation** of an array of integers is an arrangement of its members into a sequence or linear order.

Given an array of integers \`nums\`, find the next permutation of \`nums\`.

The replacement must be **in place** and use only constant extra memory.`,
    constraints: [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 100"
    ]
  },

  "Longest Valid Parentheses": {
    description: `Given a string containing just the characters \`'('\` and \`')'\`, return the length of the longest valid (well-formed) parentheses substring.`,
    constraints: [
      "0 <= s.length <= 3 * 10^4",
      "s[i] is '(' or ')'."
    ]
  },

  "Search in Rotated Sorted Array": {
    description: `There is an integer array \`nums\` sorted in ascending order (with **distinct** values). Prior to being passed to your function, \`nums\` is possibly **rotated** at an unknown pivot index.

Given the array \`nums\` after the possible rotation and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    constraints: [
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i] <= 10^4",
      "All values of nums are unique.",
      "nums is an ascending array that is possibly rotated.",
      "-10^4 <= target <= 10^4"
    ]
  },

  "Find First and Last Position of Element in Sorted Array": {
    description: `Given an array of integers \`nums\` sorted in non-decreasing order, find the starting and ending position of a given \`target\` value.

If \`target\` is not found in the array, return \`[-1, -1]\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    constraints: [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9",
      "nums is a non-decreasing array.",
      "-10^9 <= target <= 10^9"
    ]
  },

  "Search Insert Position": {
    description: `Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^4 <= nums[i] <= 10^4",
      "nums contains distinct values sorted in ascending order.",
      "-10^4 <= target <= 10^4"
    ]
  },

  "Valid Sudoku": {
    description: `Determine if a \`9 x 9\` Sudoku board is valid. Only the filled cells need to be validated according to the following rules:

1. Each row must contain the digits \`1-9\` without repetition.
2. Each column must contain the digits \`1-9\` without repetition.
3. Each of the nine \`3 x 3\` sub-boxes of the grid must contain the digits \`1-9\` without repetition.`,
    constraints: [
      "board.length == 9",
      "board[i].length == 9",
      "board[i][j] is a digit 1-9 or '.'."
    ]
  },

  "Sudoku Solver": {
    description: `Write a program to solve a Sudoku puzzle by filling the empty cells.

A sudoku solution must satisfy **all of the following rules**:
1. Each of the digits \`1-9\` must occur exactly once in each row.
2. Each of the digits \`1-9\` must occur exactly once in each column.
3. Each of the digits \`1-9\` must occur exactly once in each of the 9 \`3x3\` sub-boxes.

The \`'.'\` character indicates empty cells.`,
    constraints: [
      "board.length == 9",
      "board[i].length == 9",
      "board[i][j] is a digit or '.'.",
      "It is guaranteed that the input board has only one solution."
    ]
  },

  "Count and Say": {
    description: `The **count-and-say** sequence is a sequence of digit strings defined by the recursive formula:

- \`countAndSay(1) = "1"\`
- \`countAndSay(n)\` is the run-length encoding of \`countAndSay(n - 1)\`.

Given a positive integer \`n\`, return the \`n^th\` element of the count-and-say sequence.`,
    constraints: [
      "1 <= n <= 30"
    ]
  },

  "Combination Sum": {
    description: `Given an array of **distinct** integers \`candidates\` and a target integer \`target\`, return a list of all **unique combinations** of \`candidates\` where the chosen numbers sum to \`target\`.

You may return the combinations in **any order**. The **same** number may be chosen from \`candidates\` an **unlimited number of times\`.`,
    constraints: [
      "1 <= candidates.length <= 30",
      "2 <= candidates[i] <= 40",
      "All elements of candidates are distinct.",
      "1 <= target <= 40"
    ]
  },

  "Combination Sum II": {
    description: `Given a collection of candidate numbers (\`candidates\`) and a target number (\`target\`), find all unique combinations in \`candidates\` where the candidate numbers sum to \`target\`.

Each number in \`candidates\` may only be used **once** in the combination.`,
    constraints: [
      "1 <= candidates.length <= 100",
      "1 <= candidates[i] <= 50",
      "1 <= target <= 30"
    ]
  },

  "First Missing Positive": {
    description: `Given an unsorted integer array \`nums\`, return the smallest missing positive integer.

You must implement an algorithm that runs in \`O(n)\` time and uses \`O(1)\` auxiliary space.`,
    constraints: [
      "1 <= nums.length <= 10^5",
      "-2^31 <= nums[i] <= 2^31 - 1"
    ]
  },

  "Trapping Rain Water": {
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    constraints: [
      "n == height.length",
      "1 <= n <= 2 * 10^4",
      "0 <= height[i] <= 10^5"
    ]
  },

  "Multiply Strings": {
    description: `Given two non-negative integers \`num1\` and \`num2\` represented as strings, return the product of \`num1\` and \`num2\`, also represented as a string.

**Note:** You must not use any built-in BigInteger library or convert the inputs to integer directly.`,
    constraints: [
      "1 <= num1.length, num2.length <= 200",
      "num1 and num2 consist of digits only.",
      "Both num1 and num2 do not contain any leading zero, except the number 0 itself."
    ]
  },

  "Wildcard Matching": {
    description: `Given an input string \`s\` and a pattern \`p\`, implement wildcard pattern matching with support for \`'?'\` and \`'*'\` where:

- \`'?'\` Matches any single character.
- \`'*'\` Matches any sequence of characters (including the empty sequence).

The matching should cover the **entire** input string (not partial).`,
    constraints: [
      "0 <= s.length <= 2000",
      "0 <= p.length <= 2000",
      "s contains only lowercase English letters.",
      "p contains only lowercase English letters, '?' or '*'."
    ]
  },

  "Jump Game II": {
    description: `You are given a **0-indexed** array of integers \`nums\` of length \`n\`. You are initially positioned at \`nums[0]\`.

Each element \`nums[i]\` represents the maximum length of a forward jump from index \`i\`. In other words, if you are at \`nums[i]\`, you can jump to any \`nums[i + j]\` where \`0 <= j <= nums[i]\` and \`i + j < n\`.

Return the **minimum number of jumps** to reach \`nums[n - 1]\`.`,
    constraints: [
      "1 <= nums.length <= 10^4",
      "0 <= nums[i] <= 1000",
      "The test cases are generated such that you can reach nums[n - 1]."
    ]
  },

  "Permutations": {
    description: `Given an array \`nums\` of distinct integers, return all the possible **permutations**. You can return the answer in **any order**.`,
    constraints: [
      "1 <= nums.length <= 6",
      "-10 <= nums[i] <= 10",
      "All the integers of nums are unique."
    ]
  },

  "Permutations II": {
    description: `Given a collection of numbers, \`nums\`, that **might contain duplicates**, return all possible **unique** permutations in **any order**.`,
    constraints: [
      "1 <= nums.length <= 8",
      "-10 <= nums[i] <= 10"
    ]
  },

  "Rotate Image": {
    description: `You are given an \`n x n\` 2D \`matrix\` representing an image, rotate the image by **90 degrees** (clockwise).

You have to rotate the image **in-place**, which means you have to modify the input 2D matrix directly. **DO NOT** allocate another 2D matrix and do the rotation.`,
    constraints: [
      "n == matrix.length == matrix[i].length",
      "1 <= n <= 20",
      "-1000 <= matrix[i][j] <= 1000"
    ]
  },

  "Group Anagrams": {
    description: `Given an array of strings \`strs\`, group the **anagrams** together. You can return the answer in **any order**.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    constraints: [
      "1 <= strs.length <= 10^4",
      "0 <= strs[i].length <= 100",
      "strs[i] consists of lowercase English letters."
    ]
  },

  "Pow(x, n)": {
    description: `Implement \`pow(x, n)\`, which calculates \`x\` raised to the power \`n\` (i.e., \`x^n\`).`,
    constraints: [
      "-100.0 < x < 100.0",
      "-2^31 <= n <= 2^31 - 1",
      "n is an integer.",
      "Either x is not zero or n > 0.",
      "-10^4 <= x^n <= 10^4"
    ]
  }
};
