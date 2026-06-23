require('dotenv').config();
const mongoose = require('mongoose');
const InterviewTrack = require('../models/InterviewTrack');
const InterviewQuestion = require('../models/InterviewQuestion');

const COMPANIES = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Adobe', 'Uber', 'Atlassian', 'Walmart', 'Flipkart', 'Goldman Sachs'];

// 1. DSA QUESTIONS (50 Unique Questions)
const DSA_QUESTIONS = [
  // Arrays
  {
    trackId: 'dsa',
    topic: 'Arrays',
    title: 'Two Sum',
    questionText: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'easy',
    sampleAnswer: 'Use a hash map to store the complement of the current element (target - nums[i]) alongside its index. If the complement is found, return its stored index. Time: O(N), Space: O(N).',
    tips: 'Mention the brute-force O(N^2) double loop solution first to demonstrate optimization from O(N^2) to O(N) using space.',
    companyTags: ['Google', 'Amazon', 'Microsoft', 'Adobe', 'Meta']
  },
  {
    trackId: 'dsa',
    topic: 'Arrays',
    title: 'Best Time to Buy and Sell Stock',
    questionText: 'You are given an array prices where prices[i] is the price of a given stock on the i-th day. Find the maximum profit you can achieve by buying on one day and selling on a future day.',
    difficulty: 'easy',
    sampleAnswer: 'Track the minimum price seen so far as you iterate through the array. Calculate profit on the current day if sold, and update maximum profit. Time: O(N), Space: O(1).',
    tips: 'Explain that you cannot sell a stock before you buy it, which is why a single pass left-to-right tracking the minimum price works.',
    companyTags: ['Amazon', 'Microsoft', 'Goldman Sachs', 'Walmart', 'Adobe']
  },
  {
    trackId: 'dsa',
    topic: 'Arrays',
    title: 'Maximum Subarray (Kadane\'s Algorithm)',
    questionText: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
    difficulty: 'medium',
    sampleAnswer: 'Maintain a running maximum sum and a current subarray sum. Iterate through the array. For each element, update current sum to be max(current_element, current_sum + current_element). Update running max. Time: O(N), Space: O(1).',
    tips: 'Discuss how to handle the edge case where all numbers in the array are negative (current sum should still be the maximum negative number).',
    companyTags: ['Google', 'Amazon', 'Meta', 'Uber', 'Flipkart']
  },
  {
    trackId: 'dsa',
    topic: 'Arrays',
    title: 'Product of Array Except Self',
    questionText: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. Do it in O(N) time and without division.',
    difficulty: 'medium',
    sampleAnswer: 'Construct a prefix product array where prefix[i] contains product of elements to the left of i. Then traverse backwards to accumulate suffix products directly into the answer array. Time: O(N), Space: O(1) auxiliary.',
    tips: 'Explain why the division method (multiplying all elements and dividing by nums[i]) fails if the array contains one or more zeroes.',
    companyTags: ['Amazon', 'Microsoft', 'Apple', 'Goldman Sachs']
  },
  {
    trackId: 'dsa',
    topic: 'Arrays',
    title: 'Container With Most Water',
    questionText: 'Given n non-negative integers representing heights of vertical lines, find two lines that together with the x-axis form a container containing the most water.',
    difficulty: 'medium',
    sampleAnswer: 'Use two pointers at the boundaries (left = 0, right = n-1). Compute the water container capacity based on width and the minimum of the two heights. Move the pointer pointing to the shorter line inward. Time: O(N), Space: O(1).',
    tips: 'Prove mathematically why moving the pointer pointing to the shorter line is optimal (moving the taller one can never increase height but decreases width).',
    companyTags: ['Google', 'Meta', 'Amazon', 'Adobe', 'Uber']
  },

  // Strings
  {
    trackId: 'dsa',
    topic: 'Strings',
    title: 'Valid Anagram',
    questionText: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
    difficulty: 'easy',
    sampleAnswer: 'Use a fixed-size integer array of size 26 (for lowercase English letters) to count character frequencies. Increment frequency for characters in s, decrement for t. Check if all elements are zero. Time: O(N), Space: O(1).',
    tips: 'Discuss how you would extend the solution to support Unicode or international characters (use a hash map instead of a fixed size array).',
    companyTags: ['Uber', 'Goldman Sachs', 'Amazon', 'Atlassian']
  },
  {
    trackId: 'dsa',
    topic: 'Strings',
    title: 'Longest Substring Without Repeating Characters',
    questionText: 'Given a string s, find the length of the longest substring without repeating characters.',
    difficulty: 'medium',
    sampleAnswer: 'Use a sliding window approach with two pointers (left and right). Keep a hash set of characters in the current window. Expand the right pointer, and shrink from the left whenever a duplicate character is encountered. Time: O(N), Space: O(min(M, N)).',
    tips: 'Show how a hash map storing the last seen index of each character can optimize the window shrinking to a direct jump.',
    companyTags: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Flipkart']
  },
  {
    trackId: 'dsa',
    topic: 'Strings',
    title: 'Longest Palindromic Substring',
    questionText: 'Given a string s, return the longest palindromic substring in s.',
    difficulty: 'medium',
    sampleAnswer: 'For each character (and between each character pair), expand outwards as long as the characters match and form a palindrome. Track the maximum length and start index. Time: O(N^2), Space: O(1).',
    tips: 'Briefly mention Manacher\'s Algorithm for O(N) complexity as a theoretical optimization, but focus on the O(N^2) expansion approach.',
    companyTags: ['Google', 'Microsoft', 'Adobe', 'Amazon', 'Walmart']
  },
  {
    trackId: 'dsa',
    topic: 'Strings',
    title: 'Group Anagrams',
    questionText: 'Given an array of strings, group the anagrams together. You can return the answer in any order.',
    difficulty: 'medium',
    sampleAnswer: 'Use a hash map where the key is the sorted version of the string (or character count array), and the value is a list of strings matching that key. Time: O(N * K log K) or O(N * K) where K is max string length.',
    tips: 'Compare the sorting key technique (O(N * K log K)) with the character count hash mapping (O(N * K)) regarding memory and speed.',
    companyTags: ['Amazon', 'Meta', 'Flipkart', 'Walmart', 'Goldman Sachs']
  },
  {
    trackId: 'dsa',
    topic: 'Strings',
    title: 'Valid Parentheses',
    questionText: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    difficulty: 'easy',
    sampleAnswer: 'Use a stack. Traverse the string; push opening brackets onto the stack. For closing brackets, check if the stack is non-empty and the top matches the corresponding opening bracket. Return true if stack is empty at the end. Time: O(N), Space: O(N).',
    tips: 'Emphasize checking if the stack is empty before popping to prevent NullPointer/IndexOutOfBounds exceptions.',
    companyTags: ['Microsoft', 'Goldman Sachs', 'Amazon', 'Adobe', 'Walmart']
  },

  // Linked List
  {
    trackId: 'dsa',
    topic: 'Linked List',
    title: 'Reverse a Linked List',
    questionText: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    difficulty: 'easy',
    sampleAnswer: 'Use three pointers: prev (null), curr (head), and next (null). Iterate through, storing curr.next, setting curr.next = prev, and then moving prev and curr forward. Time: O(N), Space: O(1).',
    tips: 'Be prepared to explain both the iterative and recursive solutions. The iterative one is preferred for O(1) space.',
    companyTags: ['Amazon', 'Microsoft', 'Meta', 'Adobe', 'Google']
  },
  {
    trackId: 'dsa',
    topic: 'Linked List',
    title: 'Detect Cycle in a Linked List',
    questionText: 'Given head, the head of a linked list, determine if the linked list has a cycle in it.',
    difficulty: 'easy',
    sampleAnswer: 'Use Floyd\'s Cycle Finding Algorithm (two pointers, fast and slow). Move slow by 1 step and fast by 2 steps. If they meet, a cycle exists. If fast reaches null, there is no cycle. Time: O(N), Space: O(1).',
    tips: 'Be ready to prove why the fast pointer will eventually meet the slow pointer if a cycle exists (the distance decreases by 1 each step).',
    companyTags: ['Google', 'Meta', 'Amazon', 'Atlassian', 'Goldman Sachs']
  },
  {
    trackId: 'dsa',
    topic: 'Linked List',
    title: 'Merge Two Sorted Lists',
    questionText: 'Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.',
    difficulty: 'easy',
    sampleAnswer: 'Use a dummy head node. Maintain a tail pointer. Compare values of current nodes of both lists, append the smaller node to the tail, and advance the list pointer. Append any remaining nodes at the end. Time: O(N+M), Space: O(1).',
    tips: 'Dummy node pattern prevents dealing with edge cases of initializing the head node of the merged list.',
    companyTags: ['Microsoft', 'Amazon', 'Apple', 'Flipkart', 'Walmart']
  },
  {
    trackId: 'dsa',
    topic: 'Linked List',
    title: 'Remove Nth Node From End of List',
    questionText: 'Given the head of a linked list, remove the nth node from the end of the list and return its head.',
    difficulty: 'medium',
    sampleAnswer: 'Use two pointers: fast and slow. Advance fast by n steps. Then advance both fast and slow by 1 step at a time until fast reaches the end. slow will now point right before the node to be deleted. Time: O(N), Space: O(1).',
    tips: 'Mention using a dummy node preceding the head to easily handle the edge case of deleting the first node of the list.',
    companyTags: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Atlassian']
  },
  {
    trackId: 'dsa',
    topic: 'Linked List',
    title: 'Merge K Sorted Lists',
    questionText: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
    difficulty: 'hard',
    sampleAnswer: 'Use a Min-Heap (Priority Queue). Push the head nodes of all lists into the heap. Extract the minimum node, append it to the result list, and push its next node into the heap. Repeat until heap is empty. Time: O(N log k) where N is total nodes, Space: O(k).',
    tips: 'Compare this to the divide-and-conquer merge approach, which also has O(N log k) time complexity but doesn\'t require external heap storage.',
    companyTags: ['Google', 'Amazon', 'Meta', 'Uber', 'Adobe']
  },

  // Stack
  {
    trackId: 'dsa',
    topic: 'Stack',
    title: 'Min Stack',
    questionText: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time O(1).',
    difficulty: 'medium',
    sampleAnswer: 'Maintain two stacks: one for the regular values and another auxiliary stack to store the minimums. On pushing, push min(val, current_min) onto the min stack. Time: O(1) for all operations, Space: O(N).',
    tips: 'Discuss how you can optimize space by only pushing onto the min stack when the new value is less than or equal to the current minimum.',
    companyTags: ['Amazon', 'Microsoft', 'Goldman Sachs', 'Adobe', 'Walmart']
  },
  {
    trackId: 'dsa',
    topic: 'Stack',
    title: 'Evaluate Reverse Polish Notation',
    questionText: 'Evaluate the value of an arithmetic expression in Reverse Polish Notation (Postfix). Valid operators are +, -, *, /.',
    difficulty: 'medium',
    sampleAnswer: 'Use a stack. Iterate through the tokens. If a token is an operand, push it to stack. If it is an operator, pop the top two values, apply the operator, and push the result back. Time: O(N), Space: O(N).',
    tips: 'Pay attention to subtraction and division orders: the first popped value is the divisor/subtrahend (on the right).',
    companyTags: ['Google', 'Microsoft', 'Amazon', 'Atlassian']
  },
  {
    trackId: 'dsa',
    topic: 'Stack',
    title: 'Daily Temperatures',
    questionText: 'Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the i-th day to get a warmer temperature.',
    difficulty: 'medium',
    sampleAnswer: 'Use a monotonic decreasing stack storing indices. Iterate through temperatures. While stack is not empty and current temp is greater than temp at stack top index, pop and calculate index difference. Time: O(N), Space: O(N).',
    tips: 'Explain the monotonic stack concept: how it helps in finding the next greater element in linear time.',
    companyTags: ['Google', 'Amazon', 'Meta', 'Adobe', 'Flipkart']
  },
  {
    trackId: 'dsa',
    topic: 'Stack',
    title: 'Largest Rectangle in Histogram',
    questionText: 'Given an array of integers heights representing the histogram\'s bar height where the width of each bar is 1, find the area of the largest rectangle in the histogram.',
    difficulty: 'hard',
    sampleAnswer: 'Use a monotonic increasing stack storing indices. When a shorter bar is encountered, pop from the stack and compute the area with the popped bar as the shortest. Width is determined by current index and index of the new stack top. Time: O(N), Space: O(N).',
    tips: 'Discuss how you can append a 0 height at the end of the input array to ensure the stack is fully flushed out at the end.',
    companyTags: ['Google', 'Amazon', 'Meta', 'Uber', 'Atlassian']
  },
  {
    trackId: 'dsa',
    topic: 'Stack',
    title: 'Decode String',
    questionText: 'Given an encoded string (e.g., 3[a]2[bc]), return its decoded string.',
    difficulty: 'medium',
    sampleAnswer: 'Use two stacks: one for numbers (multipliers) and one for strings (previous states). When "[" is reached, push current number and string to stacks. When "]" is reached, pop number and repeat current string, appending to popped string. Time: O(N), Space: O(N).',
    tips: 'Ensure correct string construction when dealing with nested brackets like 3[a2[c]].',
    companyTags: ['Google', 'Amazon', 'Microsoft', 'Uber']
  },

  // Queue
  {
    trackId: 'dsa',
    topic: 'Queue',
    title: 'Implement Queue using Stacks',
    questionText: 'Implement a first-in first-out (FIFO) queue using only two stacks.',
    difficulty: 'easy',
    sampleAnswer: 'Use two stacks: s1 (input) and s2 (output). Push onto s1. For pop/peek, if s2 is empty, transfer all elements from s1 to s2, then pop/peek from s2. Time: Amortized O(1) per operation, Space: O(N).',
    tips: 'Explain the concept of amortized time complexity and why transferring elements is not O(N) for every call.',
    companyTags: ['Goldman Sachs', 'Amazon', 'Microsoft', 'Walmart']
  },
  {
    trackId: 'dsa',
    topic: 'Queue',
    title: 'Sliding Window Maximum',
    questionText: 'You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. Return the max sliding window.',
    difficulty: 'hard',
    sampleAnswer: 'Use a double-ended queue (deque) to store indices. Maintain indices in decreasing order of values. Remove indices from the back if their values are less than current element. Remove indices from the front if they fall outside the current window. Time: O(N), Space: O(k).',
    tips: 'Explain why we store indices instead of values (to easily check if a deque elements is out of the sliding window bounds).',
    companyTags: ['Google', 'Amazon', 'Meta', 'Uber', 'Atlassian']
  },
  {
    trackId: 'dsa',
    topic: 'Queue',
    title: 'Design Circular Queue',
    questionText: 'Design your implementation of the circular queue (ring buffer).',
    difficulty: 'medium',
    sampleAnswer: 'Use a fixed-size array and two pointers: head and tail. Keep track of size to distinguish between full and empty queue states. Enqueue moves tail, dequeue moves head. Time: O(1) for all operations, Space: O(k).',
    tips: 'Explain the modulo operator (i = (i + 1) % capacity) to wrap pointers around the boundaries.',
    companyTags: ['Amazon', 'Microsoft', 'Apple', 'Goldman Sachs']
  },
  {
    trackId: 'dsa',
    topic: 'Queue',
    title: 'Task Scheduler',
    questionText: 'Given a characters array tasks representing CPU tasks, and cooling time n, return the least number of units of times that the CPU will take to finish all tasks.',
    difficulty: 'medium',
    sampleAnswer: 'Find the frequency of each task. Find the max frequency. The minimum time is determined by (max_frequency - 1) * (n + 1) + (count of tasks with max frequency). Compare this value with the total task length and take the maximum. Time: O(N), Space: O(1).',
    tips: 'Describe how a Max-Heap combined with a Queue can simulate the process dynamically if the cooling time is variable.',
    companyTags: ['Meta', 'Google', 'Amazon', 'Adobe']
  },
  {
    trackId: 'dsa',
    topic: 'Queue',
    title: 'Rotting Oranges',
    questionText: 'You are given an m x n grid where each cell can be empty, fresh, or rotten. Return the minimum number of minutes that must elapse until no cell has a fresh orange.',
    difficulty: 'medium',
    sampleAnswer: 'Use BFS queue. Enqueue all initial rotten oranges and track fresh orange count. Perform level-order traversal, rotting adjacent fresh oranges and enqueuing them, incrementing minutes level-by-level. Time: O(M*N), Space: O(M*N).',
    tips: 'Point out why BFS is used instead of DFS (BFS simulates simultaneous propagation, representing elapsed minutes correctly).',
    companyTags: ['Amazon', 'Microsoft', 'Google', 'Uber', 'Flipkart']
  },

  // Trees
  {
    trackId: 'dsa',
    topic: 'Trees',
    title: 'Invert Binary Tree',
    questionText: 'Given the root of a binary tree, invert the tree (swap left and right subtrees recursively) and return its root.',
    difficulty: 'easy',
    sampleAnswer: 'Recursively swap root.left and root.right. Perform the recursive step for the left child and right child. Base case: root is null. Time: O(N), Space: O(H) where H is tree height.',
    tips: 'Mention the iterative BFS queue alternative to show how to avoid call-stack overflow on deep/skewed trees.',
    companyTags: ['Google', 'Amazon', 'Microsoft', 'Meta', 'Adobe']
  },
  {
    trackId: 'dsa',
    topic: 'Trees',
    title: 'Binary Tree Level Order Traversal',
    questionText: 'Given the root of a binary tree, return the level order traversal of its nodes\' values. (i.e., from left to right, level by level).',
    difficulty: 'medium',
    sampleAnswer: 'Use a Queue. Enqueue root. Run a loop while queue is not empty. Inside, check the current size of the queue (representing nodes on the current level). Pop that many nodes, store their values, and enqueue their children. Time: O(N), Space: O(W) where W is maximum width.',
    tips: 'Highlight the importance of capturing the queue size *before* starting the level loop, since the size changes inside the loop.',
    companyTags: ['Amazon', 'Microsoft', 'Google', 'Adobe', 'Walmart']
  },
  {
    trackId: 'dsa',
    topic: 'Trees',
    title: 'Validate Binary Search Tree',
    questionText: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST).',
    difficulty: 'medium',
    sampleAnswer: 'Recursively validate that each node\'s value lies strictly within a range (low, high). Update low = root.val for right child, and high = root.val for left child. Time: O(N), Space: O(H).',
    tips: 'Explain why simply comparing root.left.val < root.val < root.right.val is insufficient (violates grandparent constraints).',
    companyTags: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Goldman Sachs']
  },
  {
    trackId: 'dsa',
    topic: 'Trees',
    title: 'Lowest Common Ancestor of a BST',
    questionText: 'Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes p and q.',
    difficulty: 'easy',
    sampleAnswer: 'Start at root. If both p and q are smaller than root, traverse left. If both are larger, traverse right. If they split (or one equals root), the current node is the LCA. Time: O(H), Space: O(1) iterative.',
    tips: 'Emphasize how the BST property (ordered values) allows us to solve this in O(H) time without traversing the entire tree.',
    companyTags: ['Google', 'Amazon', 'Microsoft', 'Meta', 'Adobe']
  },
  {
    trackId: 'dsa',
    topic: 'Trees',
    title: 'Serialize and Deserialize Binary Tree',
    questionText: 'Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work.',
    difficulty: 'hard',
    sampleAnswer: 'Serialize using preorder traversal, appending node values separated by commas, using "N" for null nodes. Deserialize by splitting the string into a queue and rebuilding recursively. Time: O(N), Space: O(N).',
    tips: 'This is a system-design-like DSA question. Focus on efficiency of serialization format to save network payload.',
    companyTags: ['Google', 'Amazon', 'Meta', 'Uber', 'Atlassian']
  },

  // Graphs
  {
    trackId: 'dsa',
    topic: 'Graphs',
    title: 'Number of Islands',
    questionText: 'Given an m x n 2D binary grid grid which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands.',
    difficulty: 'medium',
    sampleAnswer: 'Iterate through grid. When a \'1\' is found, increment island count and trigger DFS/BFS to traverse and sink all connected lands to \'0\' to prevent recounting. Time: O(M*N), Space: O(M*N) recursion stack.',
    tips: 'Be prepared to explain the space complexity difference between DFS and BFS on a grid.',
    companyTags: ['Google', 'Amazon', 'Microsoft', 'Adobe', 'Meta']
  },
  {
    trackId: 'dsa',
    topic: 'Graphs',
    title: 'Clone Graph',
    questionText: 'Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.',
    difficulty: 'medium',
    sampleAnswer: 'Use DFS or BFS with a hash map containing mapping of {original_node: cloned_node}. If a node is visited, return its clone from map; else, create clone, store in map, and recursively clone neighbours. Time: O(V + E), Space: O(V).',
    tips: 'Highlight the necessity of the hash map to prevent infinite loops when graph has cycles.',
    companyTags: ['Google', 'Amazon', 'Meta', 'Atlassian', 'Flipkart']
  },
  {
    trackId: 'dsa',
    topic: 'Graphs',
    title: 'Course Schedule',
    questionText: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. Some courses have prerequisites. Return true if you can finish all courses.',
    difficulty: 'medium',
    sampleAnswer: 'Model courses as a directed graph. Detect cycle using DFS color marking (unvisited, visiting, visited) or Kahn\'s Algorithm (BFS topological sort using in-degree values). If a cycle is detected, return false. Time: O(V + E), Space: O(V + E).',
    tips: 'Kahn\'s Algorithm is highly appreciated. State that in-degree array helps identify entry courses.',
    companyTags: ['Google', 'Microsoft', 'Amazon', 'Uber', 'Goldman Sachs']
  },
  {
    trackId: 'dsa',
    topic: 'Graphs',
    title: 'Network Delay Time',
    questionText: 'You are given a network of n nodes, and a list of travel times. We send a signal from a node k. Return the minimum time it takes for all nodes to receive the signal.',
    difficulty: 'medium',
    sampleAnswer: 'Use Dijkstra\'s algorithm with a Min-Heap (Priority Queue). Track shortest distances from source k. Pop node with min distance, relax edges to its neighbours, and push new distances to heap. Return max distance or -1 if unreachable. Time: O(E log V), Space: O(V + E).',
    tips: 'Mention why Dijkstra\'s fails with negative edge weights, suggesting Bellman-Ford as an alternative in such scenarios.',
    companyTags: ['Google', 'Uber', 'Amazon', 'Microsoft']
  },
  {
    trackId: 'dsa',
    topic: 'Graphs',
    title: 'Alien Dictionary',
    questionText: 'Given a sorted dictionary of an alien language, find the order of characters in the alphabet.',
    difficulty: 'hard',
    sampleAnswer: 'Compare adjacent words to find relative character orderings and build a directed graph. Perform topological sort (Kahn\'s or DFS). If cycle is detected, topological ordering is impossible, return empty string. Time: O(C) where C is total characters in all words, Space: O(V + E).',
    tips: 'Point out edge cases like "abc" appearing after "ab" in the sorted list, which is invalid.',
    companyTags: ['Google', 'Amazon', 'Meta', 'Uber', 'Atlassian']
  },

  // DP
  {
    trackId: 'dsa',
    topic: 'DP',
    title: 'Climbing Stairs',
    questionText: 'It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    difficulty: 'easy',
    sampleAnswer: 'This is a Fibonacci sequence. dp[i] = dp[i-1] + dp[i-2]. We can optimize space by only tracking the last two values. Time: O(N), Space: O(1).',
    tips: 'Explain the progression: Recursive (O(2^N)) -> Memoized (O(N) space) -> Bottom-up DP (O(N) space) -> Space Optimized DP (O(1) space).',
    companyTags: ['Amazon', 'Microsoft', 'Goldman Sachs', 'Adobe', 'Walmart']
  },
  {
    trackId: 'dsa',
    topic: 'DP',
    title: 'Coin Change',
    questionText: 'You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins that you need to make up that amount.',
    difficulty: 'medium',
    sampleAnswer: 'Use a 1D DP table of size amount+1 initialized to amount+1. dp[0] = 0. For each coin and for each value from coin to amount, dp[i] = min(dp[i], dp[i - coin] + 1). Time: O(N * A), Space: O(A) where A is amount.',
    tips: 'Explain why greedy approach (taking largest coins first) fails for denominations like [1, 3, 4] for amount 6.',
    companyTags: ['Google', 'Amazon', 'Meta', 'Adobe', 'Flipkart']
  },
  {
    trackId: 'dsa',
    topic: 'DP',
    title: 'Longest Common Subsequence',
    questionText: 'Given two strings text1 and text2, return the length of their longest common subsequence.',
    difficulty: 'medium',
    sampleAnswer: 'Use a 2D DP grid. If text1[i] == text2[j], dp[i][j] = dp[i-1][j-1] + 1; else, dp[i][j] = max(dp[i-1][j], dp[i][j-1]). Time: O(M*N), Space: O(M*N) which can be optimized to O(min(M,N)).',
    tips: 'Explain the difference between subsequence (non-contiguous) and substring (must be contiguous).',
    companyTags: ['Google', 'Amazon', 'Microsoft', 'Atlassian']
  },
  {
    trackId: 'dsa',
    topic: 'DP',
    title: 'Longest Increasing Subsequence',
    questionText: 'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
    difficulty: 'medium',
    sampleAnswer: 'Use a 1D DP array. dp[i] = max(dp[j] + 1) for all j < i and nums[j] < nums[i]. Time: O(N^2), Space: O(N). Can be optimized to O(N log N) using binary search with active lists.',
    tips: 'The binary search optimization (Patience Sorting) is highly appreciated in LIS interviews. Explain how tail values are stored.',
    companyTags: ['Google', 'Amazon', 'Meta', 'Goldman Sachs']
  },
  {
    trackId: 'dsa',
    topic: 'DP',
    title: 'Edit Distance',
    questionText: 'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. Operations allowed: Insert, Delete, Replace.',
    difficulty: 'hard',
    sampleAnswer: 'Use a 2D DP grid where dp[i][j] represents distance of prefix word1[0...i-1] and word2[0...j-1]. If characters match, cost = 0, else 1. dp[i][j] = min(dp[i-1][j]+1 (del), dp[i][j-1]+1 (ins), dp[i-1][j-1]+cost (rep)). Time: O(M*N), Space: O(M*N).',
    tips: 'Draw the base cases (i=0 or j=0) which represent inserting all or deleting all characters.',
    companyTags: ['Google', 'Amazon', 'Microsoft', 'Atlassian', 'Adobe']
  },

  // Greedy
  {
    trackId: 'dsa',
    topic: 'Greedy',
    title: 'Jump Game',
    questionText: 'You are given an integer array nums. You are initially positioned at the first index. Return true if you can reach the last index.',
    difficulty: 'medium',
    sampleAnswer: 'Maintain the maximum reachable index. Iterate through the array. If current index i > max_reachable, return false. Update max_reachable = max(max_reachable, i + nums[i]). If max_reachable >= last_index, return true. Time: O(N), Space: O(1).',
    tips: 'Contrast this Greedy O(1) space solution with a DP/backtracking solution that takes O(N) space.',
    companyTags: ['Amazon', 'Microsoft', 'Meta', 'Adobe']
  },
  {
    trackId: 'dsa',
    topic: 'Greedy',
    title: 'Gas Station',
    questionText: 'There are n gas stations along a circular route. Given gas and cost arrays, return the starting gas station\'s index if you can travel around the circuit once, otherwise return -1.',
    difficulty: 'medium',
    sampleAnswer: 'If total gas < total cost, return -1. Otherwise, initialize start = 0, current_tank = 0. Iterate. If current_tank < 0, reset start = i + 1 and current_tank = 0. Accumulate gas[i] - cost[i] in current_tank. Time: O(N), Space: O(1).',
    tips: 'Prove why if total gas is greater than or equal to total cost, a solution is guaranteed to exist.',
    companyTags: ['Google', 'Amazon', 'Uber', 'Flipkart']
  },
  {
    trackId: 'dsa',
    topic: 'Greedy',
    title: 'Merge Intervals',
    questionText: 'Given an array of intervals, merge all overlapping intervals, and return an array of the non-overlapping intervals.',
    difficulty: 'medium',
    sampleAnswer: 'Sort intervals by start time. Iterate. If current interval starts after the previous merged interval ends, append it. Otherwise, merge them by updating the end time to max(prev.end, curr.end). Time: O(N log N), Space: O(N) or O(1) for sorting.',
    tips: 'Explain that sorting by start time is the crucial prerequisite to make greedy merging correct.',
    companyTags: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Atlassian']
  },
  {
    trackId: 'dsa',
    topic: 'Greedy',
    title: 'Non-overlapping Intervals',
    questionText: 'Given an array of intervals, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.',
    difficulty: 'medium',
    sampleAnswer: 'Sort intervals by end time. Iterate. Keep track of the end time of the last added non-overlapping interval. If current starts before last end, increment remove count; else, update last end to current end. Time: O(N log N), Space: O(1).',
    tips: 'Contrast this with Merge Intervals (sorting by start vs sorting by end). Sorting by end time yields the greedy choice of leaving max room for future intervals.',
    companyTags: ['Google', 'Amazon', 'Meta', 'Walmart']
  },
  {
    trackId: 'dsa',
    topic: 'Greedy',
    title: 'Partition Labels',
    questionText: 'You are given a string s. We want to partition the string into as many parts as possible so that each letter appears in at most one part. Return list of partition sizes.',
    difficulty: 'medium',
    sampleAnswer: 'Store the last occurrence index of each character in a map/array. Iterate through string, keeping track of the max index boundary needed. If current index reaches boundary, record partition size and update start. Time: O(N), Space: O(1) since charset size is constant.',
    tips: 'Explain how two pointers (start and end) are updated as we encounter letters that appear further down the string.',
    companyTags: ['Amazon', 'Meta', 'Goldman Sachs']
  },

  // Binary Search
  {
    trackId: 'dsa',
    topic: 'Binary Search',
    title: 'Search in Rotated Sorted Array',
    questionText: 'Given sorted array nums rotated at an unknown pivot, search for a target. Do it in O(log N) time.',
    difficulty: 'medium',
    sampleAnswer: 'Perform binary search. For middle index, determine which half is sorted (left-to-mid or mid-to-right). Check if target lies within the boundaries of the sorted half to discard the other. Time: O(log N), Space: O(1).',
    tips: 'Emphasize checking boundaries carefully using <= and >= comparisons.',
    companyTags: ['Google', 'Amazon', 'Microsoft', 'Adobe', 'Meta']
  },
  {
    trackId: 'dsa',
    topic: 'Binary Search',
    title: 'Find Minimum in Rotated Sorted Array',
    questionText: 'Find the minimum element in a sorted array that has been rotated. O(log N) time.',
    difficulty: 'medium',
    sampleAnswer: 'Perform binary search. Compare mid value with right boundary value. If nums[mid] > nums[right], the minimum lies in the right half, so set left = mid + 1. Else, the minimum is in the left half (including mid), so set right = mid. Time: O(log N), Space: O(1).',
    tips: 'Explain why comparing mid to right is safer than comparing mid to left in this problem.',
    companyTags: ['Google', 'Amazon', 'Microsoft', 'Uber']
  },
  {
    trackId: 'dsa',
    topic: 'Binary Search',
    title: 'Search a 2D Matrix',
    questionText: 'Write an efficient algorithm that searches for a value in an m x n integer matrix where rows and columns are sorted. O(log(M*N)) time.',
    difficulty: 'medium',
    sampleAnswer: 'Treat the 2D matrix as a 1D array of size M*N. Perform standard binary search. Map index mid to 2D coordinates: row = mid / N, col = mid % N. Time: O(log(M*N)), Space: O(1).',
    tips: 'Highlight that this treats the matrix as a flattened array because the first element of each row is greater than the last element of the previous row.',
    companyTags: ['Amazon', 'Microsoft', 'Goldman Sachs', 'Flipkart']
  },
  {
    trackId: 'dsa',
    topic: 'Binary Search',
    title: 'Koko Eating Bananas',
    questionText: 'Given piles of bananas and h hours, find the minimum integer speed k to eat all bananas within h hours.',
    difficulty: 'medium',
    sampleAnswer: 'The search space for k is from 1 to max(piles). Perform binary search. For each mid speed, calculate total hours required. If hours <= h, mid is a candidate, search left for smaller speed. Else, search right. Time: O(N log(MaxP)), Space: O(1).',
    tips: 'Explain that this is a classic "Binary Search on Answer" problem where the search space is the range of possible answers.',
    companyTags: ['Google', 'Amazon', 'Meta', 'Atlassian']
  },
  {
    trackId: 'dsa',
    topic: 'Binary Search',
    title: 'Median of Two Sorted Arrays',
    questionText: 'Given two sorted arrays nums1 and nums2 of size m and n, return the median of the two sorted arrays. Time: O(log(min(M, N))).',
    difficulty: 'hard',
    sampleAnswer: 'Perform binary search on the partition sizes of the smaller array. Partition both arrays such that the left halves have equal elements. Verify boundary conditions: left1 <= right2 and left2 <= right1. Adjust partition. Time: O(log(min(M, N))), Space: O(1).',
    tips: 'This is a notoriously difficult question. Practice explaining the partition logic and boundary indices on a whiteboard.',
    companyTags: ['Google', 'Amazon', 'Microsoft', 'Goldman Sachs', 'Adobe']
  }
];

