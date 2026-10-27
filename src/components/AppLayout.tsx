// Vaste opbouw van elk scherm: kopbalk, eventueel de melding over voorbeelddata, en daaronder het scherm zelf.
import { makeStyles, MessageBar, MessageBarBody, MessageBarTitle, tokens } from '@fluentui/react-components';
import { Outlet } from 'react-router';
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
  },
});

export function AppLayout() {
  const styles = useStyles();
  const { isVoorbeeld } = useScan();

  return (
    <div className={styles.pagina}>
      <Kopbalk />
      <main className={styles.inhoud}>
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
