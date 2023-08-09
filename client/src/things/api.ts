import {useMutation, useQuery, useQueryClient} from 'react-query'
import {Character, getCharacter, Item} from './character.ts'
import {raise} from './utils.ts'

export function useCharacter() {
  return useQuery('character', () => {
    const char = localStorage.getItem('character')

    if (char) {
      return JSON.parse(char) as Character
    } else {
      const defaultChar = getCharacter()
      localStorage.setItem('character', JSON.stringify(defaultChar))
      return defaultChar
    }
  })
}

function updateItem(changedItem: Item) {
  if (changedItem.worn === undefined)
    raise('Item does not have a worn property')

  const character =
    localStorage.getItem('character') || raise('No character found')
  const parsedCharacter = JSON.parse(character) as Character

  const updatedCharacter = {
    ...parsedCharacter,
    inventory: {
      ...parsedCharacter.inventory,
      equipment: parsedCharacter.inventory.equipment.map(item => ({
        ...item,
        worn: item.name === changedItem.name ? !item.worn : item.worn,
      })),
    },
  } as Character

  localStorage.setItem('character', JSON.stringify(updatedCharacter))

  return Promise.resolve(updatedCharacter)
}

export function useUpdateItem() {
  const queryClient = useQueryClient()
  return useMutation('updateItem', updateItem, {
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
}
