const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })

function boardingNumberToSeatId(boardingNumber) {
  function binSearch(chars, max) {
    let v = 0
    let s = max
    for (const ch of chars) {
      s /= 2
      if (ch === 'B' || ch === 'R') v += s
    }

    return v
  }

  const chars = boardingNumber.split('')
  const frontOrBack = chars.slice(0, 7)
  const leftOrRight = chars.slice(7)

  const row = binSearch(frontOrBack, 128)
  const col = binSearch(leftOrRight, 8)
  return row * 8 + col
}

const seatIds = realInput.split('\n').map(boardingNumberToSeatId)

function part1() {
  return Math.max(...seatIds)
}
console.log(part1()) // 838

function part2() {
  const takenSeats = new Set(_.sortBy(seatIds))

  const numSeats = part1();
  for (let i = 0; i < numSeats; i++) {
    if (!takenSeats.has(i)) {
      if (takenSeats.has(i - 1) && takenSeats.has(i + 1)) {
        return i
      }
    }
  }
}
console.log(part2()) // 714
