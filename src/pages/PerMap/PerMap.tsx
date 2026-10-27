// Scherm 7: hoeveel opslag en uitstoot elke map van de OneDrive heeft.
import { Body1, Card, makeStyles, Title1, tokens } from '@fluentui/react-components';
import { GeenScan } from '../../components/GeenScan';
import { GroepenTabel } from '../../components/GroepenTabel';
import { useScan } from '../../state/useScan';

const useStyles = makeStyles({
  kaart: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
});

export function PerMap() {
  const styles = useStyles();
  const { analyse } = useScan();

  if (!analyse) {
    return <GeenScan />;
  }

  return (
    <>
      <Title1 as="h1">Bestanden per map</Title1>
      <Card className={styles.kaart}>
        <Body1>
          Per map in de bovenste laag van je OneDrive. Submappen tellen mee bij hun bovenste map. Bestanden die los in
          je OneDrive staan, vind je onder "Hoofdmap".
        </Body1>
        <GroepenTabel groepen={analyse.perMap} kolomNaam="Map" beschrijving="Opslag per map" />
      </Card>
    </>
  );
}
