/**
 * fallbackTemplate.js — Competitive programming (stdin/stdout) style.
 * Generic template used when no specific pattern is detected.
 */
module.exports = (problem) => ({
  explanation: `"${problem.title}" — General solution reading from stdin and writing result to stdout.`,
  approach: `Read input, process, output result. Replace the placeholder logic with your actual solution.`,
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  code: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    // ${problem.title}
    // Read your input here
    int n; cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // Write your solution here
    int ans = 0;

    cout << ans << endl;
    return 0;
}`,
    java: `import java.util.*;
import java.io.*;
public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        // ${problem.title}
        int n = Integer.parseInt(br.readLine().trim());
        StringTokenizer st = new StringTokenizer(br.readLine());
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = Integer.parseInt(st.nextToken());

        // Write your solution here
        int ans = 0;
        System.out.println(ans);
    }
}`,
    python: `import sys
input = sys.stdin.readline
def main():
    # ${problem.title}
    n = int(input())
    nums = list(map(int, input().split()))

    # Write your solution here
    ans = 0
    print(ans)

if __name__ == "__main__":
    main()`,
    javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', line => lines.push(line.trim()));
rl.on('close', () => {
    // ${problem.title}
    const n = parseInt(lines[0]);
    const nums = lines[1].split(' ').map(Number);

    // Write your solution here
    let ans = 0;
    console.log(ans);
});`
  }
});
