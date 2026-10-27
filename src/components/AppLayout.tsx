// Vaste opbouw van elk scherm: kopbalk, eventueel de melding over voorbeelddata, en daaronder het scherm zelf.
import { makeStyles, MessageBar, MessageBarBody, MessageBarTitle, tokens } from '@fluentui/react-components';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { useScan } from '../state/useScan';
import { Kopbalk } from './Kopbalk';

const useStyles = makeStyles({
  pagina: {
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  inhoud: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: tokens.spacingHorizontalL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    ':focus': { outline: 'none' }, // focus komt hier alleen via de link "Naar de inhoud"
  },
  // Onzichtbaar tot je er met Tab op komt: dan verschijnt hij linksboven
  naarInhoud: {
    position: 'absolute',
    left: '-9999px',
    ':focus': {
      left: tokens.spacingHorizontalS,
      top: tokens.spacingVerticalS,
      zIndex: 10,
      padding: tokens.spacingHorizontalS,
      backgroundColor: tokens.colorNeutralBackground1,
      color: tokens.colorNeutralForeground1,
    },
  },
});

// De titel in het tabblad van de browser, per scherm. Handig voor schermlezers en als je veel tabbladen open hebt.
const PAGINATITELS: Record<string, string> = {
  '/': 'Welkom',
  '/privacy': 'Privacy en toestemming',
  '/scannen': 'Scannen',
  '/dashboard': 'Dashboard',
  '/zo-rekenen-we': 'Zo rekenen we',
  '/grootste-bestanden': 'Grootste bestanden en soorten',
  '/per-map': 'Bestanden per map',
  '/opruimen': 'Oude bestanden bekijken',
  '/resultaat': 'Resultaat en tips',
};

export function AppLayout() {
  const styles = useStyles();
  const { isVoorbeeld } = useScan();
  const { pathname } = useLocation();

  useEffect(() => {
    const titel = PAGINATITELS[pathname];
    document.title = titel ? `${titel} - KlimaatImpactTool` : 'KlimaatImpactTool';
  }, [pathname]);

  return (
    <div className={styles.pagina}>
      {/* Bij een hash-router werkt href="#inhoud" niet; daarom zetten we de focus zelf */}
      <a
        href="#inhoud"
        className={styles.naarInhoud}
        onClick={(gebeurtenis) => {
          gebeurtenis.preventDefault();
          document.getElementById('inhoud')?.focus();
        }}
      >
        Naar de inhoud
      </a>
      <Kopbalk />
      <main id="inhoud" tabIndex={-1} className={styles.inhoud}>
        {isVoorbeeld && (
          <MessageBar intent="warning">
            <MessageBarBody>
              <MessageBarTitle>Je bekijkt voorbeelddata.</MessageBarTitle>
              Deze bestanden zijn verzonnen. Het is niet jouw OneDrive.
            </MessageBarBody>
          </MessageBar>
        )}
        {/* Outlet: hier tekent de router het scherm dat bij de URL hoort */}
        <Outlet />
      </main>
    </div>
  );
}
