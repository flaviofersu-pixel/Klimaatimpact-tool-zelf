// Scherm 2: wat de tool wel en niet bekijkt, en de knop om in te loggen.
import {
  Body1,
  Button,
  Card,
  makeStyles,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  MessageBarTitle,
  Spinner,
  Title1,
  Title3,
  tokens,
} from '@fluentui/react-components';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { isAfgebrokenPoging, vertaalAuthFout } from '../../auth/foutmelding';
import { useAuth } from '../../auth/useAuth';
import { useScan } from '../../state/useScan';

const useStyles = makeStyles({
  kaart: {
    maxWidth: '720px',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  lijst: {
    margin: 0,
    paddingLeft: tokens.spacingHorizontalXL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  knoppen: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
});

export function Privacy() {
  const styles = useStyles();
  const navigate = useNavigate();
  const { kanInloggen, isIngelogd, login } = useAuth();
  const { laadVoorbeelddata, startScan } = useScan();
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  // opnieuw = true als de gebruiker op "Opnieuw proberen" klikt
  async function inloggenEnBerekenen(opnieuw = false) {
    setFout(null);
    if (isIngelogd) {
      startScan();
      navigate('/scannen');
      return;
    }
    setBezig(true);
    try {
      await login(opnieuw);
      startScan();
      navigate('/scannen');
    } catch (error) {
      if (isAfgebrokenPoging(error)) {
        return; // de vorige poging is afgebroken; de nieuwe poging loopt nog
      }
      setFout(vertaalAuthFout(error));
      setBezig(false);
    }
  }

  function bekijkVoorbeelddata() {
    laadVoorbeelddata();
    navigate('/dashboard');
  }

  return (
    <>
      <Title1 as="h1">Privacy en toestemming</Title1>

      <Card className={styles.kaart}>
        <Title3 as="h2">Wat de tool bekijkt</Title3>
        <Body1>Alleen gegevens óver je bestanden in je eigen OneDrive:</Body1>
        <ul className={styles.lijst}>
          <li>de naam en de soort van een bestand</li>
          <li>hoe groot het is</li>
          <li>wanneer het voor het laatst is gewijzigd</li>
          <li>in welke map het staat</li>
          <li>hoeveel ruimte je in totaal gebruikt, en hoeveel daarvan in de prullenbak staat</li>
        </ul>

        <Title3 as="h2">Wat de tool niet doet</Title3>
        <ul className={styles.lijst}>
          <li>De tool opent geen bestanden en leest niet wat erin staat.</li>
          <li>De tool kijkt niet met wie je bestanden deelt.</li>
          <li>De tool verandert en verwijdert niets in je OneDrive.</li>
          <li>De tool bewaart niets. Sluit je dit tabblad, dan is alles weg.</li>
          <li>Er gaat niets naar andere servers dan die van Microsoft.</li>
        </ul>

        <Title3 as="h2">Toestemming</Title3>
        <Body1>
          Na het inloggen vraagt Microsoft je misschien om toestemming. De tool vraagt alleen om je naam te lezen en je
          bestanden te bekijken (alleen lezen).
        </Body1>

        {!kanInloggen && (
          <MessageBar intent="warning" layout="multiline">
            <MessageBarBody>
              <MessageBarTitle>Inloggen is nog niet ingesteld.</MessageBarTitle>
              De beheerder van deze tool moet nog een client-id invullen (VITE_CLIENT_ID in het bestand .env). Je kunt
              wel de voorbeelddata bekijken.
            </MessageBarBody>
          </MessageBar>
        )}

        {fout && (
          <MessageBar intent="error" layout="multiline">
            <MessageBarBody>{fout}</MessageBarBody>
          </MessageBar>
        )}

        {bezig && (
          <MessageBar intent="info" layout="multiline" icon={<Spinner size="tiny" />}>
            <MessageBarBody>
              <MessageBarTitle>Er staat een inlogvenster open.</MessageBarTitle>
              Zie je het niet, of heb je het gesloten? Klik dan op Opnieuw proberen.
            </MessageBarBody>
            <MessageBarActions>
              <Button onClick={() => inloggenEnBerekenen(true)}>Opnieuw proberen</Button>
            </MessageBarActions>
          </MessageBar>
        )}

        <div className={styles.knoppen}>
          <Button appearance="primary" disabled={!kanInloggen || bezig} onClick={() => inloggenEnBerekenen()}>
            Inloggen en mijn OneDrive berekenen
          </Button>
          <Button onClick={bekijkVoorbeelddata}>Bekijk met voorbeelddata</Button>
        </div>
      </Card>
    </>
  );
}
