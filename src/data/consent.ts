import { Language } from '../types/crop';

/** Privacy consent shown at sign-up and when sending a case to an extension officer. */
export const CONSENT_TEXT: Record<Language, string> = {
  en: 'Consent: Your phone number and crop photos will be shared solely with local agricultural extension officers to diagnose your field and text you guidance. They will never be shared with third parties or used for advertising.',
  ny: 'Chilolezo: Nambala yanu ya foni ndi zithunzi za mbeu zanu zidzagawidwa kwa alangizi a za ulimi (AEDO) okha kuti akuthandizeni pa vuto lanu la m\'munda. Sizidzagulitsidwa kapena kuperekedwa kwina.',
  tum: 'Chizomerezgo: Nambala yinu ya foni na vithuzi vya vyomela vigawikenge ku ŵalara ŵa vya ulimi (AEDO) pera kuti ŵamovwirani. Vingaperekeka ku ŵanthu ŵanyake yayi.',
};
