import {Button} from '@i4o/catalystui'
import {
  ac,
  attributesList,
  Character,
  getCharacter,
  proficiency,
  savingThrowBonus,
  savingThrows,
  skillBonus,
} from './character.ts'
import {capitalizeAll, capitalized, raise} from './utils.ts'
import {useState} from 'react'

import * as Dialog from '@radix-ui/react-dialog'
import {DialogClose} from '@radix-ui/react-dialog'

function RouteNavigator({
  route,
  text,
  setRoute,
}: {
  route: SheetRoutes
  text: string
  setRoute: (route: SheetRoutes) => void
}) {
  const routes: SheetRoutes[] = [
    'abilities',
    'skills',
    'actions',
    'inventory',
    'spells',
    'features',
    'proficiencies',
  ]
  const [isOpen, setIsOpen] = useState(false)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button
          onClick={open}
          className="font-semibold border border-solid p-2 bg-blue-600 text-center mx-auto w-full text-white rounded-md"
        >
          {text}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <div
          aria-hidden="true"
          className="fixed inset-x-0 top-24 z-50 w-full overflow-y-auto overflow-x-hidden md:inset-0 md:h-full"
          id="defaultModal"
        >
          <div className="relative h-full w-full max-w-2xl p-4 md:h-auto mx-auto">
            <div className="relative rounded-lg bg-white shadow pb-8">
              <div className="flex items-start justify-between rounded-t border-b p-4">
                <h3 className="text-xl font-semibold text-gray-900">Routes</h3>
                <DialogClose asChild>
                  <Button onClick={close}>X</Button>
                </DialogClose>
              </div>
              <ul className="flex flex-col gap-2 ml-2 w-full">
                {routes.map(r => (
                  <li key={r}>
                    <Button
                      className={`${
                        r === route ? 'bg-blue-600' : 'bg-gray-600 '
                      } font-semibold hover:text-blue-400 py-2 text-white w-full`}
                      onClick={() => setRoute(r)}
                    >
                      {capitalized(r)}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export function AbilitiesSavesSenses({
  attributes,
  savingThrowsProficiencies,
  profBonus,
  darkVision,
  setRoute,
}: {
  attributes: Character['attributes']
  savingThrowsProficiencies: Character['savingThrowsProficiency']
  profBonus: number
  darkVision: number
  setRoute: (route: SheetRoutes) => void
}) {
  return (
    <>
      <RouteNavigator
        route={'abilities'}
        text={'Abilities, Saves, Senses'}
        setRoute={setRoute}
      />
      <div className="grid grid-cols-3 mt-4  gap-12 bg-gray-50">
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

function SheetOutlet({
  character,
  route,
  setRoute,
}: {
  character: Character
  route: SheetRoutes
  setRoute: (route: SheetRoutes) => void
}) {
  if (route === 'abilities') {
    return (
      <AbilitiesSavesSenses
        setRoute={setRoute}
        attributes={character.attributes}
        savingThrowsProficiencies={character.savingThrowsProficiency}
        profBonus={proficiency(character)}
        darkVision={character.race.darkVision}
      />
    )
  }

  if (route === 'skills') {
    return <div>Skills</div>
  }

  return raise('route not supported')
}

type SheetRoutes =
  | 'abilities'
  | 'skills'
  | 'actions'
  | 'inventory'
  | 'spells'
  | 'features'
  | 'proficiencies'

export default function Sheet() {
  const character: Character = getCharacter()
  const [route, setRoute] = useState<SheetRoutes>('abilities')

  return (
    <main className="w-100 px-2 pt-1">
      <TopBar character={character} />
      <section className="mt-4 bg-gray-50">
        <SheetOutlet character={character} route={route} setRoute={setRoute} />
      </section>
    </main>
  )
}
