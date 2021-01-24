const fs = require('fs')
const _ = require('lodash')

const realInput = '589174263'
const demoInput = '389125467'

const processInput = (input) => input.trim().split('\n')
  .flatMap(l => l.split(''))
  .map(_.parseInt)

function makeLL(cups) {
  const nodesMap = {}

  let head = null
  let tail = null
  for (const cup of cups) {
    const node = { label: cup, next: null }
    if (head === null) {
      head = node
      tail = node
    } else {
      tail.next = node
      tail = node
    }

    nodesMap[cup] = node
  }
  tail.next = head

  return [nodesMap, head]
}

function destCup(curCup, removedNums, numCups) {
  let dest = curCup - 1 < 1 ? numCups : curCup - 1
  while (removedNums.includes(dest)) {
    dest -= 1
  }
  return dest < 1 ? numCups : dest
}

function part1() {
  const cups = processInput(realInput)
  const numCups = cups.length

  let [nodesMap, head] = makeLL(cups)

  for (let m = 0; m < 100; m++) {
    const currentCup = head

    const firstCup = head.next
    const thirdCup = head.next.next.next
    const removedNums = [head.next.label, head.next.next.label, head.next.next.next.label]
    head.next = thirdCup.next

    const destNum = destCup(currentCup.label, removedNums, numCups)
    head = nodesMap[destNum]
    thirdCup.next = head.next
    head.next = firstCup

    head = currentCup.next
  }

  head = nodesMap[1].next
  let i = 1
  let ret = ''
  while (i < numCups) {
    ret += head.label
    head = head.next
    i++
  }
  return ret
}
console.log(part1()) // 43896725

function part2() {
  const cups = processInput(realInput)
  for (let i = Math.max(...cups) + 1; i <= 1000000; i++) {
    cups.push(i)
  }
  const numCups = cups.length

  let [nodesMap, head] = makeLL(cups)

  for (let m = 0; m < 10000000; m++) {
    const currentCup = head

    const firstCup = head.next
    const thirdCup = head.next.next.next
    const removedNums = [head.next.label, head.next.next.label, head.next.next.next.label]
    head.next = thirdCup.next

    const destNum = destCup(currentCup.label, removedNums, numCups)
    head = nodesMap[destNum]
    thirdCup.next = head.next
    head.next = firstCup

    head = currentCup.next
  }

  head = nodesMap[1]
  const f1 = head.next.label
  const f2 = head.next.next.label
  return f1 * f2
}
console.log(part2()) // 2911418906
