import { memo } from 'react'
import { Handle, Position } from 'react-flow-renderer'

interface Props {
  data: any
}

const CenterNode = memo(({data}: Props) => {
  return <>
    <div>
      {data.label}
    </div>
    <Handle
      type="source"
      position={Position.Left}
      id="left"
    />
    <Handle
      type="source"
      position={Position.Right}
      id="right"
    />
  </>
})

export default CenterNode