// 2. OS QUESTIONS (30 Unique Questions)
const OS_QUESTIONS = [
  // Processes
  {
    trackId: 'os',
    topic: 'Processes',
    title: 'Process vs Thread',
    questionText: 'Explain the difference between a process and a thread.',
    difficulty: 'easy',
    sampleAnswer: 'A process is an executing instance of an application that has its own independent address space, memory, and resources. A thread is a lightweight unit of execution within a process that shares the parent process\'s memory, code, and resources, but has its own stack and registers.',
    tips: 'Emphasize that process crashes do not affect other processes, whereas a thread crash can crash the entire parent process.',
    companyTags: ['Google', 'Amazon', 'Microsoft', 'Goldman Sachs']
  },
  {
    trackId: 'os',
    topic: 'Processes',
    title: 'Process Control Block (PCB)',
    questionText: 'What is a Process Control Block (PCB) and what does it contain?',
    difficulty: 'easy',
    sampleAnswer: 'A PCB is a data structure maintained by the operating system for each process. It stores process state, process ID (PID), program counter (PC), CPU registers, memory limits, list of open files, and CPU scheduling details.',
    tips: 'Mention that the PCB is crucial during context switching to save and load process execution contexts.',
    companyTags: ['Microsoft', 'Adobe', 'Walmart']
  },
  {
    trackId: 'os',
    topic: 'Processes',
    title: 'Zombie and Orphan Processes',
    questionText: 'Explain Zombie and Orphan processes in Linux/Unix.',
    difficulty: 'medium',
    sampleAnswer: 'A Zombie process is a completed process whose parent has not yet read its exit status via wait(). It occupies an entry in the process table. An Orphan process is a running process whose parent has terminated; it is adopted by the init (PID 1) process, which automatically reaps it.',
    tips: 'Highlight that having too many zombie processes can exhaust process table IDs, leading to system resource constraints.',
    companyTags: ['Uber', 'Goldman Sachs', 'Amazon']
  },
  {
    trackId: 'os',
    topic: 'Processes',
    title: 'Inter-Process Communication (IPC)',
    questionText: 'Compare Shared Memory and Message Passing techniques in IPC.',
    difficulty: 'medium',
    sampleAnswer: 'Shared memory maps a segment of physical memory to the address space of multiple processes, allowing direct, ultra-fast read/write access without kernel intervention. Message passing sends packets through kernel-mediated mailboxes or queues, which is slower but provides automatic synchronization and isolation.',
    tips: 'Mention that shared memory requires custom synchronization mechanisms like semaphores to avoid race conditions.',
    companyTags: ['Google', 'Amazon', 'Atlassian']
  },
  {
    trackId: 'os',
    topic: 'Processes',
    title: 'Context Switching',
    questionText: 'Explain the mechanism and overheads of Context Switching.',
    difficulty: 'medium',
    sampleAnswer: 'Context switching is the process of storing the CPU state of a running process/thread in its PCB/TCB and loading the saved state of another process/thread. Overheads include saving/loading registers, updating page table pointers, and invalidating CPU caches (TLB flushing).',
    tips: 'Discuss how context switching is a necessary evil that allows multitasking but degrades CPU throughput.',
    companyTags: ['Google', 'Microsoft', 'Meta']
  },

  // Threads
  {
    trackId: 'os',
    topic: 'Threads',
    title: 'User Threads vs Kernel Threads',
    questionText: 'What is the difference between User-level Threads and Kernel-level Threads?',
    difficulty: 'medium',
    sampleAnswer: 'User threads are managed by a user-space thread library without kernel awareness. They are fast to create/switch but block the entire process if one thread blocks. Kernel threads are directly managed by the OS scheduler. Switching is slower, but blocking one thread doesn\'t block others.',
    tips: 'Mention the thread mappings models: 1:1, N:1, and M:N.',
    companyTags: ['Microsoft', 'Atlassian', 'Adobe']
  },
  {
    trackId: 'os',
    topic: 'Threads',
    title: 'Thread Safety and Race Conditions',
    questionText: 'What is a Race Condition and how can we achieve Thread Safety?',
    difficulty: 'medium',
    sampleAnswer: 'A race condition occurs when concurrent threads access and modify shared data simultaneously, leading to unpredictable results. Thread safety is achieved using synchronization tools (mutexes, semaphores), atomic operations, or lock-free data structures.',
    tips: 'Use the classic "bank account balance increment" example to illustrate a race condition.',
    companyTags: ['Amazon', 'Google', 'Meta', 'Goldman Sachs']
  },
  {
    trackId: 'os',
    topic: 'Threads',
    title: 'Mutex vs Semaphore',
    questionText: 'Explain the difference between Mutex and Semaphore.',
    difficulty: 'easy',
    sampleAnswer: 'A Mutex is a locking mechanism used to synchronize access to a single resource. It is owned by only one thread at a time. A Semaphore is a signaling mechanism that uses a counter to manage access to a pool of multiple resources. Mutex has ownership concept, Semaphore does not.',
    tips: 'Mention binary semaphore vs counting semaphore and the priority inversion issue related to mutexes.',
    companyTags: ['Microsoft', 'Amazon', 'Uber', 'Walmart']
  },
  {
    trackId: 'os',
    topic: 'Threads',
    title: 'Thread Pool Design',
    questionText: 'What is a Thread Pool and why is it used?',
    difficulty: 'medium',
    sampleAnswer: 'A Thread Pool maintains a queue of tasks and a fixed collection of pre-instantiated worker threads. Instead of creating a new thread for each request (which incurs system call overhead), tasks are submitted to the pool, and active workers execute them.',
    tips: 'Discuss how thread pools prevent system exhaustion from spawning too many concurrent threads under load.',
    companyTags: ['Meta', 'Amazon', 'Flipkart']
  },
  {
    trackId: 'os',
    topic: 'Threads',
    title: 'Spinlocks vs Mutexes',
    questionText: 'When would you use a Spinlock instead of a Mutex?',
    difficulty: 'hard',
    sampleAnswer: 'A Mutex puts the waiting thread to sleep (context switch), which is costly. A Spinlock keeps the thread busy-waiting in a loop. Spinlocks are ideal for multi-core systems when the lock is expected to be held for a very short duration, avoiding context switch overhead.',
    tips: 'Point out that spinlocks are highly inefficient on single-core systems since the spinning thread wastes the CPU core needed by the lock holder to release it.',
    companyTags: ['Google', 'Meta', 'Uber']
  },

  // Scheduling
  {
    trackId: 'os',
    topic: 'Scheduling',
    title: 'Preemptive vs Non-Preemptive Scheduling',
    questionText: 'Contrast Preemptive and Non-Preemptive CPU Scheduling.',
    difficulty: 'easy',
    sampleAnswer: 'In preemptive scheduling, the OS can interrupt a running process and assign the CPU to another (e.g., Round Robin, SRTF). In non-preemptive scheduling, a process runs until it voluntarily yields control or terminates (e.g., FCFS, non-preemptive SJF).',
    tips: 'Explain that preemptive scheduling is crucial for modern multi-user/interactive desktop operating systems.',
    companyTags: ['Microsoft', 'Goldman Sachs', 'Walmart']
  },
  {
    trackId: 'os',
    topic: 'Scheduling',
    title: 'Round Robin (RR) Scheduling',
    questionText: 'Explain the working of Round Robin CPU Scheduling. How does time quantum selection affect performance?',
    difficulty: 'medium',
    sampleAnswer: 'RR assigns each process a fixed CPU time slot (time quantum) in a circular fashion. If the quantum is too large, RR behaves like FCFS. If the quantum is too small, process switching overhead increases significantly, reducing overall CPU throughput.',
    tips: 'State that quantum size is typically balanced to be larger than context switch time but small enough for fast interactive responses.',
    companyTags: ['Google', 'Amazon', 'Adobe']
  },
  {
    trackId: 'os',
    topic: 'Scheduling',
    title: 'SJF and Convoy Effect',
    questionText: 'Explain Shortest Job First (SJF) scheduling and the Convoy Effect.',
    difficulty: 'medium',
    sampleAnswer: 'SJF schedules the process with the shortest burst time first, yielding optimal average waiting time. The convoy effect occurs in FCFS when a long process occupies the CPU, causing short processes behind it to wait, leading to long average wait times.',
    tips: 'Discuss how SJF cannot be perfectly implemented because CPU burst times cannot be predicted in advance (they are estimated using exponential smoothing).',
    companyTags: ['Amazon', 'Microsoft', 'Atlassian']
  },
  {
    trackId: 'os',
    topic: 'Scheduling',
    title: 'Multi-Level Queue Scheduling',
    questionText: 'What is Multi-Level Queue Scheduling with Feedback?',
    difficulty: 'hard',
    sampleAnswer: 'It divides the ready queue into separate queues based on process type (interactive, batch). Multi-level feedback allows processes to move between queues. If a process uses too much CPU time, it is demoted to a lower-priority queue; if it waits too long, it is aged/promoted to prevent starvation.',
    tips: 'Explain how it dynamically separates CPU-bound and I/O-bound processes.',
    companyTags: ['Google', 'Uber', 'Atlassian']
  },
  {
    trackId: 'os',
    topic: 'Scheduling',
    title: 'Starvation and Aging',
    questionText: 'What is Starvation in OS scheduling, and how does Aging solve it?',
    difficulty: 'easy',
    sampleAnswer: 'Starvation (indefinite blocking) occurs when low-priority processes never get CPU time because high-priority processes keep arriving. Aging is a technique that gradually increases the priority of processes that wait in the ready queue for a long time.',
    tips: 'Mention that priority-based schedulers are highly susceptible to starvation without aging mechanisms.',
    companyTags: ['Microsoft', 'Goldman Sachs', 'Adobe']
  },

  // Deadlock
  {
    trackId: 'os',
    topic: 'Deadlock',
    title: 'Deadlock Coffman Conditions',
    questionText: 'What are the four Coffman conditions necessary for a deadlock to occur?',
    difficulty: 'medium',
    sampleAnswer: '1. Mutual Exclusion (non-shareable resources), 2. Hold and Wait (processes holding resources can request more), 3. No Preemption (resources cannot be forcibly taken), 4. Circular Wait (a circular loop of waiting processes). All four must hold simultaneously.',
    tips: 'Mention that breaking any one of these conditions (like ordering resource acquisition to prevent Circular Wait) prevents deadlocks.',
    companyTags: ['Amazon', 'Microsoft', 'Adobe', 'Goldman Sachs']
  },
  {
    trackId: 'os',
    topic: 'Deadlock',
    title: 'Banker\'s Algorithm',
    questionText: 'How does the Banker\'s Algorithm work for deadlock avoidance?',
    difficulty: 'hard',
    sampleAnswer: 'It simulates resource allocation for each process. Before granting a request, it checks if the system remains in a "safe state" (where a sequence of execution exists such that all processes can finish). If unsafe, the request is denied or delayed.',
    tips: 'Explain that the Banker\'s algorithm requires knowing maximum resource claims in advance, which is impractical in general-purpose systems.',
    companyTags: ['Google', 'Amazon', 'Meta', 'Uber']
  },
  {
    trackId: 'os',
    topic: 'Deadlock',
    title: 'Deadlock Detection vs Prevention vs Avoidance',
    questionText: 'Compare Deadlock Prevention, Avoidance, and Detection/Recovery.',
    difficulty: 'medium',
    sampleAnswer: 'Prevention sets strict rules to break one of the Coffman conditions. Avoidance dynamically checks allocation safety (e.g. Banker\'s). Detection allows deadlocks, checks for them periodically using wait-for graphs, and recovers by killing processes or preempting resources.',
    tips: 'Point out that most commercial OS (like Linux/Windows) use the Ostrich Algorithm (ignore the problem) due to high overhead of avoidance and prevention.',
    companyTags: ['Microsoft', 'Atlassian', 'Walmart']
  },
  {
    trackId: 'os',
    topic: 'Deadlock',
    title: 'Resource Allocation Graph (RAG)',
    questionText: 'Explain the role of Resource Allocation Graphs (RAG) in deadlock detection.',
    difficulty: 'medium',
    sampleAnswer: 'A RAG represents processes as nodes and resources as nodes. Edges represent allocations or requests. If the graph contains a cycle and resources are single-unit, a deadlock exists. If resources are multi-unit, a cycle is a necessary but not sufficient condition.',
    tips: 'Draw or describe process nodes (circles) and resource nodes (rectangles with dots).',
    companyTags: ['Meta', 'Atlassian', 'Adobe']
  },
  {
    trackId: 'os',
    topic: 'Deadlock',
    title: 'Livelock vs Deadlock',
    questionText: 'What is the difference between Deadlock and Livelock?',
    difficulty: 'easy',
    sampleAnswer: 'In a deadlock, processes are in a blocked state, waiting forever without executing. In a livelock, processes actively change their states and execute instructions in response to each other, but make no forward progress (similar to two polite people trying to pass each other in a narrow hallway).',
    tips: 'Mention that livelock consumes CPU cycles (active looping), whereas deadlock does not.',
    companyTags: ['Google', 'Amazon', 'Uber']
  },

  // Paging
  {
    trackId: 'os',
    topic: 'Paging',
    title: 'Paging Memory Management',
    questionText: 'Explain the concept of Paging in memory management.',
    difficulty: 'easy',
    sampleAnswer: 'Paging divides a process\'s logical address space into fixed-size blocks called pages, and physical memory into blocks of the same size called frames. Page tables map logical pages to physical frames, eliminating the need for contiguous allocation.',
    tips: 'Highlight that paging completely eliminates external fragmentation, though it can cause minor internal fragmentation on the last page.',
    companyTags: ['Google', 'Amazon', 'Microsoft', 'Goldman Sachs']
  },
  {
    trackId: 'os',
    topic: 'Paging',
    title: 'Translation Lookaside Buffer (TLB)',
    questionText: 'What is a Translation Lookaside Buffer (TLB) and how does it optimize paging?',
    difficulty: 'medium',
    sampleAnswer: 'The TLB is a fast associative cache on the CPU. It stores recent virtual-to-physical address translations. When a virtual address is accessed, the CPU checks the TLB first. On a TLB hit, translation takes near-zero time, avoiding a slow double-memory access via the page table.',
    tips: 'Describe a "TLB miss" and how it triggers a hardware page table walk.',
    companyTags: ['Microsoft', 'Adobe', 'Apple', 'Intel']
  },
  {
    trackId: 'os',
    topic: 'Paging',
    title: 'Multi-Level Paging',
    questionText: 'Why do operating systems use Multi-Level Page Tables?',
    difficulty: 'hard',
    sampleAnswer: 'Single-level page tables for large address spaces (e.g. 64-bit) require huge contiguous blocks of memory. Multi-level page tables break the page table into smaller pages and page index nodes, allowing sparse directories. Only active tables need to be loaded into physical memory.',
    tips: 'Explain that the trade-off of multi-level page tables is increased translation lookup time (page table walks).',
    companyTags: ['Google', 'Meta', 'Uber', 'Atlassian']
  },
  {
    trackId: 'os',
    topic: 'Paging',
    title: 'Page Replacement Algorithms',
    questionText: 'Compare FIFO, LRU, and Optimal page replacement algorithms.',
    difficulty: 'medium',
    sampleAnswer: 'FIFO replaces the oldest page (can suffer from Belady\'s Anomaly). LRU replaces the page that has not been used for the longest time (practical approximation). Optimal replaces the page that will not be used for the longest time in the future (impossible to implement, used as benchmark).',
    tips: 'Be prepared to manually simulate page faults on a page reference string using LRU/FIFO.',
    companyTags: ['Amazon', 'Microsoft', 'Walmart', 'Flipkart']
  },
  {
    trackId: 'os',
    topic: 'Paging',
    title: 'Belady\'s Anomaly',
    questionText: 'What is Belady\'s Anomaly?',
    difficulty: 'medium',
    sampleAnswer: 'Belady\'s Anomaly is a phenomenon where the page fault rate increases when the system is allocated more physical memory frames. It occurs in FIFO page replacement, but cannot occur in stack-based algorithms like LRU.',
    tips: 'Give a quick reference string (e.g., 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5) to demonstrate it with 3 vs 4 frames.',
    companyTags: ['Microsoft', 'Goldman Sachs', 'Atlassian']
  },

  // Virtual Memory
  {
    trackId: 'os',
    topic: 'Virtual Memory',
    title: 'Virtual Memory Concept',
    questionText: 'What is Virtual Memory and what benefits does it offer?',
    difficulty: 'easy',
    sampleAnswer: 'Virtual memory is a storage allocation scheme that maps logical memory addresses to physical memory and disk swap space. It allows processes to execute even if their size exceeds physical RAM, provides memory protection between processes, and simplifies compiling.',
    tips: 'Highlight that virtual memory enables isolation: one process cannot read or write to another\'s memory space.',
    companyTags: ['Google', 'Amazon', 'Microsoft', 'Adobe']
  },
  {
    trackId: 'os',
    topic: 'Virtual Memory',
    title: 'Page Fault Handling',
    questionText: 'Describe the sequence of steps that occurs during a Page Fault.',
    difficulty: 'medium',
    sampleAnswer: '1. CPU references page table, page is marked invalid. 2. CPU traps to OS kernel. 3. Kernel finds page on disk swap. 4. Kernel finds a free physical frame (runs page replacement if full). 5. Kernel schedules disk read. 6. Disk reads page to frame, page table updated. 7. CPU instruction restarts.',
    tips: 'Explain that page fault handling involves disk I/O, which is orders of magnitude slower than RAM access, making page faults critical to minimize.',
    companyTags: ['Amazon', 'Google', 'Meta', 'Uber']
  },
  {
    trackId: 'os',
    topic: 'Virtual Memory',
    title: 'Thrashing',
    questionText: 'What is Thrashing and how can it be prevented?',
    difficulty: 'hard',
    sampleAnswer: 'Thrashing occurs when a system spends more time page-faulting and swapping pages in/out of disk than executing useful instructions. It happens when physical memory is over-allocated. It is prevented by local page replacement, reducing degree of multiprogramming, or allocating frames using the Working Set Model.',
    tips: 'Describe the classic "CPU utilization vs degree of multiprogramming" graph where utilization crashes once thrashing starts.',
    companyTags: ['Google', 'Meta', 'Uber', 'Atlassian']
  },
  {
    trackId: 'os',
    topic: 'Virtual Memory',
    title: 'Demand Paging',
    questionText: 'What is Demand Paging?',
    difficulty: 'easy',
    sampleAnswer: 'Demand Paging is a virtual memory technique where pages of a process are loaded into physical memory only when they are requested (demanded) during execution, rather than loading the entire program at startup (lazy swapper).',
    tips: 'Explain how this accelerates initial application startup times and saves memory.',
    companyTags: ['Microsoft', 'Goldman Sachs', 'Walmart']
  },
  {
    trackId: 'os',
    topic: 'Virtual Memory',
    title: 'Kernel Space vs User Space',
    questionText: 'Explain the separation between Kernel Space and User Space in Virtual Memory.',
    difficulty: 'medium',
    sampleAnswer: 'Virtual memory is divided. User space is where normal user applications execute. Kernel space is reserved for the operating system kernel, drivers, and extensions. Applications in user space must use system calls to access kernel space resources, protected by CPU ring privileges.',
    tips: 'Discuss CPU protection rings: Ring 0 for kernel space and Ring 3 for user space.',
    companyTags: ['Google', 'Microsoft', 'Apple', 'Goldman Sachs']
  }
];

