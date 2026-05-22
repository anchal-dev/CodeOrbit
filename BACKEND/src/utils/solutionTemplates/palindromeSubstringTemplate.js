/**
 * palindromeSubstringTemplate.js — Longest Palindromic Substring (LeetCode #5)
 *
 * Input format  : single string on one line
 * Output format : the longest palindromic substring
 *
 * Example:
 *   Input : babad   →  Output: bab
 *   Input : racecar →  Output: racecar
 */
module.exports = (_problem) => ({
  explanation: `"Longest Palindromic Substring" — Expand around each centre (both odd and even length) to find the longest palindrome.`,
  approach: `For each index, expand outward while characters match. Track the longest found. O(n²) time, O(1) space.`,
  timeComplexity: "O(n²)",
  spaceComplexity: "O(1)",
  code: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    int n = s.size(), start = 0, maxLen = 1;

    auto expand = [&](int l, int r) {
        while (l >= 0 && r < n && s[l] == s[r]) { l--; r++; }
        l++; r--;
        if (r - l + 1 > maxLen) { maxLen = r - l + 1; start = l; }
    };

    for (int i = 0; i < n; i++) {
        expand(i, i);     // odd length
        expand(i, i + 1); // even length
    }
    cout << s.substr(start, maxLen) << endl;
    return 0;
}`,

    java: `import java.util.*;
import java.io.*;
public class Main {
    static String s;
    static int start = 0, maxLen = 1;

    static void expand(int l, int r) {
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }
        l++; r--;
        if (r - l + 1 > maxLen) { maxLen = r - l + 1; start = l; }
    }

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        s = br.readLine().trim();
        for (int i = 0; i < s.length(); i++) {
            expand(i, i);
            expand(i, i + 1);
        }
        System.out.println(s.substring(start, start + maxLen));
    }
}`,

    python: `import sys
input = sys.stdin.readline

def main():
    s = input().strip()
    n = len(s)
    start, max_len = 0, 1

    def expand(l, r):
        nonlocal start, max_len
        while l >= 0 and r < n and s[l] == s[r]:
            l -= 1; r += 1
        l += 1; r -= 1
        if r - l + 1 > max_len:
            max_len = r - l + 1
            start = l

    for i in range(n):
        expand(i, i)
        expand(i, i + 1)

    print(s[start:start + max_len])

if __name__ == "__main__":
    main()`,

    javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', line => lines.push(line.trim()));
rl.on('close', () => {
    const s = lines[0];
    const n = s.length;
    let start = 0, maxLen = 1;

    function expand(l, r) {
        while (l >= 0 && r < n && s[l] === s[r]) { l--; r++; }
        l++; r--;
        if (r - l + 1 > maxLen) { maxLen = r - l + 1; start = l; }
    }

    for (let i = 0; i < n; i++) {
        expand(i, i);
        expand(i, i + 1);
    }
    console.log(s.substring(start, start + maxLen));
});`
  }
});
