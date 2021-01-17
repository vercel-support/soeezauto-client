import { LANG } from '../parameters';

const trans = {
    br: {
        required: 'Requerido',
        confidentialityRequired:
            'A aceitacao de nossa politica de confidentialidade eh requerida',
        mustBe: 'Deve ser',
        charactersOrLess: 'caracteres ou menos',
        charactersOrMore: 'caracteres ou mais',
        aNumber: 'um numero',
        atLeast: 'pelo menos',
        max: 'no maximo',
        invalidEmail: 'Endereco email invalido',
        mightBeTooOld: 'Talvez voce eh muito velho para isto',
        onlyAlpha: 'Somente caracteres alfa-numericos',
        passwordsDoNotMatch: 'Senhas nao sao identicas',
        oneOf: 'Um entre',
        orThisField: 'ou este campo eh requerido',
        cityPostalInvalid: 'cidade ou codigo postal invalidos',
        noSpaces: 'Espacos nao sao permitidos',
        invalidInput: 'Input invalido',
        noChanges: 'Nenhuma modificacao foi inputada',
        invalidCharacters: 'Input contem caracteres invalidos:',
        invalidAmount: 'Montante invalido',
        passwordRequirements:
            'Senha deve ter minimo de 10 caracteres, maximo 50,  e conter pelo menos: um numero, uma letra, uma letra maiuscula e um simbolo entre !@#$%^&*',
        invalidCEP: 'CEP invalido',
    },
    en: {
        required: 'Required',
        confidentialityRequired: 'Accepting our confidentiality terms is required',
        mustBe: 'Must be',
        charactersOrLess: 'characters or less',
        charactersOrMore: 'characters or more',
        aNumber: 'a number',
        atLeast: 'at least',
        max: 'max',
        invalidEmail: 'Invalid email address',
        mightBeTooOld: 'You might be too old for this',
        onlyAlpha: 'Only alphanumeric characters',
        passwordsDoNotMatch: 'Passwords do not match',
        oneOf: 'One of',
        orThisField: 'or this field is required',
        cityPostalInvalid: 'City/postal code invalid',
        noSpaces: 'Spaces are not allowed',
        invalidInput: 'Invalid input',
        noChanges: 'No changes were entered',
        invalidCharacters: 'Input includes invalid characters:',
        invalidAmount: 'Invalid amount',
        passwordRequirements:
            'Password must have minimum 10 characters, max 50,  and contain at least: 1 number, 1 letter, 1 capital letter and one symbol !@#$%^&*',
        invalidCEP: 'Postal code invalid',
    },
};

/* eslint-disable no-restricted-globals */
export const required = (value) => (value ? undefined : trans[LANG].required);

export const rgpd = (value) => (value ? undefined : trans[LANG].confidentialityRequired);

export const maxLength = (max) => (value) =>
    value && value.length > max
        ? `${trans[LANG].mustBe} ${max} ${trans[LANG].charactersOrLess}`
        : undefined;

export const minLength = (min) => (value) =>
    value && value.length < min
        ? `${trans[LANG].mustBe} ${min} ${trans[LANG].charactersOrMore}`
        : undefined;

export const minLengthWithoutHTML = (min) => (value) => {
    const newValue = value && value.replace(/<\/?[a-z][a-z0-9]*[^<>]*>/gi, '');
    return newValue.length < min
        ? `${trans[LANG].mustBe} ${min} ${trans[LANG].charactersOrMore}`
        : undefined;
};

export const isNumber = (value) => {
    return value === undefined && isNaN(Number(value))
        ? `${trans[LANG].mustBe} ${trans[LANG].aNumber}`
        : undefined;
};

export const minValue = (min) => (value) => {
    return value && value < min
        ? `${trans[LANG].mustBe} ${trans[LANG].atLeast} ${min}`
        : undefined;
};

export const maxValue = (max) => (value) =>
    value && value > max ? `${trans[LANG].mustBe} ${trans[LANG].max} ${max}.` : undefined;

export const isEmail = (value) =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
        ? trans[LANG].invalidEmail
        : undefined;

export const tooOld = (value) =>
    value && value > 65 ? trans[LANG].mightBeTooOld : undefined;

export const alphaNumeric = (value) =>
    value && /[^a-zA-Z0-9 ]/i.test(value) ? trans[LANG].onlyAlpha : undefined;

export const isMatchPassword = (matchName) => (value, allValues) => {
    const match = allValues[matchName];
    if (value !== match) {
        return trans[LANG].passwordsDoNotMatch;
    }
    return null;
};

// one or the other field required -> used on search_ads_form
export const eitherOr = (otherField) => (value, allValues) => {
    if (value === undefined && allValues[otherField] === undefined) {
        return `${trans[LANG].oneOf} ${otherField} ${trans[LANG].orThisField}`;
    }
    return null;
};

export const isPlaceFormat = (value) => {
    const regexp = /[a-z\s]+-[\d]+/g;
    if (value) {
        return !value.match(regexp) ? trans[LANG].cityPostalInvalid : undefined;
    }
    return null;
};

export const isSpace = (value) =>
    value && /\s/.test(value) ? trans[LANG].noSpaces : null;

export const isOnlySpace = (value) =>
    value && /^ *$/.test(value) ? trans[LANG].invalidInput : null;

export const isNotMatchCurrentEmail = (matchName) => (value, allValues) => {
    const match = allValues[matchName];
    if (value === match) {
        return trans[LANG].noChanges;
    }
    return null;
};

export const isTag = (value) => {
    if (value.includes('>') || value.includes('<')) {
        return `${trans[LANG].invalidCharacters} <>`;
    }
    return null;
};

export const frenchAmount = (value) =>
    value && /^\d+(?:\.\d{1,2})?$/i.test(value) ? trans[LANG].invalidAmount : undefined;

export const passwordReq = (value) => {
    const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{10,50}$)/;
    if (value && !reg.test(value)) {
        return trans[LANG].passwordRequirements;
    }
    return null;
};

export const isPostalCodeBR = (value) =>
    value && /[0-9]{5}-[\d]{3}/.test(value) ? null : trans[LANG].invalidCEP;
