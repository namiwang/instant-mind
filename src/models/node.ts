import { IAnyModelType, Instance, types } from 'mobx-state-tree'
import * as reactFlow from 'react-flow-renderer'
import { ArrowHeadType, Position } from 'react-flow-renderer'

type NodeData = { label: string }
export type FlowEdge = reactFlow.Edge<null>
export type FlowNode = reactFlow.Node<NodeData>
export type FlowElement = FlowNode | FlowEdge

const Node = types
  .model({
    id: types.identifierNumber,
    label: types.string,
    parent: types.maybe(types.reference(types.late((): IAnyModelType => Node))),
    outgoing: false,
    side: types.number, // 0, -1, 1
    posX: 0,
    posY: 0,
  })
  .views(self => ({
    get type (): 'default' | 'input' | 'output' {
      if (!self.parent) { return 'input' }
      if (!self.outgoing) { return 'output' }
      return 'default'
    }
  }))
  .views(self => ({
    get flowData (): FlowNode {
      return {
        id: `${self.id}`,
        position: {
          x: self.posX,
          y: self.posY,
        },
        data: {
          label: self.label
        },
        type: self.type,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        className: 'node'
      }
    },
    get edgeToParent (): FlowEdge | undefined {
      if (!self.parent) {
        return undefined
      }

      return {
        id: `${self.id}-${self.parent.id}`,
        source: self.parent.id.toString(),
        target: self.id.toString(),
        // animated: false,
        // arrowHeadType: ArrowHeadType.Arrow,
      }
    }
  }))

export default Node

export type NodeInstance = Instance<typeof Node>

export const NODE_H = 48
export const NODE_W = 128
const HORIZONTAL_MARGIN = 100
const VERTICAL_MARGIN = 200
const DISTURBANCE = 20

// export function newNode ({ id, level, indexInBatch, batchSize }: {
//   id: number
//   level: number
//   indexInBatch: number
//   batchSize: number
// }): NodeInstance {
//   const deltaX = 0 - (batchSize - 1) / 2 * HORIZONTAL_MARGIN
//   let posX = indexInBatch * HORIZONTAL_MARGIN + deltaX
//   let posY = 0 - level * VERTICAL_MARGIN

//   // TODO
//   posX += random(0 - DISTURBANCE, DISTURBANCE)
//   posY += random(0 - DISTURBANCE, DISTURBANCE)

//   const data = genNodeData(milestone)

//   return Node.create({
//     id,
//     level,
//     posX,
//     posY,
//     data
//   })
// }
