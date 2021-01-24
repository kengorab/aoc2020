const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
F10
N3
F7
R90
F11
`

function processInput(input) {
  return input.trim().split('\n').map(l => {
    const [action, ...rest] = l.split('')
    return [action, _.parseInt(rest.join(''))]
  })
}
const instrs = processInput(realInput)

function part1() {
  const state = {
    dir: 1, // N -> 0, E -> 1, S -> 2, W -> 3
    x: 0,
    y: 0
  }

  for (const [action, amt] of instrs) {
    switch (action) {
      case 'N':
        state.y -= amt
        break
      case 'S':
        state.y += amt
        break
      case 'E':
        state.x += amt
        break
      case 'W':
        state.x -= amt
        break
      case 'L':
      case 'R':
        state.dir = (state.dir + 4 + (action === 'L' ? -1 : 1) * (amt / 90)) % 4
        break
      case 'F':
        switch (state.dir) {
          case 0:
            state.y -= amt
            break
          case 1:
            state.y += amt
            break
          case 2:
            state.x += amt
            break
          case 3:
            state.x -= amt
            break
        }
    }
  }

  return Math.abs(state.x) + Math.abs(state.y)
}
console.log(part1()) // 562

function part2() {
  const state = {
    wpx: 10,
    wpy: -1,
    x: 0,
    y: 0
  }

  for (const [action, amt] of instrs) {
    switch (action) {
      case 'N':
        state.wpy -= amt
        break
      case 'S':
        state.wpy += amt
        break
      case 'E':
        state.wpx += amt
        break
      case 'W':
        state.wpx -= amt
        break
      case 'L':
      case 'R':
        const rot = (amt / 90) % 4
        const n = action === 'L' ? -1 : 1
        if (rot === 0) continue
        if (rot === 2) {
          state.wpx = -state.wpx
          state.wpy = -state.wpy
        } else {
          const tmp = state.wpx
          state.wpx = n * state.wpy * (rot === 1 ? -1 : 1)
          state.wpy = n * tmp * (rot === 3 ? -1 : 1)
        }
        break
      case 'F':
        state.x += amt * state.wpx
        state.y += amt * state.wpy
    }
  }
  return Math.abs(state.x) + Math.abs(state.y)
}
console.log(part2()) // 101860