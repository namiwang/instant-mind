import { Instance, types } from 'mobx-state-tree'
import { createContext, useContext } from 'react'
import { Graph, graphFromDoc } from './graph'

const RootStore = types
  .model({
    graph: Graph,
  })
  .actions(self => ({
    updateDoc (doc: any) { // TODO tiptap/prosemirror doc type
      self.graph = graphFromDoc(doc)
      console.log(self.graph)
    }
  }))

export type RootStoreInstance = Instance<typeof RootStore>

export const rootStore = RootStore.create({
  graph: {}
})

export const RootStoreContext = createContext<null | RootStoreInstance>(null)

export function useRoot (): RootStoreInstance {
  const store = useContext(RootStoreContext)
  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider')
  }
  return store
}
