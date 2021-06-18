import { observer } from 'mobx-react-lite'
import ReactFlow, { Background, BackgroundVariant, MiniMap } from 'react-flow-renderer'
import { useRoot } from "../models/root"

const Mind = observer(() => {
  const root = useRoot()

  return (
    <ReactFlow
      id="mind"
      // nodeTypes={{ node: Node }}
      elements={root.graph.layoutedElements}
      // elementsSelectable={false}
      // nodesDraggable={false}
      // nodesConnectable={false}
      // TODO The React Flow parent container needs a width and a height to render the graph.
      // style={{ width: `${windowSize.innerWidth}px`, height: `${windowSize.innerHeight}px` }}
      // minZoom={FLOW_ZOOM_MIN}
      // maxZoom={FLOW_ZOOM_MAX}
      // defaultZoom={FLOW_ZOOM_DEFAULT}
      // onLoad={onLoad}
      // onElementClick={onElementClick}
    >
      <Background variant={BackgroundVariant.Lines} />
      <MiniMap />
    </ReactFlow>
  )
})

export default Mind
