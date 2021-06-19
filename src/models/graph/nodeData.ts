export type NodeData = {
  id: number,
  label: string,
  parent?: number,
  outgoing?: boolean,
  side: number,
  posX?: number,
  posY?: number,
}

export type NodesData = { [key: number]: NodeData }
