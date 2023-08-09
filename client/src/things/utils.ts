export function capitalized(text: string | null): string {
  if (!text || text.length < 1) return ''
  else return text[0].toUpperCase() + text.slice(1).toLowerCase()
}

export function capitalizeAll(texts: string[]): string {
  return texts.map(capitalized).join(' ')
}

export function raise(message: string): never {
  throw new Error(message)
}
