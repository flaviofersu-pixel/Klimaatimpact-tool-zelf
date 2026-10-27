// Scherm 3: voortgang van de scan, met Annuleren, en foutmeldingen in gewone taal.
import {
  Body1,
  Button,
  Card,
  Field,
  makeStyles,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  ProgressBar,
  Title1,
  tokens,
} from '@fluentui/react-components';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../auth/useAuth';
import { formatBytes } from '../../model/opmaak';
import { useScan } from '../../state/useScan';

const useStyles = makeStyles({
  kaart: {
    maxWidth: '640px',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  knoppen: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalM,
  },
});

export function Scannen() {
  const styles = useStyles();
  const navigate = useNavigate();
  const { isIngelogd } = useAuth();
  const { scan, startScan, annuleerScan } = useScan();

  // Is de scan klaar, dan door naar het Dashboard.
  const status = scan?.status;
  useEffect(() => {
    if (status === 'klaar') {
      navigate('/dashboard');
    }
  }, [status, navigate]);

  if (!scan) {
    return (
      <>
        <Title1 as="h1">Je OneDrive scannen</Title1>
        <MessageBar intent="info" layout="multiline">
          <MessageBarBody>Er loopt nu geen scan.</MessageBarBody>
          <MessageBarActions>
            {isIngelogd ? (
              <Button onClick={startScan}>Scan starten</Button>
            ) : (
              <Button onClick={() => navigate('/privacy')}>Naar inloggen</Button>
            )}
          </MessageBarActions>
        </MessageBar>
      </>
    );
  }

  if (scan.status === 'fout') {
    return (
      <>
        <Title1 as="h1">De scan is gestopt</Title1>
        <MessageBar intent="error" layout="multiline">
          <MessageBarBody>{scan.fout}</MessageBarBody>
        </MessageBar>
        <div className={styles.knoppen}>
          <Button appearance="primary" onClick={startScan}>
            Opnieuw proberen
          </Button>
          <Button onClick={() => navigate('/')}>Terug naar het begin</Button>
        </div>
      </>
    );
  }

  const quota = scan.quota;

  return (
    <>
      <Title1 as="h1">Je OneDrive wordt gescand</Title1>
      <Card className={styles.kaart}>
        <Body1>
          {quota
            ? `Je OneDrive gebruikt ${formatBytes(quota.used)} van ${formatBytes(quota.total)}. Daarvan staat ${formatBytes(quota.deleted)} in de prullenbak.`
            : 'Opslag van je OneDrive ophalen...'}
        </Body1>
        {/* role="status": schermlezers lezen het aantal gelezen bestanden voor als het verandert */}
        <Field label={<span role="status">{scan.gelezen} bestanden gelezen</span>}>
          <ProgressBar thickness="large" />
        </Field>
        <Body1>Bij veel bestanden duurt dit een paar minuten. Je kunt dit tabblad open laten staan.</Body1>
        <div className={styles.knoppen}>
          <Button onClick={annuleerScan}>Annuleren</Button>
        </div>
      </Card>
    </>
  );
}
