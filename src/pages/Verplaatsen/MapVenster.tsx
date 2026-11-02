// Eén van de twee tabellen op het Verplaatsen-scherm: kruimelpad, mappen en bestanden, en wat de map kost.
// Links (OneDrive) kun je bestanden kiezen en slepen. Rechts (SharePoint) kun je ze loslaten.
import {
  Body1,
  Button,
  Card,
  Caption1,
  makeStyles,
  mergeClasses,
  MessageBar,
  MessageBarBody,
  Spinner,
  Subtitle2,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSelectionCell,
  tokens,
} from '@fluentui/react-components';
import { useState, type DragEvent, type ReactNode } from 'react';
import { rekenConfig } from '../../model/config';
import { grootteVanItems } from '../../model/mappen';
import { formatBandbreedte, formatBytes, formatDatum } from '../../model/opmaak';
import { berekenImpact } from '../../model/rekenmodel';
import type { MapItem } from '../../model/types';
import type { MapVenster as MapVensterStand } from '../../state/useMapVenster';

// Onder deze naam zetten we het id van een bestand in het "sleeppakketje" van de browser.
const SLEEP_TYPE = 'text/plain';

const useStyles = makeStyles({
  kaart: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    minWidth: 0, // anders duwt een brede tabel de kaart buiten het scherm
  },
  // Zichtbaar als je een bestand boven deze tabel sleept
  sleepDoel: {
    outline: `2px dashed ${tokens.colorBrandStroke1}`,
    outlineOffset: '2px',
    backgroundColor: tokens.colorBrandBackground2,
  },
  kruimelpad: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXXS,
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  schuifvlak: { overflowX: 'auto', maxHeight: '420px', overflowY: 'auto' },
  tabel: { minWidth: '360px' },
  naam: { wordBreak: 'break-word' },
  getal: { textAlign: 'right', whiteSpace: 'nowrap' },
  sleepbaar: { cursor: 'grab' },
  grijs: { color: tokens.colorNeutralForeground3 },
});

interface Props {
  titel: string;
  venster: MapVensterStand;
  kop?: ReactNode; // extra regel bovenaan, bijvoorbeeld de keuze van het team
  leegTekst?: string; // als er nog geen opslagplek is gekozen
  // Alleen links: bestanden kiezen en slepen
  gekozenIds?: Set<string>;
  onWisselBestand?: (id: string) => void;
  // Alleen rechts: een bestand loslaten in de open map
  onLosgelaten?: (bestandId: string) => void;
}

