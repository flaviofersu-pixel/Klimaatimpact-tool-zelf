// Balk bovenaan elk scherm: naam van de tool, navigatie na een scan, en de ingelogde gebruiker met Uitloggen.
import { Button, makeStyles, shorthands, Text, tokens } from '@fluentui/react-components';
import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../auth/useAuth';
import { useScan } from '../state/useScan';

const useStyles = makeStyles({
  balk: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: tokens.spacingHorizontalL,
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  naam: {
    color: tokens.colorNeutralForegroundOnBrand,
    textDecoration: 'none',
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase400,
  },
  navigatie: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalM,
    flexGrow: 1,
  },
  link: {
    color: tokens.colorNeutralForegroundOnBrand,
    textDecoration: 'none',
    padding: `${tokens.spacingVerticalXXS} ${tokens.spacingHorizontalXS}`,
    borderBottom: '2px solid transparent',
    ':hover': { borderBottomColor: tokens.colorNeutralForegroundOnBrand },
    // NavLink zet aria-current="page" op de link van het huidige scherm
    '&[aria-current="page"]': { borderBottomColor: tokens.colorNeutralForegroundOnBrand },
  },
  gebruiker: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    marginLeft: 'auto', // naar rechts
  },
  uitloggen: {
    color: tokens.colorNeutralForegroundOnBrand,
    ...shorthands.borderColor(tokens.colorNeutralForegroundOnBrand),
    backgroundColor: 'transparent',
  },
});

const SCHERMEN = [
  { pad: '/dashboard', naam: 'Dashboard' },
  { pad: '/grootste-bestanden', naam: 'Grootste bestanden' },
  { pad: '/per-map', naam: 'Per map' },
  { pad: '/zo-rekenen-we', naam: 'Zo rekenen we' },
];

export function Kopbalk() {
  const styles = useStyles();
  const navigate = useNavigate();
  const { analyse, wisScan } = useScan();
  const { isIngelogd, naam, logout } = useAuth();

  async function uitloggen() {
    wisScan(); // eerst de gegevens uit het geheugen halen
    navigate('/');
    try {
      await logout();
    } catch {
      // Sluit iemand het uitlogvenster, dan blijft het account in dit tabblad bewaard. Niet erg.
    }
  }

  return (
    <header className={styles.balk}>
      <NavLink to="/" className={styles.naam}>
        KlimaatImpactTool
      </NavLink>
      {analyse && (
        <nav aria-label="Schermen" className={styles.navigatie}>
          {SCHERMEN.map((scherm) => (
            <NavLink key={scherm.pad} to={scherm.pad} className={styles.link}>
              <Text>{scherm.naam}</Text>
            </NavLink>
          ))}
        </nav>
      )}
      {isIngelogd && (
        <div className={styles.gebruiker}>
          <Text>{naam}</Text>
          <Button size="small" appearance="outline" className={styles.uitloggen} onClick={uitloggen}>
            Uitloggen
          </Button>
        </div>
      )}
    </header>
  );
}
