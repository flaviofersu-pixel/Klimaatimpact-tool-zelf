// Staafgrafiek met de opslag per bestandssoort. Met een tekstalternatief voor schermlezers.
import { makeStyles, tokens } from '@fluentui/react-components';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatBytes } from '../../model/opmaak';
import type { Groep } from '../../model/types';

const useStyles = makeStyles({
  figuur: {
    margin: 0,
    // Kleuren via CSS, zodat ze meeveranderen met het Fluent-thema (ook donker en Teams)
    '& .recharts-rectangle': { fill: tokens.colorBrandBackground },
    '& .recharts-cartesian-axis-tick-value': { fill: tokens.colorNeutralForeground1 },
    '& .recharts-cartesian-grid line': { stroke: tokens.colorNeutralStroke2 },
  },
  // Tekst die alleen schermlezers voorlezen; op het scherm onzichtbaar
  alleenSchermlezer: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
  },
});

interface Props {
  groepen: Groep[];
}

// Recharts wil een simpele lijst met getallen. Grootte in GB, zodat de as leesbaar is.
function maakGrafiekData(groepen: Groep[]) {
  return groepen.map((groep) => ({
    naam: groep.naam,
    gb: groep.impact.bytes / 1e9,
    bytes: groep.impact.bytes,
  }));
}

export function SoortenGrafiek({ groepen }: Props) {
  const styles = useStyles();
  const data = maakGrafiekData(groepen);
  const samenvatting = groepen.map((groep) => `${groep.naam}: ${formatBytes(groep.impact.bytes)}`).join(', ');

  return (
    <figure className={styles.figuur}>
      {/* De grafiek zelf is voor schermlezers verborgen; de tekst eronder vertelt hetzelfde */}
      <div aria-hidden="true" style={{ width: '100%', height: Math.max(200, data.length * 44) }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid horizontal={false} />
            <XAxis type="number" unit=" GB" tickFormatter={(gb: number) => gb.toLocaleString('nl-NL')} />
            <YAxis type="category" dataKey="naam" width={100} />
            <Tooltip formatter={(_waarde, _naam, item) => [formatBytes(item.payload.bytes), 'Opslag']} />
            <Bar dataKey="gb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <figcaption className={styles.alleenSchermlezer}>Opslag per soort. {samenvatting}.</figcaption>
    </figure>
  );
}
