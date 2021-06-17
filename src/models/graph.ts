import { Instance, types } from 'mobx-state-tree'
import { isEdge, isNode } from 'react-flow-renderer'
import dagre from 'dagre'

import Node, { FlowElement } from './node'

// TODO
const NODE_W = 200
const NODE_H = 48

export const Graph = types
  .model({
    nodes: types.map(Node),
  })
  .views(self => ({
    get flowElements (): FlowElement[] {
      const elements: FlowElement[] = []

      Array.from(self.nodes.values()).forEach(node => {
        elements.push(node.flowData)
        const edge = node.edgeToParent
        if (edge) {
          elements.push(edge)
        }
      })

      return elements
    },
  }))
  .views(self => ({
    get layoutedElements (): FlowElement[] {
      const g = new dagre.graphlib.Graph()
      g.setGraph({ rankdir: 'LR' })
      g.setDefaultEdgeLabel(() => ({}))

      const elements = self.flowElements

      elements.forEach((element) => {
        if (isNode(element)) {
          g.setNode(element.id, { width: NODE_W, height: NODE_H })
        } else {
          g.setEdge(element.source, element.target)
        }
      })

      dagre.layout(g)

      elements.forEach((element) => {
        if (isEdge(element)) { return }

        const nodeWithPosition = g.node(element.id)

        element.position = {
          x: nodeWithPosition.x - NODE_W / 2 + Math.random() / 1000, // rerender HACK
          y: nodeWithPosition.y - NODE_H / 2,
        }
      })

      return elements
    }
  }))

export type GraphInstance = Instance<typeof Graph>
