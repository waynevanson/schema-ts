type StrictEqual<E, A> = E extends A ? (A extends E ? true : false) : false

type RemoveNevers<T> = Omit<
  T,
  {
    [P in keyof T]: T[P] extends never ? P : never
  }[keyof T]
>
type Resolvers<S, K extends keyof S, A extends S[K] = S[K]> = RemoveNevers<
  {
    [P in keyof A]: {
      [Q in keyof S]: StrictEqual<S[Q], A[P]> extends true
        ? Entity<S, Q>
        : StrictEqual<Array<S[Q]>, A[P]> extends true
        ? [Entity<S, Q>]
        : never
    }[keyof S]
  }
>

// if deep recursive contains strict type that
export interface Entity<S, K extends keyof S> {
  //   eq match enities for circular scheme.
  readonly hash: string
  //   where to lookup the id in A
  readonly id: (a: S[K]) => string
  readonly resolvers: Resolvers<S, K>
}

type Model = { reviews: Review; users: User; posts: Post }

type Result = Resolvers<Model, "users">

// entities

type Review = {
  id: string
  stars: 1 | 2 | 3 | 4 | 5
  title: string
  description: string
}

type Post = {
  id: string
  author: User
  collaborators: Array<User>
  reviews: Array<Review>
}

type User = {
  id: string
  friends: Array<User>
  posts: Array<Post>
}
