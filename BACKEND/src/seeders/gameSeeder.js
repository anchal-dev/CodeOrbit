/**
 * Game Zone Question Seeder
 * Run: node src/seeders/gameSeeder.js
 * Seeds 85 questions across all game modes.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const GameQuestion = require('../models/GameQuestion');

const QUIZ_QUESTIONS = [
  // Arrays
  { topic:'Arrays', difficulty:'easy', question:'What is the time complexity of accessing an element in an array by index?', options:['O(N)','O(log N)','O(1)','O(N²)'], answer:'O(1)', explanation:'Arrays allow direct index access in constant time.' },
  { topic:'Arrays', difficulty:'easy', question:'Which operation on a dynamic array (e.g., vector) has amortized O(1) time?', options:['Insert at front','Delete at middle','Push back','Search'], answer:'Push back', explanation:'Amortized analysis of dynamic array resize makes push_back O(1).' },
  { topic:'Arrays', difficulty:'medium', question:'What algorithm finds the maximum subarray sum in O(N) time?', options:["Kadane's Algorithm","Merge Sort","Floyd-Warshall","Binary Search"], answer:"Kadane's Algorithm", explanation:'Kadane iterates once, tracking the current and global max.' },
  { topic:'Arrays', difficulty:'medium', question:'Two Sum problem: best approach to solve in O(N)?', options:['Brute force O(N²)','Sorting O(N log N)','HashMap O(N)','Binary search O(N log N)'], answer:'HashMap O(N)', explanation:'Use a hashmap to store complements while iterating.' },
  { topic:'Arrays', difficulty:'hard', question:'What is the time complexity of the Dutch National Flag algorithm?', options:['O(N log N)','O(N)','O(N²)','O(1)'], answer:'O(N)', explanation:'Single pass with three pointers: O(N) time, O(1) space.' },
  { topic:'Strings', difficulty:'easy', question:'Which algorithm finds the longest common prefix of an array of strings?', options:['KMP','Trie-based vertical scan','Boyer-Moore','Rabin-Karp'], answer:'Trie-based vertical scan', explanation:'Vertical scan or trie can efficiently find common prefix.' },
  { topic:'Strings', difficulty:'medium', question:'KMP algorithm pre-processes the pattern into a failure function. Its time complexity is?', options:['O(N²)','O(N+M)','O(N log N)','O(M²)'], answer:'O(N+M)', explanation:'KMP runs in O(N+M) where N=text length, M=pattern length.' },
  { topic:'Strings', difficulty:'medium', question:'Which data structure allows O(L) search, insert, and delete for strings of length L?', options:['Hash Table','Binary Search Tree','Trie','Heap'], answer:'Trie', explanation:'Trie stores strings character by character, each op is O(L).' },
  // Trees
  { topic:'Trees', difficulty:'easy', question:'What is the height of a complete binary tree with N nodes?', options:['O(N)','O(log N)','O(N log N)','O(√N)'], answer:'O(log N)', explanation:'A complete binary tree has height ⌊log₂N⌋.' },
  { topic:'Trees', difficulty:'medium', question:'Which traversal visits nodes in ascending order for a BST?', options:['Pre-order','Post-order','In-order','Level-order'], answer:'In-order', explanation:'In-order (left, root, right) on a BST yields sorted output.' },
  { topic:'Trees', difficulty:'medium', question:'The Lowest Common Ancestor (LCA) of a BST can be found in O(h). What does h represent?', options:['Number of nodes','Height of tree','Number of leaves','Depth of target node'], answer:'Height of tree', explanation:'We traverse from root to LCA comparing values, O(h) steps.' },
  { topic:'Trees', difficulty:'hard', question:'AVL tree rotation complexity for insertion?', options:['O(log N)','O(N)','O(1)','O(N log N)'], answer:'O(log N)', explanation:'Finding insertion point + rebalancing = O(log N).' },
  // Graphs
  { topic:'Graphs', difficulty:'easy', question:'BFS uses which data structure internally?', options:['Stack','Priority Queue','Queue','Deque'], answer:'Queue', explanation:'BFS explores level by level using a FIFO queue.' },
  { topic:'Graphs', difficulty:'medium', question:'Dijkstra\'s algorithm works correctly only when?', options:['All weights are negative','No cycles exist','All edge weights are non-negative','Graph is undirected'], answer:'All edge weights are non-negative', explanation:'Negative weights violate the greedy assumption of Dijkstra.' },
  { topic:'Graphs', difficulty:'medium', question:'Which algorithm detects a negative cycle in a graph?', options:["Dijkstra's","Prim's","Bellman-Ford","Kruskal's"], answer:'Bellman-Ford', explanation:'Bellman-Ford relaxes edges V-1 times; a V-th relaxation means a negative cycle.' },
  { topic:'Graphs', difficulty:'hard', question:'Topological sort is only applicable to?', options:['Undirected graphs','Weighted graphs','Directed Acyclic Graphs (DAG)','Dense graphs'], answer:'Directed Acyclic Graphs (DAG)', explanation:'Topological ordering only exists when there are no cycles.' },
  // DP
  { topic:'DP', difficulty:'easy', question:'The Fibonacci sequence solved with memoization has what time complexity?', options:['O(2^N)','O(N)','O(N log N)','O(N²)'], answer:'O(N)', explanation:'Each subproblem is computed once and cached.' },
  { topic:'DP', difficulty:'medium', question:'0/1 Knapsack DP solution has what time and space complexity?', options:['O(N×W) time and O(N×W) space','O(N) time and O(1) space','O(N log N) time and O(N) space','O(N²) time and O(N²) space'], answer:'O(N×W) time and O(N×W) space', explanation:'DP table has N items × W capacity cells.' },
  { topic:'DP', difficulty:'medium', question:'Longest Common Subsequence (LCS) of two strings of length M and N?', options:['O(M+N)','O(M×N)','O(M log N)','O(2^M)'], answer:'O(M×N)', explanation:'Fill an M×N DP table.' },
  { topic:'DP', difficulty:'hard', question:'Matrix Chain Multiplication DP runs in?', options:['O(N²)','O(N³)','O(N log N)','O(2^N)'], answer:'O(N³)', explanation:'Three nested loops over intervals, splits, and combinations.' },
  // OS
  { topic:'OS', difficulty:'easy', question:'Which CPU scheduling algorithm can cause starvation?', options:['Round Robin','Priority Scheduling','FCFS','SRTF'], answer:'Priority Scheduling', explanation:'Low-priority processes can wait indefinitely if high-priority jobs keep arriving.' },
  { topic:'OS', difficulty:'medium', question:'What is the main purpose of virtual memory?', options:['Speed up RAM','Allow programs larger than physical RAM','Reduce CPU usage','Encrypt data'], answer:'Allow programs larger than physical RAM', explanation:'Virtual memory uses disk as extension of RAM via paging.' },
  { topic:'OS', difficulty:'medium', question:'Deadlock requires which four conditions simultaneously?', options:['Mutual Exclusion + Hold & Wait + No Preemption + Circular Wait','Starvation + Aging + Preemption + Circular Wait','Semaphore + Mutex + Spinlock + Monitor','Paging + Segmentation + Swapping + Caching'], answer:'Mutual Exclusion + Hold & Wait + No Preemption + Circular Wait', explanation:'All four Coffman conditions must hold for deadlock.' },
  // DBMS
  { topic:'DBMS', difficulty:'easy', question:'Which SQL clause filters results after grouping?', options:['WHERE','HAVING','GROUP BY','ORDER BY'], answer:'HAVING', explanation:'HAVING filters grouped rows; WHERE filters individual rows.' },
  { topic:'DBMS', difficulty:'medium', question:'What is the time complexity of a B-Tree search with N elements and order M?', options:['O(log N)','O(N)','O(M log N)','O(log_M N)'], answer:'O(log_M N)', explanation:'B-Tree height is log_M(N), and each node search is O(M).' },
  { topic:'DBMS', difficulty:'medium', question:'ACID in databases stands for?', options:['Atomicity, Consistency, Isolation, Durability','Atomicity, Concurrency, Integrity, Distribution','Access, Control, Integrity, Durability','Atomicity, Consistency, Integrity, Distribution'], answer:'Atomicity, Consistency, Isolation, Durability', explanation:'ACID properties ensure reliable database transactions.' },
  // CN
  { topic:'CN', difficulty:'easy', question:'Which layer of OSI model is responsible for routing?', options:['Data Link Layer','Transport Layer','Network Layer','Session Layer'], answer:'Network Layer', explanation:'Layer 3 (Network) handles logical addressing and routing.' },
  { topic:'CN', difficulty:'medium', question:'TCP vs UDP: which provides reliable, ordered delivery?', options:['UDP','TCP','Both','Neither'], answer:'TCP', explanation:'TCP has handshaking, sequencing, and acknowledgements.' },
  { topic:'OOP', difficulty:'easy', question:'Which OOP principle restricts direct access to object data?', options:['Inheritance','Polymorphism','Encapsulation','Abstraction'], answer:'Encapsulation', explanation:'Encapsulation bundles data and hides it via access modifiers.' },
  { topic:'OOP', difficulty:'medium', question:'Method overriding is an example of which OOP concept?', options:['Encapsulation','Compile-time polymorphism','Runtime polymorphism','Abstraction'], answer:'Runtime polymorphism', explanation:'Overriding resolves method calls at runtime via vtable.' },
];

const COMPLEXITY_QUESTIONS = [
  { question:'for(int i=0; i<n; i++) for(int j=0; j<n; j++) { /* O(1) work */ }', options:['O(N)','O(N log N)','O(N²)','O(N³)'], answer:'O(N²)', explanation:'Two nested loops each running N times = O(N²).', codeSnippet:'for(int i=0;i<n;i++) for(int j=0;j<n;j++) work();' },
  { question:'for(int i=1; i<n; i*=2) { /* O(1) work */ }', options:['O(N)','O(log N)','O(N²)','O(√N)'], answer:'O(log N)', explanation:'i doubles each iteration → log₂N iterations.', codeSnippet:'for(int i=1;i<n;i*=2) work();' },
  { question:'Binary search on sorted array of N elements:', options:['O(N)','O(log N)','O(N log N)','O(1)'], answer:'O(log N)', explanation:'Each step halves the search space.' },
  { question:'Merge sort on N elements:', options:['O(N²)','O(N)','O(N log N)','O(log N)'], answer:'O(N log N)', explanation:'Divide into halves (log N levels) and merge (N each level).' },
  { question:'Quick sort average case:', options:['O(N²)','O(N log N)','O(N)','O(log N)'], answer:'O(N log N)', explanation:'Average partition is balanced, giving O(N log N) average.' },
  { question:'Finding an element in a Hash Map (average):', options:['O(N)','O(log N)','O(N²)','O(1)'], answer:'O(1)', explanation:'Hash maps provide average constant-time lookup.' },
  { question:'for(i=0;i<n;i++) for(j=i;j<n;j++) { /* O(1) */ }', options:['O(N)','O(N log N)','O(N²)','O(N/2)'], answer:'O(N²)', explanation:'Though j starts at i, total iterations = N(N+1)/2 ≈ O(N²).' },
  { question:'Recursive Fibonacci without memoization: T(n) = T(n-1) + T(n-2)', options:['O(N)','O(N log N)','O(2^N)','O(N²)'], answer:'O(2^N)', explanation:'Exponential calls due to repeated subproblem computation.' },
  { question:'Heap insert / extract-min operation:', options:['O(1)','O(N)','O(log N)','O(N log N)'], answer:'O(log N)', explanation:'Heapify up/down takes at most height = log N steps.' },
  { question:'DFS / BFS on a graph with V vertices and E edges:', options:['O(V)','O(E)','O(V + E)','O(V × E)'], answer:'O(V + E)', explanation:'Each vertex and edge is visited once.' },
  { question:'Bubble sort worst case:', options:['O(N)','O(N log N)','O(N²)','O(log N)'], answer:'O(N²)', explanation:'N passes, each comparing up to N elements.' },
  { question:'int sum=0; for(i=0;i<n;i++) sum+=i; — Time complexity:', options:['O(N²)','O(N)','O(1)','O(log N)'], answer:'O(N)', explanation:'Single loop running N times.' },
  { question:'Bellman-Ford algorithm with V vertices and E edges:', options:['O(V×E)','O(V²)','O(E log V)','O(V log E)'], answer:'O(V×E)', explanation:'Relax all E edges V-1 times = O(V×E).' },
  { question:'Building a heap from N elements using heapify:', options:['O(N log N)','O(N)','O(N²)','O(log N)'], answer:'O(N)', explanation:'Bottom-up heapify is O(N) by amortized analysis.' },
  { question:'Inserting N elements into a BST (balanced):', options:['O(N)','O(N²)','O(N log N)','O(log N)'], answer:'O(N log N)', explanation:'Each insertion costs O(log N), done N times.' },
  { question:'Selection sort:', options:['O(N log N)','O(N)','O(N²)','O(1)'], answer:'O(N²)', explanation:'Finds minimum in remaining N, N-1, ... 1 elements.' },
  { question:'Counting sort for N numbers in range [0, K]:', options:['O(N log N)','O(N + K)','O(N²)','O(K)'], answer:'O(N + K)', explanation:'Count array of size K+1 + one pass through N elements.' },
  { question:'Prim\'s / Kruskal\'s MST with priority queue:', options:['O(V²)','O(E log V)','O(V×E)','O(V log E)'], answer:'O(E log V)', explanation:'Each edge insert/extract from priority queue = O(log V).' },
  { question:'while(n > 0) { n = n/2; } — number of iterations:', options:['O(N)','O(√N)','O(log N)','O(1)'], answer:'O(log N)', explanation:'n halves each iteration, takes log₂N steps.' },
  { question:'Insertion sort best case (already sorted input):', options:['O(N²)','O(N log N)','O(N)','O(1)'], answer:'O(N)', explanation:'No swaps needed; inner loop exits immediately each time.' },
];

