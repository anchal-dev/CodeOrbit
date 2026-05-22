/**
 * rotateImageTemplate.js — LeetCode #48: Rotate Image
 *
 * Rotate an n×n matrix 90° clockwise IN PLACE.
 * Algorithm: (1) Transpose the matrix, (2) Reverse each row.
 *
 * Input format (stdin):
 *   Line 1: n
 *   Next n lines: space-separated integers (each row of the matrix)
 *
 * Output format (stdout):
 *   n lines of space-separated integers (rotated matrix)
 */
module.exports = (problem) => ({
  explanation: `Rotate an n×n matrix 90 degrees clockwise in place.\nFirst transpose (swap matrix[i][j] with matrix[j][i]), then reverse each row.`,
  approach: `Two-pass in-place approach:\n1. Transpose: for i in 0..n, for j in i+1..n swap matrix[i][j] and matrix[j][i].\n2. Reverse each row: reverse the elements of every row.`,
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',
  code: {
    cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    cin >> n;
    vector<vector<int>> matrix(n, vector<int>(n));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> matrix[i][j];

    // Step 1: Transpose
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            swap(matrix[i][j], matrix[j][i]);

    // Step 2: Reverse each row
    for (int i = 0; i < n; i++)
        reverse(matrix[i].begin(), matrix[i].end());

    // Output
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (j > 0) cout << " ";
            cout << matrix[i][j];
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
        int[][] matrix = new int[n][n];
        for (int i = 0; i < n; i++) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            for (int j = 0; j < n; j++)
                matrix[i][j] = Integer.parseInt(st.nextToken());
        }

        // Step 1: Transpose
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++) {
                int tmp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = tmp;
            }

        // Step 2: Reverse each row
        for (int i = 0; i < n; i++) {
            int lo = 0, hi = n - 1;
            while (lo < hi) {
                int tmp = matrix[i][lo];
                matrix[i][lo] = matrix[i][hi];
                matrix[i][hi] = tmp;
                lo++; hi--;
            }
        }

        // Output
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (j > 0) sb.append(" ");
                sb.append(matrix[i][j]);
            }
            sb.append("\\n");
        }
        System.out.print(sb);
    }
}`,

    python: `import sys
input = sys.stdin.readline

def main():
    n = int(input())
    matrix = []
    for _ in range(n):
        row = list(map(int, input().split()))
        matrix.append(row)

    # Step 1: Transpose
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]

    # Step 2: Reverse each row
    for row in matrix:
        row.reverse()

    # Output
    for row in matrix:
        print(*row)

if __name__ == "__main__":
    main()`,

    javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', line => lines.push(line.trim()));
rl.on('close', () => {
    const n = parseInt(lines[0]);
    const matrix = [];
    for (let i = 0; i < n; i++) {
        matrix.push(lines[i + 1].split(' ').map(Number));
    }

    // Step 1: Transpose
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }

    // Step 2: Reverse each row
    for (let i = 0; i < n; i++) {
        matrix[i].reverse();
    }

    // Output
    for (let i = 0; i < n; i++) {
        console.log(matrix[i].join(' '));
    }
});`
  }
});
