import { last } from "lodash"
import { useRef, useState } from "react"
import { INIT_RAW, useRoot } from "../models/root"

const LIST_ITEM_PREFIX_PATTERN = /^( *- )/

const Editor = () => {
  const root = useRoot()

  const textarea = useRef<HTMLTextAreaElement>(null)
  const [editorRaw, updateEditorRaw] = useState(INIT_RAW)
  const selectionStartToSync = useRef(0)
  const [idle, updateIdle] = useState(true)

  function updateRaw (raw: string) {
    root.updateRaw(raw)
    updateEditorRaw(raw)

    // HACK to preserve cursor position
    window.requestAnimationFrame(() => {
      const toSync = selectionStartToSync.current
      if (!toSync) { return }
      textarea.current?.setSelectionRange(toSync, toSync)
    })
  }

  function handleInput (event: React.ChangeEvent<HTMLTextAreaElement>): void {
    const target = event.target as HTMLTextAreaElement
    const prev = root.raw
    let current = target.value
    let selectionStart = target.selectionStart

    if (prev + "\n" === current) {
      const lines = prev.split("\n")
      if (lines.length > 0) {
        const lastLine = last(lines) as string
        const match = lastLine.match(LIST_ITEM_PREFIX_PATTERN)
        if (match) {
          const prefix = match[0]
          current += prefix
          selectionStart += prefix.length
        }
      }
    }

    selectionStartToSync.current = selectionStart

    updateRaw(current)
  }

  function handleKeyDown (event: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.key !== 'Tab') { return }

    console.log('editor:tab')

    event.preventDefault()

    const target = event.target as HTMLTextAreaElement
    const value = target.value
    let selectionStart = target.selectionStart

    const textUntilCursor = value.substr(0, selectionStart)
    if (textUntilCursor.length === 0) {
      return
    }

    const lines = textUntilCursor.split("\n")
    const lastLine = last(lines) as string
    if (!lastLine.match(LIST_ITEM_PREFIX_PATTERN)) {
      return
    }
    console.log('lastLine', lastLine)

    let newLastLine = lastLine
    if (!event.shiftKey) {
      // prefix indent
      newLastLine = '  ' + lastLine
      selectionStartToSync.current = selectionStart + 2
    } else {
      // remove prefix indent
      if (newLastLine.startsWith('  ')) {
        newLastLine = newLastLine.substr(2)
        selectionStartToSync.current = selectionStart - 2
      }
    }

    lines.pop()
    lines.push(newLastLine)
    const newTextUntilCursor = lines.join("\n")
    const newValue =
      newTextUntilCursor + 
      value.slice(selectionStart)

    updateRaw(newValue)
  }

  return (
    <textarea
      id="editor"
      ref={textarea}
      value={editorRaw}
      onInput={handleInput.bind(this)}
      onKeyDown={handleKeyDown}
      className={idle ? 'idle' : ''}
    />
  )
}

export default Editor
