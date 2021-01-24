const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576
`

function processInput(input) {
  return input.trim().split('\n').map(l =>  _.parseInt(l))
}
const nums = processInput(realInput)

function part1() {
  function isSumOf2(ns, n) {
    const nums = new Set(ns)
    for (const _n of ns) {
      if (nums.has(n - _n)) return true
    }
    return false
  }

  let windowSize = 25
  let idx = windowSize
  let window = nums.slice(0, windowSize)

  while (isSumOf2(window, nums[idx])) {
    idx++
    window = nums.slice(idx - windowSize, idx)
  }
  return nums[idx]
}
console.log(part1()) // 675280050

function part2() {
  const num = part1()

  let [start, end] = [0, 2]

  // Performance? Where we're going, we don't need performance
  while (start < nums.length) {
    while (end < nums.length) {
      const slice = nums.slice(start, end)
      if (_.sum(slice) === num) {
        return _.min(slice) + _.max(slice)
      }
      end++
    }
    start++
    end = start + 2
  }
}
console.log(part2()) // 96081673