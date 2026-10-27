// Scherm 9: dialoog die uitlegt wat er gebeurt. Alleen lezen: de tool opent bestanden in OneDrive, verwijdert niets.
import {
  Body1,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Link,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { BEWAARREGELS_URL } from '../../config/links';
import { formatAantal, formatBytes } from '../../model/opmaak';
import type { Bestand } from '../../model/types';

const useStyles = makeStyles({
  inhoud: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  lijst: {
    maxHeight: '240px',
    overflowY: 'auto',
    margin: 0,
    paddingLeft: tokens.spacingHorizontalXL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  grijs: { color: tokens.colorNeutralForeground3 },
});

interface Props {
  open: boolean;
  bestanden: Bestand[];
  onSluiten: () => void;
  onNaarResultaat: () => void;
}

export function BevestigDialoog({ open, bestanden, onSluiten, onNaarResultaat }: Props) {
  const styles = useStyles();

  return (
    // Dialog van Fluent: houdt de focus in de dialoog en sluit met Escape
    <Dialog open={open} onOpenChange={(_gebeurtenis, data) => !data.open && onSluiten()}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Gekozen bestanden bekijken in OneDrive</DialogTitle>
          <DialogContent className={styles.inhoud}>
            <Body1>
              De tool verwijdert zelf niets. Hieronder staat wat je hebt gekozen (
              {formatAantal(bestanden.length, 'bestand', 'bestanden')}). Open het in OneDrive en beslis daar zelf wat je
              ermee doet.
            </Body1>
            <Body1>
              Verwijder je een bestand in OneDrive, dan gaat het eerst naar de prullenbak. Pas als de prullenbak is
              geleegd, neemt het geen ruimte meer in. Kijk vooraf in de{' '}
              <Link href={BEWAARREGELS_URL} target="_blank" rel="noreferrer">
                bewaarregels
              </Link>
              .
            </Body1>
            <ul className={styles.lijst}>
              {bestanden.map((bestand) => (
                <li key={bestand.id}>
                  {bestand.webUrl ? (
                    <Link href={bestand.webUrl} target="_blank" rel="noreferrer">
                      {bestand.naam}
                      <span className={styles.grijs}> ({formatBytes(bestand.grootte)}, opent in een nieuw tabblad)</span>
                    </Link>
                  ) : (
                    <span>
                      {bestand.naam}
                      <span className={styles.grijs}> (voorbeeldbestand, bestaat niet echt)</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </DialogContent>
          <DialogActions>
            <Button appearance="primary" onClick={onNaarResultaat}>
              Naar het resultaat
            </Button>
            <Button onClick={onSluiten}>Sluiten</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
