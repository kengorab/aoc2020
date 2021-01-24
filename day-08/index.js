const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6
`

function processInput(input) {
  return input.trim().split('\n').map(l => {
    const [instr, amt] = l.split(' ')
    return [instr, _.parseInt(amt)]
  })
}

function interpret(instrs) {
  const seen = new Set([])
  let ip = 0
  let acc = 0

  while (true) {
    if (seen.has(ip)) {
      return acc
    }
    seen.add(ip)

    if (!instrs[ip]) return acc

    const [inst, amt] = instrs[ip++]
    switch (inst) {
      case 'acc':
        acc += amt
        break
      case 'jmp':
        ip += amt - 1
        break
      case 'nop':
        break
    }
  }
}

function part1() {
  const instrs = processInput(realInput)
  return interpret(instrs)
}
console.log(part1()) // 1331

function part2() {
  function getPossibilities(instrs) {
    return instrs.map((x, idx) => [x, idx])
      .filter(([[inst]]) => inst === 'jmp' || inst === 'nop')
      .map(([, idx]) => idx)
  }

  const instrs = processInput(realInput)
  const possibilities = getPossibilities(instrs).map(idx => {
    const copy = _.cloneDeep(instrs)
    if (copy[idx][0] === 'jmp') {
      copy[idx][0] = 'nop'
    } else {
      copy[idx][0] = 'jmp'
    }
    return copy
  })

  for (const instrs of possibilities) {
    const res = interpret(instrs)
    if (res) {
      return res
    }
  }
}

console.log(part2()) // 1121