// 3. DBMS QUESTIONS (30 Unique Questions)
const DBMS_QUESTIONS = [
  // Normalization
  {
    trackId: 'dbms',
    topic: 'Normalization',
    title: '1NF, 2NF, 3NF Normal Forms',
    questionText: 'Explain the rules of 1st, 2nd, and 3rd Normal Forms.',
    difficulty: 'easy',
    sampleAnswer: '1NF: Remove repeating groups, ensure all cell values are atomic. 2NF: Must be in 1NF, remove partial key dependencies (every non-prime attribute must depend on the whole primary key). 3NF: Must be in 2NF, remove transitive dependencies (non-prime attributes must not depend on other non-prime attributes).',
    tips: 'Draw simple tables to show how violating these causes insertion, deletion, and update anomalies.',
    companyTags: ['Goldman Sachs', 'Amazon', 'Walmart', 'Microsoft']
  },
  {
    trackId: 'dbms',
    topic: 'Normalization',
    title: 'Boyce-Codd Normal Form (BCNF)',
    questionText: 'What is BCNF and how does it differ from 3NF?',
    difficulty: 'medium',
    sampleAnswer: 'BCNF is a stronger version of 3NF. A table is in BCNF if for every functional dependency X -> Y, X is a superkey. BCNF addresses cases where a relation has overlapping candidate keys. 3NF allows Y to be a prime attribute, BCNF does not.',
    tips: 'Highlight that every relation in BCNF is in 3NF, but not vice versa.',
    companyTags: ['Amazon', 'Adobe', 'Flipkart']
  },
  {
    trackId: 'dbms',
    topic: 'Normalization',
    title: 'Functional Dependency',
    questionText: 'Explain Functional Dependency and Lossless Decomposition.',
    difficulty: 'medium',
    sampleAnswer: 'A functional dependency X -> Y means X uniquely determines Y. A decomposition of relation R into R1 and R2 is lossless if the natural join of R1 and R2 yields the exact original relation R without any spurious records. This is guaranteed if R1 intersect R2 functional-determines either R1 or R2.',
    tips: 'Define what a spurious tuple is and why it represents corrupted information.',
    companyTags: ['Google', 'Microsoft', 'Atlassian']
  },
  {
    trackId: 'dbms',
    topic: 'Normalization',
    title: 'Denormalization',
    questionText: 'What is Denormalization and when should it be used?',
    difficulty: 'medium',
    sampleAnswer: 'Denormalization is the process of intentionally introducing redundancy into a normalized database schema. It is used to optimize read query performance by avoiding expensive multi-table joins. Typical in read-heavy applications or data warehouses.',
    tips: 'Emphasize that the cost of denormalization is slower writes, extra storage, and the need to manage data consistency at the application layer.',
    companyTags: ['Google', 'Meta', 'Amazon', 'Uber']
  },
  {
    trackId: 'dbms',
    topic: 'Normalization',
    title: '4NF and 5NF',
    questionText: 'Briefly explain 4NF and 5NF (Join Dependency).',
    difficulty: 'hard',
    sampleAnswer: '4NF removes multi-valued dependencies (where one attribute determines multiple independent sets of values). 5NF ensures that the relation cannot be decomposed into smaller relations that can be joined back to reconstruct the original without losing information (join dependencies).',
    tips: 'State that 4NF and 5NF are rarely utilized in standard transactional design, but are critical to understand conceptually.',
    companyTags: ['Google', 'Microsoft', 'Goldman Sachs']
  },

  // Joins
  {
    trackId: 'dbms',
    topic: 'Joins',
    title: 'Inner vs Outer Joins',
    questionText: 'Compare Inner Join, Left Join, Right Join, and Full Outer Join.',
    difficulty: 'easy',
    sampleAnswer: 'Inner Join returns records that have matching values in both tables. Left Join returns all records from the left table and matched records from the right (with NULLs for unmatched). Right Join is the inverse. Full Outer Join returns all records when there is a match in either table.',
    tips: 'Be ready to write a simple SQL syntax showing left joins and filtering out nulls to find missing relations.',
    companyTags: ['Walmart', 'Flipkart', 'Goldman Sachs', 'Amazon']
  },
  {
    trackId: 'dbms',
    topic: 'Joins',
    title: 'Self Join and Cross Join',
    questionText: 'What are Self Join and Cross Join? Give use cases.',
    difficulty: 'medium',
    sampleAnswer: 'A Self Join is a regular join where a table is joined with itself (requires aliasing). Use case: querying employee-manager hierarchies. A Cross Join returns the Cartesian product of the two tables (every row from Table A matched with every row from Table B). Use case: generating combinations (sizes and colors).',
    tips: 'Point out that Cross Joins can yield massive result sets: M * N rows.',
    companyTags: ['Microsoft', 'Adobe', 'Amazon']
  },
  {
    trackId: 'dbms',
    topic: 'Joins',
    title: 'Join Algorithms',
    questionText: 'Explain the internal database join algorithms: Nested Loop, Hash Join, and Sort-Merge Join.',
    difficulty: 'hard',
    sampleAnswer: 'Nested Loop: Outer loop scans Table A, inner loop searches Table B (slow, good for small tables). Hash Join: Builds an in-memory hash table of the smaller table, scans the larger one (fast, requires memory). Sort-Merge: Sorts both tables on join key, then merges them (efficient if inputs are already indexed or sorted).',
    tips: 'Mention that the database optimizer automatically selects the best join algorithm based on table statistics and indexes.',
    companyTags: ['Google', 'Meta', 'Uber']
  },
  {
    trackId: 'dbms',
    topic: 'Joins',
    title: 'Subqueries vs Joins',
    questionText: 'When would you prefer a Join over a Subquery, and vice versa?',
    difficulty: 'medium',
    sampleAnswer: 'Joins are generally preferred because modern query optimizers compile and execute them very efficiently. Subqueries (especially correlated ones) can lead to nested loop execution (row-by-row checks). However, subqueries improve readability for aggregate checks or filtering.',
    tips: 'Mention the EXISTS clause as an optimized subquery mechanism that stops scanning as soon as a match is found.',
    companyTags: ['Amazon', 'Walmart', 'Atlassian']
  },
  {
    trackId: 'dbms',
    topic: 'Joins',
    title: 'Natural Join vs Equi Join',
    questionText: 'What is the difference between Natural Join and Equi Join?',
    difficulty: 'easy',
    sampleAnswer: 'An Equi Join is a join that uses equality comparison operator on specific columns (e.g. A.id = B.id). A Natural Join is a type of Equi Join that automatically joins tables based on columns with identical names and data types, removing duplicate columns in the result schema.',
    tips: 'Warn that Natural Joins can be dangerous if columns with the same name (like "created_at") have different meanings in different tables.',
    companyTags: ['Goldman Sachs', 'Adobe', 'Microsoft']
  },

  // Indexing
  {
    trackId: 'dbms',
    topic: 'Indexing',
    title: 'B-Tree vs B+ Tree Indexes',
    questionText: 'Why do relational databases prefer B+ Trees over B-Trees for indexing?',
    difficulty: 'hard',
    sampleAnswer: 'In B-Trees, keys and record pointers are stored in both internal and leaf nodes. In B+ Trees, data pointers are stored only in leaf nodes, allowing internal nodes to hold more keys, which reduces tree height (fan-out). Leaf nodes in B+ Trees are also linked in a doubly-linked list, making range queries highly efficient.',
    tips: 'Highlight that B+ Trees reduce disk I/O operations, which is the primary bottleneck in database lookups.',
    companyTags: ['Google', 'Amazon', 'Meta', 'Uber']
  },
  {
    trackId: 'dbms',
    topic: 'Indexing',
    title: 'Clustered vs Non-Clustered Index',
    questionText: 'Explain the difference between a Clustered and a Non-Clustered index.',
    difficulty: 'medium',
    sampleAnswer: 'A Clustered index determines the physical order of data storage in the table (a table can have only one). Leaf nodes contain the actual data rows. A Non-Clustered index has a separate structure where leaf nodes contain index keys and pointers (row locators) back to the actual data rows.',
    tips: 'State that primary keys automatically create clustered indexes in most databases.',
    companyTags: ['Microsoft', 'Goldman Sachs', 'Atlassian', 'Adobe']
  },
  {
    trackId: 'dbms',
    topic: 'Indexing',
    title: 'Composite and Covering Indexes',
    questionText: 'What are Composite Indexes and Covering Indexes?',
    difficulty: 'medium',
    sampleAnswer: 'A Composite Index is an index built on multiple columns. A Covering Index is a query-specific optimization where the index contains all the columns requested in the SELECT and WHERE clauses, allowing the database to satisfy the query entirely from the index without reading the actual table pages.',
    tips: 'Mention the "Left-to-Right" rule: a composite index on (A, B) cannot be used if only B is in the WHERE clause.',
    companyTags: ['Google', 'Amazon', 'Meta']
  },
  {
    trackId: 'dbms',
    topic: 'Indexing',
    title: 'Write Overhead of Indexing',
    questionText: 'What are the costs of having too many indexes on a database table?',
    difficulty: 'easy',
    sampleAnswer: 'Every index slows down write operations (INSERT, UPDATE, DELETE) because the database must update all index structures to maintain consistency. Additionally, indexes consume substantial disk space and memory cache.',
    tips: 'Summarize as: Indexes speed up reads but slow down writes.',
    companyTags: ['Amazon', 'Walmart', 'Flipkart']
  },
  {
    trackId: 'dbms',
    topic: 'Indexing',
    title: 'Index Scan vs Index Seek',
    questionText: 'What is the difference between an Index Scan and an Index Seek?',
    difficulty: 'medium',
    sampleAnswer: 'An Index Seek is highly efficient: the database uses the b-tree traversal to navigate directly to matching records. An Index Scan means the database must traverse the entire index leaf-level list, usually because the query predicate doesn\'t allow tree traversal or is not selective enough.',
    tips: 'Describe how EXPLAIN ANALYZE helps identify index scans that need optimization.',
    companyTags: ['Google', 'Microsoft', 'Uber']
  },

  // Transactions
  {
    trackId: 'dbms',
    topic: 'Transactions',
    title: 'Database Transaction States',
    questionText: 'Describe the states of a database transaction (Active, Partially Committed, etc.).',
    difficulty: 'easy',
    sampleAnswer: 'Active (initial state, executing), Partially Committed (final statements executed but changes not written to disk), Committed (successfully written to disk, permanent), Failed (error occurs), Aborted (rolled back, DB restored to pre-transaction state).',
    tips: 'Mention that a rollback is triggered upon reaching the Aborted state to guarantee consistency.',
    companyTags: ['Microsoft', 'Goldman Sachs', 'Adobe']
  },
  {
    trackId: 'dbms',
    topic: 'Transactions',
    title: 'Read Phenomenas',
    questionText: 'Explain Dirty Reads, Non-Repeatable Reads, and Phantom Reads.',
    difficulty: 'medium',
    sampleAnswer: 'Dirty Read: Transaction reads uncommitted data of another transaction. Non-Repeatable Read: Transaction reads a row, another modifies it, first reads again and finds different values. Phantom Read: Transaction runs a range query, another inserts new rows in that range, first reruns query and finds new rows.',
    tips: 'Differentiate between Non-Repeatable (update of existing row) and Phantom (insertion/deletion of new rows).',
    companyTags: ['Google', 'Amazon', 'Meta', 'Uber']
  },
  {
    trackId: 'dbms',
    topic: 'Transactions',
    title: 'Transaction Isolation Levels',
    questionText: 'Compare the four standard SQL Transaction Isolation Levels.',
    difficulty: 'hard',
    sampleAnswer: '1. Read Uncommitted: No isolation, all read phenomenas possible. 2. Read Committed: Prevents Dirty Reads (standard in PostgreSQL/SQL Server). 3. Repeatable Read: Prevents Dirty and Non-Repeatable reads (standard in MySQL InnoDB). 4. Serializable: Full isolation (locking ranges, prevents all phenomenas, slowest).',
    tips: 'Explain that higher isolation levels reduce concurrency and increase transaction blocking and deadlocks.',
    companyTags: ['Google', 'Microsoft', 'Atlassian']
  },
  {
    trackId: 'dbms',
    topic: 'Transactions',
    title: 'Two-Phase Locking (2PL)',
    questionText: 'What is the Two-Phase Locking (2PL) protocol?',
    difficulty: 'medium',
    sampleAnswer: '2PL is a concurrency control protocol that guarantees serializability. It consists of: 1. Growing Phase (transaction acquires locks, releases none). 2. Shrinking Phase (transaction releases locks, acquires none). Once a lock is released, no new locks can be acquired.',
    tips: 'Mention Strict 2PL where all exclusive locks are held until the transaction commits, preventing cascading rollbacks.',
    companyTags: ['Meta', 'Amazon', 'Flipkart']
  },
  {
    trackId: 'dbms',
    topic: 'Transactions',
    title: 'Write-Ahead Logging (WAL)',
    questionText: 'What is Write-Ahead Logging (WAL) and why is it used?',
    difficulty: 'hard',
    sampleAnswer: 'WAL is a family of techniques for providing atomicity and durability. It dictates that changes must be written and flushed to a non-volatile log file on disk *before* the actual database pages are modified in memory. If the server crashes, the database reconstructs its state using the log (REDO/UNDO).',
    tips: 'Explain that writing to log is sequential (fast), whereas writing to table files is random (slow), making WAL highly efficient.',
    companyTags: ['Google', 'Meta', 'Uber']
  },

  // ACID
  {
    trackId: 'dbms',
    topic: 'ACID',
    title: 'ACID Properties',
    questionText: 'Define the ACID properties and explain transaction safety.',
    difficulty: 'easy',
    sampleAnswer: 'A: Atomicity (all changes commit or none do), C: Consistency (DB moves from one valid state to another, enforcing constraints), I: Isolation (concurrent transactions execute without interference), D: Durability (committed changes survive power losses or crashes).',
    tips: 'Use a double-entry bank transfer example (deducting from Account A, adding to Account B) to demonstrate Atomicity and Consistency.',
    companyTags: ['Walmart', 'Flipkart', 'Goldman Sachs', 'Amazon']
  },
  {
    trackId: 'dbms',
    topic: 'ACID',
    title: 'Atomicity Implementation',
    questionText: 'How does a database engine implement Atomicity internally?',
    difficulty: 'medium',
    sampleAnswer: 'Database engines use transaction log files containing UNDO and REDO records. The UNDO log contains information on how to reverse modifications if a transaction aborts. The REDO log contains information to re-apply committed changes that didn\'t make it to the physical table pages before a crash.',
    tips: 'Mention the checkpoint mechanism which flushes dirty memory pages to disk to limit recovery time.',
    companyTags: ['Amazon', 'Microsoft', 'Adobe']
  },
  {
    trackId: 'dbms',
    topic: 'ACID',
    title: 'CAP Theorem vs ACID',
    questionText: 'How do ACID transactions relate to the CAP Theorem?',
    difficulty: 'hard',
    sampleAnswer: 'ACID focuses on single-node transaction consistency and safety. CAP Theorem (Consistency, Availability, Partition Tolerance) addresses distributed databases. When a network partition occurs, a database must choose between Consistency (refusing writes to guarantee same data) or Availability (accepting writes but risking inconsistency).',
    tips: 'Clarify that "Consistency" in CAP means all nodes see the same data at the same time, whereas "Consistency" in ACID means enforcing database schema integrity constraints.',
    companyTags: ['Google', 'Meta', 'Amazon', 'Atlassian']
  },
  {
    trackId: 'dbms',
    topic: 'ACID',
    title: 'Multi-Version Concurrency Control (MVCC)',
    questionText: 'Explain Multi-Version Concurrency Control (MVCC).',
    difficulty: 'hard',
    sampleAnswer: 'MVCC is a method used to implement isolation without massive locking. The database keeps multiple versions of data rows. When a transaction reads, it sees a consistent snapshot of the data from the moment it started. Writers do not block readers, and readers do not block writers; writes just create a newer version of the data.',
    tips: 'Mention that MVCC requires a garbage collector (like VACUUM in PostgreSQL) to clean up old, dead row versions.',
    companyTags: ['Google', 'Meta', 'Uber']
  },
  {
    trackId: 'dbms',
    topic: 'ACID',
    title: 'Durability Implementation',
    questionText: 'What is the fsync system call and how does it guarantee Durability?',
    difficulty: 'medium',
    sampleAnswer: 'When a database commits, it writes to the OS file cache. However, the OS may delay writing to physical disk to optimize throughput. The fsync system call forces the OS to flush all dirty buffer cache blocks of a file to physical disk immediately, ensuring durability.',
    tips: 'Mention that frequent fsync calls represent a significant performance bottleneck due to disk rotation/seek times.',
    companyTags: ['Microsoft', 'Goldman Sachs', 'Adobe']
  },

  // SQL Queries
  {
    trackId: 'dbms',
    topic: 'SQL Queries',
    title: 'Find Second Highest Salary',
    questionText: 'Write a SQL query to find the second highest salary from an Employee table.',
    difficulty: 'easy',
    sampleAnswer: 'SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee); OR SELECT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1;',
    tips: 'Note that the subquery approach handles duplicate salaries correctly. Suggest using DENSE_RANK() as an alternative.',
    companyTags: ['Microsoft', 'Amazon', 'Goldman Sachs', 'Walmart']
  },
  {
    trackId: 'dbms',
    topic: 'SQL Queries',
    title: 'Window Functions vs Group By',
    questionText: 'What is the difference between Group By and Window Functions?',
    difficulty: 'medium',
    sampleAnswer: 'Group By collapses multiple rows into a single summary row, losing individual row identities. Window Functions perform calculations across a set of table rows related to the current row, returning a value for every single row in the input.',
    tips: 'Give syntax examples like SUM(salary) OVER(PARTITION BY department_id).',
    companyTags: ['Google', 'Amazon', 'Meta', 'Flipkart']
  },
  {
    trackId: 'dbms',
    topic: 'SQL Queries',
    title: 'Find Duplicate Records',
    questionText: 'Write a SQL query to find duplicate emails in a Users table.',
    difficulty: 'easy',
    sampleAnswer: 'SELECT email, COUNT(email) FROM Users GROUP BY email HAVING COUNT(email) > 1;',
    tips: 'Emphasize that the HAVING clause is used to filter aggregates, whereas the WHERE clause cannot operate on aggregate functions.',
    companyTags: ['Adobe', 'Walmart', 'Amazon']
  },
  {
    trackId: 'dbms',
    topic: 'SQL Queries',
    title: 'RANK vs DENSE_RANK',
    questionText: 'Explain the difference between ROW_NUMBER(), RANK(), and DENSE_RANK() window functions.',
    difficulty: 'medium',
    sampleAnswer: 'ROW_NUMBER() assigns a unique, sequential integer to each row. RANK() assigns identical ranks to duplicate values, but skips subsequent rank numbers (e.g. 1, 2, 2, 4). DENSE_RANK() assigns identical ranks to duplicates without skipping numbers (e.g. 1, 2, 2, 3).',
    tips: 'Write a quick query showing how these behave on a sample dataset with duplicate marks.',
    companyTags: ['Atlassian', 'Goldman Sachs', 'Microsoft']
  },
  {
    trackId: 'dbms',
    topic: 'SQL Queries',
    title: 'SQL Injection',
    questionText: 'What is SQL Injection and how do Prepared Statements prevent it?',
    difficulty: 'medium',
    sampleAnswer: 'SQL Injection occurs when user input is concatenated directly into SQL strings, allowing malicious SQL queries to execute. Prepared Statements pre-compile the SQL template, treating user input strictly as parameters (data bindings) rather than executable code, rendering SQL injection impossible.',
    tips: 'Mention that parameter sanitization and prepared statements are standard practices in modern ORMs.',
    companyTags: ['Google', 'Meta', 'Amazon', 'Atlassian']
  }
];

