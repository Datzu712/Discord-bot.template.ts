import i18next from 'i18next';
import en from './EN.json';
import es from './ES.json';

// in process D:

const a = { en, es };
const b = a['' as keyof typeof a];
b.test;

i18next.init({
    debug: true,
    resources: {
        en,
        es,
    },
    fallbackLng: ['es', 'en'],
});

i18next.t('es', {});
