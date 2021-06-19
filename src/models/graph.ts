import { Instance, types } from 'mobx-state-tree'

import Node, { FlowElement } from './node'

export const Graph = types
  .model({
    nodes: types.map(Node),
  })
  .views(self => ({
    get elements (): FlowElement[] {
      const elements: FlowElement[] = []

      Array.from(self.nodes.values()).forEach(node => {
        elements.push(node.flowData)
        const edge = node.edgeToParent
        if (edge) {
          elements.push(edge)
        }
      })

      return elements
    }
  }))

export type GraphInstance = Instance<typeof Graph>

export { graphFromDoc } from './graph/graphFromDoc'