// 4. NETWORKING QUESTIONS (25 Unique Questions)
const CN_QUESTIONS = [
  // TCP/IP
  {
    trackId: 'cn',
    topic: 'TCP/IP',
    title: 'TCP vs UDP',
    questionText: 'Compare TCP and UDP protocols.',
    difficulty: 'easy',
    sampleAnswer: 'TCP is a connection-oriented, reliable protocol that guarantees packet delivery and order using handshakes, acknowledgements, and retransmissions. UDP is a connectionless, unreliable protocol that sends packets immediately without confirmation, prioritizing speed over reliability.',
    tips: 'Give use cases: TCP for web browsing (HTTP), email, file transfer; UDP for live streaming, gaming, DNS lookup.',
    companyTags: ['Google', 'Amazon', 'Microsoft', 'Goldman Sachs']
  },
  {
    trackId: 'cn',
    topic: 'TCP/IP',
    title: 'TCP 3-Way Handshake',
    questionText: 'Explain the steps of the TCP 3-Way Handshake.',
    difficulty: 'easy',
    sampleAnswer: '1. Client sends SYN (Synchronize) packet with initial sequence number x. 2. Server responds with SYN-ACK, acknowledging x (ack = x+1) and sending its own sequence number y. 3. Client sends ACK packet, acknowledging y (ack = y+1). Connection is established.',
    tips: 'Explain why a 2-way handshake is insufficient (to prevent delayed duplicate connections from causing server resource leaks).',
    companyTags: ['Microsoft', 'Atlassian', 'Adobe', 'Intel']
  },
  {
    trackId: 'cn',
    topic: 'TCP/IP',
    title: 'TCP 4-Way Connection Termination',
    questionText: 'Explain how a TCP connection is closed using a 4-way handshake.',
    difficulty: 'medium',
    sampleAnswer: '1. Active closer sends FIN packet. 2. Other side responds with ACK, entering Close-Wait state (can still send remaining data). 3. Other side finishes sending, sends its own FIN packet. 4. Active closer responds with ACK, enters Time-Wait state (typically waits 2*MSL) before fully closing.',
    tips: 'Highlight the importance of the Time-Wait state to ensure final ACK is received and to clean up stray packets.',
    companyTags: ['Google', 'Meta', 'Uber']
  },
  {
    trackId: 'cn',
    topic: 'TCP/IP',
    title: 'TCP Flow Control',
    questionText: 'How does TCP implement Flow Control?',
    difficulty: 'medium',
    sampleAnswer: 'TCP uses a Sliding Window mechanism. The receiver specifies its "Receiver Window" (rwnd) size in the TCP header, indicating how much free buffer space it has. The sender must limit outstanding, unacknowledged data to not exceed this rwnd size, preventing the receiver from being overwhelmed.',
    tips: 'Contrast Flow Control (preventing buffer overflow at receiver) with Congestion Control (preventing network congestion).',
    companyTags: ['Amazon', 'Google', 'Microsoft']
  },
  {
    trackId: 'cn',
    topic: 'TCP/IP',
    title: 'OSI vs TCP/IP Models',
    questionText: 'Compare the OSI reference model and the TCP/IP model.',
    difficulty: 'easy',
    sampleAnswer: 'OSI is a 7-layer theoretical reference model (Physical, Data Link, Network, Transport, Session, Presentation, Application). TCP/IP is a 4-layer practical model (Network Access, Internet, Transport, Application) that runs the modern internet.',
    tips: 'Map common protocols: IP at Network/Internet; TCP/UDP at Transport; HTTP/DNS at Application.',
    companyTags: ['Microsoft', 'Goldman Sachs', 'Walmart']
  },

  // HTTP
  {
    trackId: 'cn',
    topic: 'HTTP',
    title: 'HTTP vs HTTPS',
    questionText: 'How does HTTPS secure HTTP communication?',
    difficulty: 'easy',
    sampleAnswer: 'HTTPS encrypts HTTP data using SSL/TLS protocols. It uses asymmetric cryptography (Public/Private keys) during a handshake to establish identity and exchange a symmetric session key. All subsequent traffic is encrypted symmetrically using that session key, ensuring confidentiality and integrity.',
    tips: 'Mention Port 80 for HTTP and Port 443 for HTTPS.',
    companyTags: ['Google', 'Amazon', 'Microsoft', 'Atlassian']
  },
  {
    trackId: 'cn',
    topic: 'HTTP',
    title: 'HTTP Status Codes',
    questionText: 'Explain the classes of HTTP Status Codes.',
    difficulty: 'easy',
    sampleAnswer: '1xx: Informational. 2xx: Success (e.g. 200 OK, 201 Created). 3xx: Redirection (e.g. 301 Moved Permanently, 304 Not Modified). 4xx: Client Error (e.g. 400 Bad Request, 401 Unauthorized, 404 Not Found). 5xx: Server Error (e.g. 500 Internal Server Error, 503 Service Unavailable).',
    tips: 'Mention the difference between 401 Unauthorized (must authenticate) and 403 Forbidden (authenticated but lacks permissions).',
    companyTags: ['Walmart', 'Flipkart', 'Goldman Sachs']
  },
  {
    trackId: 'cn',
    topic: 'HTTP',
    title: 'HTTP Methods',
    questionText: 'Compare GET, POST, PUT, and PATCH methods. Which are idempotent?',
    difficulty: 'medium',
    sampleAnswer: 'GET retrieves data (idempotent/safe). POST creates data (not idempotent). PUT replaces a resource entirely or creates it if missing (idempotent). PATCH applies partial modifications to a resource (not inherently idempotent). Idempotent means calling it multiple times yields the same state.',
    tips: 'Explain that GET requests should not modify state on the server.',
    companyTags: ['Amazon', 'Adobe', 'Atlassian']
  },
  {
    trackId: 'cn',
    topic: 'HTTP',
    title: 'HTTP/1.1 vs HTTP/2 vs HTTP/3',
    questionText: 'What are the differences between HTTP/1.1, HTTP/2, and HTTP/3?',
    difficulty: 'hard',
    sampleAnswer: 'HTTP/1.1 suffers from Head-of-Line (HOL) blocking (requires separate TCP connections). HTTP/2 introduces multiplexing over a single TCP connection, header compression (HPACK), and server push. HTTP/3 replaces TCP with QUIC (built on UDP), resolving TCP HOL blocking issues and offering faster connection setup.',
    tips: 'Explain what Head-of-Line blocking means (one slow request blocks all others on the connection).',
    companyTags: ['Google', 'Meta', 'Uber', 'Atlassian']
  },
  {
    trackId: 'cn',
    topic: 'HTTP',
    title: 'Session vs Cookie vs Token',
    questionText: 'Compare Sessions, Cookies, and JWT Tokens for authentication.',
    difficulty: 'medium',
    sampleAnswer: 'Sessions are stateful: data is stored on the server, referenced by a Session ID in a cookie. Cookies are storage mechanisms on the browser. JWT (JSON Web Tokens) are stateless: all user data is encoded, digitally signed, and stored on the client, avoiding database lookups on the server.',
    tips: 'Explain the security trade-offs (JWTs are harder to revoke, Sessions require database lookups).',
    companyTags: ['Google', 'Meta', 'Amazon', 'Uber']
  },

  // DNS
  {
    trackId: 'cn',
    topic: 'DNS',
    title: 'DNS Resolution Process',
    questionText: 'Describe what happens step-by-step when you type google.com in a browser.',
    difficulty: 'medium',
    sampleAnswer: '1. Check local browser/OS cache. 2. Query Resolver (ISP). 3. Resolver queries Root Nameserver (returns .com TLD server). 4. Resolver queries TLD Nameserver (returns google.com Authoritative server). 5. Resolver queries Authoritative Nameserver (returns IP). 6. Browser caches IP and initiates TCP handshake.',
    tips: 'Highlight that Root and TLD servers return referrals (delegations), not the final IP.',
    companyTags: ['Google', 'Amazon', 'Microsoft', 'Goldman Sachs']
  },
  {
    trackId: 'cn',
    topic: 'DNS',
    title: 'DNS Record Types',
    questionText: 'Explain A, CNAME, MX, and TXT records.',
    difficulty: 'easy',
    sampleAnswer: 'A: Maps domain name to IPv4 address. AAAA: Maps domain to IPv6. CNAME: Canonical Name (creates alias for another domain name). MX: Mail Exchange (routes emails to mail servers). TXT: Text record (used for domain verification and security policies like SPF/DKIM).',
    tips: 'Mention that a CNAME record cannot coexist with other records for the same name, which is why root domains use ALIAS records.',
    companyTags: ['Atlassian', 'Adobe', 'Walmart']
  },
  {
    trackId: 'cn',
    topic: 'DNS',
    title: 'DNS Caching and TTL',
    questionText: 'What is TTL (Time-to-Live) in DNS?',
    difficulty: 'easy',
    sampleAnswer: 'TTL is a setting on DNS records that dictates how long (in seconds) caching servers (resolvers, browsers) should store the record locally before discarding it and querying the authoritative nameserver again.',
    tips: 'Explain how small TTLs allow rapid IP updates but increase DNS query traffic.',
    companyTags: ['Microsoft', 'Goldman Sachs', 'Flipkart']
  },
  {
    trackId: 'cn',
    topic: 'DNS',
    title: 'Recursive vs Iterative Queries',
    questionText: 'Differentiate between Recursive and Iterative DNS queries.',
    difficulty: 'medium',
    sampleAnswer: 'In a Recursive query, the client demands the nameserver to return the final answer (doing all the delegation queries itself). In an Iterative query, the nameserver returns the best answer it has (referrals to TLD or other servers), and the client performs subsequent queries.',
    tips: 'Normally, the query from browser to ISP resolver is Recursive, while queries from ISP resolver to Root/TLD are Iterative.',
    companyTags: ['Google', 'Meta', 'Uber']
  },
  {
    trackId: 'cn',
    topic: 'DNS',
    title: 'Anycast DNS',
    questionText: 'How does Anycast routing benefit DNS systems?',
    difficulty: 'hard',
    sampleAnswer: 'Anycast maps a single IP address to multiple physical servers distributed globally. Routers automatically route DNS requests to the nearest server using BGP path costs. It reduces latency and protects against DDoS attacks by distributing the traffic load.',
    tips: 'Mention Cloudflare or Google DNS as examples of major Anycast networks.',
    companyTags: ['Google', 'Amazon', 'Meta']
  },

  // Routing
  {
    trackId: 'cn',
    topic: 'Routing',
    title: 'Unicast vs Broadcast vs Multicast vs Anycast',
    questionText: 'Explain Unicast, Broadcast, Multicast, and Anycast routing.',
    difficulty: 'easy',
    sampleAnswer: 'Unicast: One-to-One communication. Broadcast: One-to-All communication on a local network segment. Multicast: One-to-Many communication targeting a specific group of subscribers. Anycast: One-to-Nearest communication based on routing topology.',
    tips: 'Mention that IPv6 does not support Broadcast, replacing it with Multicast.',
    companyTags: ['Microsoft', 'Goldman Sachs', 'Adobe']
  },
  {
    trackId: 'cn',
    topic: 'Routing',
    title: 'IP Addressing and Subnetting',
    questionText: 'Explain Subnet Mask and CIDR notation.',
    difficulty: 'medium',
    sampleAnswer: 'A subnet mask separates an IP address into Network ID and Host ID. CIDR (Classless Inter-Domain Routing) uses a slash notation (e.g. /24) representing the number of leading 1-bits in the subnet mask. E.g. /24 represents 255.255.255.0, leaving 8 bits for 256 hosts.',
    tips: 'Mention that 2 host addresses are always reserved: Host ID 0 (Network address) and Host ID 255 (Broadcast address).',
    companyTags: ['Google', 'Amazon', 'Meta', 'Uber']
  },
  {
    trackId: 'cn',
    topic: 'Routing',
    title: 'Routing Protocols: OSPF vs BGP',
    questionText: 'Compare OSPF and BGP routing protocols.',
    difficulty: 'hard',
    sampleAnswer: 'OSPF (Open Shortest Path First) is an Interior Gateway Protocol (IGP) used for routing *within* an autonomous system (uses link-state routing and Dijkstra). BGP (Border Gateway Protocol) is an Exterior Gateway Protocol (EGP) used for routing *between* autonomous systems across the global internet (uses path-vector routing).',
    tips: 'Highlight that OSPF prioritizes speed/cost, whereas BGP prioritizes administrative policies.',
    companyTags: ['Google', 'Meta', 'Atlassian']
  },
  {
    trackId: 'cn',
    topic: 'Routing',
    title: 'Network Address Translation (NAT)',
    questionText: 'What is NAT and why is it essential?',
    difficulty: 'medium',
    sampleAnswer: 'NAT maps private IP addresses inside a local network to a single public IP address on the router, modifying headers of outgoing packets. It is essential because it conserves the exhausted IPv4 address pool and provides basic security by hiding internal IP structures.',
    tips: 'Mention PAT (Port Address Translation) as the common variant where multiple private IPs share one public IP using different ports.',
    companyTags: ['Amazon', 'Walmart', 'Atlassian']
  },
  {
    trackId: 'cn',
    topic: 'Routing',
    title: 'DHCP Protocol Flow',
    questionText: 'Explain the DORA process in DHCP.',
    difficulty: 'easy',
    sampleAnswer: '1. Discover: Client broadcasts discovery packet. 2. Offer: DHCP servers respond with unicast IP configurations. 3. Request: Client broadcasts a request for the selected offer. 4. Acknowledge: Server sends confirmation packet, leasing the IP.',
    tips: 'Explain why the client broadcasts (since it doesn\'t have an IP address yet).',
    companyTags: ['Goldman Sachs', 'Adobe', 'Microsoft']
  },

  // Congestion Control
  {
    trackId: 'cn',
    topic: 'Congestion Control',
    title: 'TCP Congestion Control States',
    questionText: 'Explain the states of TCP Congestion Control: Slow Start and Congestion Avoidance.',
    difficulty: 'medium',
    sampleAnswer: 'Slow Start: Starts with small Congestion Window (cwnd) size and doubles it every RTT (exponential growth) until it reaches ssthresh threshold. Congestion Avoidance: Once ssthresh is hit, cwnd grows linearly by 1 segment per RTT to slowly probe network limits.',
    tips: 'Draw or describe the classic jagged "sawtooth" graph of TCP congestion window sizes.',
    companyTags: ['Google', 'Amazon', 'Meta', 'Uber']
  },
  {
    trackId: 'cn',
    topic: 'Congestion Control',
    title: 'Fast Retransmit and Fast Recovery',
    questionText: 'What are Fast Retransmit and Fast Recovery in TCP?',
    difficulty: 'hard',
    sampleAnswer: 'Fast Retransmit: If the sender receives 3 duplicate ACKs for a packet, it immediately assumes the packet was lost and retransmits it without waiting for the timeout clock. Fast Recovery: Instead of resetting cwnd to 1, it drops cwnd to ssthresh/2 and continues linear growth, avoiding slow start.',
    tips: 'Mention that this is the primary difference between TCP Tahoe (no fast recovery) and TCP Reno (has fast recovery).',
    companyTags: ['Google', 'Meta', 'Uber', 'Atlassian']
  },
  {
    trackId: 'cn',
    topic: 'Congestion Control',
    title: 'cwnd vs rwnd',
    questionText: 'Explain the difference between Congestion Window (cwnd) and Receiver Window (rwnd).',
    difficulty: 'easy',
    sampleAnswer: 'rwnd (Receiver Window) is advertised by the receiver to prevent buffer overflow (Flow Control). cwnd (Congestion Window) is calculated dynamically by the sender based on packet loss/RTT to prevent network congestion. The sender limits outstanding packets to min(cwnd, rwnd).',
    tips: 'State that min(cwnd, rwnd) bounds the rate of transmission.',
    companyTags: ['Microsoft', 'Goldman Sachs', 'Adobe']
  },
  {
    trackId: 'cn',
    topic: 'Congestion Control',
    title: 'Leaky Bucket vs Token Bucket',
    questionText: 'Compare Leaky Bucket and Token Bucket traffic shaping algorithms.',
    difficulty: 'medium',
    sampleAnswer: 'Leaky Bucket shapes traffic to flow at a strictly constant rate (smooths out bursts, discards overflow). Token Bucket accumulates tokens over time; packets are sent immediately if tokens are available, allowing it to handle sudden bursts of traffic while guaranteeing an average rate.',
    tips: 'Token Bucket is highly favored in modern APIs for rate limiting because it accommodates legitimate bursty user behavior.',
    companyTags: ['Amazon', 'Google', 'Meta']
  },
  {
    trackId: 'cn',
    topic: 'Congestion Control',
    title: 'RTT and Bandwidth-Delay Product',
    questionText: 'What are RTT and Bandwidth-Delay Product (BDP)?',
    difficulty: 'hard',
    sampleAnswer: 'RTT (Round Trip Time) is the time it takes for a packet to travel to destination and back. BDP is the product of network bandwidth and RTT. It represents the maximum amount of data that can be "in flight" in the network pipe at any given time, defining optimal TCP window sizes.',
    tips: 'State that if the receiver buffer size is less than the BDP, the network connection cannot achieve its maximum possible throughput.',
    companyTags: ['Google', 'Meta', 'Uber']
  }
];

