/**
 * addTwoNumbersTemplate.js — Add Two Numbers (LeetCode #2)
 *
 * Input format  :
 *   line 1 = n1 (length of first list)
 *   line 2 = space-separated digits of first list (least significant first)
 *   line 3 = n2 (length of second list)
 *   line 4 = space-separated digits of second list (least significant first)
 *
 * Output format : space-separated digits of the sum list (least significant first)
 *
 * Example:
 *   Input : 3\n2 4 3\n3\n5 6 4   →  Output: 7 0 8   (342 + 465 = 807)
 *   Input : 1\n0\n1\n0           →  Output: 0
 */
module.exports = (_problem) => ({
  explanation: `"Add Two Numbers" — Simulate digit-by-digit addition with carry on two linked lists represented as digit arrays.`,
  approach: `Iterate both lists together, sum digits with carry, push remainder digit to result, carry the quotient forward.`,
  timeComplexity: "O(max(m,n))",
  spaceComplexity: "O(max(m,n))",
  code: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
    int n1, n2;
    cin >> n1;
    vector<int> a(n1);
    for (int i = 0; i < n1; i++) cin >> a[i];
    cin >> n2;
    vector<int> b(n2);
    for (int i = 0; i < n2; i++) cin >> b[i];

    vector<int> res;
    int carry = 0, i = 0, j = 0;
    while (i < n1 || j < n2 || carry) {
        int sum = carry;
        if (i < n1) sum += a[i++];
        if (j < n2) sum += b[j++];
        res.push_back(sum % 10);
        carry = sum / 10;
    }

    for (int k = 0; k < (int)res.size(); k++) {
        if (k) cout << " ";
        cout << res[k];
    }
    cout << endl;
    return 0;
}`,

    java: `import java.util.*;
import java.io.*;
public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int n1 = Integer.parseInt(br.readLine().trim());
        int[] a = new int[n1];
        if (n1 > 0) {
            StringTokenizer st1 = new StringTokenizer(br.readLine());
            for (int i = 0; i < n1; i++) a[i] = Integer.parseInt(st1.nextToken());
        } else { br.readLine(); }
        int n2 = Integer.parseInt(br.readLine().trim());
        int[] b = new int[n2];
        if (n2 > 0) {
            StringTokenizer st2 = new StringTokenizer(br.readLine());
            for (int i = 0; i < n2; i++) b[i] = Integer.parseInt(st2.nextToken());
        } else { br.readLine(); }

        List<Integer> res = new ArrayList<>();
        int carry = 0, i = 0, j = 0;
        while (i < n1 || j < n2 || carry > 0) {
            int sum = carry;
            if (i < n1) sum += a[i++];
            if (j < n2) sum += b[j++];
            res.add(sum % 10);
            carry = sum / 10;
        }

        StringBuilder sb = new StringBuilder();
        for (int k = 0; k < res.size(); k++) {
            if (k > 0) sb.append(' ');
            sb.append(res.get(k));
        }
        System.out.println(sb);
    }
}`,

    python: `import sys
input = sys.stdin.readline

def main():
    n1 = int(input())
    a = list(map(int, input().split())) if n1 > 0 else []
    n2 = int(input())
    b = list(map(int, input().split())) if n2 > 0 else []

    res, carry, i, j = [], 0, 0, 0
    while i < n1 or j < n2 or carry:
        total = carry
        if i < n1:
            total += a[i]; i += 1
        if j < n2:
            total += b[j]; j += 1
        res.append(total % 10)
        carry = total // 10

    print(' '.join(map(str, res)))

if __name__ == "__main__":
    main()`,

    javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', line => lines.push(line.trim()));
rl.on('close', () => {
    let idx = 0;
    const n1 = parseInt(lines[idx++]);
    const a = n1 > 0 ? lines[idx++].split(' ').map(Number) : (idx++, []);
    const n2 = parseInt(lines[idx++]);
    const b = n2 > 0 ? lines[idx++].split(' ').map(Number) : (idx++, []);

    const res = [];
    let carry = 0, i = 0, j = 0;
    while (i < n1 || j < n2 || carry) {
        let sum = carry;
        if (i < n1) sum += a[i++];
        if (j < n2) sum += b[j++];
        res.push(sum % 10);
        carry = Math.floor(sum / 10);
    }
    console.log(res.join(' '));
});`
  }
});
