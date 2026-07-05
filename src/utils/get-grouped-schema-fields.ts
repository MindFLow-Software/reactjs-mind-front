import { ZodObject } from 'zod'

type IgroupField<T extends string> = Record<T, string[]>

type Ifieldgroup<T> = {
  name: T
  fields: string[]
}

type IGroupedFields<T> = Ifieldgroup<T>[]

export const getGroupedFields = <T extends string>(
  initialState: IgroupField<T>,
  schema: ZodObject,
): IGroupedFields<T> => {
  const shape = schema.shape
  const groupedFields: IgroupField<T> = initialState

  for (const key in shape) {
    const field = shape[key as keyof typeof shape]
    const group = field.description as T

    if (!groupedFields[group]) {
      groupedFields[group] = []
    }

    groupedFields[group].push(key)
  }

  const keys = Object.keys(groupedFields) as T[]

  const tabs = keys.map((key) => {
    return {
      name: key,
      fields: groupedFields[key],
    }
  })

  return tabs
}
