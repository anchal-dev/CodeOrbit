/**
 * slidingWindowTemplate.js — Longest Substring Without Repeating Characters (LeetCode #3)
 *
 * Input format  : single string on one line
 * Output format : integer — length of longest substring without repeating characters
 *
 * Example:
 *   Input : abcabcbb
 *   Output: 3
 */
module.exports = (_problem) => ({
  explanation: `"Longest Substring Without Repeating Characters" — Sliding window with a frequency map to track the current window's characters.`,
  approach: `Expand right pointer. When a duplicate is found, shrink left pointer until the window has no duplicates. Track maximum window size.`,
  timeComplexity: "O(n)",
  spaceComplexity: "O(min(m,n)) where m is charset size",
  code: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    // Longest substring without repeating characters (sliding window)
    unordered_map<char, int> freq;
    int l = 0, ans = 0;
    for (int r = 0; r < (int)s.size(); r++) {
        freq[s[r]]++;
        while (freq[s[r]] > 1) { freq[s[l]]--; l++; }
        ans = max(ans, r - l + 1);
    }
    cout << ans << endl;
    return 0;
}`,

    java: `import java.util.*;
import java.io.*;
public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine().trim();
        Map<Character, Integer> freq = new HashMap<>();
        int l = 0, ans = 0;
        for (int r = 0; r < s.length(); r++) {
            freq.merge(s.charAt(r), 1, Integer::sum);
            while (freq.get(s.charAt(r)) > 1) {
                freq.merge(s.charAt(l), -1, Integer::sum);
                l++;
            }
            ans = Math.max(ans, r - l + 1);
        }
        System.out.println(ans);
    }
}`,

    python: `import sys
input = sys.stdin.readline
def main():
    s = input().strip()
    from collections import defaultdict
    freq = defaultdict(int)
    l = ans = 0
    for r, c in enumerate(s):
        freq[c] += 1
        while freq[c] > 1:
            freq[s[l]] -= 1
            l += 1
        ans = max(ans, r - l + 1)
    print(ans)
if __name__ == "__main__":
    main()`,

    javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', line => lines.push(line.trim()));
rl.on('close', () => {
    const s = lines[0];
    const freq = new Map();
    let l = 0, ans = 0;
    for (let r = 0; r < s.length; r++) {
        freq.set(s[r], (freq.get(s[r]) || 0) + 1);
        while (freq.get(s[r]) > 1) {
            freq.set(s[l], freq.get(s[l]) - 1);
            l++;
        }
        ans = Math.max(ans, r - l + 1);
    }
    console.log(ans);
});`
  }
});
