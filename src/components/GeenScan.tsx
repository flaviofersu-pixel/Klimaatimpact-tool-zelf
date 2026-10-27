// Melding voor schermen die een scan nodig hebben, als er nog niets gescand is.
import { Button, MessageBar, MessageBarActions, MessageBarBody } from '@fluentui/react-components';
import { useNavigate } from 'react-router';

export function GeenScan() {
  const navigate = useNavigate();

  return (
    <MessageBar intent="info" layout="multiline">
      <MessageBarBody>Er zijn nog geen gegevens. Begin op het welkomstscherm.</MessageBarBody>
      <MessageBarActions>
        <Button onClick={() => navigate('/')}>Naar het begin</Button>
      </MessageBarActions>
    </MessageBar>
  );
}
