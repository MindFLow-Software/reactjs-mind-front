import { ZodObject } from 'zod'

type IGroupField<T extends string> = Record<T, string[]>

type IFieldGroup<T> = {
  name: T
  fields: string[]
}

class SchemaFields {
  static getGrouped = <T extends string>(
    initialState: IGroupField<T>,
    schema: ZodObject,
  ): IFieldGroup<T>[] => {
    const shape = schema.shape
    const groupedFields: IGroupField<T> = initialState

    for (const key in shape) {
      const field = shape[key as keyof typeof shape]
      const group = field.description as T

      if (!groupedFields[group]) {
        groupedFields[group] = []
      }

      groupedFields[group].push(key)
    }

    const keys = Object.keys(groupedFields) as T[]

    return keys.map((key) => ({
      name: key,
      fields: groupedFields[key],
    }))
  }
}

export const schemaFields = SchemaFields
