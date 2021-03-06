import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import { makeStyles } from '@material-ui/core/styles';
import {
    Box,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import getModels from 'lib/getModels';
import getPosts from 'lib/getPosts';
import getBrandsModels from 'lib/getBrandsModels';
import { urlWriter, randIndex, getBaseDate } from 'tools/functions';
import { apiQl } from 'lib/functions';
import ModelSpecs from 'components/modelSpecs';
import ModelPrices from 'components/modelPrices';
import ModelVersions from 'components/modelVersions';
import ModelTrims from 'components/modelTrims';
import Breadcrumb from 'components/breadcrumb';
import Link from 'components/link';
import NotifierInline from 'components/notifierInline';

const WidgetNav = dynamic(() => import('../../../components/widgetNav'), {
    ssr: false,
});

const WidgetLaunches = dynamic(() => import('../../../components/widgetLaunches'), {
    ssr: false,
});

const WidgetPromo = dynamic(() => import('../../../components/widgetPromotion'), {
    ssr: false,
});

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: '#ffe082',
        '& .MuiCardHeader-root': {
            textAlign: 'center',
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
            // color: '#fff',
        },
    },
    cardContent: {
        overflow: 'scroll',
        // display: 'grid',
        // gridTemplateColumns: '1fr 1fr 1fr',
        // justifyContent: 'space-evenly',
        // rowGap: '6px',
        // gridGap: '6px',
        '& >div': {
            textAlign: 'center',
        },
        '& > a button': {
            width: '100%',
        },
        '& .selectForms': {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, 200px)',
            justifyContent: 'space-evenly',
            gap: 10,
            textAlign: 'left',
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
        [theme.breakpoints.down('xs')]: {
            padding: 0,
        },
        '& .MuiCard-root:nth-child(2)': {
            contentVisibility: 'auto',
            containIntrinsicSize: '304px',
        },
        '& .MuiCard-root:nth-child(3)': {
            contentVisibility: 'auto',
            containIntrinsicSize: '683px',
        },
        '& .MuiCard-root:nth-child(4)': {
            contentVisibility: 'auto',
            containIntrinsicSize: '147px',
        },
        '& .MuiCard-root:nth-child(5)': {
            contentVisibility: 'auto',
            containIntrinsicSize: '751px',
        },
    },
    table: {
        '& th': {
            fontWeight: 600,
            fontSize: '.75rem',
        },
        '& th:first-child': {
            width: 100,
        },
        '& td': {
            fontSize: '.75rem',
        },
    },
    chart: {
        height: 400,
        backgroundColor: '#fff',
        margin: 5,
        padding: 0,
    },
    fiche: {
        display: 'grid',
        marginBottom: 20,
        gap: 20,
        '& button': {
            minWidth: 280,
            fontWeight: 700,
        },
    },
}));

