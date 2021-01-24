const fs = require('fs')
const _ = require('lodash')

const pubKey1 = 3248366
const pubKey2 = 4738476

function determineLoopSize(key) {
  let numLoops = 0
  let subject = 1

  while (true) {
    numLoops += 1
    subject = (subject * 7) % 20201227
    if (subject === key) return numLoops
  }
}

// console.log(determineLoopSize(5764801)) // 8
// console.log(determineLoopSize(17807724)) // 11

function transform(subject, numLoops) {
  let res = 1
  for (let i = 0; i < numLoops; i++) {
    res = (res * subject) % 20201227
  }
  return res
}

// console.log(transform(7, 8)) // 5764801
// console.log(transform(7, 11)) // 17807724
//
// console.log(transform(5764801, 11)) // 14897079
// console.log(transform(17807724, 8)) // 14897079

function part1() {
  // const l1 = determineLoopSize(pubKey1)
  const l2 = determineLoopSize(pubKey2)

  return transform(pubKey1, l2)
}
console.log(part1()) // 18293391