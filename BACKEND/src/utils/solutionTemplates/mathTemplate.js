/**
 * mathTemplate.js — Competitive programming (stdin/stdout) style.
 * Used for: Reverse Integer, Palindrome Number, Pow(x,n), math-based problems.
 */
module.exports = (problem) => ({
  explanation: `"${problem.title}" — Mathematical approach using arithmetic operations and overflow handling.`,
  approach: `Extract digits or use fast power. Handle edge cases (negatives, overflow, zero).`,
  timeComplexity: "O(log n)",
  spaceComplexity: "O(1)",
  code: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
    long long x; cin >> x;
    // Reverse integer, handle overflow
    long long rev = 0, orig = abs(x);
    while (orig > 0) { rev = rev * 10 + orig % 10; orig /= 10; }
    if (x < 0) rev = -rev;
    if (rev > INT_MAX || rev < INT_MIN) rev = 0;
    cout << rev << endl;
    return 0;
}`,
    java: `import java.util.*;
import java.io.*;
public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        long x = Long.parseLong(br.readLine().trim());
        long rev = 0, orig = Math.abs(x);
        while (orig > 0) { rev = rev * 10 + orig % 10; orig /= 10; }
        if (x < 0) rev = -rev;
        if (rev > Integer.MAX_VALUE || rev < Integer.MIN_VALUE) rev = 0;
        System.out.println(rev);
    }
}`,
    python: `import sys
input = sys.stdin.readline
def main():
    x = int(input())
    sign = -1 if x < 0 else 1
    rev = int(str(abs(x))[::-1]) * sign
    if rev > 2**31 - 1 or rev < -2**31:
        print(0)
    else:
        print(rev)
if __name__ == "__main__":
    main()`,
    javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', line => lines.push(line.trim()));
rl.on('close', () => {
    const x = parseInt(lines[0]);
    const sign = x < 0 ? -1 : 1;
    const rev = parseInt(Math.abs(x).toString().split('').reverse().join('')) * sign;
    const MAX = 2**31 - 1, MIN = -(2**31);
    console.log(rev > MAX || rev < MIN ? 0 : rev);
});`
  }
});
