const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.
`

function processInput(input) {
  const nodes = input.trim().split('\n').map(l => {
    const [modifier, color, _, __, ...rest] = l.split(' ')
    const bags = rest.join(' ').split(',').map(bags => {
      const [num, modifier, color, _] = bags.trim().split(' ')
      if (num === 'no') return null
      return { num: parseInt(num, 10), color: modifier + color }
    })
    return { color: modifier + color, bags: bags.filter(x => !!x) }
  })
  return nodes.reduce((acc, n) => ({ ...acc, [n.color]: n.bags }), {})
}

const nodes = processInput(realInput)

function part1() {
  function invertNodes(nodes, color) {
    const children = Object.entries(nodes)
      .filter(([_, v]) => v.find((node) => node.color === color))
      .map(([color]) => invertNodes(nodes, color))

    return { color, children }
  }

  function traverse(tree) {
    if (!tree.children.length) return []
    const childColors = tree.children.map(({ color }) => color)
    for (const child of tree.children) {
      childColors.push(...traverse(child))
    }
    return childColors
  }

  const inverted = invertNodes(nodes, 'shinygold')
  return new Set(traverse(inverted)).size
}
console.log(part1()) // 112

function part2() {
  function traverse(nodes, color) {
    const [, children] = Object.entries(nodes).find(([k]) => k === color)
    if (children.length === 0) return 0

    return children
      .map(({ num, color }) => num + num * traverse(nodes, color))
      .reduce((acc, n) => acc + n)
  }

  return traverse(nodes, 'shinygold')
}
console.log(part2()) // 6260
