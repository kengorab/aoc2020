const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in
`

function processInput(input) {
  return input.trim().split('\n\n').map(pp => {
    const pairs = pp.split('\n').join(' ').split(' ')
    return pairs.map(p => p.split(':')).reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
  })
}

function part1() {
  function isValid(passport) {
    const keys = new Set(Object.keys(passport))
    return ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'].every(f => keys.has(f))
  }

  const passports = processInput(realInput)
  return passports.filter(isValid).length
}
console.log(part1()) // 204

function part2() {
  function between(n, l, h) {
    if (!n) return false
    return l <= n && n <= h
  }

  const rules = {
    'byr': ({ byr }) => between(byr, 1920, 2002),
    'iyr': ({ iyr }) => between(iyr, 2010, 2020),
    'eyr': ({ eyr }) => between(eyr, 2020, 2030),
    'hgt': ({ hgt }) => {
      const match = /([0-9]+)(in|cm)$/.exec(hgt)
      if (!match) return false

      const [, amt, unit] = match
      if (unit === 'in') return between(amt, 59, 76)
      else return between(amt, 150, 193)
    },
    'hcl': ({ hcl }) => /#[\da-f]{6}/.test(hcl),
    'ecl': ({ ecl }) => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(ecl),
    'pid': ({ pid }) => /\b\d{9}\b/.test(pid),
    'cid': () => true
  }

  function isValid(passport) {
    for (const rule of Object.values(rules)) {
      if (!rule(passport)) return false
    }
    return true
  }

  const passports = processInput(realInput)
  return passports.filter(isValid).length
}
console.log(part2()) // 179
