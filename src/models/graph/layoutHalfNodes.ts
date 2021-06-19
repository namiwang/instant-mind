import { filter, random } from "lodash"
import dagre from "dagre"
import { NodesData } from "./nodeData"

const NODE_W = 200
const NODE_H = 48
const NODE_MARGIN_X = 50
const DISTURBANCE = 8

export function layoutHalfNodes (nodes: NodesData, direction: 'LR' | 'RL'): void {
  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: direction })
  g.setDefaultEdgeLabel(() => ({}))

  const halfNodes = filter(Object.values(nodes), node =>
    ( direction === 'LR' && node.side >= 0 ) ||
    ( direction === 'RL' && node.side <= 0 )
  )

  halfNodes.forEach(node => {
    g.setNode(node.id.toString(), { width: NODE_W, height: NODE_H })
    if (node.side === 0) {
      return
    }
    g.setEdge(
      node.parent?.toString() as string,
      node.id.toString()
    )
  })

  dagre.layout(g)

  halfNodes.forEach(node => {
    const nodeWithPos = g.node(node.id.toString())

    node.posX = nodeWithPos.x - NODE_W / 2 + random(0 - DISTURBANCE, DISTURBANCE)
    node.posY = nodeWithPos.y - NODE_H / 2 + random(0 - DISTURBANCE, DISTURBANCE)
  })
}
