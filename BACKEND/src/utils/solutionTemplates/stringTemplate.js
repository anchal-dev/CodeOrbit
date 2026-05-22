/**
 * stringTemplate.js — Generic single-string processing fallback.
 *
 * Used for string problems that don't have a dedicated slug template:
 * e.g. Count and Say, Longest Common Prefix, basic string manipulation.
 *
 * Input format  : single string on one line
 * Output format : processed string or count
 */
module.exports = (problem) => ({
  explanation: `"${problem.title}" — String manipulation with linear scan.`,
  approach: `Read the input string and process character by character to produce the required output.`,
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  code: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string s;
    getline(cin, s);
    // TODO: implement ${problem.title} logic
    cout << s << endl;
    return 0;
}`,

    java: `import java.util.*;
import java.io.*;
public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine().trim();
        // TODO: implement ${problem.title} logic
        System.out.println(s);
    }
}`,

    python: `import sys
input = sys.stdin.readline

def main():
    s = input().strip()
    # TODO: implement ${problem.title} logic
    print(s)

if __name__ == "__main__":
    main()`,

    javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', line => lines.push(line.trim()));
rl.on('close', () => {
    const s = lines[0];
    // TODO: implement ${problem.title} logic
    console.log(s);
});`
  }
});
