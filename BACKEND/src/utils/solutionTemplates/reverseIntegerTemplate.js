/**
 * reverseIntegerTemplate.js — Reverse Integer (LeetCode #7)
 *
 * Input format  : single integer on one line
 * Output format : reversed integer (0 if overflow beyond 32-bit signed range)
 *
 * Example:
 *   Input : 123         →  Output: 321
 *   Input : -123        →  Output: -321
 *   Input : 120         →  Output: 21
 *   Input : 1534236469  →  Output: 0
 */
module.exports = (_problem) => ({
  explanation: `"Reverse Integer" — Reverse the digits of a 32-bit signed integer. Return 0 if result overflows.`,
  approach: `Extract digits one by one via modulo. Build result, checking for overflow before each multiply-and-add step.`,
  timeComplexity: "O(log x)",
  spaceComplexity: "O(1)",
  code: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
    long long x;
    cin >> x;
    long long rev = 0;
    bool neg = x < 0;
    long long n = abs(x);
    while (n > 0) {
        rev = rev * 10 + n % 10;
        n /= 10;
    }
    if (neg) rev = -rev;
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
        long rev = 0;
        boolean neg = x < 0;
        long n = Math.abs(x);
        while (n > 0) {
            rev = rev * 10 + n % 10;
            n /= 10;
        }
        if (neg) rev = -rev;
        if (rev > Integer.MAX_VALUE || rev < Integer.MIN_VALUE) rev = 0;
        System.out.println(rev);
    }
}`,

    python: `import sys
input = sys.stdin.readline

def main():
    x = int(input().strip())
    neg = x < 0
    n = abs(x)
    rev = int(str(n)[::-1])
    if neg:
        rev = -rev
    INT_MAX = 2**31 - 1
    INT_MIN = -(2**31)
    if rev > INT_MAX or rev < INT_MIN:
        rev = 0
    print(rev)

if __name__ == "__main__":
    main()`,

    javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', line => lines.push(line.trim()));
rl.on('close', () => {
    let x = parseInt(lines[0]);
    const neg = x < 0;
    let n = Math.abs(x);
    let rev = 0;
    while (n > 0) {
        rev = rev * 10 + n % 10;
        n = Math.floor(n / 10);
    }
    if (neg) rev = -rev;
    const INT_MAX = 2**31 - 1, INT_MIN = -(2**31);
    if (rev > INT_MAX || rev < INT_MIN) rev = 0;
    console.log(rev);
});`
  }
});
