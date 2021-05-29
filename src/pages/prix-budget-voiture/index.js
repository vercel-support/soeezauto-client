/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import {
    AppBar,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    Paper,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button,
    Box,
    Slider,
    Chip,
    Avatar,
    Checkbox,
    Snackbar,
    SnackbarContent,
    Badge,
} from '@material-ui/core';
import { MonetizationOn } from '@material-ui/icons';
import localforage from 'localforage';
import PropTypes from 'prop-types';
import getPosts from 'lib/getPosts';
import getSegmentsModelsDetailed from 'lib/getSegmentsModelsDetailed';
import getBrandsModels from 'lib/getBrandsModels';
import { CONVERSION_FUEL, PRICE_RANGES } from 'parameters';
import Link from 'components/link';
import { urlWriter } from 'tools/functions';
import usePrevious from 'tools/hooks/usePrevious';
import Breadcrumb from 'components/breadcrumb';
import WidgetNav from 'components/widgetNav';
import WidgetLaunches from 'components/widgetLaunches';
import WidgetPromo from 'components/widgetPromotion';
import NotifierInline from 'components/notifierInline';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`spec-tabpanel-${index}`}
            aria-labelledby={`spec-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `spec-tab-${index}`,
        'aria-controls': `spec-tabpanel-${index}`,
    };
}

function CheckboxCompare({ model, handleCompareChange, selectedModels }) {
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (selectedModels.length === 0) {
            setChecked(false);
        }
    }, [selectedModels]);

    const handleChange = (event) => {
        setChecked(event.target.checked);
        handleCompareChange(event);
    };

    return (
        <Checkbox
            checked={checked}
            value={model.id}
            onChange={handleChange}
            size="small"
            disabled={!checked && selectedModels.length === 3}
            inputProps={{
                'aria-label': `Comparer ${model.model}`,
            }}
        />
    );
}

CheckboxCompare.propTypes = {
    model: PropTypes.object.isRequired,
    handleCompareChange: PropTypes.func.isRequired,
    selectedModels: PropTypes.array.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        overflow: 'scroll',
        '& button': {
            minWidth: 'unset',
            // width: '33%',
            fontSize: '.75rem',
        },
    },
    table: {
        tableLayout: 'unset',
        '& td': {
            fontSize: '.75rem',
        },
        '& th': {
            fontSize: '.75rem',
        },
    },
    brand: {
        width: 150,
        minWidth: 150,
        height: 85,
    },
    model: {
        height: 70,
    },
    cardRoot: {
        width: 'clamp(300px, 100%, 700px)',
        backgroundColor: '#ffe082',
        margin: '10px auto',
        color: '#29335c',
        '& .MuiCardHeader-root': {
            textAlign: 'center',
        },
        '& .MuiCardActions-root': {
            justifyContent: 'center',
            flexDirection: 'column',
        },
        '& .MuiCardHeader-content span': {
            textTransform: 'uppercase',
            fontWeight: 'bold',
        },
    },
    cardContent: {
        padding: '8px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        justifyContent: 'space-evenly',
        rowGap: '6px',
        gridGap: '6px',
        '& >div': {
            textAlign: 'center',
        },
    },
    ownBudget: {
        backgroundColor: '#fff',
        width: 'clamp(300px,50%,500px)',
        borderRadius: 8,
        display: 'grid',
        gridGap: 20,
        padding: 10,
        '& div:first-child': {
            textAlign: 'center',
        },
        '& .MuiChip-root': {
            width: '50%',
            margin: '0 auto',
        },
    },
    range: {
        width: '100%',
        height: '100%',
        '& > span': {
            fontWeight: 'bold',
        },
    },
    snack: {
        '& .MuiSnackbarContent-root': {
            backgroundColor: theme.palette.primary.main,
        },
        '& .MuiSnackbarContent-message': {
            display: 'flex',
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            fontWeight: 700,
        },
    },
    subheader: {
        height: 40,
        display: 'grid',
        gridTemplateColumns: 'auto auto',
        gap: 20,
        justifyContent: 'center',
        alignContent: 'center',
    },
    notifier: {
        marginLeft: 0,
    },
}));

const RANGE = {
    minPrice: 100,
    maxPrice: 1000,
    minRange: 30,
    maxRange: 350,
};

const Prices = (props) => {
    const classes = useStyles();
    const router = useRouter();
    const { segments, brands } = props;

    const [tabValue, setTabValue] = useState(0);
    const [currentSegments, setCurrentSegments] = useState(segments);
    const [sliderRange, setSliderRange] = useState([100, 300]);
    const previousSliderRange = usePrevious(sliderRange);
    const [selectedButtonId, setSelectedButtonId] = useState(null);
    const [selectedRangeIndex, setSelectedRangeIndex] = useState(null);
    const [selectedModels, setSelectedModels] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const handleRangeSelect = (event) => {
        let min = sliderRange[0] * 1000;
        let max = sliderRange[1] * 1000;
        setSelectedRangeIndex(null);
        if (event.target.id !== 'sliderButton') {
            min = parseInt(event.target.id.split(',')[0], 10);
            max = parseInt(event.target.id.split(',')[1], 10);
            setSelectedRangeIndex(parseInt(event.target.dataset.rangeindex, 10));
        }
        const newSegments = [];
        segments.forEach((seg) => {
            const newModels = [];
            seg.models.forEach((mod) => {
                const versions = mod.versions.filter((vs) => {
                    return vs.prices[0].price > min && vs.prices[0].price < max;
                });
                if (versions.length > 0) {
                    newModels.push({ ...mod, versions });
                }
            });
            if (newModels.length > 0) {
                newSegments.push({ ...seg, models: newModels });
            }
        });
        setCurrentSegments(newSegments);
        setTabValue(0);
        setSelectedButtonId(event.target.id);
    };

    const getUnique = (versions, item) => {
        let allItems = versions.map((vs) => {
            if (item[1] === 'fuel') {
                return CONVERSION_FUEL[vs[item[0]][item[1]]];
            }
            return item.length === 1 ? vs[item[0]] : vs[item[0]][item[1]];
        });
        if (item[1] === 'mileageMix') {
            allItems = allItems.map((x) => {
                return parseFloat(x, 10);
            });
        }
        const withMinMax = ['trunk', 'length', 'maxSpeed', 'mileageMix'];
        if (withMinMax.includes(item[1])) {
            allItems = [Math.min(...allItems), Math.max(...allItems)];
        }
        const unique = [...new Set(allItems)];
        if (unique.length === 1) {
            return unique[0];
        }
        return `${unique[0]}-${unique[1]}`;
    };
    const handleSliderRangeChange = (event, newValue) => {
        const newRange = [...newValue];
        if (previousSliderRange[0] !== newRange[0]) {
            if (newRange[1] - newRange[0] > RANGE.maxRange) {
                newRange[1] = newRange[0] + RANGE.maxRange;
            }
        }
        if (previousSliderRange[1] !== newRange[1]) {
            if (newRange[1] - newRange[0] > RANGE.maxRange) {
                newRange[0] = newRange[1] - RANGE.maxRange;
            }
        }
        if (newRange[0] > newRange[1] - RANGE.minRange) {
            newRange[0] = newRange[1] - RANGE.minRange;
        }
        setSliderRange(newRange);
    };

    const handleCompareChange = (event) => {
        const currentModels = [...selectedModels];
        if (event.target.checked) {
            setSelectedModels([...currentModels, event.target.value]);
        } else {
            const index = currentModels.indexOf(event.target.value);
            if (index > -1) {
                currentModels.splice(index, 1);
                setSelectedModels([...currentModels]);
            }
        }
        setOpenSnackbar(true);
    };
    const handleComparison = () => {
        localforage.setItem('modelsForComparison', [...selectedModels]);
        setSelectedModels([]);
        router.push('/comparatif-voiture');
    };
    const handleDeleteComparison = () => {
        setSelectedModels([]);
    };

    const alertMessage = () => {
        return (
            <>
                <Badge badgeContent={selectedModels.length} color="secondary" showZero />
                <span>de</span>
                <Badge badgeContent={3} color="secondary" />
                <span>modeles choisis</span>
            </>
        );
    };
    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                    className={classes.snack}
                >
                    <SnackbarContent message={alertMessage()} />
                </Snackbar>
                <Breadcrumb
                    links={[
                        {
                            href: '/',
                            text: 'accueil',
                        },
                        {
                            href: null,
                            text: 'prix et budget voiture',
                        },
                    ]}
                />
                <div className="main-title">
                    <h1>Prix et budget voiture au Maroc</h1>
                </div>
                <Card className={classes.cardRoot}>
                    <CardHeader title="Gammes de prix" subheader="mille dh" />
                    <CardContent className={classes.cardContent}>
                        {PRICE_RANGES.map((range, index) => (
                            <Box key={range}>
                                <Button
                                    data-rangeindex={index}
                                    id={range}
                                    className={classes.range}
                                    variant="contained"
                                    color={
                                        selectedRangeIndex === index
                                            ? 'secondary'
                                            : 'primary'
                                    }
                                    onClick={handleRangeSelect}
                                >
                                    {index === 0 &&
                                        ` < ${Math.floor(Math.round(range[1] / 1000))}`}
                                    {index > 0 &&
                                        index < PRICE_RANGES.length - 1 &&
                                        `${Math.floor(
                                            Math.round(range[0] / 1000),
                                        )}-${Math.floor(Math.round(range[1] / 1000))}`}
                                    {index === PRICE_RANGES.length - 1 &&
                                        ` > ${Math.floor(Math.round(range[0] / 1000))}`}
                                </Button>
                            </Box>
                        ))}
                    </CardContent>
                    <CardActions>
                        <Box className={classes.ownBudget}>
                            <div>
                                <h3>Faites votre propre budget</h3>
                            </div>
                            <Slider
                                value={sliderRange}
                                onChange={handleSliderRangeChange}
                                valueLabelDisplay="auto"
                                aria-labelledby="range-slider"
                                min={RANGE.minPrice}
                                max={RANGE.maxPrice}
                                step={10}
                            />
                            <Chip
                                label={`Range ${sliderRange[0]}-${sliderRange[1]}`}
                                color={
                                    selectedButtonId === 'sliderButton'
                                        ? 'secondary'
                                        : 'default'
                                }
                            />
                            <Button
                                id="sliderButton"
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={handleRangeSelect}
                            >
                                Envoyer
                            </Button>
                        </Box>
                        <div className={classes.notifier}>
                            <NotifierInline message="Résultat affiché sur le tableau en bas" />
                        </div>
                    </CardActions>
                </Card>
                <Card className={classes.cardRoot}>
                    <CardHeader
                        title="Modèles par gamme de prix et segment"
                        subheader={
                            <div className={classes.subheader}>
                                {selectedModels.length > 0 && (
                                    <>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="secondary"
                                            onClick={handleComparison}
                                        >
                                            Comparer
                                        </Button>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="secondary"
                                            onClick={handleDeleteComparison}
                                        >
                                            Effacer selections
                                        </Button>
                                    </>
                                )}
                            </div>
                        }
                    />
                    <CardContent>
                        <div className={classes.root}>
                            <AppBar position="static">
                                <Tabs
                                    value={tabValue}
                                    onChange={handleTabChange}
                                    variant="scrollable"
                                    scrollButtons="on"
                                    aria-label="simple tabs example"
                                >
                                    {currentSegments.map((segment, index) => (
                                        <Tab
                                            key={segment.id}
                                            label={segment.segment}
                                            {...a11yProps(index)}
                                        />
                                    ))}
                                </Tabs>
                            </AppBar>
                            {currentSegments.map((segment, index) => (
                                <TabPanel
                                    key={`panel${segment.id}`}
                                    value={tabValue}
                                    index={index}
                                >
                                    <TableContainer component={Paper}>
                                        <Table
                                            className={classes.table}
                                            aria-label={segment.segment}
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell
                                                        className={classes.brand}
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        Marque
                                                    </TableCell>
                                                    {segment.models.map((model) => (
                                                        <TableCell key={model.model}>
                                                            {model.brand.brand}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow className={classes.model}>
                                                    <TableCell component="th" scope="row">
                                                        Modele
                                                    </TableCell>
                                                    {segment.models.map((model) => (
                                                        <TableCell key={model.model}>
                                                            <Link
                                                                href={`/modeles-voiture/${urlWriter(
                                                                    model.brand.brand,
                                                                )}/${urlWriter(
                                                                    model.model,
                                                                )}`}
                                                            >
                                                                {model.model}
                                                            </Link>
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            disabled={
                                                                selectedModels.length ===
                                                                0
                                                            }
                                                            color="secondary"
                                                            onClick={handleComparison}
                                                        >
                                                            Comparer
                                                        </Button>
                                                    </TableCell>
                                                    {segment.models.map((model) => (
                                                        <TableCell key={model.id}>
                                                            <CheckboxCompare
                                                                model={model}
                                                                handleCompareChange={
                                                                    handleCompareChange
                                                                }
                                                                selectedModels={
                                                                    selectedModels
                                                                }
                                                            />
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">
                                                        Versions
                                                    </TableCell>
                                                    {segment.models.map((model) => (
                                                        <TableCell key={model.id}>
                                                            {model.versions.length}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">
                                                        Prix
                                                    </TableCell>
                                                    {segment.models.map((mod) => (
                                                        <TableCell key={mod.id}>
                                                            {mod.versions.length === 1
                                                                ? Math.floor(
                                                                      Math.round(
                                                                          mod.versions[0]
                                                                              .prices[0]
                                                                              .price /
                                                                              1000,
                                                                      ),
                                                                  )
                                                                : `${Math.floor(
                                                                      Math.round(
                                                                          mod.versions[0]
                                                                              .prices[0]
                                                                              .price /
                                                                              1000,
                                                                      ),
                                                                  )}-${Math.floor(
                                                                      Math.round(
                                                                          mod.versions[
                                                                              mod.versions
                                                                                  .length -
                                                                                  1
                                                                          ].prices[0]
                                                                              .price /
                                                                              1000,
                                                                      ),
                                                                  )}`}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">
                                                        Promo
                                                    </TableCell>
                                                    {segment.models.map((model) => (
                                                        <TableCell key={model.id}>
                                                            {model.isPromo ? (
                                                                <Chip
                                                                    size="small"
                                                                    label="Promo"
                                                                    avatar={
                                                                        <Avatar>
                                                                            <MonetizationOn />
                                                                        </Avatar>
                                                                    }
                                                                />
                                                            ) : (
                                                                '-'
                                                            )}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">
                                                        Boite vitesse
                                                    </TableCell>
                                                    {segment.models.map((model) => (
                                                        <TableCell key={model.id}>
                                                            {getUnique(model.versions, [
                                                                'gearbox',
                                                            ])}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">
                                                        Combustible
                                                    </TableCell>
                                                    {segment.models.map((model) => (
                                                        <TableCell key={model.id}>
                                                            {getUnique(model.versions, [
                                                                'motor',
                                                                'fuel',
                                                            ])}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        colSpan={
                                                            segment.models.length + 1
                                                        }
                                                    >
                                                        Performance
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">
                                                        Conso. mixte l/100km
                                                    </TableCell>
                                                    {segment.models.map((model) => (
                                                        <TableCell key={model.id}>
                                                            {getUnique(model.versions, [
                                                                'performance',
                                                                'mileageMix',
                                                            ])}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">
                                                        Vitesse max. km/h
                                                    </TableCell>
                                                    {segment.models.map((model) => (
                                                        <TableCell key={model.id}>
                                                            {getUnique(model.versions, [
                                                                'performance',
                                                                'maxSpeed',
                                                            ])}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">
                                                        Coffre
                                                    </TableCell>
                                                    {segment.models.map((model) => (
                                                        <TableCell key={model.id}>
                                                            {getUnique(model.versions, [
                                                                'measures',
                                                                'trunk',
                                                            ])}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">
                                                        Longueur
                                                    </TableCell>
                                                    {segment.models.map((model) => (
                                                        <TableCell key={model.id}>
                                                            {getUnique(model.versions, [
                                                                'measures',
                                                                'length',
                                                            ])}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </TabPanel>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <WidgetNav brands={brands} />
                <WidgetLaunches data={brands} />
                <WidgetPromo data={brands} />
            </main>
        </div>
    );
};

Prices.propTypes = {
    segments: PropTypes.array.isRequired,
    brands: PropTypes.array.isRequired,
};

export default Prices;
/*
const queryQl = `query getRange(
  	$isActiveModel: Boolean!
  	$range: String
) {
    versions(
        exists: {prices:true}
        model_isActive: $isActiveModel
    ) {
        id
        version
        prices(
            price: {between: $range}
            _order: {updatedAt: "DESC"}
        ) {
            id
            updatedAt
            price
            promo
        }
    }
}`;
*/
export async function getStaticProps() {
    let segments = await getSegmentsModelsDetailed();
    segments = segments.data.segments;
    let posts = await getPosts();
    posts = posts.data.posts;
    let brands = await getBrandsModels();
    brands = brands.data.brands;
    const newSegments = [];
    segments.forEach((seg) => {
        const newSeg = { ...seg };
        const newModels = [];
        seg.models.forEach((mod) => {
            const newModel = { ...mod };
            const versions = mod.versions.filter((vs) => {
                return vs.prices[0].promo;
            });
            newModel.isPromo = versions.length > 0;
            newModels.push(newModel);
        });
        newSeg.models = [...newModels];
        newSegments.push(newSeg);
    });
    return {
        props: {
            segments: newSegments,
            brands,
            posts,
        },
    };
}
