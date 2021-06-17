import { useRoot } from "../models/root"

const Editor = () => {
  const root = useRoot()

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    root.updateRaw(event.target.value)
  }

  return (
    <textarea id="editor" onInput={handleChange}></textarea>
  )
}

export default Editor
