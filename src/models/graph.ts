import { filter, last, random } from 'lodash'
import { Instance, types } from 'mobx-state-tree'
import dagre from 'dagre'

import Node, { FlowElement } from './node'
import Token from 'markdown-it/lib/token'

const NODE_W = 200
const NODE_H = 48
const NODE_MARGIN_X = 50
const DISTURBANCE = 20

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

type NodeData = {
  id: number,
  label: string,
  parent?: number,
  outgoing?: boolean,
  rank: number,
  posX?: number,
  posY?: number,
}

type NodesData = { [key: number]: NodeData }

function layoutHalfNodes (nodes: NodesData, direction: 'LR' | 'RL'): void {
  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: direction })
  g.setDefaultEdgeLabel(() => ({}))

  const halfNodes = filter(Object.values(nodes), node =>
    ( direction === 'LR' && node.rank >= 0 ) ||
    ( direction === 'RL' && node.rank <= 0 )
  )

  halfNodes.forEach(node => {
    g.setNode(node.id.toString(), { width: NODE_W, height: NODE_H })
    if (node.rank === 0) {
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

    node.posX = nodeWithPos.x - NODE_W / 2 // + random(0 - DISTURBANCE, DISTURBANCE)
    node.posY = nodeWithPos.y - NODE_H / 2 // + random(0 - DISTURBANCE, DISTURBANCE)
  })
}

export function graphFromDoc (tokens: Token[]): GraphInstance {
  const nodes: NodesData = {}

  let level = -1
  let nodesN = -1
  let ancestors = []
  let currentNode: NodeData | undefined
  let pointingRight = false

  function wrapCurrentNode (): NodeData | undefined {
    if (!currentNode) { return }
    nodes[currentNode.id] = currentNode
  }

  function rankFromParent (parent: NodeData | undefined): number {
    if (!parent) { return 0 }
    const parentRank = parent.rank
    if (parentRank > 0) {
      return parentRank + 1
    }
    if (parentRank < 0) {
      return parentRank - 1
    }
    pointingRight = !pointingRight
    return pointingRight ? 1 : -1
  }

  for (const token of tokens) {
    let aborted = false

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
        if (level === 0) {
          aborted = true
        }
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
          label: '',
          rank: rankFromParent(parent),
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

    if (aborted) {
      break
    }
  }
  wrapCurrentNode()

  layoutHalfNodes(nodes, 'LR')
  layoutHalfNodes(nodes, 'RL')
  const deltaX = nodes[0].posX

  Object.values(nodes).forEach(node => {
    if (node.rank > 0) {
      (node.posX as number) += deltaX as number
    }
  })

  return Graph.create({nodes})
}
