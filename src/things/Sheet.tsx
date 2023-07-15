import {Button, Dialog} from '@i4o/catalystui'
import {
  ac,
  Attributes,
  attributesList,
  Character,
  Item,
  proficiency,
  savingThrowBonus,
  savingThrows,
  SavingThrowsProficiency,
  skillAttr,
  skillBonus,
  SkillProficiencies,
  skills,
  totalWeight,
} from './character.ts'
import {capitalizeAll, capitalized, raise} from './utils.ts'
import React, {useState} from 'react'
import {updateItem, useCharacter, useItemUpdate} from './api.ts'
import {useMutation, useQueryClient} from 'react-query'

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
    <Dialog
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      title={''}
      trigger={
        <Button
          onClick={open}
          className="font-semibold border border-solid p-2 bg-blue-600 text-center mx-auto w-full text-white rounded-md"
        >
          {text}
        </Button>
      }
    >
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-20 z-50 w-full overflow-y-auto overflow-x-hidden md:inset-0 md:h-full"
        id="defaultModal"
      >
        <div className="relative h-full w-full max-w-2xl p-4 md:h-auto mx-auto">
          <div className="relative rounded-lg bg-white shadow pb-8">
            <div className="w-full flex justify-between my-4 pt-2 mx-2">
              <p className="text-lg font-semibold">Routes</p>
              <Button className="text-2xl mr-1" onClick={close}>
                X
              </Button>
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
    </Dialog>
  )
}

export function AbilitiesSavesSenses({
  attributes,
  savingThrowsProficiencies,
  profBonus,
  darkVision,
  setRoute,
}: {
  attributes: Attributes
  savingThrowsProficiencies: SavingThrowsProficiency
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

function Inventory(props: {
  navigate: (route: SheetRoutes) => void
  inventory: Character['inventory']
  attributes: Attributes
}) {
  const queryClient = useQueryClient()
  const {mutate: toggleItem} = useMutation('updateItem', updateItem, {
    onMutate: async updatedItem => {
      const previousCharacter = queryClient.getQueryData(['character'])

      queryClient.setQueryData(
        ['character'],
        (toUpdate: Character | undefined) => {
          if (!toUpdate) raise('Character not found')

          const equipment = toUpdate.inventory.equipment.map(item =>
            item.name === updatedItem.name ? updatedItem : item,
          )
          return {
            ...toUpdate,
            inventory: {...toUpdate.inventory, equipment},
          } as Character
        },
      )

      return {previousCharacter}
    },
    onSettled: () => queryClient.invalidateQueries(['character']),
  })

  return (
    <section>
      <RouteNavigator
        route={'inventory'}
        text={'Inventory'}
        setRoute={props.navigate}
      />
      <div className="flex flex-row justify-between mt-4">
        <div className="flex flex-row justify-between uppercase w-full text-sm font-semibold">
          <span className="flex flex-col gap-1">
            <p>Weight Carried</p>
            {totalWeight(props.inventory)} / {props.attributes.str * 15} lbs
          </span>
          <span className="flex flex-col gap-1">
            <p>Total currency</p>
            <p className="text-right">{props.inventory.coins.gp} gp</p>
          </span>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="uppercase font-bold mb-2">Equipment</h3>
        <table className="w-full">
          <thead>
            <tr className="uppercase text-sm font-semibold ">
              <th></th>
              <th>Weight</th>
              <th>Qty</th>
              <th>Cost (GP)</th>
            </tr>
          </thead>
          <tbody>
            {props.inventory.equipment.map(item => (
              <tr
                key={item.name}
                className="text-center font-semibold text-sm border-y border-solid"
              >
                <td>
                  {item.worn === undefined ? (
                    ''
                  ) : (
                    <Button
                      className={`w-6 h-6 bg-white  border-solid  border-blue-600 rounded-sm m-auto ${
                        item.worn ? 'border-8' : 'border-2 border-gray-400'
                      }`}
                      onClick={() => toggleItem(item)}
                    />
                  )}
                </td>
                <td className="py-4">{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function Skills({
  attributes,
  navigate,
  skillProficiencies,
}: {
  navigate: (route: SheetRoutes) => void
  attributes: Attributes
  skillProficiencies: SkillProficiencies
}) {
  return (
    <div>
      <RouteNavigator route={'skills'} text={'Skills'} setRoute={navigate} />
      <table className="w-full">
        <thead>
          <tr>
            <th className="font-semibold uppercase py-2">Prof</th>
            <th className="font-semibold uppercase py-2">Mod</th>
            <th className="font-semibold uppercase py-2">Skill</th>
            <th className="font-semibold uppercase py-2">Bonus</th>
          </tr>
        </thead>
        <tbody>
          {skills(attributes, skillProficiencies).map(skill => (
            <tr
              key={skill.name}
              className="border-y border-solid text-center font-semibold"
            >
              <td className="text-center py-2">
                {skill.isProficient ? (
                  <span className="text-green-500">✔</span>
                ) : (
                  ''
                )}
              </td>
              <td className="py-2 uppercase">
                {capitalized(skillAttr(skill.name))}
              </td>
              <td className="py-2">{capitalized(skill.name)}</td>
              <td className="text-center py-2">+{skill.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
    return (
      <Skills
        navigate={setRoute}
        attributes={character.attributes}
        skillProficiencies={character.skillProficiencies}
      />
    )
  }

  if (route === 'inventory') {
    return (
      <Inventory
        navigate={setRoute}
        inventory={character.inventory}
        attributes={character.attributes}
      />
    )
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
  const {data: character} = useCharacter()
  const [route, setRoute] = React.useState<SheetRoutes>('abilities')

  if (!character) return <div>Loading...</div>

  return (
    <main className="w-100 px-2 pt-1">
      <TopBar character={character} />
      <section className="mt-4 bg-gray-50">
        <SheetOutlet character={character} route={route} setRoute={setRoute} />
      </section>
    </main>
  )
}
