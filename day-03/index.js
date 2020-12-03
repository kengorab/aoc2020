const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#
`

function processInput(input) {
  return input.trim().split('\n').map(l => {
    return l.split('')
  })
}

function numTreesAtSlope([dx, dy], map) {
  const [width, height] = [map[0].length, map.length]
  let [x, y] = [0, 0]
  let numTrees = 0

  while (y < height - 1) {
    x = (x + dx) % width
    y += dy
    if (map[y][x] === '#') {
      numTrees++
    }
  }
  return numTrees
}

function part1() {
  const map = processInput(realInput);
  return numTreesAtSlope([3, 1], map)
}
console.log(part1()) // 286

function part2() {
  const map = processInput(realInput);
  const slopes = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2]
  ]
  return slopes.map(sl => numTreesAtSlope(sl, map)).reduce((acc, i) => acc * i, 1)
}
console.log(part2()) // 3638606400
