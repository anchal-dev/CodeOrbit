/**
 * fourSumTemplate.js — 4Sum (LeetCode #18)
 *
 * Input format  : line 1 = n (count), line 2 = space-separated integers, line 3 = target
 * Output format : each unique quadruplet on its own line, elements space-separated
 *                 Empty string if no quadruplets exist.
 *
 * Example:
 *   Input : 6\n1 0 -1 0 -2 2\n0
 *   Output:
 *     -2 -1 1 2
 *     -2  0 0 2
 *     -1  0 0 1
 */
module.exports = (_problem) => ({
  explanation: `"4Sum" — Sort the array, then use two nested loops (i, j) plus an inner two-pointer window (left, right) to find all unique quadruplets summing to target.`,
  approach: `Sort array. For each pair (i, j), use two pointers left=j+1, right=n-1. Skip duplicates at every level to avoid repeated quadruplets.`,
  timeComplexity: "O(n³)",
  spaceComplexity: "O(1) extra (output not counted)",
  code: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    long long target;
    cin >> target;

    sort(nums.begin(), nums.end());
    vector<vector<int>> result;

    for (int i = 0; i < n - 3; i++) {
        if (i > 0 && nums[i] == nums[i-1]) continue;
        for (int j = i + 1; j < n - 2; j++) {
            if (j > i + 1 && nums[j] == nums[j-1]) continue;
            int left = j + 1, right = n - 1;
            while (left < right) {
                long long sum = (long long)nums[i] + nums[j] + nums[left] + nums[right];
                if (sum == target) {
                    result.push_back({nums[i], nums[j], nums[left], nums[right]});
                    while (left < right && nums[left]  == nums[left+1])  left++;
                    while (left < right && nums[right] == nums[right-1]) right--;
                    left++; right--;
                } else if (sum < target) {
                    left++;
                } else {
                    right--;
                }
            }
        }
    }

    for (auto& q : result) {
        for (int k = 0; k < 4; k++) {
            if (k) cout << " ";
            cout << q[k];
        }
        cout << "\\n";
    }
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
        long target = Long.parseLong(br.readLine().trim());

        Arrays.sort(nums);
        List<int[]> result = new ArrayList<>();

        for (int i = 0; i < n - 3; i++) {
            if (i > 0 && nums[i] == nums[i-1]) continue;
            for (int j = i + 1; j < n - 2; j++) {
                if (j > i + 1 && nums[j] == nums[j-1]) continue;
                int left = j + 1, right = n - 1;
                while (left < right) {
                    long sum = (long)nums[i] + nums[j] + nums[left] + nums[right];
                    if (sum == target) {
                        result.add(new int[]{nums[i], nums[j], nums[left], nums[right]});
                        while (left < right && nums[left]  == nums[left+1])  left++;
                        while (left < right && nums[right] == nums[right-1]) right--;
                        left++; right--;
                    } else if (sum < target) left++;
                    else right--;
                }
            }
        }

        StringBuilder sb = new StringBuilder();
        for (int[] q : result) {
            sb.append(q[0]).append(' ').append(q[1]).append(' ')
              .append(q[2]).append(' ').append(q[3]).append('\\n');
        }
        System.out.print(sb);
    }
}`,

    python: `import sys
input = sys.stdin.readline

def main():
    n = int(input())
    nums = list(map(int, input().split()))
    target = int(input())

    nums.sort()
    result = []

    for i in range(n - 3):
        if i > 0 and nums[i] == nums[i-1]:
            continue
        for j in range(i + 1, n - 2):
            if j > i + 1 and nums[j] == nums[j-1]:
                continue
            left, right = j + 1, n - 1
            while left < right:
                total = nums[i] + nums[j] + nums[left] + nums[right]
                if total == target:
                    result.append((nums[i], nums[j], nums[left], nums[right]))
                    while left < right and nums[left]  == nums[left+1]:  left  += 1
                    while left < right and nums[right] == nums[right-1]: right -= 1
                    left  += 1
                    right -= 1
                elif total < target:
                    left  += 1
                else:
                    right -= 1

    for q in result:
        print(' '.join(map(str, q)))

if __name__ == "__main__":
    main()`,

    javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', line => lines.push(line.trim()));
rl.on('close', () => {
    const n = parseInt(lines[0]);
    const nums = lines[1].split(' ').map(Number);
    const target = parseInt(lines[2]);

    nums.sort((a, b) => a - b);
    const result = [];

    for (let i = 0; i < n - 3; i++) {
        if (i > 0 && nums[i] === nums[i-1]) continue;
        for (let j = i + 1; j < n - 2; j++) {
            if (j > i + 1 && nums[j] === nums[j-1]) continue;
            let left = j + 1, right = n - 1;
            while (left < right) {
                const sum = nums[i] + nums[j] + nums[left] + nums[right];
                if (sum === target) {
                    result.push([nums[i], nums[j], nums[left], nums[right]]);
                    while (left < right && nums[left]  === nums[left+1])  left++;
                    while (left < right && nums[right] === nums[right-1]) right--;
                    left++; right--;
                } else if (sum < target) left++;
                else right--;
            }
        }
    }

    for (const q of result) console.log(q.join(' '));
});`
  }
});
