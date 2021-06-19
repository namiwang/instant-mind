import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useRoot } from '../models/root'

export const INIT_CONTENT = `
<ul>
  <li>
    <p>instant mind</p>
    <ul>
      <li>
        <p>design</p>
      </li>
      <li>
        <p>development</p>
        <ul>
          <li>
            <p>editor</p>
          </li>
          <li>
            <p>flow utility</p>
          </li>
          <li>
            <p>layout algorithm</p>
          </li>
          <li>
            <p>download</p>
          </li>
        </ul>
      </li>
      <li>
        <p>deployment</p>
        <ul>
          <li>
            <p>github pages</p>
          </li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
`

const Editor = () => {
  const root = useRoot()

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: INIT_CONTENT,
    autofocus: true, // TODO not working
    onCreate ({editor}) {
      const doc = editor.getJSON()
      root.updateDoc(doc)
    },
    onUpdate ({editor}) {
      // console.log('onUpdate')
      const doc = editor.getJSON()
      root.updateDoc(doc)

      console.log(editor.getHTML())
    },
  })

  return (
    <EditorContent editor={editor} id="editor" />
  )
}

export default Editor
