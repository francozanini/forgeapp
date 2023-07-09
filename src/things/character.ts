import {raise} from './utils.ts'

export type Character = {
  race: {darkVision: number; name: string; walkingSpeed: number}
  name: string
  hp: {total: number; current: number; temp: number}
  savingThrowsProficiency: {
    strength: boolean
    wisdom: boolean
    constitution: boolean
    dexterity: boolean
    charisma: boolean
    intelligence: boolean
  }
  attributes: {
    str: number
    wis: number
    con: number
    dex: number
    cha: number
    int: number
  }
  inspired: boolean
  inventory: any[]
  clazz: {hitDice: number; lvl: number; name: string}
}

export function attributesList(attributes: Character['attributes']) {
  return [
    {name: 'strength', val: attributes.str},
    {name: 'dexterity', val: attributes.dex},
    {name: 'constitution', val: attributes.con},
    {name: 'intelligence', val: attributes.int},
    {name: 'wisdom', val: attributes.wis},
    {name: 'charisma', val: attributes.cha},
  ] as const
}

export function savingThrows(
  attributes: Character['attributes'],
  savingThrowsProficiency: Character['savingThrowsProficiency'],
) {
  return attributesList(attributes).map(attr => ({
    ...attr,
    isProficient: savingThrowsProficiency[attr.name],
  }))
}

export function proficiency(character: Character) {
  return character.clazz.lvl < 5 ? 2 : raise('Implement proficiency')
}

export function savingThrowBonus({
  val,
  isProficient,
  proficiency,
}: {
  val: number
  isProficient: boolean
  proficiency: number
}) {
  return skillBonus(val) + (isProficient ? proficiency : 0)
}

export function skillBonus(attribute: number) {
  return Math.floor((attribute - 10) / 2)
}

export function ac(character: Character) {
  return skillBonus(character.attributes.dex) + 10
}