export function MapVenster({ titel, venster, kop, leegTekst, gekozenIds, onWisselBestand, onLosgelaten }: Props) {
  const styles = useStyles();
  const [sleeptErBoven, setSleeptErBoven] = useState(false);
  const kanKiezen = onWisselBestand !== undefined;
  const isSleepDoel = onLosgelaten !== undefined && venster.plek !== null;

  // Standaard mag je in de browser nergens iets loslaten. preventDefault() zegt: hier wel.
  function bijSlepenErboven(gebeurtenis: DragEvent) {
    if (!isSleepDoel) {
      return;
    }
    gebeurtenis.preventDefault();
    gebeurtenis.dataTransfer.dropEffect = 'move';
    setSleeptErBoven(true);
  }

  function bijLoslaten(gebeurtenis: DragEvent) {
    if (!isSleepDoel) {
      return;
    }
    gebeurtenis.preventDefault();
    setSleeptErBoven(false);
    const bestandId = gebeurtenis.dataTransfer.getData(SLEEP_TYPE);
    if (bestandId) {
      onLosgelaten(bestandId);
    }
  }

  function bijStartSlepen(gebeurtenis: DragEvent, item: MapItem) {
    gebeurtenis.dataTransfer.setData(SLEEP_TYPE, item.id);
    gebeurtenis.dataTransfer.effectAllowed = 'move';
  }

  const impact = berekenImpact(grootteVanItems(venster.items), rekenConfig);

  return (
    <Card
      className={mergeClasses(styles.kaart, sleeptErBoven && styles.sleepDoel)}
      onDragOver={bijSlepenErboven}
      onDragLeave={() => setSleeptErBoven(false)}
      onDrop={bijLoslaten}
    >
      <Subtitle2 as="h2">{titel}</Subtitle2>
      {kop}

      {venster.plek === null ? (
        <Body1 className={styles.grijs}>{leegTekst}</Body1>
      ) : (
        <>
          {/* Kruimelpad: klik op een eerdere map om terug te gaan */}
          <nav aria-label={`Pad in ${titel}`}>
            <ol className={styles.kruimelpad}>
              {venster.pad.map((stap, index) => {
                const isLaatste = index === venster.pad.length - 1;
                return (
                  <li key={stap.id}>
                    {index > 0 && <span aria-hidden="true"> › </span>}
                    {isLaatste ? (
                      <Body1 aria-current="location">
                        <strong>{stap.naam}</strong>
                      </Body1>
                    ) : (
                      <Button appearance="transparent" size="small" onClick={() => venster.gaNaarStap(index)}>
                        {stap.naam}
                      </Button>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          {venster.fout && (
            <MessageBar intent="error" layout="multiline">
              <MessageBarBody>{venster.fout}</MessageBarBody>
            </MessageBar>
          )}

          {venster.laden ? (
            <Spinner size="small" label="Map openen..." />
          ) : (
            <MapTabel
              titel={titel}
              items={venster.items}
              kanKiezen={kanKiezen}
              gekozenIds={gekozenIds}
              onWisselBestand={onWisselBestand}
              onOpenMap={venster.openMap}
              onStartSlepen={bijStartSlepen}
            />
          )}

          <Caption1 className={styles.grijs}>
            In deze map: {formatBytes(impact.bytes)}, {formatBandbreedte(impact.kgCo2PerJaar, 'kg CO₂ per jaar')}.
          </Caption1>
        </>
      )}
    </Card>
  );
}

interface TabelProps {
  titel: string;
  items: MapItem[];
  kanKiezen: boolean;
  gekozenIds?: Set<string>;
  onWisselBestand?: (id: string) => void;
  onOpenMap: (map: MapItem) => void;
  onStartSlepen: (gebeurtenis: DragEvent, item: MapItem) => void;
}

function MapTabel({ titel, items, kanKiezen, gekozenIds, onWisselBestand, onOpenMap, onStartSlepen }: TabelProps) {
  const styles = useStyles();

  if (items.length === 0) {
    return <Body1 className={styles.grijs}>Deze map is leeg.</Body1>;
  }

  return (
    <div className={styles.schuifvlak}>
      <Table size="small" aria-label={`Inhoud van de map in ${titel}`} className={styles.tabel}>
        <TableHeader>
          <TableRow>
            {kanKiezen && <TableHeaderCell aria-label="Kiezen" />}
            <TableHeaderCell>Naam</TableHeaderCell>
            <TableHeaderCell>Grootte</TableHeaderCell>
            <TableHeaderCell>Gewijzigd</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            // Alleen bestanden kun je slepen. Mappen open je met een klik.
            const kanSlepen = kanKiezen && !item.isMap;
            return (
              <TableRow
                key={item.id}
                draggable={kanSlepen}
                onDragStart={kanSlepen ? (gebeurtenis) => onStartSlepen(gebeurtenis, item) : undefined}
                className={kanSlepen ? styles.sleepbaar : undefined}
              >
                {kanKiezen &&
                  (item.isMap ? (
                    <TableCell />
                  ) : (
                    <TableSelectionCell
                      checked={gekozenIds?.has(item.id) ?? false}
                      onClick={() => onWisselBestand?.(item.id)}
                      checkboxIndicator={{ 'aria-label': `${item.naam} kiezen` }}
                    />
                  ))}
                <TableCell className={styles.naam}>
                  {item.isMap ? (
                    <Button appearance="transparent" size="small" onClick={() => onOpenMap(item)}>
                      <span aria-hidden="true">📁&nbsp;</span>
                      {item.naam}
                    </Button>
                  ) : (
                    item.naam
                  )}
                </TableCell>
                <TableCell className={styles.getal}>{formatBytes(item.grootte)}</TableCell>
                <TableCell>{formatDatum(item.gewijzigdOp)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
