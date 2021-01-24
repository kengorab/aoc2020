const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))
`

function processInput(input) {
  return input.trim().split('\n')
}

function wonkyMath(input, getPrec) {
  const tokens = input.replace(/\s/g, '').split('')
  let idx = 0
  const next = () => tokens[idx++]
  const peek = () => tokens[idx]

  function parsePrec(prec) {
    const prefixTok = next();

    let left = null
    if (/\d+/.test(prefixTok)) {
      left = _.parseInt(prefixTok)
    } else if (prefixTok === '(') {
      left = parseGroup()
    }

    while (true) {
      const infixTok = peek()
      const nextPrec = getPrec(infixTok)
      if (!infixTok || !nextPrec || prec >= nextPrec) break

      left = parseInfix(left, next())
    }

    return left
  }

  function parseGroup() {
    const v = parsePrec(1)
    next() // consume ')'
    return v
  }

  function parseInfix(left, op) {
    const opPrec = getPrec(op)
    if (op === '+') return left + parsePrec(opPrec)
    if (op === '-') return left - parsePrec(opPrec)
    if (op === '*') return left * parsePrec(opPrec)
    if (op === '/') return left / parsePrec(opPrec)
  }

  return parsePrec(1)
}

function part1() {
  const lines = processInput(realInput)

  const getPrec = t => {
    if (/\d+/.test(t)) return 1
    if (/[+-]/.test(t)) return 2
    if (/[*/]/.test(t)) return 2
    if (/\(/.test(t)) return 4
    return null
  }

  return _.sum(lines.map(line => wonkyMath(line, getPrec)))
}
console.log(part1()) // 21022630974613

function part2() {
  const lines = processInput(realInput)

  const getPrec = t => {
    if (/\d+/.test(t)) return 1
    if (/[+-]/.test(t)) return 3  // < Normal precedence flipped
    if (/[*/]/.test(t)) return 2  // <
    if (/\(/.test(t)) return 4
    return null
  }

  return _.sum(lines.map(line => wonkyMath(line, getPrec)))
}
console.log(part2()) // 169899524778212
