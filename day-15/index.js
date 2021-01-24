const fs = require('fs')
const _ = require('lodash')

const realInput = '12,1,16,3,11,0'
const demoInput = `
0,3,6
`

function processInput(input) {
  return input.trim().split('\n').map(l => {
    return l.split(',').map(_.parseInt)
  })[0]
}

function run(numRounds) {
  const nums = processInput(realInput)
  const spoken = Object.fromEntries(nums.map((n, i) => [n, [i + 1]]))

  let turn = nums.length + 1
  let n = _.last(nums)
  while (true) {
    if (spoken[n].length === 1) {
      n = 0
    } else {
      const [t1, t2] = spoken[n]
      n = t2 - t1
    }

    if (turn % 100000 === 0) {
      console.log('turn:', turn)
    }

    if (turn === numRounds) {
      return n
    }

    if (!spoken[n]) {
      spoken[n] = [turn]
    } else {
      spoken[n] = [_.last(spoken[n]), turn]
    }
    turn += 1
  }
}
console.log(run(2020)) // 1692
console.log(run(30000000)) // 37385
