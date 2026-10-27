// Scherm 6: welke soorten bestanden de meeste ruimte innemen, en de grootste bestanden.
import { Card, makeStyles, Title1, Title3, tokens } from '@fluentui/react-components';
import { BestandenTabel } from '../../components/BestandenTabel';
import { SoortenGrafiek } from '../../components/charts/SoortenGrafiek';
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

export function GrootsteBestanden() {
  const styles = useStyles();
  const { analyse } = useScan();

  if (!analyse) {
    return <GeenScan />;
  }

  return (
    <>
      <Title1 as="h1">Grootste bestanden en soorten</Title1>

      <Card className={styles.kaart}>
        <Title3 as="h2">Opslag per soort</Title3>
        <SoortenGrafiek groepen={analyse.perSoort} />
        <GroepenTabel groepen={analyse.perSoort} kolomNaam="Soort" beschrijving="Opslag per soort bestand" />
      </Card>

      <Card className={styles.kaart}>
        <Title3 as="h2">Je grootste bestanden</Title3>
        <BestandenTabel bestanden={analyse.grootste} beschrijving="Grootste bestanden" />
      </Card>
    </>
  );
}
