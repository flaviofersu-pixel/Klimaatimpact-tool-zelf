// Scherm 4: overzicht van de klimaatimpact van de hele OneDrive.
import { Button, Card, Field, makeStyles, ProgressBar, Title1, tokens } from '@fluentui/react-components';
import { useNavigate } from 'react-router';
import { GeenScan } from '../../components/GeenScan';
import { ImpactKaart } from '../../components/ImpactKaart';
import { LeeftijdKaart } from '../../components/LeeftijdKaart';
import { formatAantal, formatBytes } from '../../model/opmaak';
import { useScan } from '../../state/useScan';

const useStyles = makeStyles({
  kaarten: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: tokens.spacingHorizontalL,
  },
  knoppen: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalM,
  },
});

export function Dashboard() {
  const styles = useStyles();
  const navigate = useNavigate();
  const { scan, analyse } = useScan();

  if (!scan || !analyse) {
    return <GeenScan />;
  }

  const quota = scan.quota;

  return (
    <>
      <Title1 as="h1">Jouw OneDrive</Title1>

      {quota && quota.total > 0 && (
        <Card>
          <Field
            label={`Je gebruikt ${formatBytes(quota.used)} van ${formatBytes(quota.total)}`}
            hint={`${formatAantal(scan.bestanden.length, 'bestand', 'bestanden')} bekeken`}
          >
            <ProgressBar value={quota.used / quota.total} thickness="large" />
          </Field>
        </Card>
      )}

      <div className={styles.kaarten}>
        <ImpactKaart
          titel="Al je bestanden"
          impact={analyse.totaal}
          toelichting="Zolang bestanden in OneDrive staan, kosten ze elk jaar stroom."
        />
        <ImpactKaart
          titel="Prullenbak"
          impact={analyse.prullenbak}
          toelichting="Bestanden in de prullenbak tellen ook mee, tot de prullenbak is geleegd."
        />
      </div>

      <LeeftijdKaart groepen={analyse.perLeeftijd} />

      <div className={styles.knoppen}>
        <Button appearance="primary" onClick={() => navigate('/opruimen')}>
          Oude bestanden bekijken
        </Button>
        <Button onClick={() => navigate('/grootste-bestanden')}>Grootste bestanden en soorten</Button>
        <Button onClick={() => navigate('/per-map')}>Bestanden per map</Button>
        <Button onClick={() => navigate('/zo-rekenen-we')}>Zo rekenen we</Button>
      </div>
    </>
  );
}
