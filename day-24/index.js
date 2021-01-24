const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew
`

function parseLine(line) {
  const dirs = []
  for (let i = 0; i < line.length; i++) {
    if (line[i] === 'e' || line[i] === 'w') {
      dirs.push(line[i])
    } else if (line[i] === 'n' || line[i] === 's') {
      const c = line[i]
      dirs.push(c + line[++i])
    }
  }
  return dirs
}

function processInput(input) {
  return input.trim().split('\n').map(l => parseLine(l))
}

// https://www.redblobgames.com/grids/hexagons
const hexCoord = {
  'e': [1, -1, 0],
  'w': [-1, 1, 0],
  'ne': [1, 0, -1],
  'nw': [0, 1, -1],
  'se': [0, -1, 1],
  'sw': [-1, 0, 1]
}

const ser = ([x, y, z]) => `${x},${y},${z}`
const collapsePath = path => path.map(seg => hexCoord[seg])
  .reduce((acc, n) => [acc[0] + n[0], acc[1] + n[1], acc[2] + n[2]])

function blackTiles(input) {
  const B = new Set()

  for (const path of input) {
    const coord = ser(collapsePath(path))
    if (B.has(coord)) {
      B.delete(coord)
    } else {
      B.add(coord)
    }
  }

  return B
}

function part1() {
  const input = processInput(realInput)
  return blackTiles(input).size
}
console.log(part1(realInput)) // 473

function part2() {
  const input = processInput(realInput)
  let room = blackTiles(input)

  function neighbors(coord) {
    const [cx, cy, cz] = coord.split(',').map(_.parseInt)
    const deltas = Object.values(hexCoord)
    return deltas.map(([x, y, z]) => ser([cx + x, cy + y, cz + z]))
  }

  function tick(room) {
    const oldRoom = [...room]
    const newRoom = new Set()

    const numLivingNeighborsPerCell = _.countBy(oldRoom.flatMap(coord => neighbors(coord)))
    for (const [coord, num] of Object.entries(numLivingNeighborsPerCell)) {
      if (room.has(coord)) {
        if (num === 1 || num === 2) {
          newRoom.add(coord)
        }
      } else {
        if (num === 2) {
          newRoom.add(coord)
        }
      }
    }

    return newRoom
  }

  for (let i = 0; i < 100; i++) {
    room = tick(room)
  }
  return room.size
}
console.log(part2()) // 4070
