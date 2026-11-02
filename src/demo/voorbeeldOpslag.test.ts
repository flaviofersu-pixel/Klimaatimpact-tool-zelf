// Tests voor de voorbeeldopslag: mappen openen, mapgroottes en verplaatsen in het geheugen.
import { describe, expect, it } from 'vitest';
import { maakVoorbeeldBron } from './voorbeeldOpslag';

const nu = new Date('2026-06-15T12:00:00Z');

async function maakKlaar() {
  const bron = maakVoorbeeldBron(nu, 0);
  const onedrive = await bron.haalOneDrive();
  const [eersteTeam] = await bron.haalTeams();
  const team = await bron.haalTeamOpslag(eersteTeam);
  return { bron, onedrive, team };
}

describe('voorbeeldopslag', () => {
  it('toont mappen eerst en geeft een map de grootte van alles erin', async () => {
    const { bron, onedrive } = await maakKlaar();
    const hoofdmap = await bron.haalMapInhoud(onedrive, onedrive.hoofdmapId);

    expect(hoofdmap[0]).toMatchObject({ naam: 'Afbeeldingen', isMap: true, grootte: 8_100_000 });
    expect(hoofdmap.at(-1)).toMatchObject({ naam: 'Opname teamoverleg.mp4', isMap: false });
  });

  it('verplaatst een bestand van de OneDrive naar het team', async () => {
    const { bron, onedrive, team } = await maakKlaar();
    const kladblok = (await bron.haalMapInhoud(onedrive, onedrive.hoofdmapId)).find((i) => i.naam === 'Kladblok.txt')!;

    await bron.verplaatsBestand(kladblok, onedrive, team, team.hoofdmapId);

    const inOneDrive = await bron.haalMapInhoud(onedrive, onedrive.hoofdmapId);
    const inTeam = await bron.haalMapInhoud(team, team.hoofdmapId);
    expect(inOneDrive.map((i) => i.naam)).not.toContain('Kladblok.txt');
    expect(inTeam.map((i) => i.naam)).toContain('Kladblok.txt');
  });

  it('weigert een naam die in de doelmap al bestaat', async () => {
    const { bron, onedrive, team } = await maakKlaar();
    const documenten = await bron.haalMapInhoud(onedrive, 'onedrive:Documenten');
    const plan = documenten.find((i) => i.naam === 'Projectplan Klimaat.docx')!;

    await expect(bron.verplaatsBestand(plan, onedrive, team, 'team-duurzaamheid:Projecten')).rejects.toMatchObject({
      status: 409,
    });
  });
});