// 5. OOP QUESTIONS (25 Unique Questions)
const OOP_QUESTIONS = [
  // Inheritance
  {
    trackId: 'oop',
    topic: 'Inheritance',
    title: 'Interface vs Abstract Class',
    questionText: 'What is the difference between an Interface and an Abstract Class?',
    difficulty: 'easy',
    sampleAnswer: 'An Abstract Class can have state (instance variables) and concrete methods with implementations. A subclass can inherit from only one abstract class. An Interface defines a strict behavior contract (only abstract methods, constants) and supports multiple inheritance of interface definitions.',
    tips: 'Discuss how modern Java interfaces can contain default and static methods, narrowing the gap with abstract classes.',
    companyTags: ['Google', 'Amazon', 'Microsoft', 'Goldman Sachs']
  },
  {
    trackId: 'oop',
    topic: 'Inheritance',
    title: 'Composition vs Inheritance',
    questionText: 'Why is it often recommended to "Favor Composition over Inheritance"?',
    difficulty: 'medium',
    sampleAnswer: 'Inheritance creates a rigid compile-time relationship ("is-a") that breaks encapsulation because subclasses depend on parent implementation details. Composition ("has-a") references objects dynamically at runtime, creating a loosely coupled design that is easier to modify and test.',
    tips: 'Mention that inheritance represents white-box reuse, while composition represents black-box reuse.',
    companyTags: ['Microsoft', 'Atlassian', 'Adobe']
  },
  {
    trackId: 'oop',
    topic: 'Inheritance',
    title: 'Multiple Inheritance & Diamond Problem',
    questionText: 'What is the Diamond Problem in Multiple Inheritance, and how is it resolved?',
    difficulty: 'medium',
    sampleAnswer: 'The Diamond Problem occurs in multiple inheritance when Class D inherits from Classes B and C, which both inherit from Class A. If Class A has a method overridden by B and C, Class D cannot resolve which version to call. C++ resolves this using virtual inheritance; Java avoids it by not allowing multiple inheritance of classes.',
    tips: 'Explain how Java interfaces resolve conflicts using default method rules (compilation error if multiple identical defaults are inherited).',
    companyTags: ['Google', 'Meta', 'Uber']
  },
  {
    trackId: 'oop',
    topic: 'Inheritance',
    title: 'Method Overriding',
    questionText: 'Explain Method Overriding and the super keyword.',
    difficulty: 'easy',
    sampleAnswer: 'Method Overriding allows a subclass to provide a specific implementation of a method that is already defined in its superclass. The signatures must be identical. The super keyword is used in the subclass to invoke the parent class version of the method or constructor.',
    tips: 'Highlight that overriding supports dynamic polymorphism (runtime binding).',
    companyTags: ['Amazon', 'Google', 'Microsoft']
  },
  {
    trackId: 'oop',
    topic: 'Inheritance',
    title: 'Constructor Chain',
    questionText: 'What is constructor chaining during inheritance?',
    difficulty: 'easy',
    sampleAnswer: 'Constructor chaining is the sequence of constructor calls that occurs when instantiating a subclass. The subclass constructor automatically (or explicitly via super()) calls the superclass constructor first, propagating up to the Object base class to ensure parent states are initialized.',
    tips: 'State that if parent lacks a default/no-arg constructor, subclass must explicitly call a parent constructor in its first line.',
    companyTags: ['Microsoft', 'Goldman Sachs', 'Walmart']
  },

  // Polymorphism
  {
    trackId: 'oop',
    topic: 'Polymorphism',
    title: 'Compile-time vs Runtime Polymorphism',
    questionText: 'Compare Compile-time and Runtime Polymorphism.',
    difficulty: 'easy',
    sampleAnswer: 'Compile-time (Static) polymorphism is resolved during compilation. Example: Method Overloading (same method name, different parameters). Runtime (Dynamic) polymorphism is resolved during execution. Example: Method Overriding (overridden methods resolved based on actual object type at runtime).',
    tips: 'Explain that overloading is early-binding; overriding is late-binding.',
    companyTags: ['Google', 'Amazon', 'Microsoft', 'Atlassian']
  },
  {
    trackId: 'oop',
    topic: 'Polymorphism',
    title: 'VTABLE and VPTR',
    questionText: 'Explain the concepts of VTABLE and VPTR in C++ runtime polymorphism.',
    difficulty: 'hard',
    sampleAnswer: 'For any class containing virtual functions, the compiler creates a virtual table (VTABLE) storing pointers to those virtual methods. Every instance of that class contains a hidden pointer (VPTR) to the VTABLE. When a virtual function is called, the CPU dereferences the VPTR to search the VTABLE and invoke the correct method.',
    tips: 'Mention that this adds a slight performance overhead (double pointer dereference) for virtual function calls.',
    companyTags: ['Google', 'Meta', 'Uber', 'Atlassian']
  },
  {
    trackId: 'oop',
    topic: 'Polymorphism',
    title: 'Method Overloading Rules',
    questionText: 'What are the rules of Method Overloading? Can we overload by changing return types?',
    difficulty: 'easy',
    sampleAnswer: 'Method Overloading requires methods to have the same name but different signatures (different number, types, or order of parameters). You cannot overload a method by changing only the return type, because the compiler cannot determine which method to call if the return value is ignored.',
    tips: 'Mention that overloading is compile-time: compiler resolves calls based on static reference types.',
    companyTags: ['Walmart', 'Flipkart', 'Goldman Sachs']
  },
  {
    trackId: 'oop',
    topic: 'Polymorphism',
    title: 'Operator Overloading',
    questionText: 'What is Operator Overloading and why is it not supported in Java?',
    difficulty: 'medium',
    sampleAnswer: 'Operator Overloading allows standard operators (like +, *) to exhibit user-defined behaviors for custom objects (e.g. matrix addition). Java does not support it to maintain simplicity and avoid code obfuscation, though String concatenation using + is a built-in exception.',
    tips: 'Contrast this with languages like C++ or Python where operator overloading is standard practice.',
    companyTags: ['Amazon', 'Adobe', 'Atlassian']
  },
  {
    trackId: 'oop',
    topic: 'Polymorphism',
    title: 'Dynamic Binding',
    questionText: 'Explain Dynamic Binding and its relation to polymorphism.',
    difficulty: 'medium',
    sampleAnswer: 'Dynamic (Late) Binding means the compiler does not resolve the target method call at compile time. Instead, it generates instructions to examine the actual object type at runtime and call the corresponding method implementation, which enables polymorphism.',
    tips: 'Mention that static binding occurs for private, final, or static methods because they cannot be overridden.',
    companyTags: ['Google', 'Meta', 'Amazon', 'Uber']
  },

  // Encapsulation
  {
    trackId: 'oop',
    topic: 'Encapsulation',
    title: 'Data Hiding and Access Specifiers',
    questionText: 'Explain how access specifiers enforce Encapsulation.',
    difficulty: 'easy',
    sampleAnswer: 'Encapsulation groups code and data together. Access specifiers regulate access limits: private restricts access to within the class itself; protected allows access to subclasses and package members; public allows access from anywhere.',
    tips: 'State that private attributes with public getter/setter methods is the standard encapsulation pattern.',
    companyTags: ['Google', 'Amazon', 'Microsoft', 'Goldman Sachs']
  },
  {
    trackId: 'oop',
    topic: 'Encapsulation',
    title: 'Getters and Setters Value',
    questionText: 'Why should we use Getters and Setters instead of public variables?',
    difficulty: 'easy',
    sampleAnswer: 'Getters and Setters provide control and validation over how class fields are modified or retrieved (read-only views, range limits). They decouple the internal data representation from the public API, allowing you to modify internal implementations without breaking client code.',
    tips: 'Give a scenario where a setter checks for negative age values before updating the field.',
    companyTags: ['Atlassian', 'Adobe', 'Walmart']
  },
  {
    trackId: 'oop',
    topic: 'Encapsulation',
    title: 'Encapsulation vs Abstraction',
    questionText: 'Differentiate between Encapsulation and Abstraction.',
    difficulty: 'medium',
    sampleAnswer: 'Encapsulation is the mechanism of wrapping data and methods into a single unit and restricting direct access to enforce safety (data hiding). Abstraction is the process of hiding complex internal details and exposing only the essential interface to the user (e.g. driving a car without knowing engine mechanics).',
    tips: 'Summarize as: Encapsulation is about safety and control; Abstraction is about hiding complexity.',
    companyTags: ['Microsoft', 'Goldman Sachs', 'Flipkart']
  },
  {
    trackId: 'oop',
    topic: 'Encapsulation',
    title: 'Immutability in OOP Design',
    questionText: 'How do you design a Class to be Immutable?',
    difficulty: 'hard',
    sampleAnswer: '1. Mark class as final (prevents inheritance). 2. Make all fields private and final. 3. Do not provide setter methods. 4. Initialize all fields via constructor. 5. If fields are mutable objects, perform deep copies in constructor and getters to prevent reference leaks.',
    tips: 'Explain the deep copy rule carefully; returning direct references to mutable internal lists breaks immutability.',
    companyTags: ['Google', 'Meta', 'Uber']
  },
  {
    trackId: 'oop',
    topic: 'Encapsulation',
    title: 'Shallow Copy vs Deep Copy',
    questionText: 'Compare Shallow Copy and Deep Copy.',
    difficulty: 'medium',
    sampleAnswer: 'A Shallow Copy duplicates the object shell, copying primitive values and copying *references* to nested objects. Both original and copy point to the same nested objects. A Deep Copy recursively copies all objects, creating entirely new memory spaces so no references are shared.',
    tips: 'Explain that modifying nested objects in a shallow copy affects the original object, whereas in a deep copy it does not.',
    companyTags: ['Google', 'Meta', 'Amazon']
  },

  // Abstraction
  {
    trackId: 'oop',
    topic: 'Abstraction',
    title: 'Abstraction Concept',
    questionText: 'Explain Abstraction and its benefit in large-scale codebases.',
    difficulty: 'easy',
    sampleAnswer: 'Abstraction hides subsystem complexities behind simple interfaces. It decouples high-level business logic from low-level implementations (database access, file systems), allowing teams to work independently and modify implementations without affecting other modules.',
    tips: 'Mention that Abstraction is primarily achieved using abstract classes and interfaces.',
    companyTags: ['Microsoft', 'Goldman Sachs', 'Adobe']
  },
  {
    trackId: 'oop',
    topic: 'Abstraction',
    title: 'Pure Virtual Functions',
    questionText: 'What is a Pure Virtual Function / Abstract Method?',
    difficulty: 'easy',
    sampleAnswer: 'A pure virtual function (in C++) or abstract method (in Java) is a method declared in a base class that has no implementation. It forces subclasses to override and implement the method. Any class containing at least one abstract method becomes abstract and cannot be instantiated.',
    tips: 'Mention the C++ syntax: virtual void draw() = 0;.',
    companyTags: ['Google', 'Amazon', 'Meta', 'Uber']
  },
  {
    trackId: 'oop',
    topic: 'Abstraction',
    title: 'API Abstraction',
    questionText: 'How does Abstraction apply to API Design?',
    difficulty: 'medium',
    sampleAnswer: 'API abstraction hides database interactions, authentication protocols, and system routing behind a clean set of endpoints. The client interacts with simple JSON structures, while the server handles complex processes without exposing them.',
    tips: 'Mention that this prevents clients from depending on database schemas or server architectures.',
    companyTags: ['Google', 'Microsoft', 'Atlassian']
  },
  {
    trackId: 'oop',
    topic: 'Abstraction',
    title: 'Concrete vs Abstract Classes',
    questionText: 'Compare Concrete and Abstract Classes.',
    difficulty: 'easy',
    sampleAnswer: 'A Concrete class has all its methods fully implemented and can be instantiated directly. An Abstract class cannot be instantiated using the new keyword and may contain unimplemented abstract methods, serving as a template for subclasses.',
    tips: 'Clarify that abstract classes can have constructors which are invoked during constructor chaining.',
    companyTags: ['Meta', 'Amazon', 'Flipkart']
  },
  {
    trackId: 'oop',
    topic: 'Abstraction',
    title: 'Dependency Inversion via Abstraction',
    questionText: 'How does Abstraction enable Dependency Inversion?',
    difficulty: 'hard',
    sampleAnswer: 'Normally, high-level modules depend on low-level modules (e.g. BusinessLogic depends on SQLDatabase). By introducing an Abstraction layer (IDatabase interface), both high-level and low-level modules depend on the interface. The dependency direction is inverted, decoupling the modules.',
    tips: 'Mention that this is the letter "D" in SOLID principles.',
    companyTags: ['Google', 'Meta', 'Uber']
  },

  // SOLID
  {
    trackId: 'oop',
    topic: 'SOLID Principles',
    title: 'Single Responsibility Principle (SRP)',
    questionText: 'Explain the Single Responsibility Principle (SRP).',
    difficulty: 'easy',
    sampleAnswer: 'SRP states that a class should have one, and only one, reason to change. This means a class should focus on a single job. E.g., an Invoice class should calculate totals, but not handle saving to database or email formatting.',
    tips: 'Explain that SRP increases modularity and makes testing/maintenance much simpler.',
    companyTags: ['Goldman Sachs', 'Adobe', 'Microsoft']
  },
  {
    trackId: 'oop',
    topic: 'SOLID Principles',
    title: 'Open/Closed Principle (OCP)',
    questionText: 'Explain the Open/Closed Principle (OCP).',
    difficulty: 'medium',
    sampleAnswer: 'OCP states that software entities (classes, modules) should be open for extension but closed for modification. You should be able to add new features without changing existing code. This is typically achieved using abstract classes/interfaces and design patterns like Strategy.',
    tips: 'Give an example of a graphics drawing program: adding a new shape class shouldn\'t require modifying a massive switch statement in the drawer class.',
    companyTags: ['Google', 'Amazon', 'Meta', 'Uber']
  },
  {
    trackId: 'oop',
    topic: 'SOLID Principles',
    title: 'Liskov Substitution Principle (LSP)',
    questionText: 'Explain the Liskov Substitution Principle (LSP).',
    difficulty: 'medium',
    sampleAnswer: 'LSP states that objects of a superclass should be replaceable with objects of its subclasses without affecting the correctness of the program. A classic violation is the Square-Rectangle problem: a Square subclass overriding setWidth/setHeight to set both fields breaks Rectangle assumptions.',
    tips: 'Explain that LSP is about behavioral subtyping, ensuring subclasses respect parent contract behaviors.',
    companyTags: ['Google', 'Microsoft', 'Atlassian']
  },
  {
    trackId: 'oop',
    topic: 'SOLID Principles',
    title: 'Interface Segregation Principle (ISP)',
    questionText: 'Explain the Interface Segregation Principle (ISP).',
    difficulty: 'easy',
    sampleAnswer: 'ISP states that clients should not be forced to depend on interfaces they do not use. Instead of one large "fat" interface containing dozens of methods, split it into smaller, specific interfaces focused on unique behaviors (e.g. Printable, Scannable).',
    tips: 'Discuss how violating ISP forces subclasses to write dummy/empty methods (like throw new UnsupportedOperationException()).',
    companyTags: ['Amazon', 'Walmart', 'Flipkart']
  },
  {
    trackId: 'oop',
    topic: 'SOLID Principles',
    title: 'Dependency Inversion Principle (DIP)',
    questionText: 'Explain the Dependency Inversion Principle (DIP).',
    difficulty: 'medium',
    sampleAnswer: 'DIP states that high-level modules should not depend on low-level modules; both should depend on abstractions. Also, abstractions should not depend on details; details should depend on abstractions. It decouples components by programming to interfaces rather than concrete classes.',
    tips: 'Link DIP with Dependency Injection frameworks (like Spring or Dagger) which supply implementations at runtime.',
    companyTags: ['Google', 'Meta', 'Uber']
  }
];