const Model = ({ model, recentModels, randPromos, brands }) => {
    const classes = useStyles();
    const [versionSelect, setVersionSelect] = useState([model.versions[0].id, '', '']);
    const [selectedVersions, setSelectedVersions] = useState([model.versions[0]]);

    const handleVersionSelectChange = (event) => {
        const index = parseInt(event.target.name.replace('version', ''), 10);
        const versionsSelected = [...versionSelect];
        versionsSelected[index] = event.target.value;
        if (event.target.value === '' && index === 1) {
            versionsSelected[2] = '';
        }
        setVersionSelect([...versionsSelected]);
        let versions = [...selectedVersions];
        if (event.target.value === '') {
            if (index === 1) {
                versions = [versions[0]];
            } else if (index === 2) {
                versions = [versions[0], versions[1]];
            }
        } else {
            const newSelect = model.versions.filter((vs) => {
                return vs.id === event.target.value;
            });
            versions[index] = newSelect[0];
        }
        setSelectedVersions([...versions]);
    };

    const handleSetVersionSelect = () => {
        const handleSetOptions = (i) => {
            let options = [];
            let filtered = [...model.versions];
            if (i > 0) {
                options = [
                    <MenuItem key={0} aria-label="aucune" value="">
                        Aucune
                    </MenuItem>,
                ];
                filtered = filtered.filter((ver) => {
                    return !versionSelect.slice(0, i).includes(ver.id);
                });
            }
            filtered.forEach((vs) => {
                options.push(
                    <MenuItem value={vs.id} key={vs.id}>
                        {vs.version}
                    </MenuItem>,
                );
            });

            return options;
        };
        const selects = [];
        for (let i = 0; i < 3; i++) {
            selects.push(
                <form key={i}>
                    <div className="form_select">
                        <FormControl variant="outlined">
                            <InputLabel id={`version${i}-select-label`}>
                                {`Choisir version ${i === 0 ? 'base' : i}`}
                            </InputLabel>
                            <Select
                                labelId={`version${i}-select-label`}
                                id={`version${i}-select`}
                                name={`version${i}`}
                                label={`Choisir version ${i}`}
                                value={versionSelect[i]}
                                onChange={handleVersionSelectChange}
                                variant="outlined"
                                disabled={i === 2 && versionSelect[1] === ''}
                            >
                                {handleSetOptions(i)}
                            </Select>
                        </FormControl>
                    </div>
                </form>,
            );
        }
        return selects;
    };
    useEffect(() => {
        handleSetVersionSelect();
    }, [versionSelect]);

    return (
        <div>
            <Head>
                <title>
                    {`${model.brand.brand} ${model.model} neuve au Maroc | guide d'achat,
                    prix, fiches techniques`}
                </title>
                <meta
                    name="description"
                    content={`${model.brand.brand} ${model.model} neuve au Maroc, guide d'achat, prix, fiches techniques, comparateur, nouveaut??s`}
                />
                <meta
                    property="og:title"
                    content={`${model.brand.brand} ${model.model} neuve au Maroc, prix, fiches techniques`}
                />
                <meta
                    property="og:image"
                    content={`https://www.soeezauto.com/images/models/${model.images[0].filename}`}
                />
                <meta
                    property="og:url"
                    content={`https://www.soeezauto.ma/modeles-voiture/${urlWriter(
                        model.brand.brand,
                    )}/${urlWriter(model.model)}`}
                />
                <link
                    rel="canonical"
                    href={`https://www.soeezauto.ma/modeles-voiture/${urlWriter(
                        model.brand.brand,
                    )}/${urlWriter(model.model)}`}
                />
            </Head>

            <main>
                <Breadcrumb
                    links={[
                        {
                            href: `/marques-voiture/${urlWriter(model.brand.brand)}`,
                            text: `${model.brand.brand}`,
                        },
                        {
                            href: null,
                            text: `${model.brand.brand} ${model.model}`,
                        },
                    ]}
                />
                <div className="main-title">
                    <h1>{`${model.brand.brand} ${model.model} neuve au Maroc`}</h1>
                </div>
                <div className={classes.mainContainer}>
                    <Card className={classes.root}>
                        <CardHeader title={<h2>{`Versions ${model.model}`}</h2>} />
                        <CardContent className={classes.cardContent}>
                            <ModelVersions model={model} />
                        </CardContent>
                        <CardActions>
                            <Box className={classes.fiche}>
                                {model.specs.edges.length > 0 && (
                                    <Link
                                        href={`/fiches-techniques/marque/${urlWriter(
                                            model.brand.brand,
                                        )}`}
                                    >
                                        <Button variant="contained" color="primary">
                                            Fiche technique constructeur
                                        </Button>
                                    </Link>
                                )}
                                <Link
                                    href={`/images/${urlWriter(
                                        model.brand.brand,
                                    )}/${urlWriter(model.model)}`}
                                >
                                    <Button
                                        variant="contained"
                                        color="primary"
                                    >{`Images ${model.brand.brand} ${model.model}`}</Button>
                                </Link>
                            </Box>
                        </CardActions>
                    </Card>
                    <Card className={classes.root}>
                        <CardHeader
                            title={<h2>S??lectionnez versions pour comparaison</h2>}
                        />
                        <CardContent className={classes.cardContent}>
                            <div className="selectForms">{handleSetVersionSelect()}</div>
                        </CardContent>
                    </Card>
                    <Card className={classes.root}>
                        <CardHeader title={<h2>Caract??ristiques techniques</h2>} />
                        <CardContent className={classes.cardContent}>
                            <ModelSpecs versions={selectedVersions} />
                        </CardContent>
                    </Card>
                    <Card className={classes.root}>
                        <CardHeader title={<h2>??quipements</h2>} />
                        <CardContent className={classes.cardContent}>
                            <ModelTrims versions={selectedVersions} />
                        </CardContent>
                    </Card>
                    <Card className={classes.root}>
                        <CardHeader title={<h2>??volution prix & promotion</h2>} />
                        <CardContent>
                            <NotifierInline
                                severity="info"
                                message={
                                    <>
                                        <p>
                                            {`Indicateur de l'??volution du prix du mod??le
                                            pendant les 12 derniers mois.`}
                                        </p>
                                        <p>
                                            Les prix et promo concernent les versions de
                                            base et haut de gamme.
                                        </p>
                                        <p>
                                            {`Notez qu'il se peut que cettes versions aussi
                                            bien que leurs caract??ristiques et dotations
                                            aient ??t?? modifi??es pendant cette p??riode.`}
                                        </p>
                                        <p>Utilisez ceci ?? titre indicatif seulement.</p>
                                    </>
                                }
                            />
                            <div className={classes.chart}>
                                <ModelPrices model={model} />
                            </div>
                        </CardContent>
                    </Card>
                    <WidgetNav brands={brands} />
                    <WidgetPromo data={randPromos} />
                    <WidgetLaunches data={recentModels} />
                </div>
            </main>
        </div>
    );
};

