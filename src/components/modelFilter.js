/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { makeStyles } from '@material-ui/core/styles';
import {
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Button,
    Fab,
    Card,
    CardHeader,
    CardContent,
    Radio,
    RadioGroup,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@material-ui/core';
import { Clear, ExpandMore } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { objectToMap } from 'tools/functions';
import { LANG } from 'parameters';
import Loading from 'components/loading';
import NotifierInline from 'components/notifierInline';
import NotifierDialog from 'components/notifierDialog';

const ModelTable = dynamic(() => import('./modelTable'), {
    ssr: false,
    // loading: () => <div style={{ height: '35px ' }} />,
});

const trans = {
    fr: {
        submit: 'Enviar',
        clear: 'Apagar',
        somethingWrong: 'Algo deu errado',
        reloadAndTryAgain: 'Recarregue pagina e tente de novo',
    },
    en: {
        submit: 'Submit',
        clear: 'Clear',
        somethingWrong: 'There was an error',
        reloadAndTryAgain: 'Reload and try again',
    },
};
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 20,
        '& .MuiFormGroup-row': {
            justifyContent: 'space-around',
        },
    },
    cardRoot: {
        backgroundColor: '#daa520',
        maxWidth: 400,
        margin: '0 auto 20px',
        '& .MuiCardHeader-content': {
            '& span': {
                color: '#fff',
                textAlign: 'center',
                textTransform: 'uppercase',
                fontSize: '.875rem',
                fontWeight: 'bold',
            },
        },
        '& .MuiCardActions-root': {
            justifyContent: 'center',
        },
    },
    accordionRoot: {
        backgroundColor: '#daa520',
        '& .MuiAccordionSummary-root': {
            '& svg': {
                color: '#fff',
            },
        },
    },
    formControl: {
        margin: theme.spacing(3),
        '& span:nth-child(2)': {
            fontSize: '0.75rem',
            fontWeight: 'bold',
        },
    },
    checkboxes: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        marginBottom: 20,
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

