const i18n = require('i18next');

i18n.init({
    lng: 'en', // if you're using a language detector, do not define the lng option
    debug: false,
    resources: {
        en: {
            translation: {
                key: 'hello world',
            },
        },
        es: {
            translation: {
                key: 'Hola mundo',
            },
        },
    },
});

console.log(i18n.t('key'));

let a = require('i18next');

a.changeLanguage('es').then(() => {
    console.log(a.t('key'));

    console.log(i18n.t('key'));
});