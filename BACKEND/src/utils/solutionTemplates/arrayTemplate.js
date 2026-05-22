/**
 * arrayTemplate.js — Competitive programming (stdin/stdout) style.
 * Used for: sorting, prefix sum, sliding window, array manipulation problems.
 */
module.exports = (problem) => ({
  explanation: `"${problem.title}" — Read array from stdin, apply the algorithm, print result to stdout.`,
  approach: `Read n elements, process with the appropriate array algorithm, output result.`,
  timeComplexity: "O(n log n)",
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

    // ${problem.title} — array solution
    sort(nums.begin(), nums.end());

    for (int i = 0; i < n; i++) {
        cout << nums[i];
        if (i < n - 1) cout << " ";
    }
    cout << endl;

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

        // ${problem.title} — array solution
        Arrays.sort(nums);

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if (i > 0) sb.append(" ");
            sb.append(nums[i]);
        }
        System.out.println(sb);
    }
}`,
    python: `import sys
input = sys.stdin.readline

def main():
    n = int(input())
    nums = list(map(int, input().split()))

    # ${problem.title} — array solution
    nums.sort()
    print(*nums)

if __name__ == "__main__":
    main()`,
    javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', line => lines.push(line.trim()));
rl.on('close', () => {
    const n = parseInt(lines[0]);
    const nums = lines[1].split(' ').map(Number);

    // ${problem.title} — array solution
    nums.sort((a, b) => a - b);
    console.log(nums.join(' '));
});`
  }
});
