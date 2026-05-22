/**
 * greedyTemplate.js — Competitive programming (stdin/stdout) style.
 * Used for: Jump Game, Jump Game II, interval scheduling, activity selection.
 */
module.exports = (problem) => ({
  explanation: `"${problem.title}" — Greedy: always pick the locally optimal choice (max reach / earliest end time).`,
  approach: `Track current reach / farthest jump. At each step extend greedily. Count jumps when boundary is crossed.`,
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  code: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    // Greedy jump game II
    int jumps = 0, curEnd = 0, farthest = 0;
    for (int i = 0; i < n - 1; i++) {
        farthest = max(farthest, i + nums[i]);
        if (i == curEnd) { jumps++; curEnd = farthest; }
    }
    cout << jumps << endl;
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
        int jumps = 0, curEnd = 0, farthest = 0;
        for (int i = 0; i < n - 1; i++) {
            farthest = Math.max(farthest, i + nums[i]);
            if (i == curEnd) { jumps++; curEnd = farthest; }
        }
        System.out.println(jumps);
    }
}`,
    python: `import sys
input = sys.stdin.readline
def main():
    n = int(input())
    nums = list(map(int, input().split()))
    jumps = cur_end = farthest = 0
    for i in range(n - 1):
        farthest = max(farthest, i + nums[i])
        if i == cur_end:
            jumps += 1
            cur_end = farthest
    print(jumps)
if __name__ == "__main__":
    main()`,
    javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', line => lines.push(line.trim()));
rl.on('close', () => {
    const n = parseInt(lines[0]);
    const nums = lines[1].split(' ').map(Number);
    let jumps = 0, curEnd = 0, farthest = 0;
    for (let i = 0; i < n - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);
        if (i === curEnd) { jumps++; curEnd = farthest; }
    }
    console.log(jumps);
});`
  }
});
