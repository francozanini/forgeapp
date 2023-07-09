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
  skillProficiencies: {
    // give me all dnd 5e skills as keys and booleans as values.
    // e.g. {acrobatics: true, animalHandling: false, ...}
    acrobatics: boolean
    animalHandling: boolean
    arcana: boolean
    athletics: boolean
    deception: boolean
    history: boolean
    insight: boolean
    intimidation: boolean
    investigation: boolean
    medicine: boolean
    nature: boolean
    perception: boolean
    performance: boolean
    persuasion: boolean
    religion: boolean
    sleightOfHand: boolean
    stealth: boolean
    survival: boolean
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

export function getCharacter(): Character {
  return {
    name: 'Barthoz',
    race: {
      name: 'goblin',
      walkingSpeed: 30,
      darkVision: 60,
    },
    clazz: {
      name: 'artificer',
      lvl: 2,
      hitDice: 8,
    },
    attributes: {
      str: 11,
      dex: 14,
      con: 14,
      int: 17,
      wis: 11,
      cha: 12,
    },
    skillProficiencies: {
      acrobatics: false,
      animalHandling: false,
      arcana: true,
      athletics: false,
      deception: false,
      history: false,
      insight: false,
      intimidation: false,
      investigation: true,
      medicine: false,
      nature: false,
      perception: false,
      performance: false,
      persuasion: false,
      religion: false,
      sleightOfHand: false,
      stealth: false,
      survival: false,
    },
    hp: {
      total: 19,
      current: 14,
      temp: 0,
    },
    inspired: false,
    inventory: [],
    savingThrowsProficiency: {
      strength: false,
      dexterity: false,
      constitution: true,
      intelligence: true,
      wisdom: false,
      charisma: false,
    },
  }
}
