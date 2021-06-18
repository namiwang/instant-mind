import { IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react'
import { pencilOutline, text } from 'ionicons/icons'
import { useEffect, useRef, useState } from 'react'
import Editor from '../components/Editor'
import Mind from '../components/Mind'
import './Home.sass'

const Home: React.FC = () => {
  const [showEditor, setShowEditor] = useState(true)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const focusOnEditor = () => {
    const element = textareaRef.current
    if (!element) { return }
    element.focus()
    element.setSelectionRange(element.value.length, element.value.length)
  }

  const toggleShowEditor = () => {
    setShowEditor(!showEditor)
  }

  useEffect(() => {
    if (showEditor) {
      focusOnEditor()
    }
  }, [showEditor])

  // HACK wont focus on first render
  useEffect(() => {
    setTimeout(focusOnEditor, 200)
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>InstantMind</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonFab vertical="bottom" horizontal="start" slot="fixed" >
          <IonFabButton onClick={toggleShowEditor}>
            <IonIcon icon={pencilOutline} />
          </IonFabButton>
        </IonFab>
        { showEditor ? <Editor textareaRef={textareaRef} /> : null }
        <Mind />
      </IonContent>
    </IonPage>
  );
};

export default Home;
