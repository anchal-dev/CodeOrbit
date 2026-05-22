/**
 * twoPointersTemplate.js — Competitive programming (stdin/stdout) style.
 */
module.exports = (problem) => ({
  explanation: `"${problem.title}" — Two pointers from both ends, move inward.`,
  approach: `Sort, use left/right pointers moving inward to find pairs satisfying the condition.`,
  timeComplexity: "O(n log n)",
  spaceComplexity: "O(1)",
  code: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target; cin >> target;
    sort(nums.begin(), nums.end());
    int lo = 0, hi = n - 1;
    while (lo < hi) {
        int s = nums[lo] + nums[hi];
        if (s == target) { cout << lo << " " << hi; return 0; }
        else if (s < target) lo++;
        else hi--;
    }
    cout << -1;
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
        int target = Integer.parseInt(br.readLine().trim());
        Arrays.sort(nums);
        int lo = 0, hi = n - 1;
        while (lo < hi) {
            int s = nums[lo] + nums[hi];
            if (s == target) { System.out.println(lo + " " + hi); return; }
            else if (s < target) lo++;
            else hi--;
        }
        System.out.println(-1);
    }
}`,
    python: `import sys
input = sys.stdin.readline
def main():
    n = int(input())
    nums = list(map(int, input().split()))
    target = int(input())
    nums.sort()
    lo, hi = 0, n - 1
    while lo < hi:
        s = nums[lo] + nums[hi]
        if s == target: print(lo, hi); return
        elif s < target: lo += 1
        else: hi -= 1
    print(-1)
if __name__ == "__main__":
    main()`,
    javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', line => lines.push(line.trim()));
rl.on('close', () => {
    const n = parseInt(lines[0]);
    const nums = lines[1].split(' ').map(Number).sort((a,b)=>a-b);
    const target = parseInt(lines[2]);
    let lo = 0, hi = n - 1;
    while (lo < hi) {
        const s = nums[lo] + nums[hi];
        if (s === target) { console.log(lo+' '+hi); return; }
        else if (s < target) lo++;
        else hi--;
    }
    console.log(-1);
});`
  }
});