const OUTPUT_QUESTIONS = [
  {
    question:'What is the output of this Python code?',
    codeSnippet:`x = [1, 2, 3]
y = x
y.append(4)
print(len(x))`,
    options:['3','4','Error','[1,2,3,4]'],
    answer:'4',
    explanation:'y = x makes y point to the same list; appending to y changes x too.'
  },
  {
    question:'What does this C++ code print?',
    codeSnippet:`int a = 5, b = 10;
a = a + b;
b = a - b;
a = a - b;
cout << a << " " << b;`,
    options:['5 10','10 5','15 5','5 15'],
    answer:'10 5',
    explanation:'XOR swap without XOR: swaps a and b values.'
  },
  {
    question:'What does this code print?',
    codeSnippet:`def f(n):
    if n <= 1: return n
    return f(n-1) + f(n-2)
print(f(6))`,
    options:['6','8','13','5'],
    answer:'8',
    explanation:'f(6) = Fibonacci(6) = 8 (0,1,1,2,3,5,8).'
  },
  {
    question:'What is the output?',
    codeSnippet:`int x = 10;
printf("%d", x++);
printf("%d", ++x);`,
    options:['10 12','11 12','10 11','11 11'],
    answer:'10 12',
    explanation:'x++ prints 10 (post-increment), then x becomes 12 after ++x (pre-increment).'
  },
  {
    question:'What does this Python code output?',
    codeSnippet:`print(type(1/2))
print(type(1//2))`,
    options:["<class 'float'> <class 'int'>","<class 'int'> <class 'int'>","<class 'float'> <class 'float'>","Error"],
    answer:"<class 'float'> <class 'int'>",
    explanation:'/ always returns float in Python 3; // is floor division returning int.'
  },
  {
    question:'What is printed?',
    codeSnippet:`for i in range(3):
    for j in range(3):
        if i == j:
            print(i, end=' ')`,
    options:['0 1 2','0 0 1 1 2 2','1 2 3','0 1'],
    answer:'0 1 2',
    explanation:'Only diagonal elements (i==j) are printed: 0,1,2.'
  },
  {
    question:'Output of this JavaScript code?',
    codeSnippet:`console.log(0.1 + 0.2 === 0.3);`,
    options:['true','false','undefined','NaN'],
    answer:'false',
    explanation:'Floating-point precision: 0.1+0.2 = 0.30000000000000004, not exactly 0.3.'
  },
  {
    question:'What does this code return?',
    codeSnippet:`def mystery(lst):
    return lst[::-1]
print(mystery([1,2,3,4,5]))`,
    options:['[5,4,3,2,1]','[1,2,3,4,5]','Error','None'],
    answer:'[5,4,3,2,1]',
    explanation:'[::-1] reverses the list.'
  },
  {
    question:'What is the output?',
    codeSnippet:`int arr[] = {1, 2, 3, 4, 5};
int *p = arr;
p++;
cout << *p;`,
    options:['1','2','3','Address'],
    answer:'2',
    explanation:'p++ advances pointer to next element; *p dereferences arr[1] = 2.'
  },
  {
    question:'What does this print?',
    codeSnippet:`s = "hello"
s = s[::-1]
print(s[0])`,
    options:['h','o','e','l'],
    answer:'o',
    explanation:'Reversed "hello" is "olleh"; first char is "o".'
  },
  {
    question:'Output?',
    codeSnippet:`x = [i*i for i in range(5)]
print(sum(x))`,
    options:['10','30','25','15'],
    answer:'30',
    explanation:'0²+1²+2²+3²+4² = 0+1+4+9+16 = 30.'
  },
  {
    question:'What is printed?',
    codeSnippet:`a = True
b = False
print(a and not b, a or b, not a)`,
    options:['True True False','True False False','False True True','True True True'],
    answer:'True True False',
    explanation:'True and not False = True; True or False = True; not True = False.'
  },
  {
    question:'Output of this code?',
    codeSnippet:`stack = []
for i in [1,2,3]:
    stack.append(i)
while stack:
    print(stack.pop(), end=' ')`,
    options:['1 2 3','3 2 1','1 3 2','Error'],
    answer:'3 2 1',
    explanation:'Stack is LIFO: last pushed (3) is first popped.'
  },
  {
    question:'What is the output?',
    codeSnippet:`cout << (5 & 3);
cout << " " << (5 | 3);
cout << " " << (5 ^ 3);`,
    options:['1 7 6','5 3 1','7 1 6','1 5 7'],
    answer:'1 7 6',
    explanation:'5=101, 3=011: AND=001=1, OR=111=7, XOR=110=6.'
  },
  {
    question:'What does this recursive call print?',
    codeSnippet:`def count(n):
    if n == 0: return
    count(n-1)
    print(n, end=' ')
count(4)`,
    options:['4 3 2 1','1 2 3 4','0 1 2 3 4','4 3 2 1 0'],
    answer:'1 2 3 4',
    explanation:'Print happens after recursive call, so 1 is printed first when stack unwinds.'
  },
  {
    question:'What is the result?',
    codeSnippet:`d = {'a':1, 'b':2}
d['c'] = d.get('c', 0) + 5
print(d['c'])`,
    options:['5','0','Error','None'],
    answer:'5',
    explanation:'d.get("c",0) returns 0 (key absent); 0+5=5 stored.'
  },
  {
    question:'What is the output?',
    codeSnippet:`n = 16
count = 0
while n > 1:
    n //= 2
    count += 1
print(count)`,
    options:['3','4','5','16'],
    answer:'4',
    explanation:'16→8→4→2→1: 4 divisions = log₂16.'
  },
  {
    question:'Output of this code?',
    codeSnippet:`s = set([1,1,2,3,3,4])
print(len(s))`,
    options:['6','4','3','5'],
    answer:'4',
    explanation:'Sets remove duplicates: {1,2,3,4} has 4 elements.'
  },
  {
    question:'What is printed?',
    codeSnippet:`int x = 7;
cout << (x >> 1);`,
    options:['7','3','14','1'],
    answer:'3',
    explanation:'Right shift by 1 = integer division by 2: 7>>1 = 3.'
  },
  {
    question:'What does this return?',
    codeSnippet:`def check(s):
    return s == s[::-1]
print(check("racecar"), check("hello"))`,
    options:['True False','False True','True True','False False'],
    answer:'True False',
    explanation:'"racecar" reversed is "racecar" (palindrome); "hello" reversed is "olleh".'
  },
];

