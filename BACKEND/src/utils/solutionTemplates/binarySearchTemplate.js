/**
 * binarySearchTemplate.js — Competitive programming (stdin/stdout) style.
 * Used for: Binary Search, search in rotated array, find first/last position.
 */
module.exports = (problem) => ({
  explanation: `"${problem.title}" — Binary search on a sorted (or rotated) array for O(log n) lookups.`,
  approach: `Maintain low/high pointers, check mid each iteration, narrow the search space by half.`,
  timeComplexity: "O(log n)",
  spaceComplexity: "O(1)",
  code: {
    cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // ${problem.title} — Binary Search
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target;
    cin >> target;

    int lo = 0, hi = n - 1, ans = -1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) { ans = mid; break; }
        else if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }

    cout << ans << endl;
    return 0;
}`,
    java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        // ${problem.title} — Binary Search
        int n = Integer.parseInt(br.readLine().trim());
        StringTokenizer st = new StringTokenizer(br.readLine());
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = Integer.parseInt(st.nextToken());
        int target = Integer.parseInt(br.readLine().trim());

        int lo = 0, hi = n - 1, ans = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) { ans = mid; break; }
            else if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        System.out.println(ans);
    }
}`,
    python: `import sys
input = sys.stdin.readline

def main():
    # ${problem.title} — Binary Search
    n = int(input())
    nums = list(map(int, input().split()))
    target = int(input())

    lo, hi, ans = 0, n - 1, -1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            ans = mid; break
        elif nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    print(ans)

if __name__ == "__main__":
    main()`,
    javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', line => lines.push(line.trim()));
rl.on('close', () => {
    // ${problem.title} — Binary Search
    const n = parseInt(lines[0]);
    const nums = lines[1].split(' ').map(Number);
    const target = parseInt(lines[2]);

    let lo = 0, hi = n - 1, ans = -1;
    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (nums[mid] === target) { ans = mid; break; }
        else if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    console.log(ans);
});`
  }
});
