// Scherm 8: bestanden die langer dan een half jaar niet zijn gewijzigd, te sorteren en te selecteren.
import {
  Body1,
  Button,
  Card,
  Link,
  makeStyles,
  mergeClasses,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSelectionCell,
  Title1,
  tokens,
} from '@fluentui/react-components';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { GeenScan } from '../../components/GeenScan';
import { BEWAARREGELS_URL } from '../../config/links';
import { formatAantal, formatBandbreedte, formatBytes, formatDatum } from '../../model/opmaak';
import { sorteerBestanden, type SorteerKolom, type SorteerRichting } from '../../model/opruimen';
import { useScan } from '../../state/useScan';
import { BevestigDialoog } from './BevestigDialoog';

const useStyles = makeStyles({
  kaart: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  schuifvlak: { overflowX: 'auto' },
  tabel: { minWidth: '600px' },
  naam: { wordBreak: 'break-word' },
  getal: { textAlign: 'right' },
  // De samenvatting blijft onderaan in beeld, ook als je door een lange lijst scrolt
  samenvatting: {
    position: 'sticky',
    bottom: 0,
    zIndex: 1,
    boxShadow: tokens.shadow16,
  },
  knoppen: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalM,
  },
});

const STAP = 100; // zoveel rijen tonen we per keer, zodat de pagina snel blijft

const KOLOMMEN: { kolom: SorteerKolom; titel: string }[] = [
  { kolom: 'naam', titel: 'Naam' },
  { kolom: 'map', titel: 'Map' },
  { kolom: 'grootte', titel: 'Grootte' },
  { kolom: 'gewijzigdOp', titel: 'Gewijzigd' },
];

interface Sortering {
  kolom: SorteerKolom;
  richting: SorteerRichting;
}

