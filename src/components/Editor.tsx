import { last } from "lodash"
import { useState } from "react"
import { INIT_RAW, useRoot } from "../models/root"

const LIST_ITEM_PREFIX_PATTERN = /^( *- )/

const Editor = ({textareaRef}: {textareaRef: React.RefObject<HTMLTextAreaElement>}) => {
  const root = useRoot()

  const [editorRaw, updateEditorRaw] = useState(INIT_RAW)

  function updateRaw (raw: string) {
    updateEditorRaw(raw)
    root.updateRaw(raw)
  }

  function handleInput (event: React.ChangeEvent<HTMLTextAreaElement>): void {
    const prev = root.raw
    let current = event.target.value

    if (prev + "\n" === current) {
      const lines = prev.split("\n")
      if (lines.length > 0) {
        const lastLine = last(lines) as string
        const match = lastLine.match(LIST_ITEM_PREFIX_PATTERN)
        if (match) {
          const prefix = match[0]
          current += prefix
        }
      }
    }

    updateRaw(current)
  }

  function handleKeyDown (event: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.key !== 'Tab') { return }

    event.preventDefault()

    const target = event.target as HTMLTextAreaElement
    const value = target.value

    const textUntilCursor = value.substr(0, target.selectionStart)
    if (textUntilCursor.length === 0) {
      return
    }

    const lines = textUntilCursor.split("\n")
    const lastLine = last(lines) as string
    if (!lastLine.match(LIST_ITEM_PREFIX_PATTERN)) {
      return
    }

    let newLastLine = lastLine
    if (!event.shiftKey) {
      // prefix indent
      newLastLine = '  ' + lastLine
    } else {
      // remove prefix indent
      if (newLastLine.startsWith('  ')) {
        newLastLine = newLastLine.substr(2)
      }
    }

    lines.pop()
    lines.push(newLastLine)
    const newTextUntilCursor = lines.join("\n")
    const newValue =
      newTextUntilCursor + 
      value.slice(target.selectionStart)
    updateRaw(newValue)
  }

  return (
    <textarea
      id="editor"
      ref={textareaRef}
      value={editorRaw}
      onInput={handleInput.bind(this)} onKeyDown={handleKeyDown}
    />
  )
}

export default Editor
