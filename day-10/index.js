const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
16
10
15
5
1
11
7
19
6
12
4
`

function processInput(input) {
  return input.trim().split('\n').map(l => _.parseInt(l))
}

const joltages = _.sortBy(processInput(realInput))
const sortedAdapters = [0, ...joltages, _.last(joltages) + 3]

function part1() {
  const diffs = [0, 0, 0, 0]
  for (let i = 0; i < sortedAdapters.length - 1; i++) {
    diffs[sortedAdapters[i + 1] - sortedAdapters[i]]++
  }
  return diffs[1] * diffs[3]
}
console.log(part1()) // 2574

function part2() {
  function buildDAG(adapters) {
    const nodes = {}

    for (let i = 0; i < adapters.length; i++) {
      const adapter = adapters[i]

      const edges = []
      let j = i + 1
      while (adapters[j] - adapters[i] <= 3) {
        edges.push(adapters[j])
        j++
      }

      if (edges.length)
        nodes[adapter] = { memo: 0, edges }
    }
    return nodes
  }

  const dag = buildDAG(sortedAdapters)
  const endValue = sortedAdapters[sortedAdapters.length - 2]

  function traverse(dag, start = 0) {
    const node = dag[start]

    if (!node.memo) {
      if (start === endValue) {
        node.memo = 1
      } else {
        node.memo = node.edges.reduce((acc, e) => acc + traverse(dag, e), 0)
      }
    }

    return node.memo
  }

  return traverse(dag)
}
console.log(part2()) // 2644613988352