export function Opruimen() {
  const styles = useStyles();
  const navigate = useNavigate();
  const { analyse, oudeBestanden, selectie, kiesBestanden } = useScan();
  const [sortering, setSortering] = useState<Sortering>({ kolom: 'grootte', richting: 'aflopend' });
  const [aantalZichtbaar, setAantalZichtbaar] = useState(STAP);
  const [dialoogOpen, setDialoogOpen] = useState(false);

  const gesorteerd = useMemo(
    () => sorteerBestanden(oudeBestanden, sortering.kolom, sortering.richting),
    [oudeBestanden, sortering],
  );

  if (!analyse) {
    return <GeenScan />;
  }

  const zichtbaar = gesorteerd.slice(0, aantalZichtbaar);
  const gekozenIds = new Set(selectie.gekozen);
  const gekozenBestanden = oudeBestanden.filter((bestand) => gekozenIds.has(bestand.id));
  const aantalZichtbaarGekozen = zichtbaar.filter((bestand) => gekozenIds.has(bestand.id)).length;

  // Klik op dezelfde kolom: richting omdraaien. Klik op een andere kolom: daarop sorteren.
  function wisselSortering(kolom: SorteerKolom) {
    if (sortering.kolom === kolom) {
      setSortering({ kolom, richting: sortering.richting === 'oplopend' ? 'aflopend' : 'oplopend' });
    } else {
      setSortering({ kolom, richting: kolom === 'naam' || kolom === 'map' ? 'oplopend' : 'aflopend' });
    }
  }

  function wisselBestand(id: string) {
    if (gekozenIds.has(id)) {
      kiesBestanden(selectie.gekozen.filter((gekozenId) => gekozenId !== id));
    } else {
      kiesBestanden([...selectie.gekozen, id]);
    }
  }

  // Het vinkje in de kop: alle zichtbare rijen aan, of (als ze al aan staan) allemaal uit.
  function wisselAlleZichtbare() {
    const zichtbareIds = zichtbaar.map((bestand) => bestand.id);
    if (aantalZichtbaarGekozen === zichtbaar.length) {
      kiesBestanden(selectie.gekozen.filter((id) => !zichtbareIds.includes(id)));
    } else {
      kiesBestanden([...new Set([...selectie.gekozen, ...zichtbareIds])]);
    }
  }

  function richtingVoorFluent(kolom: SorteerKolom) {
    if (sortering.kolom !== kolom) {
      return undefined;
    }
    return sortering.richting === 'oplopend' ? 'ascending' : 'descending';
  }

  let kopVinkje: boolean | 'mixed' = false;
  if (aantalZichtbaarGekozen > 0) {
    kopVinkje = aantalZichtbaarGekozen === zichtbaar.length ? true : 'mixed';
  }

  return (
    <>
      <Title1 as="h1">Oude bestanden bekijken</Title1>

      <MessageBar intent="warning" layout="multiline">
        <MessageBarBody>
          <MessageBarTitle>Let op de bewaartermijnen.</MessageBarTitle>
          Sommige documenten moet de gemeente bewaren, soms lang, volgens de Archiefwet en de selectielijst. Dat een
          bestand oud is, zegt niets over of je het nog moet bewaren. Twijfel je? Vraag het je informatiebeheerder.{' '}
          <Link href={BEWAARREGELS_URL} target="_blank" rel="noreferrer">
            Bekijk de bewaarregels (opent in een nieuw tabblad)
          </Link>
        </MessageBarBody>
      </MessageBar>

      <Card className={styles.kaart}>
        {oudeBestanden.length === 0 ? (
          <Body1>Je hebt geen bestanden die langer dan een half jaar niet zijn gewijzigd.</Body1>
        ) : (
          <Body1>
            {formatAantal(oudeBestanden.length, 'bestand is', 'bestanden zijn')} langer dan een half jaar niet
            gewijzigd. Kies wat je in OneDrive wilt bekijken.
          </Body1>
        )}

        {oudeBestanden.length > 0 && (
          <div className={styles.schuifvlak}>
            <Table sortable aria-label="Bestanden ouder dan een half jaar" className={styles.tabel}>
              <TableHeader>
                <TableRow>
                  <TableSelectionCell
                    checked={kopVinkje}
                    onClick={wisselAlleZichtbare}
                    checkboxIndicator={{ 'aria-label': 'Alle getoonde bestanden kiezen' }}
                  />
                  {KOLOMMEN.map(({ kolom, titel }) => (
                    <TableHeaderCell
                      key={kolom}
                      sortDirection={richtingVoorFluent(kolom)}
                      onClick={() => wisselSortering(kolom)}
                    >
                      {titel}
                    </TableHeaderCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {zichtbaar.map((bestand) => (
                  <TableRow key={bestand.id}>
                    <TableSelectionCell
                      checked={gekozenIds.has(bestand.id)}
                      onClick={() => wisselBestand(bestand.id)}
                      checkboxIndicator={{ 'aria-label': `${bestand.naam} kiezen` }}
                    />
                    <TableCell className={styles.naam}>{bestand.naam}</TableCell>
                    <TableCell>{bestand.map}</TableCell>
                    <TableCell className={styles.getal}>{formatBytes(bestand.grootte)}</TableCell>
                    <TableCell>{formatDatum(bestand.gewijzigdOp)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {gesorteerd.length > aantalZichtbaar && (
          <div>
            <Button onClick={() => setAantalZichtbaar(aantalZichtbaar + STAP)}>
              Meer tonen ({gesorteerd.length - aantalZichtbaar} over)
            </Button>
          </div>
        )}
      </Card>

      <Card className={mergeClasses(styles.kaart, styles.samenvatting)}>
        {/* role="status": schermlezers horen de nieuwe telling na elk vinkje */}
        <Body1 role="status">
          {gekozenBestanden.length === 0
            ? 'Je hebt nog geen bestanden gekozen.'
            : `Gekozen: ${formatAantal(gekozenBestanden.length, 'bestand', 'bestanden')}, samen ${formatBytes(selectie.besparing.bytes)}. Staan ze niet meer in OneDrive, dan scheelt dat ${formatBandbreedte(selectie.besparing.kgCo2PerJaar, 'kg CO₂ per jaar')}.`}
        </Body1>
        <div className={styles.knoppen}>
          <Button appearance="primary" disabled={gekozenBestanden.length === 0} onClick={() => setDialoogOpen(true)}>
            Gekozen bestanden bekijken in OneDrive
          </Button>
          <Button onClick={() => navigate('/resultaat')}>Naar het resultaat</Button>
        </div>
      </Card>

      <BevestigDialoog
        open={dialoogOpen}
        bestanden={gekozenBestanden}
        onSluiten={() => setDialoogOpen(false)}
        onNaarResultaat={() => navigate('/resultaat')}
      />
    </>
  );
}
