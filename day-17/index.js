const fs = require('fs')
require('lodash.product')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
.#.
..#
###
`

const mkCoord = (x, y, ...rest) => {
  const z = rest[0] || 0
  if (rest[1] !== null || rest[1] !== undefined) {
    const w = rest[1] || 0
    return `${x},${y},${z},${w}`
  } else {
    return `${x},${y},${z}`
  }
}

function processInput(input, numDimens = 3) {
  const coords = input.trim().split('\n')
    .flatMap((l, r) => {
      return l.split('')
        .map((cell, c) => cell === '#' ? mkCoord(c, r, ...Array(numDimens - 2).fill(0)) : null)
    })
  return new Set(_.compact(coords))
}

function neighbors(coord, numDimens = 3) {
  return _.product(...Array(numDimens).fill([-1, 0, 1]))
    .filter(deltas => !_.isEqual(deltas, Array(numDimens).fill(0)))
    .map(deltas => {
      const coords = _.zip(coord.split(',').map(_.parseInt), deltas).map(([c, dc]) => c + dc)
      return mkCoord(...coords)
    })
}

function tick(space, numDimens ) {
  const oldSpace = [...space]
  const newSpace = new Set()

  const numLivingNeighborsPerCell = _.countBy(oldSpace.flatMap(coord => neighbors(coord, numDimens)))
  oldSpace.forEach(coord => {
    if (numLivingNeighborsPerCell[coord] === 2 || numLivingNeighborsPerCell[coord] === 3) {
      newSpace.add(coord)
    }
  })
  Object.entries(numLivingNeighborsPerCell)
    .filter(([coord, num]) => !space.has(coord) && num === 3)
    .forEach(([coord]) => newSpace.add(coord))

  return newSpace
}

function part1() {
  let space = processInput(realInput)
  for (let i = 0; i < 6; i++) {
    space = tick(space, 3)
  }
  return space.size
}
console.log(part1()) // 291

function part2() {
  let space = processInput(realInput, 4)
  for (let i = 0; i < 6; i++) {
    space = tick(space, 4)
  }
  return space.size
}
console.log(part2()) // 1524
