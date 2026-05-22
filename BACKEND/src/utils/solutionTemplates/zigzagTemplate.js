/**
 * zigzagTemplate.js — Zigzag Conversion (LeetCode #6)
 *
 * Input format  : line 1 = string s, line 2 = int numRows
 * Output format : single line — the zigzag-converted string
 *
 * Example:
 *   Input : PAYPALISHIRING\n3
 *   Output: PAHNAPLSIIGYIR
 */
module.exports = (_problem) => ({
  explanation: `"Zigzag Conversion" — Place characters in a zigzag pattern across numRows rows, then read row by row.`,
  approach: `Simulate by tracking the current row and direction. Append each character to its row's string, then concatenate all rows.`,
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  code: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    int numRows;
    cin >> s >> numRows;

    if (numRows == 1 || numRows >= (int)s.size()) {
        cout << s << endl;
        return 0;
    }

    vector<string> rows(numRows);
    int row = 0, dir = -1;
    for (char c : s) {
        rows[row] += c;
        if (row == 0 || row == numRows - 1) dir = -dir;
        row += dir;
    }

    string result;
    for (auto& r : rows) result += r;
    cout << result << endl;
    return 0;
}`,

    java: `import java.util.*;
import java.io.*;
public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine().trim();
        int numRows = Integer.parseInt(br.readLine().trim());

        if (numRows == 1 || numRows >= s.length()) {
            System.out.println(s);
            return;
        }

        StringBuilder[] rows = new StringBuilder[numRows];
        for (int i = 0; i < numRows; i++) rows[i] = new StringBuilder();
        int row = 0, dir = -1;
        for (char c : s.toCharArray()) {
            rows[row].append(c);
            if (row == 0 || row == numRows - 1) dir = -dir;
            row += dir;
        }

        StringBuilder res = new StringBuilder();
        for (StringBuilder r : rows) res.append(r);
        System.out.println(res);
    }
}`,

    python: `import sys
input = sys.stdin.readline

def main():
    s = input().strip()
    num_rows = int(input().strip())

    if num_rows == 1 or num_rows >= len(s):
        print(s)
        return

    rows = [''] * num_rows
    row, direction = 0, -1
    for c in s:
        rows[row] += c
        if row == 0 or row == num_rows - 1:
            direction = -direction
        row += direction

    print(''.join(rows))

if __name__ == "__main__":
    main()`,

    javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', line => lines.push(line.trim()));
rl.on('close', () => {
    const s = lines[0];
    const numRows = parseInt(lines[1]);

    if (numRows === 1 || numRows >= s.length) {
        console.log(s);
        return;
    }

    const rows = Array.from({ length: numRows }, () => '');
    let row = 0, dir = -1;
    for (const c of s) {
        rows[row] += c;
        if (row === 0 || row === numRows - 1) dir = -dir;
        row += dir;
    }

    console.log(rows.join(''));
});`
  }
});
