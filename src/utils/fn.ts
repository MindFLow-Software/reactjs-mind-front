class Fn {
  static one = <T = unknown>(
    key: string | undefined,
    object: Record<string, NonNullable<T>>,
    defaultValue: NonNullable<T>,
  ): NonNullable<T> => {
    return key ? object[key] : defaultValue
  }
}

export const fn = Fn