const BUG_QUESTIONS = [
  {
    question:'Find the bug: Binary search returns wrong results',
    codeSnippet:`int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n;  // Bug: should be n-1
    while (left < right) {
        int mid = left + right / 2;  // Bug: should be left + (right-left)/2
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid;
    }
    return -1;
}`,
    options:['right = n should be right = n-1','mid calculation has operator precedence error','Both bugs exist','No bug'],
    answer:'Both bugs exist',
    explanation:'right should be n-1 (0-indexed last). mid = left + right/2 due to precedence gives wrong result; correct is left + (right-left)/2.'
  },
  {
    question:'Find the bug in this linked list code',
    codeSnippet:`void deleteNode(Node* head, int val) {
    Node* curr = head;
    while (curr != NULL) {
        if (curr->data == val) {
            curr = curr->next;  // Bug: doesn't update prev->next
        }
        curr = curr->next;
    }
}`,
    options:["Doesn't update previous node's next pointer","curr not initialized properly","Missing NULL check","Loop condition wrong"],
    answer:"Doesn't update previous node's next pointer",
    explanation:"To delete a node, the previous node's next pointer must point to curr->next. This code just moves curr without unlinking."
  },
  {
    question:'Find the bug in this factorial function',
    codeSnippet:`int factorial(int n) {
    if (n == 0) return 0;  // Bug: should return 1
    return n * factorial(n - 1);
}`,
    options:['Base case returns 0 instead of 1','n should start from 1','Missing negative check','No recursion needed'],
    answer:'Base case returns 0 instead of 1',
    explanation:'factorial(0) = 1 (empty product). Returning 0 makes all factorials compute to 0.'
  },
  {
    question:'Spot the bug in this stack implementation',
    codeSnippet:`class Stack:
    def __init__(self):
        self.data = []
    
    def push(self, x):
        self.data.append(x)
    
    def pop(self):
        return self.data.pop(0)  # Bug: should be pop() or pop(-1)`,
    options:['pop(0) removes from front (queue behavior) not top of stack','append is wrong','data should be a dict','No bug'],
    answer:'pop(0) removes from front (queue behavior) not top of stack',
    explanation:'Stack is LIFO; pop() or pop(-1) removes from the end. pop(0) removes from the front, making it a queue.'
  },
  {
    question:'Find the bug in this palindrome checker',
    codeSnippet:`bool isPalindrome(string s) {
    int left = 0, right = s.length();  // Bug
    while (left < right) {
        if (s[left] != s[right]) return false;  // Bug: out of bounds
        left++;
        right--;
    }
    return true;
}`,
    options:['right should be s.length()-1','String comparison is wrong','Loop should use <=','No bug'],
    answer:'right should be s.length()-1',
    explanation:'s.length() is one past the last index. s[s.length()] is undefined behavior. right should start at s.length()-1.'
  },
  {
    question:'What bug causes infinite loop here?',
    codeSnippet:`int i = 0;
while (i != 10) {
    i += 3;  // Bug: i will skip over 10 (0,3,6,9,12...)
}`,
    options:['i skips over 10 so condition is never true','i starts at 0 not 1','Should use for loop','No bug'],
    answer:'i skips over 10 so condition is never true',
    explanation:'i goes 0,3,6,9,12... and never equals 10, causing infinite loop. Use i < 10 or i += 2.'
  },
  {
    question:'Find the off-by-one error',
    codeSnippet:`int sumArray(int arr[], int n) {
    int sum = 0;
    for (int i = 0; i <= n; i++) {  // Bug: should be i < n
        sum += arr[i];
    }
    return sum;
}`,
    options:['i <= n accesses arr[n] which is out of bounds','sum not initialized','Wrong return type','No bug'],
    answer:'i <= n accesses arr[n] which is out of bounds',
    explanation:'Array indices go from 0 to n-1. i <= n accesses arr[n] which is undefined behavior.'
  },
  {
    question:'Find the bug in this string reversal',
    codeSnippet:`void reverseString(char s[], int n) {
    for (int i = 0; i < n; i++) {  // Bug: should be n/2
        char temp = s[i];
        s[i] = s[n-1-i];
        s[n-1-i] = temp;
    }
}`,
    options:['Loop goes n instead of n/2, un-reversing the already reversed string','temp should be string','Missing null check','No bug'],
    answer:'Loop goes n instead of n/2, un-reversing the already reversed string',
    explanation:'Swapping all n elements reverses and then un-reverses the string. Loop should run only n/2 times.'
  },
  {
    question:'Spot the Python bug',
    codeSnippet:`def remove_duplicates(lst):
    for item in lst:
        if lst.count(item) > 1:
            lst.remove(item)  # Bug: mutating list while iterating
    return lst`,
    options:['Modifying list while iterating causes skipped elements','count() is wrong','remove() not available','No bug'],
    answer:'Modifying list while iterating causes skipped elements',
    explanation:'Removing elements from a list while iterating over it causes the iterator to skip elements. Use a copy or list comprehension instead.'
  },
  {
    question:'Find the bug in the two-pointer approach',
    codeSnippet:`int maxArea(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int maxW = 0;
    while (left < right) {
        int area = min(height[left], height[right]);  // Bug: missing * (right - left)
        maxW = max(maxW, area);
        if (height[left] < height[right]) left++;
        else right--;
    }
    return maxW;
}`,
    options:['Area formula missing multiplication by width (right - left)','min/max logic reversed','Pointers initialized wrong','No bug'],
    answer:'Area formula missing multiplication by width (right - left)',
    explanation:'Container area = min(height[l], height[r]) * (right - left). The width factor is missing.'
  },
  {
    question:'Find the bug in BFS code',
    codeSnippet:`void bfs(int start, vector<vector<int>>& adj) {
    queue<int> q;
    q.push(start);
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        for (int neighbor : adj[node]) {
            q.push(neighbor);  // Bug: no visited check → infinite loop on cycles
        }
    }
}`,
    options:['No visited array causes infinite loop on cycles','adj accessed wrong','queue should be stack','No bug'],
    answer:'No visited array causes infinite loop on cycles',
    explanation:'Without marking nodes as visited, BFS will keep revisiting nodes in a cyclic graph, causing infinite loop.'
  },
  {
    question:'Spot the bug in this merge sort',
    codeSnippet:`void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;     // Bug: should be r - m
    // ... copies to temp arrays L, R
    int i=0, j=0, k=l;
    while(i<n1 && j<n2) {
        if(L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    // Bug: missing copy of remaining elements
}`,
    options:["Missing copy of remaining elements from L[] or R[] after main while loop","n2 calculation wrong","Indices off by one","No bug"],
    answer:"Missing copy of remaining elements from L[] or R[] after main while loop",
    explanation:'After the main while loop, one sub-array may still have elements. They must be copied to arr[].'
  },
  {
    question:'Find the Python recursion bug',
    codeSnippet:`def power(base, exp):
    if exp == 0: return 1
    return base * power(base, exp)  # Bug: exp not decremented`,
    options:['exp not decremented → infinite recursion','Base case wrong','base should be int','No bug'],
    answer:'exp not decremented → infinite recursion',
    explanation:'power(base, exp) calls itself with the same exp forever. Should be power(base, exp-1).'
  },
  {
    question:'Find the bug in this hash map usage',
    codeSnippet:`int firstNonRepeating(string s) {
    map<char, int> freq;
    for (char c : s) freq[c]++;
    for (int i = 0; i < s.length(); i++) {
        if (freq[s[i]] == 0) return i;  // Bug: should check == 1
    }
    return -1;
}`,
    options:['Condition checks freq == 0 instead of freq == 1','Map should be unordered_map','Loop should go backward','No bug'],
    answer:'Condition checks freq == 0 instead of freq == 1',
    explanation:'A non-repeating character appears exactly once (freq == 1). freq == 0 would mean the character never appeared in the string.'
  },
  {
    question:'Find the bug in this DP solution',
    codeSnippet:`int climbStairs(int n) {
    vector<int> dp(n);  // Bug: should be n+1
    dp[0] = 1;
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];  // Bug: out of bounds when n is size
    }
    return dp[n];
}`,
    options:['dp vector size should be n+1 to hold dp[n]','dp[0] should be 0','Loop should start at 1','No bug'],
    answer:'dp vector size should be n+1 to hold dp[n]',
    explanation:'dp has size n, so valid indices are 0..n-1. Accessing dp[n] is out of bounds. Use vector<int> dp(n+1).'
  },
];

