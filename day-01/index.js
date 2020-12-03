const fs = require('fs')
const _ = require('lodash')

const input = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
  .trim().split('\n').map(_.parseInt)
// const input = `
// 1721
// 979
// 366
// 299
// 675
// 1456
// `.trim().split('\n').map(_.parseInt)

function part1() {
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input.length; j++) {
      if (i === j) continue

      if (input[i] + input[j] === 2020) {
        return input[i] * input[j]
      }
    }
  }
}

console.log(part1()) // 197451

function part2() {
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input.length; j++) {
      for (let k = 0; k < input.length; k++) {
        if (i === j || j === k || k === i) continue

        if (input[i] + input[j] + input[k] === 2020) {
          return input[i] * input[j] * input[k]
        }
      }
    }
  }
}

console.log(part2()) // 138233720