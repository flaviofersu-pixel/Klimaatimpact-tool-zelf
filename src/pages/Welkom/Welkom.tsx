// Scherm 1: welkom en uitleg, met de keuze tussen je eigen OneDrive en voorbeelddata.
import { Body1, Button, Card, makeStyles, Title1, tokens } from '@fluentui/react-components';
import { useNavigate } from 'react-router';
import { useScan } from '../../state/useScan';

const useStyles = makeStyles({
  kaart: {
    maxWidth: '640px',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  knoppen: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalM,
  },
});

export function Welkom() {
  const styles = useStyles();
  const navigate = useNavigate();
  const { laadVoorbeelddata } = useScan();

  function bekijkVoorbeelddata() {
    laadVoorbeelddata();
    navigate('/dashboard');
  }

  return (
    <Card className={styles.kaart}>
      <Title1 as="h1">Hoeveel stroom kost jouw OneDrive?</Title1>
      <Body1>
        Alles wat je in OneDrive bewaart, staat dag en nacht op servers in een datacenter. Dat kost stroom, en
        stroom zorgt voor CO₂-uitstoot.
      </Body1>
      <Body1>
        Deze tool bekijkt hoeveel opslag jij gebruikt en rekent uit wat dat ongeveer betekent voor het klimaat. Je
        ziet ook welke bestanden de meeste ruimte innemen, zodat je zelf kunt kiezen wat je opruimt.
      </Body1>
      <div className={styles.knoppen}>
        <Button appearance="primary" onClick={() => navigate('/privacy')}>
          Aan de slag
        </Button>
        <Button onClick={bekijkVoorbeelddata}>Bekijk met voorbeelddata</Button>
      </div>
    </Card>
  );
}