Model.propTypes = {
    model: PropTypes.object.isRequired,
    recentModels: PropTypes.array.isRequired,
    randPromos: PropTypes.array.isRequired,
    brands: PropTypes.array.isRequired,
};

export default Model;

const queryQl = `query getModel(
  	$id: ID!
    $after: String!
) {
    model(id: $id) {
        id
    	model
    	modelYear
    	images(isFeatured: true) {
            filename
        }
    	brand {
            id
            brand
            image
        }
        segment {
            id
            segment
        }
        specs(
            first: 1, after: null,
            _order: {updatedAt: "DESC"}
            updatedAt: {after: $after}
        ) {
            edges {
                node {
                    id
                    filename
                    updatedAt
                }
            }
        }
        versions(
            isActive: true
            _order:{ bodyType: "ASC", motor_fuel: "ASC", prices_price: "ASC"}
        ){
            id
            version
          	taxLuxe
          	matricule
          	tag
          	paintMetal
          	destCharges
          	gearbox
          	places
          	doors
          	curbWeight
          	gvw
          	traction
      		tyreFr
      		tyreBk
            prices(
                _order: {updatedAt: "DESC"}
            ) {
                id
                updatedAt
                price
                promo
                isActive
            }
            CF {
                CF
            }
        	motor {
                power
                fuel
                cc
                cylinder
                torque
                valves
                aspiration
            }
      		measures {
                fuelTank
                width
                height
                length
                wheelbase
                trunk
                trunkMax
            }
            performance {
                to100
                maxSpeed
                emissions
                mileageCity
                mileageRoad
                mileageMix
            }
            trims(_order: { trim: "ASC"}) {
                id
                trim
                trimType
            }
        }
    }
}`;

export async function getStaticPaths() {
    let models = await getModels();
    models = models.data.models;
    const paths = [];
    models.forEach((model) => {
        paths.push({
            params: {
                brand: urlWriter(model.brand.brand),
                model: urlWriter(model.model),
            },
        });
    });
    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    const { model: modelParam } = params;
    let models = await getModels();
    models = models.data.models;
    const modelFilter = models.filter((mod) => {
        return urlWriter(mod.model) === urlWriter(modelParam);
    });
    /*
    if (modelFilter.length === 0) {
        return {
            notFound: true,
        };
    }
    // redirect in case valid brand with capital letters
    if (/[A-Z]/.test(modelParam)) {
        return {
            redirect: {
                destination: `/modeles-voiture/${urlWriter(
                    modelFilter[0].brand.brand,
                )}/${urlWriter(modelParam)}`,
                permanent: true,
            },
        };
    }
    */
    let posts = await getPosts();
    posts = posts.data.posts;
    // data for widgets
    let brands = await getBrandsModels();
    brands = brands.data.brands;
    const randMod = randIndex(19, 6);
    const recentModels = models.filter((model, ind) => {
        return randMod.includes(ind);
    });
    // rand promos
    const promos = [];
    models.forEach((model) => {
        const promoVersions = model.versions.filter((version) => {
            return version.prices[0].promo !== null;
        });
        if (promoVersions.length > 0) {
            // eslint-disable-next-line no-param-reassign
            model.versions = promoVersions;
            promos.push(model);
        }
    });
    const selectedPromos = randIndex(promos.length, 6);
    const randPromos = promos.filter((model, ind) => {
        return selectedPromos.includes(ind + 1);
    });

    const variables = {
        id: modelFilter[0].id,
        after: getBaseDate(),
    };
    const data = await apiQl(queryQl, variables, false);
    const model = data.data.model;
    return {
        props: {
            model,
            brands,
            posts,
            recentModels,
            randPromos,
        },
    };
}
