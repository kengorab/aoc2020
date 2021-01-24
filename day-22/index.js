const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10
`

function processInput(input) {
  return input.trim().split('\n\n').map(s => {
    const [,...cards] = s.split('\n').map(_.parseInt)
    return cards
  })
}

function score(p1, p2) {
  const winner = p1.length === 0 ? p2 : p1
  return winner.reduce((acc, c, idx) => acc + c * (winner.length - idx), 0)
}

function part1() {
  const [p1, p2] = processInput(realInput)

  while (p1.length !== 0 && p2.length !== 0) {
    const c1 = p1.shift()
    const c2 = p2.shift()

    if (c1 > c2) {
      p1.push(c1, c2)
    } else {
      p2.push(c2, c1)
    }
  }

  return score(p1, p2)
}
console.log(part1()) // 33010

function part2() {
  const [p1, p2] = processInput(realInput)

  const serialize = (p1, p2) => p1.join(',') + '|' + p2.join(',')

  function playGame(p1, p2, subGame = 1) {
    const memo = new Set()

    while (p1.length !== 0 && p2.length !== 0) {
      if (memo.has(serialize(p1, p2))) {
        return 1
      }
      memo.add(serialize(p1, p2))

      const c1 = p1.shift()
      const c2 = p2.shift()

      if (c1 <= p1.length && c2 <= p2.length) {
        const newP1 = [...p1.slice(0, c1)]
        const newP2 = [...p2.slice(0, c2)]
        const subGameWinner = playGame(newP1, newP2, subGame + 1)
        if (subGameWinner === 1) {
          p1.push(c1, c2)
        } else {
          p2.push(c2, c1)
        }
      } else {
        if (c1 > c2) {
          p1.push(c1, c2)
        } else {
          p2.push(c2, c1)
        }
      }
    }
    return p1.length !== 0 ? 1 : 2
  }

  playGame(p1, p2)
  return score(p1, p2)
}
console.log(part2()) // 32769
