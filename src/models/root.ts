import { Instance, types } from 'mobx-state-tree'
import { createContext, useContext } from 'react'
import MarkdownIt from 'markdown-it'
import { Graph, graphFromDoc } from './graph'

const md = new MarkdownIt()

export const INIT_RAW = '- mind'

const RootStore = types
  .model({
    raw: '',
    graph: Graph,
  })
  .views(self => ({
    get flow (): string {
      return self.raw
    }
  }))
  .actions(self => ({
    updateRaw (raw: string) {
      self.raw = raw

      const doc = md.parse(raw, {})
      // console.log(doc)
      // console.log(JSON.stringify(doc))

      self.graph = graphFromDoc(doc)
      console.log(self.graph)
    }
  }))

export type RootStoreInstance = Instance<typeof RootStore>

export const rootStore = RootStore.create({
  graph: {}
})
rootStore.updateRaw(INIT_RAW)

export const RootStoreContext = createContext<null | RootStoreInstance>(null)

export function useRoot (): RootStoreInstance {
  const store = useContext(RootStoreContext)
  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider')
  }
  return store
}