// Combine all questions
const ALL_SEED_QUESTIONS = [
  ...DSA_QUESTIONS,
  ...OS_QUESTIONS,
  ...DBMS_QUESTIONS,
  ...CN_QUESTIONS,
  ...OOP_QUESTIONS
];

async function seed() {
  await mongoose.connect(process.env.DB_CONNECT_STRING);
  console.log('Connected to Database');

  // A. Clear tracks and questions
  await InterviewTrack.deleteMany({});
  await InterviewQuestion.deleteMany({});
  console.log('Cleared existing tracks and questions');

  // B. Seed tracks
  const TRACK_METADATA = [
    { trackName: 'dsa', title: '🧠 DSA Track', description: 'Master essential Data Structures & Algorithms concepts, patterns, and complexity analysis.', totalQuestions: DSA_QUESTIONS.length, difficulty: 'Hard' },
    { trackName: 'os', title: '🖥 OS Track', description: 'Understand process lifecycle, multithreading, CPU scheduling, deadlocks, and virtual memory.', totalQuestions: OS_QUESTIONS.length, difficulty: 'Medium' },
    { trackName: 'dbms', title: '🗄 DBMS Track', description: 'Dive deep into database schemas, normalization, SQL joins, indexing, and ACID transactions.', totalQuestions: DBMS_QUESTIONS.length, difficulty: 'Medium' },
    { trackName: 'cn', title: '🌐 Computer Networks', description: 'Explore OSI layers, TCP/IP handshake, DNS routing, HTTP protocols, and congestion control.', totalQuestions: CN_QUESTIONS.length, difficulty: 'Medium' },
    { trackName: 'oop', title: '⚙ OOP Track', description: 'Master Object Oriented programming pillars, interface designs, design patterns, and SOLID principles.', totalQuestions: OOP_QUESTIONS.length, difficulty: 'Easy' }
  ];

  await InterviewTrack.insertMany(TRACK_METADATA);
  console.log('Seeded 5 tracks with corrected counts');

  // C. Insert all real questions into database
  await InterviewQuestion.insertMany(ALL_SEED_QUESTIONS);

  // Print exact counts
  const dsaCount = await InterviewQuestion.countDocuments({ trackId: 'dsa' });
  const osCount = await InterviewQuestion.countDocuments({ trackId: 'os' });
  const dbmsCount = await InterviewQuestion.countDocuments({ trackId: 'dbms' });
  const cnCount = await InterviewQuestion.countDocuments({ trackId: 'cn' });
  const oopCount = await InterviewQuestion.countDocuments({ trackId: 'oop' });

  console.log(`✅ Seeded ${ALL_SEED_QUESTIONS.length} unique interview questions:`);
  console.log(`   DSA:        ${dsaCount}`);
  console.log(`   OS:         ${osCount}`);
  console.log(`   DBMS:       ${dbmsCount}`);
  console.log(`   Networks:   ${cnCount}`);
  console.log(`   OOP:        ${oopCount}`);

  mongoose.connection.close();
}

seed().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
