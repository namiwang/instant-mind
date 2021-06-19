import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useState } from 'react'
import ReactFlow, { Background, BackgroundVariant, MiniMap } from 'react-flow-renderer'
import { useRoot } from "../models/root"

const FLOW_ZOOM_DEFAULT = 0.8

const Mind = observer(() => {
  const root = useRoot()

  const [flowInstance, setFlowInstance] = useState<any>(null)

  const onLoad = useCallback((instance) => {
    setFlowInstance(instance)
    // instance.fitView()
    // instance.zoomTo(FLOW_ZOOM_DEFAULT)
  }, [])

  useEffect(() => {
    flowInstance?.fitView()
  }, [root.graph.layoutedElements])

  return (
    <ReactFlow
      id="mind"
      // nodeTypes={{ node: Node }}
      elements={root.graph.layoutedElements}
      onLoad={onLoad}
      // elementsSelectable={false}
      // nodesDraggable={false}
      // nodesConnectable={false}
      // TODO The React Flow parent container needs a width and a height to render the graph.
      // style={{ width: `${windowSize.innerWidth}px`, height: `${windowSize.innerHeight}px` }}
      // minZoom={FLOW_ZOOM_MIN}
      // maxZoom={FLOW_ZOOM_MAX}
      defaultZoom={FLOW_ZOOM_DEFAULT}
      // onElementClick={onElementClick}
    >
      <Background variant={BackgroundVariant.Lines} />
      <MiniMap />
    </ReactFlow>
  )
})

export default Mind
