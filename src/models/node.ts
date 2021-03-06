import { IAnyModelType, Instance, types } from 'mobx-state-tree'
import * as reactFlow from 'react-flow-renderer'
import { ArrowHeadType, Position } from 'react-flow-renderer'
import clsx from 'clsx'

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
    get type (): 'default' | 'center' {
      if (!self.parent) { return 'center' }
      // if (!self.outgoing) { return 'output' }
      return 'default'
    },
  }))
  .views(self => ({
    get klass (): string {
      return clsx('node', {
        center: !self.parent,
      })
    },
  }))
  .views(self => ({
    get flowData (): FlowNode {
      const sourcePosition = !self.parent ? undefined : self.side > 0 ? Position.Right : Position.Left
      const targetPosition = !self.parent ? undefined : self.side > 0 ? Position.Left : Position.Right

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
        sourcePosition,
        targetPosition,
        className: self.klass,
      }
    },
    get edgeToParent (): FlowEdge | undefined {
      if (!self.parent) {
        return undefined
      }

      const sourceHandle = !self.parent ? undefined : (
        self.side > 0 ? 'right' : 'left'
      )

      return {
        id: `${self.id}-${self.parent.id}`,
        source: self.parent.id.toString(),
        target: self.id.toString(),
        // animated: false,
        // arrowHeadType: ArrowHeadType.Arrow,
        sourceHandle,
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