const ModelFilter = ({ allModels, filters }) => {
    const classes = useStyles();
    const [currentModels, setCurrentModels] = useState(allModels);
    const [filterValues, setFilterValues] = useState({
        airCondAuto: false,
        hybrid: false,
        leatherSeats: false,
        automaticGearbox: false,
        displayMultimedia: false,
        powerBetween150200: false,
        price: false,
    });
    const [isFormPristine, setIsFormPristine] = useState(true);
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [isFiltersValid, setIsFiltersValid] = useState(true);
    const [notification, setNotification] = useState({
        status: '',
        title: '',
        message: '',
        errors: {},
    });

    useEffect(() => {
        const map = objectToMap(filters);
        const filtersMap = [...map].filter((filter) => {
            return filter[1] === null;
        });
        setIsFiltersValid(filtersMap.length === 0);
    }, [filters]);

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        setFilterValues({
            ...filterValues,
            [name]: value,
        });
        setIsFormPristine(false);
        setIsFormSubmitted(false);
    };
    const handleFilterSubmit = () => {
        event.preventDefault();
        if (isFiltersValid) {
            setIsFormSubmitting(true);
            const values = objectToMap(filterValues);
            const models = [...allModels];
            let filtered = [];
            let n = 0;
            for (const [key, value] of values) {
                if (value) {
                    if (n === 0) {
                        if (key === 'price') {
                            filtered = models.filter((model) => {
                                return filters[value].includes(model.id);
                            });
                        } else {
                            filtered = models.filter((model) => {
                                return filters[key].includes(model.id);
                            });
                        }
                    } else if (n > 0) {
                        if (key === 'price') {
                            filtered = filtered.filter((model) => {
                                return filters[value].includes(model.id);
                            });
                        } else {
                            filtered = filtered.filter((model) => {
                                return filters[key].includes(model.id);
                            });
                        }
                    }
                    n++;
                }
            }
            setCurrentModels(filtered);
            setIsFormSubmitting(false);
            setIsFormSubmitted(true);
        } else {
            setNotification({
                status: 'ok_and_dismiss',
                title: trans[LANG].somethingWrong,
                message: trans[LANG].reloadAndTryAgain,
                errors: {},
            });
        }
    };
    const handleResetFilter = () => {
        setFilterValues({
            airCondAuto: false,
            hybrid: false,
            leatherSeats: false,
            automaticGearbox: false,
            displayMultimedia: false,
            powerBetween150200: false,
            price: false,
        });
        setIsFormPristine(true);
        setIsFormSubmitted(false);
        setCurrentModels(allModels);
    };

    const handleNotificationDismiss = () => {
        setNotification({
            status: '',
            title: '',
            message: '',
            errors: {},
        });
    };
    return (
        <div>
            {isFormSubmitting && <Loading />}
            <Card className={classes.cardRoot}>
                <CardHeader title="Filtres" />
                <CardContent>
                    <form onSubmit={handleFilterSubmit}>
                        <div className={classes.root}>
                            <FormControl
                                component="fieldset"
                                className={classes.formControl}
                            >
                                <FormGroup>
                                    <div className={classes.checkboxes}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={filterValues.airCondAuto}
                                                    onChange={handleInputChange}
                                                    name="airCondAuto"
                                                />
                                            }
                                            label="Climatisation auto"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={filterValues.hybrid || false}
                                                    onChange={handleInputChange}
                                                    name="hybrid"
                                                />
                                            }
                                            label="Hybride"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={
                                                        filterValues.leatherSeats || false
                                                    }
                                                    onChange={handleInputChange}
                                                    name="leatherSeats"
                                                />
                                            }
                                            label="Sellerie cuir"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={
                                                        filterValues.automaticGearbox
                                                    }
                                                    onChange={handleInputChange}
                                                    name="automaticGearbox"
                                                />
                                            }
                                            label="Boite automatique"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={
                                                        filterValues.displayMultimedia
                                                    }
                                                    onChange={handleInputChange}
                                                    name="displayMultimedia"
                                                />
                                            }
                                            label="Ecran multimedia"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={
                                                        filterValues.powerBetween150200
                                                    }
                                                    onChange={handleInputChange}
                                                    name="powerBetween150200"
                                                />
                                            }
                                            label="150-200 ch"
                                        />
                                    </div>
                                    <span>Prix - mille DH</span>
                                    <RadioGroup
                                        row
                                        aria-label="price"
                                        name="price"
                                        value={filterValues.price}
                                        onChange={handleInputChange}
                                        className={classes.selection}
                                    >
                                        <FormControlLabel
                                            className={classes.radioLabel}
                                            value="priceBetween0200"
                                            control={<Radio />}
                                            label="< 200"
                                            labelPlacement="bottom"
                                        />
                                        <FormControlLabel
                                            className={classes.radioLabel}
                                            value="priceBetween200300"
                                            control={<Radio />}
                                            label="200-300"
                                            labelPlacement="bottom"
                                        />
                                        <FormControlLabel
                                            className={classes.radioLabel}
                                            value="priceBetween300400"
                                            control={<Radio />}
                                            label="300-400"
                                            labelPlacement="bottom"
                                        />
                                        <FormControlLabel
                                            className={classes.radioLabel}
                                            value="priceHigherThan400"
                                            control={<Radio />}
                                            label="> 400"
                                            labelPlacement="bottom"
                                        />
                                    </RadioGroup>
                                </FormGroup>
                            </FormControl>
                            <FormGroup row>
                                <Fab
                                    disabled={isFormPristine || isFormSubmitting}
                                    onClick={handleResetFilter}
                                    variant="round"
                                    color="secondary"
                                    size="small"
                                    type="reset"
                                    aria-label={trans[LANG].clear}
                                >
                                    <Clear />
                                </Fab>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={
                                        isFormPristine ||
                                        isFormSubmitting ||
                                        isFormSubmitted
                                    }
                                    name="_submit"
                                    type="submit"
                                    aria-label={trans[LANG].submit}
                                >
                                    {trans[LANG].submit}
                                </Button>
                            </FormGroup>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <Accordion
                TransitionProps={{ unmountOnExit: true }}
                className={classes.accordionRoot}
            >
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <NotifierInline
                        message={`${currentModels.length} modeles correspondent a vos criteres`}
                        isNotClosable
                    />
                </AccordionSummary>
                <AccordionDetails>
                    <ModelTable currentModels={currentModels} />
                </AccordionDetails>
            </Accordion>
            <NotifierDialog
                notification={notification}
                handleNotificationDismiss={handleNotificationDismiss}
            />
        </div>
    );
};

ModelFilter.propTypes = {
    allModels: PropTypes.array.isRequired,
    filters: PropTypes.object.isRequired,
};

export default React.memo(ModelFilter);
