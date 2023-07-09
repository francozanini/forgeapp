import {Button} from '@i4o/catalystui'
import {
  ac,
  attributesList,
  Character,
  proficiency,
  savingThrowBonus,
  savingThrows,
  skillBonus,
} from './character.ts'
import {capitalizeAll, capitalized} from './utils.ts'

export function AbilitiesSavesSenses({
  attributes,
  savingThrowsProficiencies,
  profBonus,
  darkVision,
}: {
  attributes: Character['attributes']
  savingThrowsProficiencies: Character['savingThrowsProficiency']
  profBonus: number
  darkVision: number
}) {
  return (
    <>
      <h3 className="text-center font-semibold text-2xl py-2">
        Abilities, Saves, Senses
      </h3>
      <div className="grid grid-cols-3  gap-12 bg-gray-50">
        {attributesList(attributes).map(attr => (
          <div
            key={attr.name}
            className="flex font-semibold py-1 flex-col gap-1 bg-white text-center shadow-md rounded-md"
          >
            <span className="text-xs uppercase">{attr.name}</span>
            <span className="text-xl">
              <Button className="border border-solid py-1 px-4 rounded-md">
                +{skillBonus(attr.val)}
              </Button>
            </span>
            <span className="text-lg ">{attr.val}</span>
          </div>
        ))}
      </div>
      <section className="mt-4 bg-gray-50">
        <h2 className="font-semibold text-2xl text-center mb-2">
          Saving Throws
        </h2>
        <div className="grid grid-cols-2 gap-2 justify-items-center">
          {savingThrows(attributes, savingThrowsProficiencies).map(
            ({name, val, isProficient}) => (
              <div
                key={name}
                className="font-semibold text-sm border border-solid rounded-sm p-1 min-w-full flex justify-between"
              >
                <span
                  className={`w-2 h-2 rounded-2xl border border-solid ${
                    isProficient ? 'bg-black' : ''
                  }`}
                ></span>
                <span>{capitalized(name)}</span>{' '}
                <span>
                  +
                  {savingThrowBonus({
                    val,
                    isProficient,
                    proficiency: profBonus,
                  })}
                </span>
              </div>
            ),
          )}
        </div>
      </section>
      <section className="mt-4 bg-gray-50">
        <h2 className="text-2xl font-semibold text-center">Senses</h2>
        <div className="flex flex-col gap-2 font-semibold">
          {[
            {val: 12, name: 'perception'},
            {val: 15, name: 'investigation'},
            {val: 12, name: 'insight'},
          ].map(sense => (
            <span key={sense.name} className="border border-solid p-2">
              {sense.val} {capitalized(sense.name)}
            </span>
          ))}
          <p>Darkvision {darkVision} ft</p>
        </div>
      </section>
    </>
  )
}

function TopBar({character}: {character: Character}) {
  const subtitle = capitalizeAll([
    character.race.name,
    character.clazz.name,
    character.clazz.lvl.toString(),
  ])

  return (
    <>
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
          <div className="text-center font-bold text-2xl">
            +{proficiency(character)}
          </div>
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
    </>
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
      str: 11,
      dex: 14,
      con: 14,
      int: 17,
      wis: 11,
      cha: 12,
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

  return (
    <main className="w-100 px-2 pt-1">
      <TopBar character={character} />
      <section className="mt-4 bg-gray-50">
        <AbilitiesSavesSenses
          attributes={character.attributes}
          savingThrowsProficiencies={character.savingThrowsProficiency}
          profBonus={proficiency(character)}
          darkVision={character.race.darkVision}
        />
      </section>
    </main>
  )
}
