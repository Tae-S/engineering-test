export interface Person {
  id: number
  first_name: string
  last_name: string
  photo_url?: string
}

export const PersonHelper = {
  getFullName: (p: Person) => `${p.first_name} ${p.last_name}`,
  getFirstName: (p : Person) : string => p.first_name,
  getLastName: (p : Person) : string => p.last_name
}
