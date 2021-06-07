import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import {
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    Card,
    CardHeader,
    CardContent,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { urlWriter } from 'tools/functions';

const useStyles = makeStyles({
    root: {
        contentVisibility: 'auto',
        containIntrinsicSize: '175px',
        backgroundColor: '#ffe082',
        color: '#29335c',
        margin: '20px auto',
        width: 'clamp(300px,100%, 600px)',
        '& .MuiCardHeader-root': {
            textAlign: 'center',
            // color: '#fff',
        },
        '& .MuiCardHeader-avatar': {
            padding: 6,
            backgroundColor: '#fff',
            borderRadius: 10,
        },
        '& .MuiCardContent-root': {
            // height: '200px',
        },
        '& .MuiCardActions-root': {
            justifyContent: 'center',
        },
        '& .MuiCardHeader-content span': {
            textTransform: 'uppercase',
            fontWeight: 'bold',
        },
    },
    cardContent: {
        backgroundColor: '#fff',
        margin: 10,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, auto))',
        gap: 20,
        justifyContent: 'center',
        '& form div': {
            width: '100%',
        },
    },
    selectBrand: {
        height: 80,
        width: 300,
        margin: '0 auto',
    },
});

const WidgetNav = ({ brands }) => {
    const classes = useStyles();
    const router = useRouter();
    const [brandSelect, setBrandSelect] = useState('all');
    const [modelSelect, setModelSelect] = useState('all');

    useEffect(() => {
        setBrandSelect('all');
        setModelSelect('all');
    }, [router.asPath]);

    const handleSetBrandSelect = () => {
        const options = [
            <MenuItem key={0} aria-label="Toutes" value="all">
                Choisir
            </MenuItem>,
        ];
        brands.forEach((brand) => {
            options.push(
                <MenuItem value={brand.id} key={brand.id}>
                    {brand.brand}
                </MenuItem>,
            );
        });

        return options;
    };
    const handleBrandSelectChange = (event) => {
        setBrandSelect(event.target.value);
        if (event.target.value !== 'all') {
            const selected = brands.filter((brand) => {
                return brand.id === event.target.value;
            });
            router.push(`/marques-voiture/${urlWriter(selected[0].brand)}`);
        }
    };
    const handleSetModelSelect = () => {
        const options = [
            <MenuItem key={0} aria-label="Tous" value="all">
                Choisir
            </MenuItem>,
        ];
        brands.forEach((brand) => {
            brand.models.forEach((mod) => {
                options.push(
                    <MenuItem value={mod.id} key={mod.id}>
                        {`${brand.brand} ${mod.model}`}
                    </MenuItem>,
                );
            });
        });

        return options;
    };
    const handleModelSelectChange = (event) => {
        setModelSelect(event.target.value);
        if (event.target.value !== 'all') {
            let selectedModel = [];
            brands.forEach((brand) => {
                if (selectedModel.length === 0) {
                    selectedModel = brand.models.filter((mod) => {
                        return mod.id === event.target.value;
                    });
                    if (selectedModel.length === 1) {
                        selectedModel[0].brand = brand.brand;
                    }
                }
            });
            router.push(
                `/modeles-voiture/${urlWriter(selectedModel[0].brand)}/${urlWriter(
                    selectedModel[0].model,
                )}`,
            );
        }
    };
    return (
        <Card className={classes.root}>
            <CardHeader title={<h2>Accès rapide marque & modèle</h2>} />
            <CardContent className={classes.cardContent}>
                <form>
                    <FormControl variant="outlined">
                        <InputLabel id="brand-select-label">Choisir marque</InputLabel>
                        <Select
                            labelId="brand-select-label"
                            id="brand-select"
                            name="brand"
                            label="Choisir marque"
                            value={brandSelect}
                            onChange={handleBrandSelectChange}
                            variant="outlined"
                        >
                            {handleSetBrandSelect()}
                        </Select>
                        <span id="no_cat_search" className="form_error" />
                    </FormControl>
                </form>
                <form>
                    <FormControl variant="outlined">
                        <InputLabel id="model-select-label">Choisir modèle</InputLabel>
                        <Select
                            labelId="model-select-label"
                            id="model-select"
                            name="model"
                            label="Choisir modèle"
                            value={modelSelect}
                            onChange={handleModelSelectChange}
                            variant="outlined"
                        >
                            {handleSetModelSelect()}
                        </Select>
                        <span id="no_cat_search" className="form_error" />
                    </FormControl>
                </form>
            </CardContent>
        </Card>
    );
};

WidgetNav.propTypes = {
    brands: PropTypes.array.isRequired,
};

export default React.memo(WidgetNav);
