const fs = require('fs')
require('lodash.product')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)
`

function processInput(input) {
  return input.trim().split('\n').map(l => {
    const [ingredients, allergens] = l.split(' (contains ')
    return {
      ingredients: ingredients.split(' '),
      allergens: allergens.replace(')', '').split(', ')
    }
  })
}

function getPossibilities(input) {
  const possibilities = {}
  for (const { ingredients, allergens } of input) {
    for (const allergen of allergens) {
      if (!possibilities[allergen]) {
        possibilities[allergen] = ingredients
      } else {
        possibilities[allergen] = _.intersection(possibilities[allergen], ingredients)
      }
    }
  }
  return possibilities
}

function part1() {
  const input = processInput(realInput)
  const possibilities = getPossibilities(input)
  const allIngs = input.flatMap(({ ingredients }) => ingredients)

  const possibleAllergicIngs = _.uniq(_.flatten(Object.values(possibilities)))
  const safeIngs = _.difference(_.uniq(allIngs), possibleAllergicIngs)

  const ingCounts = _.countBy(allIngs)
  return safeIngs.reduce((acc, i) => acc + ingCounts[i], 0)
}
console.log(part1()) // 2324

function part2() {
  const input = processInput(realInput)
  const possibilities = getPossibilities(input)

  const known = {}
  while (_.size(known) !== _.size(possibilities)) {
    for (const [allergen, ings] of Object.entries(possibilities)) {
      if (ings.length === 1) {
        known[allergen] = ings[0]
      } else {
        possibilities[allergen] = ings.filter(ing => !Object.values(known).includes(ing))
      }
    }
  }

  return _.sortBy(Object.entries(known), ([k]) => k)
    .map(([, v]) => v)
    .join(',')
}
console.log(part2()) // bxjvzk,hqgqj,sp,spl,hsksz,qzzzf,fmpgn,tpnnkc
