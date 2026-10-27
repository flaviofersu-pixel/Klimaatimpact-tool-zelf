// Kaart met de klimaatimpact van een hoeveelheid opslag: grootte, kWh en CO2 per jaar als bandbreedte.
import { Card, CardHeader, makeStyles, Text, tokens } from '@fluentui/react-components';
import { formatBandbreedte, formatBytes } from '../model/opmaak';
import type { Impact } from '../model/types';

const useStyles = makeStyles({
  kaart: { height: '100%' },
  regels: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  groot: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
  },
});

interface Props {
  titel: string;
  impact: Impact;
  toelichting?: string;
}

export function ImpactKaart({ titel, impact, toelichting }: Props) {
  const styles = useStyles();

  return (
    <Card className={styles.kaart}>
      <CardHeader header={<Text as="h2" weight="semibold" size={400}>{titel}</Text>} />
      <div className={styles.regels}>
        <Text className={styles.groot}>{formatBytes(impact.bytes)}</Text>
        <Text>Stroom: {formatBandbreedte(impact.kwhPerJaar, 'kWh per jaar')}</Text>
        <Text>Uitstoot: {formatBandbreedte(impact.kgCo2PerJaar, 'kg CO₂ per jaar')}</Text>
        {toelichting && <Text size={200}>{toelichting}</Text>}
      </div>
    </Card>
  );
}
