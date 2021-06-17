import { Instance, types } from 'mobx-state-tree'
import Node, { FlowElement } from './node'
import dagre from 'dagre'
import { isEdge, isNode } from 'react-flow-renderer'

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

      console.log('elements', elements)
      return elements
    },
  }))
  .views(self => ({
    get layoutedElements (): FlowElement[] {
      const dagreGraph = new dagre.graphlib.Graph()
      // dagreGraph.setDefaultEdgeLabel(() => ({}))
      dagreGraph.setGraph({ rankdir: 'LR' })

      const elements = self.flowElements

      console.warn(elements)

      elements.forEach((element) => {
        if (isNode(element)) {
          dagreGraph.setNode(element.id, { width: NODE_W, height: NODE_H })
        } else {
          dagreGraph.setEdge(element.source, element.target)
        }
      })

      dagre.layout(dagreGraph)

      elements.forEach((element) => {
        if (isEdge(element)) { return }

        const nodeWithPosition = dagreGraph.node(element.id)

        element.position = {
          x: nodeWithPosition.x - NODE_W / 2 + Math.random() / 1000, // rerender HACK
          y: nodeWithPosition.y - NODE_H / 2,
        }
      })

      return elements
    }
  }))

export type GraphInstance = Instance<typeof Graph>
