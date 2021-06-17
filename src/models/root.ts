import { last } from 'lodash'
import { Instance, types, castToSnapshot, flow, detach, clone } from 'mobx-state-tree'
import { createContext, useContext } from 'react'
import MarkdownIt from 'markdown-it'
import Token from 'markdown-it/lib/token'
import { Graph, GraphInstance } from './graph'

const md = new MarkdownIt()

type NodeData = {
  id: number,
  label: string,
  parent?: number,
  outgoing?: boolean
}

function graphFromDoc(tokens: Token[]): GraphInstance {
  const nodes: { [key: string]: NodeData } = {}

  let level = -1
  let nodesN = -1
  let ancestors = []
  let currentNode: NodeData | undefined

  function wrapCurrentNode (): NodeData | undefined {
    if (!currentNode) { return }
    nodes[currentNode.id] = currentNode
  }

  for (const token of tokens) {
    switch (token.type) {
      case 'bullet_list_open':
        wrapCurrentNode()

        level += 1
        if (currentNode) {
          ancestors.push(currentNode)
        }

        break
      case 'bullet_list_close':
        level -= 1
        ancestors.pop()
        break
      case 'list_item_open':
        wrapCurrentNode()

        const parent = last(ancestors)
        if (parent) {
          parent.outgoing = true
        }
        nodesN += 1
        currentNode = {
          id: nodesN,
          parent: parent?.id,
          label: ''
        }
        break
      case 'list_item_close':
        break
      case 'inline':
        if (!currentNode) { break }
        if (!token.children) { break }
        for (const subToken of token.children) {
          if (subToken.type === 'text') {
            currentNode.label += subToken.content
          }
        }
        break
      default:
        break
    }
  }
  wrapCurrentNode()

  return Graph.create({nodes})
}

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
      console.log(doc)
      console.log(JSON.stringify(doc))

      self.graph = graphFromDoc(doc)
      console.log(JSON.stringify(self.graph))
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
