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
    textareaRef.current?.focus()
    // TODO cursor pos
  }

  const toggleShowEditor = () => {
    setShowEditor(!showEditor)
    if (showEditor) {
      focusOnEditor()
    }
  }

  useEffect(() => {
    setTimeout(focusOnEditor, 500)
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

        <IonFab vertical="top" horizontal="start" slot="fixed" >
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
