const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
939
7,13,x,x,59,x,31,19
`

function part1() {
  const lines = realInput.trim().split('\n')
  const timestamp = _.parseInt(lines[0])
  const busIds = _.compact(lines[1].split(',').map(id => id !== 'x' ? _.parseInt(id) : null))

  let ts = timestamp
  while (true) {
    for (const busId of busIds) {
      if (ts % busId === 0) {
        return (ts - timestamp) * busId
      }
    }

    ts += 1
  }
}
console.log(part1()) // 4782

function part2() {
  const buses = realInput.trim()
    .split('\n')[1]
    .split(',')
    .map((id, idx) => [_.parseInt(id), idx])
    .filter(([id]) => !!id)

  let time = 0
  let [[increment], ...restBuses] = buses
  for (const [id, offset] of restBuses) {
    while (true) {
      time += increment
      if ((time + offset) % id === 0) break
    }
    increment *= id
  }

  return time
}
console.log(part2()) // 1118684865113056
