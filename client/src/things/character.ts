import {raise} from './utils.ts'

export type Item = {
  name: string
  weight: number
  quantity: number
  description: string
  cost: number
  worn?: boolean
  type: 'gear' | 'weapon' | 'armor' | 'tool' | 'consumable' | 'loot'
  subtype?:
    | (
        | 'ammunition'
        | 'finesse'
        | 'thrown'
        | 'two-handed'
        | 'versatile'
        | 'improvised'
        | 'natural'
        | 'siege'
        | 'special'
        | 'adventuring gear'
      )
    | ArmorType
    | WeaponType
}

type ArmorType = 'light' | 'medium' | 'heavy' | 'shield'
type WeaponType = 'simple' | 'firearms' | 'martial'
type Tools =
  | "Alchemist's supplies"
  | 'Disguise Kit'
  | "Smith's Tools"
  | 'Thieves Tools'
  | "Tinker's Tools"
type Language = 'Common' | 'Goblin'

export type Attributes = {
  str: number
  wis: number
  con: number
  dex: number
  cha: number
  int: number
}

export type SkillProficiencies = {
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

export type SavingThrowsProficiency = {
  strength: boolean
  wisdom: boolean
  constitution: boolean
  dexterity: boolean
  charisma: boolean
  intelligence: boolean
}

type Race = {
  darkVision: number
  name: string
  walkingSpeed: number
}

type HPTracking = {
  total: number
  current: number
  temp: number
}

type Inventory = {
  equipment: Item[]
  coins: {
    cp: number
    sp: number
    ep: number
    gp: number
    pp: number
  }
}

export type Character = {
  race: Race
  name: string
  hp: HPTracking
  attributes: Attributes
  skillProficiencies: SkillProficiencies
  savingThrowsProficiency: SavingThrowsProficiency
  generalProficiencies: GeneralProficiencies
  inspired: boolean
  inventory: Inventory
  clazz: Class
}

export type GeneralProficiencies = {
  armor: ArmorType[]
  weapons: WeaponType[]
  tools: Tools[]
  languages: Language[]
}

export type Class = {
  hitDice: number
  lvl: number
  name: string
}

export function attributesList(attributes: Attributes) {
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
  attributes: Attributes,
  savingThrowsProficiency: SavingThrowsProficiency,
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
    generalProficiencies: {
      languages: ['Common', 'Goblin'],
      tools: [
        "Alchemist's supplies",
        'Disguise Kit',
        "Smith's Tools",
        'Thieves Tools',
        "Tinker's Tools",
      ],
      weapons: ['simple', 'firearms'],
      armor: ['light', 'medium', 'shield'],
    },
    hp: {
      total: 19,
      current: 14,
      temp: 0,
    },
    inspired: false,
    inventory: {
      equipment: [
        {
          name: 'Clothes, common',
          weight: 3,
          quantity: 1,
          description:
            'A set of common clothes, including a belt, a cap, a cloak, a shirt, a pair of trousers or a skirt, and a pair of shoes.',
          cost: 0.5,
          type: 'gear',
          subtype: 'adventuring gear',
        },
        {
          name: 'Dagger',
          weight: 1,
          quantity: 1,
          description:
            'A dagger is a simple weapon in the melee weapon group. It is a small, light, one-handed weapon that deals piercing damage. A dagger is a martial weapon when thrown.',
          cost: 2,
          worn: false,
          type: 'weapon',
          subtype: 'simple',
        },
        {
          name: 'Scale mail',
          weight: 45,
          quantity: 1,
          description:
            'Scale mail is a type of medium armor. It is a set of interlocking metal rings sewn onto leather backing, which is worn over padding. Scale mail is superior to chain mail, but inferior to plate mail. Scale mail is a martial armor, and it requires proficiency with medium armor to wear it without disadvantage.',
          cost: 50,
          worn: false,
          type: 'armor',
          subtype: 'medium',
        },
      ],
      coins: {
        cp: 0,
        sp: 0,
        ep: 0,
        gp: 0,
        pp: 0,
      },
    },
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

export function skillAttr(name: SkillName): keyof Character['attributes'] {
  const skillAttrs: Record<string, keyof Character['attributes']> = {
    athletics: 'str',
    acrobatics: 'dex',
    sleightOfHand: 'dex',
    stealth: 'dex',
    arcana: 'int',
    history: 'int',
    investigation: 'int',
    nature: 'int',
    religion: 'int',
    animalHandling: 'wis',
    insight: 'wis',
    medicine: 'wis',
    perception: 'wis',
    survival: 'wis',
    deception: 'cha',
    intimidation: 'cha',
    performance: 'cha',
    persuasion: 'cha',
  } as const

  return skillAttrs[name]
}

export type SkillName = keyof Character['skillProficiencies']

export function skills(
  attributes: Attributes,
  skillProficiencies: SkillProficiencies,
) {
  return (
    [
      'athletics',
      'acrobatics',
      'sleightOfHand',
      'stealth',
      'arcana',
      'history',
      'investigation',
      'nature',
      'religion',
      'animalHandling',
      'insight',
      'medicine',
      'perception',
      'survival',
      'deception',
      'intimidation',
      'performance',
      'persuasion',
    ] as const
  ).map(name => ({
    name,
    isProficient: skillProficiencies[name],
    points: skillBonus(attributes[skillAttr(name)]),
  }))
}

// @ts-ignore
export function totalWeight(inventory: Inventory) {
  return 0
}
