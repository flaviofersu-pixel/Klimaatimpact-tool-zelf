// Dialoog vóór het verplaatsen: wat er gebeurt, wat je kwijtraakt, en daarna de voortgang en de uitkomst.
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
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  ProgressBar,
  tokens,
} from '@fluentui/react-components';
import { BEWAARREGELS_URL } from '../../config/links';
import { zoekDubbeleNamen } from '../../model/mappen';
import { formatAantal, formatBytes } from '../../model/opmaak';
import type { MapItem, VerplaatsResultaat } from '../../model/types';

const useStyles = makeStyles({
  inhoud: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  lijst: {
    maxHeight: '200px',
    overflowY: 'auto',
    margin: 0,
    paddingLeft: tokens.spacingHorizontalXL,
  },
  gelukt: { color: tokens.colorPaletteGreenForeground1 },
  mislukt: { color: tokens.colorPaletteRedForeground1 },
});

interface Props {
  open: boolean;
  bestanden: MapItem[]; // wat de medewerker wil verplaatsen
  doelNaam: string; // "Team Duurzaamheid › Projecten"
  inDoelmap: MapItem[]; // wat er al in de doelmap staat, om dubbele namen te vinden
  bezig: boolean;
  aantalKlaar: number;
  resultaten: VerplaatsResultaat[];
  onVerplaats: (bestanden: MapItem[]) => void;
  onSluiten: () => void;
}

export function VerplaatsDialoog(props: Props) {
  const { open, bestanden, doelNaam, inDoelmap, bezig, aantalKlaar, resultaten, onVerplaats, onSluiten } = props;
  const styles = useStyles();

  // Bestanden met een naam die er al staat, slaan we over. Anders zou je een bestand van een collega overschrijven.
  const dubbeleNamen = zoekDubbeleNamen(bestanden, inDoelmap);
  const teVerplaatsen = bestanden.filter((bestand) => !dubbeleNamen.includes(bestand.naam));
  const isKlaar = !bezig && resultaten.length > 0;

  return (
    // Tijdens het verplaatsen kun je de dialoog niet sluiten: dan zou je niet zien hoe het afloopt.
    <Dialog open={open} modalType="alert" onOpenChange={(_gebeurtenis, data) => !data.open && !bezig && onSluiten()}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{isKlaar ? 'Klaar met verplaatsen' : `Verplaatsen naar ${doelNaam}`}</DialogTitle>
          <DialogContent className={styles.inhoud}>
            {!bezig && !isKlaar && (
              <>
                <Body1>
                  {formatAantal(teVerplaatsen.length, 'bestand gaat', 'bestanden gaan')} van je OneDrive naar{' '}
                  <strong>{doelNaam}</strong>. Daarna staan ze niet meer in je OneDrive (ze gaan naar je prullenbak).
                </Body1>
                <ul className={styles.lijst}>
                  {teVerplaatsen.map((bestand) => (
                    <li key={bestand.id}>
                      {bestand.naam} ({formatBytes(bestand.grootte)})
                    </li>
                  ))}
                </ul>

                {dubbeleNamen.length > 0 && (
                  <MessageBar intent="warning" layout="multiline">
                    <MessageBarBody>
                      <MessageBarTitle>Deze bestanden slaan we over.</MessageBarTitle>
                      In de doelmap staat al een bestand met dezelfde naam: {dubbeleNamen.join(', ')}. Geef het je
                      bestand in OneDrive eerst een andere naam als je allebei wilt houden.
                    </MessageBarBody>
                  </MessageBar>
                )}

                <MessageBar intent="info" layout="multiline">
                  <MessageBarBody>
                    <MessageBarTitle>Goed om te weten.</MessageBarTitle>
                    De eerdere versies van het bestand gaan niet mee. Links die je eerder hebt gedeeld, werken niet meer.
                    In de teamsite kunnen al je teamgenoten het bestand zien. Werkdocumenten horen vaak in de teamsite,
                    omdat daar de{' '}
                    <Link href={BEWAARREGELS_URL} target="_blank" rel="noreferrer">
                      bewaarregels
                    </Link>{' '}
                    gelden.
                  </MessageBarBody>
                </MessageBar>
              </>
            )}

            {bezig && (
              <>
                <Body1 role="status">
                  Bezig: {aantalKlaar} van {teVerplaatsen.length} klaar. Sluit dit tabblad niet.
                </Body1>
                <ProgressBar value={aantalKlaar} max={Math.max(teVerplaatsen.length, 1)} />
              </>
            )}

            {isKlaar && (
              <ul className={styles.lijst} role="status">
                {resultaten.map((resultaat) => (
                  <li key={resultaat.naam}>
                    {resultaat.naam}:{' '}
                    {resultaat.gelukt ? (
                      <span className={styles.gelukt}>verplaatst</span>
                    ) : (
                      <span className={styles.mislukt}>{resultaat.melding}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </DialogContent>
          <DialogActions>
            {!bezig && !isKlaar && (
              <Button appearance="primary" disabled={teVerplaatsen.length === 0} onClick={() => onVerplaats(teVerplaatsen)}>
                Verplaatsen
              </Button>
            )}
            <Button disabled={bezig} onClick={onSluiten}>
              {isKlaar ? 'Sluiten' : 'Annuleren'}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
