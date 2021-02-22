/* eslint-disable no-param-reassign */
import React, { useState } from 'react';
import Head from 'next/head';
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
import getModels from 'lib/getModels';
import getModelsWithAirCondAuto from 'lib/getModelsWithAirCondAuto';
import getModelsWithDisplayMultimedia from 'lib/getModelsWithDisplayMultimedia';
import getModelsWithHybrid from 'lib/getModelsWithHybrid';
import getModelsWithLeatherSeats from 'lib/getModelsWithLeatherSeats';
import getModelsWithAutomaticGearbox from 'lib/getModelsWithAutomaticGearbox';
import getModelsWithPowerBetween150200 from 'lib/getModelsWithPowerBetween150200';
import getModelsWithPriceBetween0200 from 'lib/getModelsWithPriceBetween0200';
import getModelsWithPriceBetween200300 from 'lib/getModelsWithPriceBetween200300';
import getModelsWithPriceBetween300400 from 'lib/getModelsWithPriceBetween300400';
import getModelsWithPriceHigherThan400 from 'lib/getModelsWithPriceHigherThan400';
import getPosts from 'lib/getPosts';
import { objectToMap } from 'tools/functions';
import { LANG } from 'parameters';
import Loading from 'components/loading';
import NotifierInline from 'components/notifierInline';

const ModelTable = dynamic(() => import('../../components/modelTable'), {
    ssr: false,
    // loading: () => <div style={{ height: '35px ' }} />,
});

const trans = {
    fr: {
        submit: 'Enviar',
        clear: 'Apagar',
    },
    en: {
        submit: 'Submit',
        clear: 'Clear',
    },
};
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        '& .MuiFormGroup-row': {
            justifyContent: 'space-around',
        },
    },
    cardRoot: {
        maxWidth: 400,
        margin: '0 auto',
        '& .MuiCardActions-root': {
            justifyContent: 'center',
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
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

const Models = ({ allModels, filters }) => {
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

    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
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
                                                        checked={
                                                            filterValues.hybrid || false
                                                        }
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
                                                            filterValues.leatherSeats ||
                                                            false
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
                <Accordion TransitionProps={{ unmountOnExit: true }}>
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
            </main>
        </div>
    );
};

Models.propTypes = {
    allModels: PropTypes.array.isRequired,
    filters: PropTypes.object.isRequired,
};

export default Models;

export async function getStaticProps() {
    let allModels = await getModels();
    allModels = allModels.data.models;
    // get price range, power range
    allModels.forEach((model) => {
        const prices = model.versions.map((version) => {
            return Math.round(version.prices[0].price / 1000);
        });
        model.prices = Array.from(new Set([Math.min(...prices), Math.max(...prices)]));
        const power = model.versions.map((version) => {
            return version.motor.power;
        });
        model.power = Array.from(new Set([Math.min(...power), Math.max(...power)]));
        let fuels = model.versions.map((version) => {
            return version.motor.fuel;
        });
        fuels = Array.from(new Set(fuels));
        fuels.forEach((item, i) => {
            if (item === 'diesel') {
                fuels[i] = 'die';
            } else if (item === 'gas') {
                fuels[i] = 'ess';
            } else if (item === 'hybrid') {
                fuels[i] = 'hyb';
            } else if (item === 'electric') {
                fuels[i] = 'ele';
            }
        });
        model.fuels = fuels.sort();
    });
    const modelsWithAirCondAuto = await getModelsWithAirCondAuto();
    const modelsWithDisplayMultimedia = await getModelsWithDisplayMultimedia();
    const modelsWithHybrid = await getModelsWithHybrid();
    const modelsWithLeatherSeats = await getModelsWithLeatherSeats();
    const modelsWithAutomaticGearbox = await getModelsWithAutomaticGearbox();
    const modelsWithPowerBetween150200 = await getModelsWithPowerBetween150200();
    const modelsWithPriceBetween0200 = await getModelsWithPriceBetween0200();
    const modelsWithPriceBetween200300 = await getModelsWithPriceBetween200300();
    const modelsWithPriceBetween300400 = await getModelsWithPriceBetween300400();
    const modelsWithPriceHigherThan400 = await getModelsWithPriceHigherThan400();
    const filters = {
        airCondAuto: modelsWithAirCondAuto.data.models.map((mod) => mod.id),
        displayMultimedia: modelsWithDisplayMultimedia.data.models.map((mod) => mod.id),
        hybrid: modelsWithHybrid.data.models.map((mod) => mod.id),
        leatherSeats: modelsWithLeatherSeats.data.models.map((mod) => mod.id),
        automaticGearbox: modelsWithAutomaticGearbox.data.models.map((mod) => mod.id),
        powerBetween150200: modelsWithPowerBetween150200.data.models.map((mod) => mod.id),
        priceBetween0200: modelsWithPriceBetween0200.data.models.map((mod) => mod.id),
        priceBetween200300: modelsWithPriceBetween200300.data.models.map((mod) => mod.id),
        priceBetween300400: modelsWithPriceBetween300400.data.models.map((mod) => mod.id),
        priceHigherThan400: modelsWithPriceHigherThan400.data.models.map((mod) => mod.id),
    };
    let posts = await getPosts();
    posts = posts.data.posts;
    return {
        props: {
            allModels,
            filters,
            posts,
        },
    };
}