const PATTERN_QUESTIONS = [
  { question:'Given a sorted array and a target sum, find two elements that sum to target. Best approach?', options:['Two Pointers','Binary Search','Sliding Window','Hash Map'], answer:'Two Pointers', explanation:'With sorted array, use left and right pointers moving inward.' },
  { question:'Find the maximum sum subarray of length K in an array of N elements.', options:['Sliding Window','Two Pointers','Binary Search','DP'], answer:'Sliding Window', explanation:'Fixed window of size K slides across array, O(N).' },
  { question:'Find if a number N is present in a sorted rotated array.', options:['Linear Search','Hash Map','Modified Binary Search','DFS'], answer:'Modified Binary Search', explanation:'Binary search can be adapted to handle rotated sorted arrays.' },
  { question:'Count number of islands in a 2D grid of 0s and 1s.', options:['Binary Search','Two Pointers','BFS/DFS','DP'], answer:'BFS/DFS', explanation:'Traverse connected 1-cells using BFS or DFS.' },
  { question:'Find the shortest path from source to destination in an unweighted graph.', options:['DFS','BFS','Dijkstra','Bellman-Ford'], answer:'BFS', explanation:'BFS visits level by level, guaranteeing shortest path in unweighted graphs.' },
  { question:'Job scheduling to maximize profit where each job has deadline and profit.', options:['DP','Greedy','Binary Search','Graph'], answer:'Greedy', explanation:'Sort by profit descending and schedule in latest available slot.' },
  { question:'Longest Increasing Subsequence in an array.', options:['Greedy','Sliding Window','DP','Two Pointers'], answer:'DP', explanation:'dp[i] = length of LIS ending at index i. O(N²) or O(N log N) with patience sort.' },
  { question:'Find all subsets of a given set.', options:['Two Pointers','Backtracking','BFS','Greedy'], answer:'Backtracking', explanation:'Explore include/exclude choices recursively = backtracking.' },
  { question:'Kth largest element in an unsorted array — optimal approach.', options:['Sort the array','Min-Heap of size K','BFS','DP'], answer:'Min-Heap of size K', explanation:'Maintain a min-heap of size K; after processing all elements, top = Kth largest.' },
  { question:'Word search in a 2D grid — does a word exist following adjacent cells?', options:['BFS','DFS with Backtracking','Binary Search','DP'], answer:'DFS with Backtracking', explanation:'DFS from each cell, backtrack if path fails.' },
  { question:'Next greater element for every element in array.', options:['Sliding Window','Monotonic Stack','Two Pointers','DP'], answer:'Monotonic Stack', explanation:'Use a decreasing monotonic stack — pop when current element is greater.' },
  { question:'Valid parentheses matching.', options:['Queue','Stack','Hash Map','Two Pointers'], answer:'Stack', explanation:'Push open brackets, pop and match close brackets.' },
];

