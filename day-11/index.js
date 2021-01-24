const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL
`

function processInput(input) {
  return input.trim().split('\n').map(l => {
    return l.split('')
  })
}
function mapToString(map) {
  return map.map(row => {
    return row.join('')
  }).join('\n')
}
const map = processInput(realInput)

const height = map.length
const width = map[0].length

function part1() {
  function neighbors(map, [r, c]) {
    const deltas = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1],
    ]
    const neighbors = deltas.map(([dr, dc]) => {
      const R = r + dr
      const C = c + dc
      if (!map[R]) return
      return map[R][C]
    })
    return neighbors.filter(s => s === '#').length
  }

  function tick(map) {
    const newMap = _.cloneDeep(map)

    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        const seat = map[r][c]
        if (seat === '.') continue

        const numOccupiedNeighbors = neighbors(map, [r, c])
        if (seat === 'L') {
          if (numOccupiedNeighbors === 0) {
            newMap[r][c] = '#'
          }
        } else {
          if (numOccupiedNeighbors >= 4) {
            newMap[r][c] = 'L'
          }
        }
      }
    }

    return newMap
  }

  const seen = new Set([mapToString(map)])
  let m = map

  while (true) {
    m = tick(m)
    const str = mapToString(m)
    if (seen.has(str)) {
      break
    }
    seen.add(str)
  }

  return m.reduce((acc, row) => acc + row.filter(s => s === '#').length, 0)
}
console.log(part1()) // 2152

function part2() {
  function neighbors(map, [r, c]) {
    const deltas = [
      [-1, -1], [-1, 1], [1, 1], [1, -1], // Diags
      [1, 0], [-1, 0], [0, 1], [0, -1],
    ]
    const neighbors = deltas.map(([dr, dc]) => {
      let R = r, C = c
      while (true) {
        R = R + dr
        C = C + dc
        if (!map[R]) return '.'
        const seat = map[R][C]
        if (seat !== '.') return seat
      }
    })

    return neighbors.filter(s => s === '#').length
  }

  function tick(map) {
    const newMap = _.cloneDeep(map)

    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        const seat = map[r][c]
        if (seat === '.') continue

        const numOccupiedNeighbors = neighbors(map, [r, c])
        if (seat === 'L') {
          if (numOccupiedNeighbors === 0) {
            newMap[r][c] = '#'
          }
        } else {
          if (numOccupiedNeighbors >= 5) {
            newMap[r][c] = 'L'
          }
        }
      }
    }

    return newMap
  }

  const seen = new Set([mapToString(map)])
  let m = map

  while (true) {
    m = tick(m)
    const str = mapToString(m)
    if (seen.has(str)) {
      break
    }
    seen.add(str)
  }

  return m.reduce((acc, row) => acc + row.filter(s => s === '#').length, 0)
}
console.log(part2()) // 1937
