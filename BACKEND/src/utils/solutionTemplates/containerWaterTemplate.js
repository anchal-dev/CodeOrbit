/**
 * containerWaterTemplate.js — Container With Most Water (LeetCode #11)
 *
 * Input format  : line 1 = n (count), line 2 = space-separated heights
 * Output format : integer — maximum water area
 *
 * Example:
 *   Input : 9\n1 8 6 2 5 4 8 3 7
 *   Output: 49
 */
module.exports = (_problem) => ({
  explanation: `"Container With Most Water" — Two pointers from both ends. Move the shorter line inward to potentially find a taller one.`,
  approach: `Start with left=0, right=n-1. At each step compute area = min(h[l],h[r])*(r-l). Move the pointer with the shorter height.`,
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  code: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> h(n);
    for (int i = 0; i < n; i++) cin >> h[i];

    int lo = 0, hi = n - 1, ans = 0;
    while (lo < hi) {
        ans = max(ans, min(h[lo], h[hi]) * (hi - lo));
        if (h[lo] < h[hi]) lo++;
        else hi--;
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
        int[] h = new int[n];
        for (int i = 0; i < n; i++) h[i] = Integer.parseInt(st.nextToken());

        int lo = 0, hi = n - 1, ans = 0;
        while (lo < hi) {
            ans = Math.max(ans, Math.min(h[lo], h[hi]) * (hi - lo));
            if (h[lo] < h[hi]) lo++;
            else hi--;
        }
        System.out.println(ans);
    }
}`,

    python: `import sys
input = sys.stdin.readline

def main():
    n = int(input())
    h = list(map(int, input().split()))
    lo, hi, ans = 0, n - 1, 0
    while lo < hi:
        ans = max(ans, min(h[lo], h[hi]) * (hi - lo))
        if h[lo] < h[hi]:
            lo += 1
        else:
            hi -= 1
    print(ans)

if __name__ == "__main__":
    main()`,

    javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', line => lines.push(line.trim()));
rl.on('close', () => {
    const n = parseInt(lines[0]);
    const h = lines[1].split(' ').map(Number);
    let lo = 0, hi = n - 1, ans = 0;
    while (lo < hi) {
        ans = Math.max(ans, Math.min(h[lo], h[hi]) * (hi - lo));
        if (h[lo] < h[hi]) lo++;
        else hi--;
    }
    console.log(ans);
});`
  }
});
