const fs = require('fs')
const _ = require('lodash')

const input = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
// const input = `
// 1-3 a: abcde
// 1-3 b: cdefg
// 2-9 c: ccccccccc
// `
  .trim().split('\n').map(l => {
  const [n, letter, pw] = l.split(' ')
  const [hi, lo] = n.split('-').map(_.parseInt)
  return {
    range: [hi, lo],
    letter: letter.replace(':', ''),
    pw
  }
})

function part1() {
  function isPwValid({ range: [low, hi], letter, pw }) {
    const count = pw.split('').filter(c => c === letter).length
    return low <= count && count <= hi
  }

  return input.map(isPwValid).filter(Boolean).length
}
console.log(part1()) // 410

function part2() {
  function isPwValid({ range: [low, hi], letter, pw }) {
    const chars = pw.split('')
    return chars[low - 1] === letter ^ chars[hi - 1] === letter
  }

  return input.map(isPwValid).filter(Boolean).length
}
console.log(part2()) // 694
