export const LOADING_INDICATOR_IMG = '/images/loading.svg';

export const TIMEZONE = 'America/Sao Paulo';
export const LOCALE = 'fr-MA';
export const CURRENCY = 'MAD';
export const LANG = 'fr';
export const COUNTRY = 'Maroc';

export const COOKIE_MAX_AGE = 2592000; // 30 days
export const COOKIE_MAX_AGE_USER_REMINDERS = 300;
export const COOKIE_SAME_SITE = 'strict';

export const REVALIDATE_INTERVAL = 3600; // how ofter to refresh data from API

export const REDIRECT_TIMER = 4000; // 4 seconds

export const ITEMS_PER_PAGE = 10;

export const PRICE_RANGES = [
    [1, 125000],
    [125001, 150000],
    [150001, 175000],
    [175001, 200000],
    [200001, 225000],
    [225001, 250000],
    [250001, 300000],
    [300001, 400000],
    [400001, 500000],
    [500001, 800000],
    [800001, 1100000],
    [1100001, 5000000],
];

export const PRICE_RANGES_SHORT = [
    ['0', '200000'],
    ['200000', '300000'],
    ['300000', '400000'],
    ['400000'],
];

export const CONVERSION_FUEL = {
    diesel: 'die',
    gas: 'ess',
    hybrid: 'hyb',
    electric: 'ele',
};

export const AUTOMATIC_GEARBOXES = ['a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'cvt'];

export const TRIMS_AIR_COND_AUTO = [
    '/api/trims/37',
    '/api/trims/38',
    '/api/trims/204',
    '/api/trims/250',
];

export const TRIMS_DISPLAY_MULTIMEDIA = ['/api/trims/272', '/api/trims/462'];

export const TRIMS_LEATHER_SEATS = ['/api/trims/115', '/api/trims/283', '/api/trims/540'];

export const MUI_DATATABLES_TEXT_LABELS = {
    body: {
        noMatch: 'Sorry, no matching records found',
        toolTip: 'Sort',
        columnHeaderTooltip: (column) => `Sort for ${column.label}`,
    },
    pagination: {
        next: 'Prochaine Page',
        previous: 'Page précédente',
        rowsPerPage: 'lignes par page:',
        displayRows: 'de',
    },
    toolbar: {
        search: 'Recherche',
        downloadCsv: 'télécharger CSV',
        print: 'Imprimer',
        viewColumns: 'Afficher les colonnes',
        filterTable: 'Filtrer tableau',
    },
    filter: {
        all: 'Tous',
        title: 'Filtres',
        reset: 'Réinitialiser',
    },
    viewColumns: {
        title: 'Afficher les colonnes',
        titleAria: 'Afficher/Masquer colonnes',
    },
    selectedRows: {
        text: ' ligne(s) sélectionnée(s)',
        delete: 'Supprimer',
        deleteAria: 'Supprimer lignes sélectionnées',
    },
};