async function seed() {
  await mongoose.connect(process.env.DB_CONNECT_STRING || process.env.MONGODB_URI || process.env.DATABASE_URL);
  console.log('Connected to DB');

  // Clear existing game questions
  await GameQuestion.deleteMany({});
  console.log('Cleared existing questions');

  const quizDocs    = QUIZ_QUESTIONS.map(q   => ({ ...q, type: 'quiz',       points: 10, timeLimit: 30 }));
  const complexDocs = COMPLEXITY_QUESTIONS.map(q => ({ ...q, type: 'complexity', points: 10, timeLimit: 25 }));
  const outputDocs  = OUTPUT_QUESTIONS.map(q  => ({ ...q, type: 'output',    points: 15, timeLimit: 45 }));
  const bugDocs     = BUG_QUESTIONS.map(q     => ({ ...q, type: 'bug',       points: 20, timeLimit: 90 }));
  const patternDocs = PATTERN_QUESTIONS.map(q => ({ ...q, type: 'pattern',   points: 10, timeLimit: 30 }));

  const all = [...quizDocs, ...complexDocs, ...outputDocs, ...bugDocs, ...patternDocs];
  await GameQuestion.insertMany(all);

  console.log(`✅ Seeded ${all.length} game questions:`);
  console.log(`   Quiz:       ${quizDocs.length}`);
  console.log(`   Complexity: ${complexDocs.length}`);
  console.log(`   Output:     ${outputDocs.length}`);
  console.log(`   Bug Hunter: ${bugDocs.length}`);
  console.log(`   Pattern:    ${patternDocs.length}`);

  mongoose.connection.close();
}

seed().catch(err => { console.error(err); mongoose.connection.close(); });
