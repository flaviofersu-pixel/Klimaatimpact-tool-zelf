// Staafgrafiek met de opslag per bestandssoort. Met een tekstalternatief voor schermlezers.
import { makeStyles, tokens } from '@fluentui/react-components';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatBytes, kiesEenheid } from '../../model/opmaak';
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

// Recharts wil een simpele lijst met getallen. We rekenen om naar de eenheid van de as (bijvoorbeeld GB).
function maakGrafiekData(groepen: Groep[], deler: number) {
  return groepen.map((groep) => ({
    naam: groep.naam,
    waarde: groep.impact.bytes / deler,
    bytes: groep.impact.bytes,
  }));
}

export function SoortenGrafiek({ groepen }: Props) {
  const styles = useStyles();
  if (groepen.length === 0) {
    return null; // lege OneDrive: geen lege grafiek tonen
  }
  // De eenheid van de as past zich aan de grootste groep aan: GB bij veel opslag, kB bij weinig.
  const grootste = Math.max(...groepen.map((groep) => groep.impact.bytes));
  const { eenheid, deler } = kiesEenheid(grootste);
  const data = maakGrafiekData(groepen, deler);
  const samenvatting = groepen.map((groep) => `${groep.naam}: ${formatBytes(groep.impact.bytes)}`).join(', ');

  return (
    <figure className={styles.figuur}>
      {/* De grafiek zelf is voor schermlezers verborgen; de tekst eronder vertelt hetzelfde */}
      <div aria-hidden="true" style={{ width: '100%', height: Math.max(200, data.length * 44) }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid horizontal={false} />
            <XAxis
              type="number"
              unit={` ${eenheid}`}
              tickFormatter={(waarde: number) => waarde.toLocaleString('nl-NL', { maximumFractionDigits: 1 })}
            />
            <YAxis type="category" dataKey="naam" width={100} />
            <Tooltip formatter={(_waarde, _naam, item) => [formatBytes(item.payload.bytes), 'Opslag']} />
            {/* Geen groei-animatie: rustiger, en de balk staat meteen op de goede lengte */}
            <Bar dataKey="waarde" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <figcaption className={styles.alleenSchermlezer}>Opslag per soort. {samenvatting}.</figcaption>
    </figure>
  );
}
