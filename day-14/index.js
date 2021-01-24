const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
// const demoInput1 = `
// mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
// mem[8] = 11
// mem[7] = 101
// mem[8] = 0
// `
const demoInput2 = `
mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1
`

function processInput(input) {
  return input.trim().split('\n').map(l => {
    const [action, value] = l.split(' = ')
    if (action === 'mask') {
      return { mask: value }
    } else {
      return {
        addr: _.parseInt(action.replace('mem[', '').replace(']', '')),
        val: _.parseInt(value)
      }
    }
  })
}

// function part1() {
//   const mem = {}
//   const actions = processInput(realInput)
//
//   let mask = ''
//   for (const action of actions) {
//     if (action.mask) {
//       mask = action.mask
//     } else {
//       const { addr, val } = action
//       const bits = val.toString(2).padStart(36, '0').split('')
//       for (let i = mask.length - 1; i >= 0; i--) {
//         const bit = mask[i]
//         if (bit === 'X') continue
//         bits[i] = bit
//       }
//       mem[addr] = parseInt(bits.join(''), 2)
//     }
//   }
//   return _.sum(Object.values(mem))
// }
// console.log(part1()) // 10717676595607

function part2() {
  const mem = {}
  const actions = processInput(realInput)

  let mask = ''
  for (const action of actions) {
    if (action.mask) {
      mask = action.mask
    } else {
      const { addr, val } = action
      const baseAddr = addr.toString(2).padStart(36, '0').split('')
      for (let i = mask.length - 1; i >= 0; i--) {
        const maskBit = mask[i]
        if (maskBit !== '0')
          baseAddr[i] = maskBit
      }

      const numXs = baseAddr.filter(b => b === 'X').length
      const substitutions = _.range(0, Math.pow(2, numXs)).map(n => n.toString(2).padStart(numXs, '0').split(''))

      const addrs = substitutions.map(sub => {
        const addr = [...baseAddr]
        let idx = addr.indexOf('X')
        let n = 0
        while (idx >= 0) {
          addr[idx] = sub[n]
          idx = addr.indexOf('X')
          n+=1
        }
        return addr
      })

      for (const a of addrs) {
        const addr = parseInt(a.join(''), 2)
        mem[addr] = val
      }
    }
  }
  return _.sum(Object.values(mem))
}
console.log(part2()) // 3974538275659
