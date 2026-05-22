/**
 * regularExpressionTemplate.js — Regular Expression Matching (LeetCode #10)
 *
 * Input format  : line 1 = string s, line 2 = pattern p
 * Output format : "true" or "false"
 *
 * Example:
 *   Input : aa\na    →  Output: false
 *   Input : aa\na*   →  Output: true
 *   Input : ab\n.*   →  Output: true
 */
module.exports = (_problem) => ({
  explanation: `"Regular Expression Matching" — DP table where dp[i][j] = whether s[0..i-1] matches p[0..j-1].`,
  approach: `dp[i][j] is true if: chars match directly, or p[j-1]='.' matches any, or '*' covers zero/one+ of previous pattern char.`,
  timeComplexity: "O(m*n)",
  spaceComplexity: "O(m*n)",
  code: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
    string s, p;
    cin >> s >> p;
    int m = s.size(), n = p.size();
    vector<vector<bool>> dp(m + 1, vector<bool>(n + 1, false));
    dp[0][0] = true;
    for (int j = 2; j <= n; j++)
        if (p[j-1] == '*') dp[0][j] = dp[0][j-2];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (p[j-1] == '*') {
                dp[i][j] = dp[i][j-2]; // zero occurrence
                if (p[j-2] == '.' || p[j-2] == s[i-1])
                    dp[i][j] = dp[i][j] || dp[i-1][j];
            } else if (p[j-1] == '.' || p[j-1] == s[i-1]) {
                dp[i][j] = dp[i-1][j-1];
            }
        }
    }
    cout << (dp[m][n] ? "true" : "false") << endl;
    return 0;
}`,

    java: `import java.util.*;
import java.io.*;
public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine().trim();
        String p = br.readLine().trim();
        int m = s.length(), n = p.length();
        boolean[][] dp = new boolean[m+1][n+1];
        dp[0][0] = true;
        for (int j = 2; j <= n; j++)
            if (p.charAt(j-1) == '*') dp[0][j] = dp[0][j-2];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (p.charAt(j-1) == '*') {
                    dp[i][j] = dp[i][j-2];
                    if (p.charAt(j-2) == '.' || p.charAt(j-2) == s.charAt(i-1))
                        dp[i][j] = dp[i][j] || dp[i-1][j];
                } else if (p.charAt(j-1) == '.' || p.charAt(j-1) == s.charAt(i-1)) {
                    dp[i][j] = dp[i-1][j-1];
                }
            }
        }
        System.out.println(dp[m][n] ? "true" : "false");
    }
}`,

    python: `import sys
input = sys.stdin.readline

def main():
    s = input().strip()
    p = input().strip()
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    for j in range(2, n + 1):
        if p[j-1] == '*':
            dp[0][j] = dp[0][j-2]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j-1] == '*':
                dp[i][j] = dp[i][j-2]
                if p[j-2] in ('.', s[i-1]):
                    dp[i][j] = dp[i][j] or dp[i-1][j]
            elif p[j-1] in ('.', s[i-1]):
                dp[i][j] = dp[i-1][j-1]
    print('true' if dp[m][n] else 'false')

if __name__ == "__main__":
    main()`,

    javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', line => lines.push(line.trim()));
rl.on('close', () => {
    const s = lines[0], p = lines[1];
    const m = s.length, n = p.length;
    const dp = Array.from({length: m+1}, () => new Array(n+1).fill(false));
    dp[0][0] = true;
    for (let j = 2; j <= n; j++)
        if (p[j-1] === '*') dp[0][j] = dp[0][j-2];
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (p[j-1] === '*') {
                dp[i][j] = dp[i][j-2];
                if (p[j-2] === '.' || p[j-2] === s[i-1])
                    dp[i][j] = dp[i][j] || dp[i-1][j];
            } else if (p[j-1] === '.' || p[j-1] === s[i-1]) {
                dp[i][j] = dp[i-1][j-1];
            }
        }
    }
    console.log(dp[m][n] ? 'true' : 'false');
});`
  }
});
