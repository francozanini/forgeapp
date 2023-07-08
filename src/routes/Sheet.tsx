import {Button} from '@i4o/catalystui'

function capitalized(text: string | null): string {
  if (!text || text.length < 1) return ''
  else return text[0].toUpperCase() + text.slice(1).toLowerCase()
}

function capitalizeAll(texts: string[]): string {
  return texts.map(capitalized).join(' ')
}

type Character = {
  race: {darkVision: number; name: string; walkingSpeed: number}
  name: string
  hp: {total: number; current: number; temp: number}
  savingThrowsProficiency: {
    str: boolean
    wis: boolean
    con: boolean
    dex: boolean
    cha: boolean
    int: boolean
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

function TopBar({character}: {character: Character}) {
  const subtitle = capitalizeAll([
    character.race.name,
    character.clazz.name,
    character.clazz.lvl.toString(),
  ])

  return (
    <section className="flex flex-row justify-between">
      <div>
        <h1 className="text-lg font-bold">{character.name}</h1>
        <p className="text-sm font-semibold">{subtitle}</p>
      </div>
      <Button
        type="button"
        className="bg-blue-600 py-1 px-8 font-semibold text-white rounded-md"
      >
        {character.hp.current} / {character.hp.total} <br />
        <span className="mt-1 uppercase text-xs">Hit Points</span>
      </Button>
    </section>
  )
}

export default function Sheet() {
  const character: Character = {
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
      str: 10,
      dex: 10,
      con: 10,
      int: 10,
      wis: 10,
      cha: 10,
    },
    hp: {
      total: 19,
      current: 14,
      temp: 0,
    },
    inspired: false,
    inventory: [],
    savingThrowsProficiency: {
      str: false,
      dex: false,
      con: true,
      int: true,
      wis: false,
      cha: false,
    },
  }
  return (
    <main className="w-100 px-2 pt-1">
      <TopBar character={character} />
      <section className="mt-4 grid grid-cols-3 grid-rows-2 gap-4">
        <Button className="font-semibold bg-gray-100 rounded-md px-4 py-1">
          Conditions
        </Button>
        <img
          className={'row-span-2 border-2 border-solid border-red-600'}
          src="http://placekitten.com/g/150/150"
          alt="Character avatar"
        />
        <Button className="font-semibold bg-gray-100 rounded-md px-4 py-1">
          Defenses
        </Button>
        <Button className="font-semibold bg-gray-100 rounded-md px-4 py-1">
          Rest
        </Button>
        <Button className="font-semibold bg-gray-100 rounded-md px-4 py-1">
          Inspiration
        </Button>
      </section>
      <section className="flex flex-row justify-between mt-4">
        <div>
          <div className="text-center font-bold text-2xl">+2</div>
          <div className="uppercase text-sm font-semibold">Prof Bonus</div>
        </div>
        <div>
          <div className="text-center font-bold text-2xl">
            {character.race.walkingSpeed} ft
          </div>
          <div className="uppercase text-sm font-semibold">Walking Speed</div>
        </div>
        <div>
          <div className="text-center font-bold text-2xl">
            {skillBonus(character.attributes.dex)}
          </div>
          <div className="uppercase text-sm font-semibold">Initiative</div>
        </div>
        <div>
          <div className="text-center font-bold text-2xl">{ac(character)}</div>
          <div className="uppercase text-sm font-semibold">Armor class</div>
        </div>
      </section>
    </main>
  )
}

function skillBonus(attribute: number) {
  return Math.floor((attribute - 10) / 2)
}

function ac(character: Character) {
  return skillBonus(character.attributes.dex) + 10
}
