const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
abc

a
b
c

ab
ac

a
a
a
a

b
`

// function part1() {
//   const nums = realInput.trim().split('\n\n').map(group => {
//     return new Set(group.split('\n').join('').split('')).size
//   })
//   return nums.reduce((acc, n) => acc + n)
// }
// console.log(part1()) // 6799

function part2() {
  const nums = realInput.trim().split('\n\n').map(group => {
    const members = group.split('\n').map(m => m.split(''))
    return _.intersection(...members).length
  })
  return nums.reduce((acc, n) => acc + n)
}
console.log(part2()) // 3354
