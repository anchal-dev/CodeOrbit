/**
 * backtrackTemplate.js — Competitive programming (stdin/stdout) style.
 * Used for: Permutations, Combinations, Subsets, Letter combinations.
 */
module.exports = (problem) => ({
  explanation: `"${problem.title}" — Backtracking: build candidates incrementally, abandon a candidate as soon as it can't lead to a valid solution.`,
  approach: `Recursively build combinations/permutations. At each step try all choices, recurse, then undo the choice.`,
  timeComplexity: "O(n!)",
  spaceComplexity: "O(n)",
  code: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
vector<vector<int>> results;
void backtrack(vector<int>& nums, vector<int>& path, vector<bool>& used) {
    if ((int)path.size() == (int)nums.size()) { results.push_back(path); return; }
    for (int i = 0; i < (int)nums.size(); i++) {
        if (used[i]) continue;
        used[i] = true; path.push_back(nums[i]);
        backtrack(nums, path, used);
        path.pop_back(); used[i] = false;
    }
}
int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    vector<int> path; vector<bool> used(n, false);
    backtrack(nums, path, used);
    for (auto& r : results) {
        for (int i = 0; i < (int)r.size(); i++) { if(i) cout << " "; cout << r[i]; }
        cout << "\n";
    }
    return 0;
}`,
    java: `import java.util.*;
import java.io.*;
public class Main {
    static List<List<Integer>> results = new ArrayList<>();
    static void backtrack(int[] nums, List<Integer> path, boolean[] used) {
        if (path.size() == nums.length) { results.add(new ArrayList<>(path)); return; }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true; path.add(nums[i]);
            backtrack(nums, path, used);
            path.remove(path.size()-1); used[i] = false;
        }
    }
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(br.readLine().trim());
        StringTokenizer st = new StringTokenizer(br.readLine());
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = Integer.parseInt(st.nextToken());
        backtrack(nums, new ArrayList<>(), new boolean[n]);
        StringBuilder sb = new StringBuilder();
        for (List<Integer> r : results) {
            for (int i = 0; i < r.size(); i++) { if(i>0) sb.append(' '); sb.append(r.get(i)); }
            sb.append('\n');
        }
        System.out.print(sb);
    }
}`,
    python: `import sys
input = sys.stdin.readline
def main():
    n = int(input())
    nums = list(map(int, input().split()))
    results = []
    def backtrack(path, used):
        if len(path) == n: results.append(path[:]); return
        for i in range(n):
            if used[i]: continue
            used[i] = True; path.append(nums[i])
            backtrack(path, used)
            path.pop(); used[i] = False
    backtrack([], [False]*n)
    for r in results:
        print(*r)
if __name__ == "__main__":
    main()`,
    javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', line => lines.push(line.trim()));
rl.on('close', () => {
    const n = parseInt(lines[0]);
    const nums = lines[1].split(' ').map(Number);
    const results = [];
    function backtrack(path, used) {
        if (path.length === n) { results.push([...path]); return; }
        for (let i = 0; i < n; i++) {
            if (used[i]) continue;
            used[i] = true; path.push(nums[i]);
            backtrack(path, used);
            path.pop(); used[i] = false;
        }
    }
    backtrack([], new Array(n).fill(false));
    results.forEach(r => console.log(r.join(' ')));
});`
  }
});
