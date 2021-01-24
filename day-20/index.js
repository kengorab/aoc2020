const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...
`

function pixels2LTBR(pixels) {
  return {
    t: pixels[0].join(''),
    b: _.last(pixels).join(''),
    l: pixels.map(r => r[0]).join(''),
    r: pixels.map(r => _.last(r)).join('') ,
  }
}

function processInput(input) {
  return input.trim().split('\n\n').map(s => {
    const [label, ...rows] = s.split('\n')
    const [,id] = label.split(' ')
    const pixels = rows.map(r => r.split(''))
    return { id: _.parseInt(id), ...pixels2LTBR(pixels), pixels }
  })
}

const strRev = (str) => str.split('').reverse().join('')

function part1() {
  const tiles = processInput(realInput)
  const allEdges = tiles.flatMap(t => [t.t, t.b, t.l, t.r, strRev(t.t), strRev(t.b), strRev(t.l), strRev(t.r)])
  const edgeCount = _.countBy(allEdges)
  const corners = []

  for (const tile of tiles) {
    let numUniq = 0

    for (const edge of [tile.t, tile.b, tile.l, tile.r]) {
      if (edgeCount[edge] === 1) {
        numUniq++
      } else {
        console.assert(edgeCount[edge] === 2)
      }
    }
    if (numUniq === 2) {
      corners.push(tile)
    }
  }

  console.assert(corners.length === 4)
  return corners.reduce((acc, { id }) => acc * id, 1)
}
console.log(part1()) // 18411576553343

function part2() {
  const tiles = processInput(realInput)
  const remaining = new Set(tiles.map(({ id }) => id))
  const allEdges = tiles.flatMap(t => [t.t, t.b, t.l, t.r, strRev(t.t), strRev(t.b), strRev(t.l), strRev(t.r)])
  const edgeCount = _.countBy(allEdges)

  function flipTB({ id, pixels }) {
    const flippedPixels = [...pixels].reverse()
    return { id, pixels: flippedPixels, ...pixels2LTBR(flippedPixels) }
  }

  function flipLR({ id, pixels }) {
    const flippedPixels = pixels.map(r => [...r].reverse())
    return { id, pixels: flippedPixels, ...pixels2LTBR(flippedPixels) }
  }

  const transpose = (M) => _.zip(...M).map(row => row.reverse())

  function rotateCW({ id, pixels }) {
    const rotatedPixels = transpose(pixels)
    return { id, pixels: rotatedPixels, ...pixels2LTBR(rotatedPixels) }
  }

  function findFirstCorner() {
    for (let tile of tiles) {
      let uniq = ''

      for (const [edge, s] of [[tile.t, 't'], [tile.b, 'b'], [tile.l, 'l'], [tile.r, 'r']]) {
        if (edgeCount[edge] === 1) {
          uniq += s
        } else { console.assert(edgeCount[edge] === 2) }
      }

      if (uniq.length === 2) {
        if (uniq.includes('b')) {
          tile = flipTB(tile)
        }
        if (uniq.includes('r')) {
          tile = flipLR(tile)
        }
        return tile
      }
    }
  }

  const transformations = [
    _.identity, rotateCW, _.flowRight(rotateCW, rotateCW), _.flowRight(rotateCW, rotateCW, rotateCW),
    flipTB, _.flowRight(rotateCW, flipTB), _.flowRight(rotateCW, rotateCW, flipTB), _.flowRight(rotateCW, rotateCW, rotateCW, flipTB)
  ]

  function findAdj(tile, on = 'right') {
    for (let t of tiles) {
      if (!remaining.has(t.id)) continue

      for (const tr of transformations) {
        const transformed = tr(t)
        if (on === 'right') {
          if (tile.r === transformed.l) return transformed
        } else if (on === 'bottom') {
          if (tile.b === transformed.t) return transformed
        } else {
          console.assert(false)
        }
      }
    }
    return null
  }

  const puzzle = []
  let tile = findFirstCorner()
  remaining.delete(tile.id)

  let adj
  let row = [tile]
  while (adj = findAdj(tile, 'right')) {
    row.push(adj)
    tile = adj
    remaining.delete(tile.id)
  }
  puzzle.push(row)

  tile = row[0]
  while (adj = findAdj(tile, 'bottom')) {
    row = [adj]
    tile = adj
    remaining.delete(tile.id)

    while (adj = findAdj(tile, 'right')) {
      row.push(adj)
      tile = adj
      remaining.delete(tile.id)
    }

    tile = row[0]
    puzzle.push(row)
  }

  const stitchedPuzzle = puzzle.flatMap(row => {
    const rowTiles = row.map(({ pixels }) => {
      const middle = pixels.slice(1, pixels.length - 1)
      return middle.map(row => {
        return row.slice(1, row.length - 1).join('')
      })
    })

    return _.zip(...rowTiles).map(row => row.join('').split(''))
  })

  const seaMonster = `
..................#.
#....##....##....###
.#..#..#..#..#..#...
`.trim().split('\n').map(r => r.split(''))
  const windowH = seaMonster.length
  const windowW = seaMonster[0].length

  function findSeaMonsters(image) {
    let numSeaMonsters = 0

    function isMonsterAt(y, x) {
      for (let sr = 0; sr < windowH; sr++) {
        for (let sc = 0; sc < windowW; sc++) {
          if (seaMonster[sr][sc] === '.') continue
          if (seaMonster[sr][sc] === '#') {
            if (image[y + sr][x + sc] !== '#') return false
          }
        }
      }
      return true
    }

    for (let r = 0; r + windowH < image.length; r++) {
      for (let c = 0; c + windowW < image[0].length; c++) {
        if (isMonsterAt(r, c)) {
          numSeaMonsters++
        }
      }
    }
    return numSeaMonsters
  }

  const stitchedImage = { pixels: stitchedPuzzle }
  for (const tr of transformations) {
    const img = tr(stitchedImage).pixels
    const numSeaMonsters = findSeaMonsters(img)
    if (numSeaMonsters > 0) {
      const numHashesInImg = img.reduce((acc, row) => acc + row.filter(c => c === '#').length, 0)
      const numHashesInSeaMonster = seaMonster.reduce((acc, row) => acc + row.filter(c => c === '#').length, 0)
      return numHashesInImg - numSeaMonsters * numHashesInSeaMonster
    }
  }
}
console.log(part2()) // 2002
