/**
 * hashMapTemplate.js — Competitive programming (stdin/stdout) style.
 * Used for: Two Sum, frequency counting, anagram, group problems.
 */
module.exports = (problem) => ({
  explanation: `"${problem.title}" — Use a hash map for O(1) lookups to avoid O(n²) brute force.`,
  approach: `Store seen values/indices in a map as we iterate. For each element, check if its complement is already in the map.`,
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  code: {
    cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // ${problem.title} — HashMap solution
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target;
    cin >> target;

    unordered_map<int, int> seen;
    for (int i = 0; i < n; i++) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            cout << seen[complement] << " " << i << endl;
            return 0;
        }
        seen[nums[i]] = i;
    }

    return 0;
}`,
    java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        // ${problem.title} — HashMap solution
        int n = Integer.parseInt(br.readLine().trim());
        StringTokenizer st = new StringTokenizer(br.readLine());
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = Integer.parseInt(st.nextToken());
        int target = Integer.parseInt(br.readLine().trim());

        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) {
                System.out.println(seen.get(complement) + " " + i);
                return;
            }
            seen.put(nums[i], i);
        }
    }
}`,
    python: `import sys
input = sys.stdin.readline

def main():
    # ${problem.title} — HashMap solution
    n = int(input())
    nums = list(map(int, input().split()))
    target = int(input())

    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            print(seen[complement], i)
            return
        seen[num] = i

if __name__ == "__main__":
    main()`,
    javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', line => lines.push(line.trim()));
rl.on('close', () => {
    // ${problem.title} — HashMap solution
    const n = parseInt(lines[0]);
    const nums = lines[1].split(' ').map(Number);
    const target = parseInt(lines[2]);

    const seen = new Map();
    for (let i = 0; i < n; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            console.log(seen.get(complement) + ' ' + i);
            return;
        }
        seen.set(nums[i], i);
    }
});`
  }
});
