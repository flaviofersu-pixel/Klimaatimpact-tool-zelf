// Tabel met bestanden: naam, map, grootte en datum van laatste wijziging.
import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  tokens,
} from '@fluentui/react-components';
import { formatBytes, formatDatum } from '../model/opmaak';
import type { Bestand } from '../model/types';

const useStyles = makeStyles({
  // Op een smal scherm kun je de tabel opzij schuiven in plaats van dat de pagina breder wordt
  schuifvlak: { overflowX: 'auto' },
  tabel: { minWidth: '520px' },
  naam: { wordBreak: 'break-word' },
  getal: { textAlign: 'right' },
  // De kop van een getalkolom ook rechts, net als de getallen eronder
  getalKop: { '& .fui-TableHeaderCell__button': { justifyContent: 'flex-end' } },
  leeg: { padding: tokens.spacingVerticalM },
});

interface Props {
  bestanden: Bestand[];
  beschrijving: string; // voor schermlezers: wat staat er in de tabel?
}

export function BestandenTabel({ bestanden, beschrijving }: Props) {
  const styles = useStyles();

  if (bestanden.length === 0) {
    return <p className={styles.leeg}>Geen bestanden om te tonen.</p>;
  }

  return (
    <div className={styles.schuifvlak}>
      <Table aria-label={beschrijving} className={styles.tabel}>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Naam</TableHeaderCell>
            <TableHeaderCell>Map</TableHeaderCell>
            <TableHeaderCell className={styles.getalKop}>Grootte</TableHeaderCell>
            <TableHeaderCell>Gewijzigd</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bestanden.map((bestand) => (
            <TableRow key={bestand.id}>
              <TableCell className={styles.naam}>{bestand.naam}</TableCell>
              <TableCell>{bestand.map}</TableCell>
              <TableCell className={styles.getal}>{formatBytes(bestand.grootte)}</TableCell>
              <TableCell>{formatDatum(bestand.gewijzigdOp)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
