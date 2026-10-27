// Scherm 10: de mogelijke besparing van de gekozen bestanden, en tips om minder op te slaan.
import { Body1, Button, Card, makeStyles, Title1, Title3, tokens } from '@fluentui/react-components';
import { useNavigate } from 'react-router';
import { GeenScan } from '../../components/GeenScan';
import { ImpactKaart } from '../../components/ImpactKaart';
import { useScan } from '../../state/useScan';

const useStyles = makeStyles({
  kaarten: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: tokens.spacingHorizontalL,
  },
  kaart: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  tips: {
    margin: 0,
    paddingLeft: tokens.spacingHorizontalXL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  knoppen: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalM,
  },
});

const TIPS = [
  'Deel een link naar het bestand in plaats van het als bijlage te mailen. Dan staat er maar één kopie.',
  'Bewaar één versie op één plek, in plaats van kopieën in meerdere mappen.',
  "Grote video's en foto's nemen de meeste ruimte in. Kijk of ze al op een gedeelde plek staan.",
  'Bestanden in de prullenbak kosten ook opslag, tot de prullenbak is geleegd.',
  'Kijk één keer per jaar naar je oude bestanden, met de bewaarregels erbij.',
];

export function Resultaat() {
  const styles = useStyles();
  const navigate = useNavigate();
  const { analyse, selectie } = useScan();

  if (!analyse) {
    return <GeenScan />;
  }

  const aantalGekozen = selectie.gekozen.length;

  return (
    <>
      <Title1 as="h1">Resultaat en tips</Title1>

      <div className={styles.kaarten}>
        {aantalGekozen > 0 ? (
          <ImpactKaart
            titel="Mogelijke besparing"
            impact={selectie.besparing}
            toelichting={`Als de ${aantalGekozen} gekozen bestanden niet meer in OneDrive staan, en ook niet meer in de prullenbak.`}
          />
        ) : (
          <Card className={styles.kaart}>
            <Title3 as="h2">Mogelijke besparing</Title3>
            <Body1>Je hebt nog geen bestanden gekozen.</Body1>
            <div>
              <Button onClick={() => navigate('/opruimen')}>Oude bestanden bekijken</Button>
            </div>
          </Card>
        )}
        <ImpactKaart titel="Al je bestanden nu" impact={analyse.totaal} />
      </div>

      <Card className={styles.kaart}>
        <Title3 as="h2">Tips</Title3>
        <ul className={styles.tips}>
          {TIPS.map((tip) => (
            <li key={tip}>
              <Body1>{tip}</Body1>
            </li>
          ))}
        </ul>
      </Card>

      <div className={styles.knoppen}>
        <Button onClick={() => navigate('/opruimen')}>Terug naar oude bestanden</Button>
        <Button onClick={() => navigate('/dashboard')}>Naar het dashboard</Button>
      </div>
    </>
  );
}
