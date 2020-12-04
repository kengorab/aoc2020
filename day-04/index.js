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
    const reqFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']
    const reqOptFields = [...reqFields, 'cid']
    const ppKeys = new Set(Object.keys(passport))
    return _.isEqual(new Set(reqFields), ppKeys) || _.isEqual(new Set(reqOptFields), ppKeys)
  }

  const passports = processInput(realInput)
  return passports.filter(isValid).length
}

console.log(part1()) // 204

function part2() {
  const rules = {
    'byr': ({ byr }) => !!byr && 1920 <= _.parseInt(byr) && _.parseInt(byr) <= 2002,
    'iyr': ({ iyr }) => !!iyr && 2010 <= _.parseInt(iyr) && _.parseInt(iyr) <= 2020,
    'eyr': ({ eyr }) => !!eyr && 2020 <= _.parseInt(eyr) && _.parseInt(eyr) <= 2030,
    'hgt': ({ hgt }) => {
      if (!hgt) return false

      const match = /([0-9]+)(in|cm)$/.exec(hgt)
      if (!match) return false

      const [, amt, unit] = match
      const num = _.parseInt(amt)
      if (unit === 'in') {
        return 59 <= num && num <= 76
      } else {
        return 150 <= num && num <= 193
      }
    },
    'hcl': ({ hcl }) => !!hcl && /#[0-9a-f]{6}/.test(hcl),
    'ecl': ({ ecl }) => !!ecl && ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(ecl),
    'pid': ({ pid }) => !!pid && /\b[0-9]{9}\b/.test(pid),
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
