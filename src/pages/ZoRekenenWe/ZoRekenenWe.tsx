// Scherm 5: uitleg van het rekenmodel, met de factoren, hun bronnen en een rekenvoorbeeld.
import {
  Body1,
  Card,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Title1,
  Title3,
  tokens,
} from '@fluentui/react-components';
import { rekenConfig } from '../../model/config';
import { formatBandbreedte, formatBytes, formatExact } from '../../model/opmaak';
import { useScan } from '../../state/useScan';

const useStyles = makeStyles({
  kaart: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  formule: {
    fontFamily: tokens.fontFamilyMonospace,
    backgroundColor: tokens.colorNeutralBackground3,
    padding: tokens.spacingHorizontalM,
    borderRadius: tokens.borderRadiusMedium,
    overflowX: 'auto',
    margin: 0,
  },
  schuifvlak: { overflowX: 'auto' },
});

// De rijen van de tabel met factoren. Getallen met Nederlandse komma.
function maakFactorRijen() {
  const c = rekenConfig;
  return [
    { naam: 'Stroom per TB opslag', laag: `${formatExact(c.wattPerTB.laag)} W`, hoog: `${formatExact(c.wattPerTB.hoog)} W`, bron: c.bron.wattPerTB },
    { naam: 'Aantal kopieën', laag: formatExact(c.kopieen), hoog: formatExact(c.kopieen), bron: c.bron.kopieen },
    { naam: 'PUE (extra stroom datacenter)', laag: formatExact(c.pue), hoog: formatExact(c.pue), bron: c.bron.pue },
    { naam: 'Uren per jaar', laag: formatExact(c.urenPerJaar), hoog: formatExact(c.urenPerJaar), bron: c.bron.urenPerJaar },
    { naam: 'CO₂ per kWh', laag: `${formatExact(c.kgCo2PerKwh.laag)} kg`, hoog: `${formatExact(c.kgCo2PerKwh.hoog)} kg`, bron: c.bron.kgCo2PerKwh },
  ];
}

export function ZoRekenenWe() {
  const styles = useStyles();
  const { analyse } = useScan();

  return (
    <>
      <Title1 as="h1">Zo rekenen we</Title1>

      <Card className={styles.kaart}>
        <Title3 as="h2">De formule</Title3>
        <pre className={styles.formule}>
          {'kWh per jaar    = TB × watt per TB × kopieën × PUE × uren per jaar ÷ 1000\n'}
          {'kg CO₂ per jaar = kWh per jaar × kg CO₂ per kWh'}
        </pre>
        <Body1>
          We weten niet precies hoeveel stroom Microsoft per terabyte gebruikt. Daarom rekenen we twee keer: met een
          lage en met een hoge schatting. De echte waarde ligt waarschijnlijk daartussen. We rekenen met 1 TB = 1000
          GB, net als de bronnen.
        </Body1>
      </Card>

      <Card className={styles.kaart}>
        <Title3 as="h2">De factoren en hun bronnen</Title3>
        <div className={styles.schuifvlak}>
          <Table aria-label="Factoren van het rekenmodel">
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Factor</TableHeaderCell>
                <TableHeaderCell>Laag</TableHeaderCell>
                <TableHeaderCell>Hoog</TableHeaderCell>
                <TableHeaderCell>Bron</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maakFactorRijen().map((rij) => (
                <TableRow key={rij.naam}>
                  <TableCell>{rij.naam}</TableCell>
                  <TableCell>{rij.laag}</TableCell>
                  <TableCell>{rij.hoog}</TableCell>
                  <TableCell>{rij.bron}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {analyse && (
        <Card className={styles.kaart}>
          <Title3 as="h2">Voor jouw OneDrive</Title3>
          <Body1>
            Je bestanden zijn samen {formatBytes(analyse.totaal.bytes)}. Dat kost{' '}
            {formatBandbreedte(analyse.totaal.kwhPerJaar, 'kWh per jaar')} en geeft{' '}
            {formatBandbreedte(analyse.totaal.kgCo2PerJaar, 'kg CO₂ per jaar')}.
          </Body1>
        </Card>
      )}
    </>
  );
}
