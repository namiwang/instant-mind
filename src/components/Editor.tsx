import { useState } from "react"
import { useRoot } from "../models/root"

const INIT_RAW = '- mind'

const Editor = ({textareaRef}: {textareaRef: React.RefObject<HTMLTextAreaElement>}) => {
  const root = useRoot()

  const [raw, updateRaw] = useState(INIT_RAW)

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    const value = event.target.value
    updateRaw(value)
    root.updateRaw(value)
  }

  return (
    <textarea id="editor" ref={textareaRef} value={raw} onInput={handleChange}></textarea>
  )
}

export default Editor
