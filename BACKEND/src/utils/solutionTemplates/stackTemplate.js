/**
 * stackTemplate.js — Competitive programming (stdin/stdout) style.
 * Used for: Valid Parentheses, Longest Valid Parentheses, Monotonic Stack problems.
 */
module.exports = (problem) => ({
  explanation: `"${problem.title}" — Use a stack to track opening brackets or indices. Pop on matching closing bracket.`,
  approach: `Iterate through input, push to stack on open bracket, pop on matching close. Stack empty at end = valid.`,
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  code: {
    cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
    string s; cin >> s;
    stack<char> st;
    bool valid = true;
    for (char c : s) {
        if (c=='(' || c=='{' || c=='[') { st.push(c); }
        else {
            if (st.empty()) { valid = false; break; }
            char top = st.top(); st.pop();
            if ((c==')' && top!='(') || (c=='}' && top!='{') || (c==']' && top!='['))
                { valid = false; break; }
        }
    }
    if (!st.empty()) valid = false;
    cout << (valid ? "true" : "false") << endl;
    return 0;
}`,
    java: `import java.util.*;
import java.io.*;
public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine().trim();
        Deque<Character> stack = new ArrayDeque<>();
        boolean valid = true;
        for (char c : s.toCharArray()) {
            if (c=='(' || c=='{' || c=='[') stack.push(c);
            else {
                if (stack.isEmpty()) { valid = false; break; }
                char top = stack.pop();
                if ((c==')' && top!='(') || (c=='}' && top!='{') || (c==']' && top!='['))
                    { valid = false; break; }
            }
        }
        if (!stack.isEmpty()) valid = false;
        System.out.println(valid ? "true" : "false");
    }
}`,
    python: `import sys
input = sys.stdin.readline
def main():
    s = input().strip()
    stack = []
    match = {')':'(', '}':'{', ']':'['}
    for c in s:
        if c in '({[': stack.append(c)
        else:
            if not stack or stack[-1] != match[c]:
                print("false"); return
            stack.pop()
    print("true" if not stack else "false")
if __name__ == "__main__":
    main()`,
    javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', line => lines.push(line.trim()));
rl.on('close', () => {
    const s = lines[0];
    const stack = [];
    const match = {')':'(', '}':'{', ']':'['};
    let valid = true;
    for (const c of s) {
        if ('({['.includes(c)) stack.push(c);
        else {
            if (!stack.length || stack[stack.length-1] !== match[c]) { valid = false; break; }
            stack.pop();
        }
    }
    if (stack.length) valid = false;
    console.log(valid ? 'true' : 'false');
});`
  }
});
