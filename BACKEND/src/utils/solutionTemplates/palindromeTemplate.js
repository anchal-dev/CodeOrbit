/**
 * palindromeTemplate.js — Competitive programming (stdin/stdout) style.
 * Used for: Longest Palindromic Substring, Palindrome Number, etc.
 * Uses expand-around-center approach.
 */
module.exports = (problem) => ({
  explanation: `"${problem.title}" — Expand around each center (odd and even length) to find the longest palindromic substring.`,
  approach: `For each index, expand outward while characters match. Track maximum length. O(n²) time, O(1) space.`,
  timeComplexity: "O(n²)",
  spaceComplexity: "O(1)",
  code: {
    cpp: `#include <bits/stdc++.h>
using namespace std;

// Expand around center and return longest palindrome found
string expand(const string& s, int l, int r) {
    while (l >= 0 && r < (int)s.size() && s[l] == s[r]) { l--; r++; }
    return s.substr(l + 1, r - l - 1);
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // ${problem.title}
    string s;
    cin >> s;

    string res = "";
    for (int i = 0; i < (int)s.size(); i++) {
        string odd  = expand(s, i, i);       // odd-length palindrome
        string even = expand(s, i, i + 1);   // even-length palindrome
        if (odd.size()  > res.size()) res = odd;
        if (even.size() > res.size()) res = even;
    }

    cout << res << endl;
    return 0;
}`,
    java: `import java.util.*;
import java.io.*;

public class Main {
    static int expand(String s, int l, int r) {
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }
        return r - l - 1;
    }

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        // ${problem.title}
        String s = br.readLine().trim();

        int start = 0, maxLen = 1;
        for (int i = 0; i < s.length(); i++) {
            int odd  = expand(s, i, i);
            int even = expand(s, i, i + 1);
            int len  = Math.max(odd, even);
            if (len > maxLen) {
                maxLen = len;
                start  = i - (len - 1) / 2;
            }
        }
        System.out.println(s.substring(start, start + maxLen));
    }
}`,
    python: `import sys
input = sys.stdin.readline

def main():
    # ${problem.title}
    s = input().strip()

    def expand(l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1; r += 1
        return s[l+1:r]

    res = ""
    for i in range(len(s)):
        odd  = expand(i, i)
        even = expand(i, i + 1)
        if len(odd)  > len(res): res = odd
        if len(even) > len(res): res = even
    print(res)

if __name__ == "__main__":
    main()`,
    javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', line => lines.push(line.trim()));
rl.on('close', () => {
    // ${problem.title}
    const s = lines[0];

    function expand(l, r) {
        while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
        return s.slice(l + 1, r);
    }

    let res = "";
    for (let i = 0; i < s.length; i++) {
        const odd  = expand(i, i);
        const even = expand(i, i + 1);
        if (odd.length  > res.length) res = odd;
        if (even.length > res.length) res = even;
    }
    console.log(res);
});`
  }
});
