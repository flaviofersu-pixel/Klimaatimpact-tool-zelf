// Tabel met groepen (soorten of mappen): aantal bestanden, grootte, stroom en uitstoot per jaar.
import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@fluentui/react-components';
import { formatBandbreedte, formatBytes } from '../model/opmaak';
import type { Groep } from '../model/types';

const useStyles = makeStyles({
  schuifvlak: { overflowX: 'auto' },
  tabel: { minWidth: '560px' },
  getal: { textAlign: 'right' },
  // De kop van een getalkolom ook rechts, net als de getallen eronder
  getalKop: { '& .fui-TableHeaderCell__button': { justifyContent: 'flex-end' } },
});

interface Props {
  groepen: Groep[];
  kolomNaam: string; // kop van de eerste kolom, bijvoorbeeld "Soort" of "Map"
  beschrijving: string; // voor schermlezers
}

export function GroepenTabel({ groepen, kolomNaam, beschrijving }: Props) {
  const styles = useStyles();

  if (groepen.length === 0) {
    return <p>Geen bestanden gevonden.</p>;
  }

  return (
    <div className={styles.schuifvlak}>
      <Table aria-label={beschrijving} className={styles.tabel}>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>{kolomNaam}</TableHeaderCell>
            <TableHeaderCell className={styles.getalKop}>Bestanden</TableHeaderCell>
            <TableHeaderCell className={styles.getalKop}>Grootte</TableHeaderCell>
            <TableHeaderCell>Stroom per jaar</TableHeaderCell>
            <TableHeaderCell>Uitstoot per jaar</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groepen.map((groep) => (
            <TableRow key={groep.naam}>
              <TableCell>{groep.naam}</TableCell>
              <TableCell className={styles.getal}>{groep.aantal}</TableCell>
              <TableCell className={styles.getal}>{formatBytes(groep.impact.bytes)}</TableCell>
              <TableCell>{formatBandbreedte(groep.impact.kwhPerJaar, 'kWh')}</TableCell>
              <TableCell>{formatBandbreedte(groep.impact.kgCo2PerJaar, 'kg CO₂')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
