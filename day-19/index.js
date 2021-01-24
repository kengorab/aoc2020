const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb`

function processInput(input) {
  const [rulesInput, msgInput] = input.trim().split('\n\n')

  const pairs = rulesInput.trim().split('\n').map(l => {
    const [_n, rest] = l.split(': ')
    const n = _.parseInt(_n)

    if (rest[0] === '"') {
      return [n, { char: rest[1] }]
    } else {
      const ors = rest.split(' | ')
      return [n, { opts: ors.map(o => o.split(' ').map(_.parseInt)) }]
    }
  })
  const rules = Object.fromEntries(pairs)
  const msgs = msgInput.split('\n')
  return [rules, msgs]
}

const memo = {}
function buildRegex(r, rules) {
  const rule = rules[r]
  if (memo[r]) return memo[r]
  if (rule.char) return rule.char

  // Handle stars for part 2
  if (r === 8) {
    const regex = '(' + buildRegex(42, rules) + ')+'
    memo[r] = regex
    return regex
  } else if (r === 11) {
    const parts = []
    const r42 = buildRegex(42, rules)
    const r31 = buildRegex(31, rules)
    for (let i = 1; i < 5; i++) {
      parts.push('(' + r42 + `{${i}}` + r31 + `{${i}}` + ')')
    }
    const regex = '(' + parts.join('|') + ')'
    memo[r] = regex
    return regex
  }

  const regex = '(' + rule.opts.map(opt => {
    return opt.map(rid => {
      return buildRegex(rid, rules)
    }).join('')
  }).join('|') + ')'
  memo[r] = regex
  return regex
}


// function part1() {
//   const [rules, msgs] = processInput(realInput)
//   const R = new RegExp('^' + buildRegex(0, rules) + '$')
//
//   return msgs.filter(msg => R.test(msg)).length
// }
// console.log(part1()) // 291

function part2() {
  const [rules, msgs] = processInput(realInput)
  rules[8] = { opts: [[42], [42, 8]] }
  rules[11] = { opts: [[42, 31], [42, 11, 31]] }

  const R = new RegExp('^' + buildRegex(0, rules) + '$')
  return msgs.filter(msg => R.test(msg)).length
}
console.log(part2()) // 409
