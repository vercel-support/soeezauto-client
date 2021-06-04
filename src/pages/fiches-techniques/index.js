import React, { useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    CardHeader,
    CardContent,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import getBrandsModels from 'lib/getBrandsModels';
import { getBaseDate, urlWriter } from 'tools/functions';
import Breadcrumb from 'components/breadcrumb';
import { apiQl } from 'lib/functions';

const WidgetNav = dynamic(() => import('../../components/widgetNav'), {
    ssr: false,
});

const WidgetLaunches = dynamic(() => import('../../components/widgetLaunches'), {
    ssr: false,
});

const WidgetPromo = dynamic(() => import('../../components/widgetPromotion'), {
    ssr: false,
});

const useStyles = makeStyles(() => ({
    root: {
        contentVisibility: 'auto',
        backgroundColor: '#ffe082',
        '& .MuiCardHeader-root': {
            textAlign: 'center',
        },
        '& .MuiCardContent-root': {
            overflow: 'scroll',
            backgroundColor: '#fff',
            margin: 10,
            padding: '20px 0',
        },
        '& .MuiCardActions-root': {
            justifyContent: 'center',
        },
        '& .MuiCardHeader-content span': {
            textTransform: 'uppercase',
            fontWeight: 'bold',
            // color: '#fff',
        },
    },
    mainContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        '& > div': {
            flex: '0 0 clamp(300px, 100%, 700px)',
            margin: '20px 0',
        },
        '& nav': {
            width: '100%',
        },
    },
    selectBrand: {
        height: 80,
        width: 300,
        margin: '0 auto',
    },
}));

const FicheTechniqueMain = ({ brands, brandsModels }) => {
    const classes = useStyles();
    const router = useRouter();
    const [brandSelect, setBrandSelect] = useState('Choisir');
    const [modelSelect, setModelSelect] = useState('Choisir');
    const handleSetBrandSelect = () => {
        const options = [
            <MenuItem key={0} aria-label="Toutes" value="Choisir">
                Choisir
            </MenuItem>,
        ];
        brands.forEach((brand) => {
            if (brand.isSpecs) {
                options.push(
                    <MenuItem value={brand.id} key={brand.id}>
                        {brand.brand}
                    </MenuItem>,
                );
            }
        });

        return options;
    };

    const handleBrandSelectChange = (event) => {
        setBrandSelect(event.target.value);
        if (event.target.value !== 'Choisir') {
            const filtered = brands.filter((brand) => {
                return brand.id === event.target.value;
            });
            router.push(`/fiches-techniques/marque/${urlWriter(filtered[0].brand)}`);
        }
    };

    const handleSetModelSelect = () => {
        const options = [
            <MenuItem key={0} aria-label="Choisir" value="Choisir">
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
        if (event.target.value !== 'Choisir') {
            let selectedModel = [];
            brands.forEach((brand) => {
                if (selectedModel.length === 0) {
                    selectedModel = brand.models.filter((mod) => {
                        return mod.id === event.target.value;
                    });
                    if (selectedModel.length === 1) {
                        selectedModel[0].brand = brand.brand;
                        router.push(
                            `/fiches-techniques/${urlWriter(brand.brand)}/${urlWriter(
                                selectedModel[0].model,
                            )}`,
                        );
                    }
                }
            });
        }
    };

    return (
        <div>
            <Head>
                <title>{`Fiches techniques voiture neuve au Maroc - ${new Date().getFullYear()}`}</title>
                <meta
                    name="description"
                    content="Fiches techniques constructeur et Soeezauto "
                />
                <meta
                    property="og:title"
                    content={`Fiches techniques voiture neuve au Maroc - ${new Date().getFullYear()}`}
                />
                <meta
                    property="og:image"
                    content="https://www.soeezauto.ma/TODO/og/segment-petit-monospace-ford-b-max.jpg"
                />
                <meta
                    property="og:url"
                    content="https://www.soeezauto.ma/fiches-techniques"
                />
                <link rel="canonical" href="https://www.soeezauto.ma/fiches-techniques" />
            </Head>

            <main>
                <Breadcrumb
                    links={[
                        {
                            href: null,
                            text: 'Fiches techniques',
                        },
                    ]}
                />
                <div className="main-title">
                    <h1>Fiches techniques voitures neuve au Maroc</h1>
                </div>
                <div className={classes.mainContainer}>
                    <Card className={classes.root}>
                        <CardHeader title={<h2>Fiches techniques Soeezauto</h2>} />
                        <CardContent className={classes.cardContent}>
                            <div className={classes.selectBrand}>
                                <form>
                                    <div className="form_input form_select">
                                        <FormControl variant="outlined">
                                            <InputLabel id="model-select-label">
                                                Choisir modèle
                                            </InputLabel>
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
                                            <span
                                                id="no_cat_search"
                                                className="form_error"
                                            />
                                        </FormControl>
                                    </div>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className={classes.root}>
                        <CardHeader
                            title={<h2>Fiches techniques constructeur</h2>}
                            subheader="Selon disponibilité"
                        />
                        <CardContent className={classes.cardContent}>
                            <div className={classes.selectBrand}>
                                <form>
                                    <div className="form_input form_select">
                                        <FormControl variant="outlined">
                                            <InputLabel id="brand-select-label">
                                                Choisir marque
                                            </InputLabel>
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
                                            <span
                                                id="no_cat_search"
                                                className="form_error"
                                            />
                                        </FormControl>
                                    </div>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <WidgetPromo data={brandsModels} />
                <WidgetNav brands={brandsModels} />
                <WidgetLaunches data={brandsModels} />
            </main>
        </div>
    );
};

FicheTechniqueMain.propTypes = {
    brands: PropTypes.array.isRequired,
    brandsModels: PropTypes.array.isRequired,
};

export default FicheTechniqueMain;

const queryQl = `query getBrandsModelsForSpecs(
        $isActive: Boolean!,
        $isActiveModel: Boolean!
        $after: String!
    ) {
    brands(
        isActive: $isActive
        _order: {brand: "ASC"}
        ) {
		    id
		    brand
            image
            models(
                isActive: $isActiveModel
                _order: {model: "ASC"}
            ){
                id
                model
                specs(
                    first: 1, after: null,
                    _order: {updatedAt: "DESC"}
                    updatedAt: {after: $after}
                ) {
                    edges {
                        node {
                            id
                            updatedAt
                        }
                    }
                }
            }
        }
    }`;

export async function getStaticProps() {
    const variables = {
        isActive: true,
        isActiveModel: true,
        after: getBaseDate(90),
    };
    const data = await apiQl(queryQl, variables, false);
    const brands = data.data.brands;
    // set property indicating that brand has specs
    brands.forEach((brand) => {
        let isSpecs = false;
        brand.models.forEach((model) => {
            if (!isSpecs) {
                isSpecs = model.specs.edges.length > 0;
            }
        });
        // eslint-disable-next-line no-param-reassign
        brand.isSpecs = isSpecs;
    });
    let brandsModels = await getBrandsModels();
    brandsModels = brandsModels.data.brands;
    return {
        props: {
            brands,
            brandsModels,
        },
    };
}
