/**
 * dpTemplate.js — Competitive programming (stdin/stdout) style.
 * Used for: Dynamic Programming, memoization, tabulation problems.
 */
module.exports = (problem) => ({
  explanation: `"${problem.title}" — Classic DP problem. Build a table bottom-up from subproblems.`,
  approach: `Read input, define DP state, fill table iteratively, output the final answer.`,
  timeComplexity: "O(n²)",
  spaceComplexity: "O(n)",
  code: {
    cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // ${problem.title} — DP solution
    vector<int> dp(n, 1);
    int ans = 1;
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i])
                dp[i] = max(dp[i], dp[j] + 1);
        }
        ans = max(ans, dp[i]);
    }

    cout << ans << endl;
    return 0;
}`,
    java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(br.readLine().trim());
        StringTokenizer st = new StringTokenizer(br.readLine());
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = Integer.parseInt(st.nextToken());

        // ${problem.title} — DP solution
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        int ans = 1;
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i])
                    dp[i] = Math.max(dp[i], dp[j] + 1);
            }
            ans = Math.max(ans, dp[i]);
        }
        System.out.println(ans);
    }
}`,
    python: `import sys
input = sys.stdin.readline

def main():
    n = int(input())
    nums = list(map(int, input().split()))

    # ${problem.title} — DP solution
    dp = [1] * n
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    print(max(dp))

if __name__ == "__main__":
    main()`,
    javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', line => lines.push(line.trim()));
rl.on('close', () => {
    const n = parseInt(lines[0]);
    const nums = lines[1].split(' ').map(Number);

    // ${problem.title} — DP solution
    const dp = new Array(n).fill(1);
    let ans = 1;
    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
        }
        ans = Math.max(ans, dp[i]);
    }
    console.log(ans);
});`
  }
});
