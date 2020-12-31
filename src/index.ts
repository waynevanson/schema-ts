import { hash } from "./util"
import { Entity } from "./types"
import { make } from "fp-ts/lib/Tree"
import { pipe } from "fp-ts/lib/pipeable"

// derive a schema, then add the stuff

type Model = {
  users: User
  posts: Post
  reviews: Review
}

// type Schema<S> = { [P in keyof S]: S[P] extends object ? [] : never }

/**
 * An AST like interface to be used by the dev in their own projects.
 */
type TestAgainstSchema = {
  [name: string]: {
    hash: string
    id: (item: any) => string
    resolvers: [{ relationship: "One" | "Many"; name: string }]
  }
}

export function makeEntity<S, K extends keyof S>({
  id,
  resolvers,
}: Omit<Entity<S, K>, "hash">): Entity<S, K> {
  return { hash: hash(), id, resolvers }
}

const reviews = makeEntity<Model, "reviews">({
  id: (a) => a.id,
  resolvers: {},
})

const lazy = <A>(f: () => A) => f()

const users: Entity<Model, "users"> = makeEntity({
  id: (a) => a.id,
  resolvers: {
    friends: [lazy(() => users)],
    posts: [lazy(() => posts)],
  },
})

const posts = makeEntity<Model, "posts">({
  id: (a) => a.id,
  resolvers: {
    reviews: [reviews],
    author: users,
    collaborators: [users],
  },
})

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
