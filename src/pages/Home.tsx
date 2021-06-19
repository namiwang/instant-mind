import { IonButton, IonButtons, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react'
import { downloadOutline } from 'ionicons/icons'
import Editor from '../components/Editor'
import Mind from '../components/Mind'
import './Home.sass'

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>InstantMind</IonTitle>
          <IonButtons slot="primary">
            <IonButton>
              <IonIcon slot="icon-only" icon={downloadOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">InstantMind</IonTitle>
          </IonToolbar>
        </IonHeader>

        <Editor />
        <Mind />
      </IonContent>
    </IonPage>
  );
};

export default Home;
