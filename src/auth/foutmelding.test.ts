// Tests voor het vertalen van inlogfouten naar gewone taal.
import { describe, expect, it } from 'vitest';
import { isAfgebrokenPoging, vertaalAuthFout } from './foutmelding';

describe('isAfgebrokenPoging', () => {
  it('herkent een poging die is afgebroken door "Opnieuw proberen"', () => {
    expect(isAfgebrokenPoging({ errorCode: 'interaction_in_progress_cancelled' })).toBe(true);
    expect(isAfgebrokenPoging({ errorCode: 'user_cancelled' })).toBe(false);
    expect(isAfgebrokenPoging(undefined)).toBe(false);
  });
});

describe('vertaalAuthFout', () => {
  it('herkent een geblokkeerde popup', () => {
    expect(vertaalAuthFout({ errorCode: 'popup_window_error' }, true)).toContain('pop-ups toe');
    expect(vertaalAuthFout({ errorCode: 'empty_window_error' }, true)).toContain('pop-ups toe');
  });

  it('herkent geweigerde toestemming', () => {
    expect(vertaalAuthFout({ errorCode: 'access_denied' }, true)).toContain('geen toestemming');
    expect(vertaalAuthFout({ errorCode: 'x', errorMessage: 'AADSTS65004: User declined' }, true)).toContain(
      'geen toestemming',
    );
  });

  it('herkent dat de beheerder toestemming moet geven', () => {
    expect(vertaalAuthFout({ errorCode: 'invalid_client', errorMessage: 'AADSTS90094: admin' }, true)).toContain(
      'IT-beheerder',
    );
  });

  it('herkent geen internet, ook zonder foutcode', () => {
    expect(vertaalAuthFout(new Error('fetch failed'), false)).toContain('geen internetverbinding');
    expect(vertaalAuthFout({ errorCode: 'no_network_connectivity' }, true)).toContain('geen internetverbinding');
  });

  it('herkent een gesloten venster', () => {
    expect(vertaalAuthFout({ errorCode: 'user_cancelled' }, true)).toContain('gesloten');
  });

  it('geeft een algemene melding met foutcode bij onbekende fouten', () => {
    expect(vertaalAuthFout({ errorCode: 'iets_raars' }, true)).toBe(
      'Inloggen is niet gelukt. Probeer het opnieuw. (foutcode: iets_raars)',
    );
    expect(vertaalAuthFout(undefined, true)).toBe('Inloggen is niet gelukt. Probeer het opnieuw.');
  });
});
