import { IAnyModelType, Instance, types } from 'mobx-state-tree'
import * as reactFlow from 'react-flow-renderer'
import Node from './node'

export type FlowEdge = reactFlow.Edge<any>

const Edge = types
  .model({
    id: types.identifier,
    source: types.reference(types.late((): IAnyModelType => Node)),
    target: types.reference(types.late((): IAnyModelType => Node)),
  })
  .views(self => ({
    flowData (): FlowEdge {
      return {
        id: self.id,
        source: self.source.id.toString(),
        target: self.target.id.toString(),
        type: 'default',
        animated: true,
        // className: clsx('edge', self.flowClasses)
      }
    }
  }))

export default Edge
export type EdgeInstance = Instance<typeof Edge>
