import { Graph, GraphInstance } from "../graph";
import { layoutHalfNodes } from "./layoutHalfNodes";
import { NodeData, NodesData } from "./nodeData";

export function graphFromDoc (doc: any): GraphInstance { // TODO type
  console.info(doc)

  const nodes: NodesData = {}

  let level = -1
  let nodesN = -1
  let ancestors: NodeData[] = []
  let pointingRight = false

  function side (parent: NodeData | undefined): number {
    if (!parent) { return 0 }
    if (parent.side === 0) {
      pointingRight = !pointingRight
      return pointingRight ? 1 : -1
    }
    return parent.side
  }

  function newNode (label: string): NodeData {
    nodesN += 1
    const id = nodesN
    const parent = level > 0 ? ancestors[level - 1] : undefined

    const node = {
      id,
      label,
      parent: parent?.id,
      side: side(parent),
      // TODO
    }
    nodes[id] = node

    if (parent) {
      parent.outgoing = true
    }

    console.info('new node', node)
    return node
  }

  function parsePara (docNode: any): string {
    console.info('parsePara', docNode)
    const text = docNode?.content?.map((child: any) => child.text)?.join()
    return text ?? ''
  }

  function parseItem (docNode: any): void {
    // assertion:
    // first child paragraph (may have no content)
    // second optional child bulletList

    if (docNode.type !== 'listItem') { return }

    console.info('parseItem', docNode)

    // label
    const label = parsePara(docNode.content[0])
    const node = newNode(label)

    ancestors[level] = node

    const subList = docNode.content?.[1]
    if (subList) {
      parseList(subList)
    }
  }

  function parseList (docNode: any): void {
    if (docNode.type !== 'bulletList') { return }
    console.info('parseList', docNode)

    level += 1
    for (const subNode of docNode.content as any[]) {
      parseItem(subNode)
    }
    level -= 1
  }

  parseList(doc.content[0])

  layoutHalfNodes(nodes, 'LR')
  const deltaY = nodes[0].posY
  layoutHalfNodes(nodes, 'RL')
  const deltaX = nodes[0].posX

  Object.values(nodes).forEach(node => {
    if (node.side > 0) {
      (node.posX as number) += deltaX as number
      (node.posY as number) -= deltaY as number
    }
  })

  return Graph.create({nodes})
}
