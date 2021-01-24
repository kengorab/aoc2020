const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
// const demoInput = `
// class: 1-3 or 5-7
// row: 6-11 or 33-44
// seat: 13-40 or 45-50
//
// your ticket:
// 7,1,14
//
// nearby tickets:
// 7,3,47
// 40,4,50
// 55,2,20
// 38,6,12
// `
const demoInput = `
class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9
`

function processInput(input) {
  const [rules, myTicket, nearbyTickets] = input.trim().split('\n\n')
  return {
    rules: Object.fromEntries(
      rules.split('\n').map(line => {
        const [, rule, l1, h1, l2, h2] = /(\w+\s?\w*): (\d+)-(\d+) or (\d+)-(\d+)/.exec(line)
        return [rule, [[l1, h1].map(_.parseInt), [l2, h2].map(_.parseInt)]]
      })
    ),
    myTicket: myTicket.split('\n')[1].split(',').map(_.parseInt),
    nearbyTickets: nearbyTickets.split('\n').slice(1).map(l => l.split(',').map(_.parseInt))
  }
}

function part1() {
  const { rules, nearbyTickets } = processInput(realInput)
  let sum = 0

  const ranges = Object.values(rules).map(r => Object.values(r))
  for (const ticket of nearbyTickets) {
    for (const n of ticket) {
      const validForOne = ranges.some(([[l1, h1], [l2, h2]]) => {
        return ((l1 <= n && n <= h1) || (l2 <= n && n <= h2))
      })
      if (!validForOne) {
        sum += n
      }
    }
  }
  return sum
}
console.log(part1()) // 19070

function part2() {
  const { rules, myTicket, nearbyTickets } = processInput(realInput)
  const ruleRanges = Object.values(rules).map(r => Object.values(r))
  const validTickets = nearbyTickets.filter(nums => {
    return nums.every(n => ruleRanges.some(([[l1, h1], [l2, h2]]) => {
      return ((l1 <= n && n <= h1) || (l2 <= n && n <= h2))
    }))
  })

  const impossibleRules = _.range(0, myTicket.length).map(() => new Set())
  for (const t of validTickets) {
    for (let i = 0; i < t.length; i++) {
      const n = t[i]
      for (const [rule, [[l1, h1], [l2, h2]]] of Object.entries(rules)) {
        if (!((l1 <= n && n <= h1) || (l2 <= n && n <= h2))) {
          impossibleRules[i].add(rule)
        }
      }
    }
  }
  const allRules = Object.keys(rules)
  const possibleRules = impossibleRules.map((imm, idx) => [_.difference(allRules, [...imm]), idx])
  const sorted = _.sortBy(possibleRules, a => a[0].length)

  const ruleOrder = _.range(0, myTicket.length).map(() => null)
  for (const [possibilities, idx] of sorted) {
    ruleOrder[idx] = _.difference(possibilities, ruleOrder)[0]
  }

  const mine = Object.fromEntries(_.zip(ruleOrder, myTicket))
  return Object.entries(mine)
    .filter(([k]) => k.startsWith('departure'))
    .map(([,v]) => v)
    .reduce((acc, v) => acc * v)
}
console.log(part2()) // 161926544831
