// Kaart die laat zien hoeveel opslag nieuw, een half jaar of meer dan een jaar oud is.
import { Card, CardHeader, Field, makeStyles, ProgressBar, Text, tokens } from '@fluentui/react-components';
import { formatAantal, formatBandbreedte, formatBytes } from '../model/opmaak';
import type { Groep } from '../model/types';

const useStyles = makeStyles({
  lijst: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
});

interface Props {
  groepen: Groep[];
}

export function LeeftijdKaart({ groepen }: Props) {
  const styles = useStyles();

  let totaal = 0;
  for (const groep of groepen) {
    totaal += groep.impact.bytes;
  }

  return (
    <Card>
      <CardHeader
        header={<Text as="h2" weight="semibold" size={400}>Hoe oud zijn je bestanden?</Text>}
        description="Gerekend vanaf de laatste keer dat een bestand is gewijzigd."
      />
      <div className={styles.lijst}>
        {groepen.map((groep) => {
          // Aandeel tussen 0 en 1 voor de balk. Bij een lege OneDrive is alles 0.
          const aandeel = totaal > 0 ? groep.impact.bytes / totaal : 0;
          return (
            <Field
              key={groep.naam}
              label={`${groep.naam}: ${formatAantal(groep.aantal, 'bestand', 'bestanden')}, ${formatBytes(groep.impact.bytes)}`}
              hint={formatBandbreedte(groep.impact.kgCo2PerJaar, 'kg CO₂ per jaar')}
            >
              <ProgressBar value={aandeel} thickness="large" />
            </Field>
          );
        })}
      </div>
    </Card>
  );
}
