import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { makeStyles } from '@material-ui/core/styles';
import {
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    Card,
    CardHeader,
    CardContent,
    Chip,
    Avatar,
    List,
    ListItem,
    Button,
} from '@material-ui/core';
import { MonetizationOn, Clear } from '@material-ui/icons';
import localforage from 'localforage';
import PropTypes from 'prop-types';
import getBrandsModelsForComparison from 'lib/getBrandsModelsForComparison';
import { numberFrance } from 'tools/functions';
import { CONVERSION_FUEL } from 'parameters';
import ModelSpecs from 'components/modelSpecs';
import ModelTrims from 'components/modelTrims';
import { actionGetModel, actionSetGetModelToNull } from 'store/actions';
import NotifierInline from 'components/notifierInline';
import NotifierDialog from 'components/notifierDialog';
import Loading from 'components/loading';
import Breadcrumb from 'components/breadcrumb';

const useStylesVL = makeStyles({
    cards: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: '10px',
        justifyContent: 'space-around',
        gap: 10,
        '& > div': {
            // flex: '0 0 280px',
            // backgroundColor: '#ffe082',
        },
        '& .MuiCard-root': {
            width: '100%',
        },
        '& .MuiCardContent-root': {
            padding: 0,
        },
    },
    table: {
        margin: '20px 0',
    },
    fiche: {
        margin: '20px 0',
        '& button': {
            fontWeight: 700,
        },
    },
    ul: {
        display: 'grid',
        justifyContent: 'center',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        '& li': {
            height: 40,
            '& div': {
                width: '100%',
            },
        },
    },
    prices: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
});

const VersionList = ({ model, handleVersionSelect }) => {
    const classes = useStylesVL();
    return (
        <div className={classes.cards}>
            {model.versions.map((version) => (
                <Card key={version.id}>
                    <CardHeader
                        title={
                            <Button
                                size="small"
                                id={version.id}
                                variant="outlined"
                                onClick={handleVersionSelect}
                            >
                                {version.version}
                            </Button>
                        }
                    />
                    <CardContent>
                        <List className={classes.ul}>
                            <ListItem>{`${version.motor.power} ch`}</ListItem>
                            <ListItem>{`PF ${version.CF.CF}`}</ListItem>
                            <ListItem>
                                {`${CONVERSION_FUEL[version.motor.fuel]}`}
                            </ListItem>
                            <ListItem className={classes.prices}>
                                {`${numberFrance(version.prices[0].price)} DH`}
                                {version.prices[0].promo && (
                                    <Chip
                                        size="small"
                                        avatar={
                                            <Avatar>
                                                <MonetizationOn />
                                            </Avatar>
                                        }
                                        label="PROMO"
                                        color="secondary"
                                    />
                                )}
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

VersionList.propTypes = {
    model: PropTypes.object.isRequired,
    handleVersionSelect: PropTypes.func.isRequired,
};
const useStyles = makeStyles((theme) => ({
    root: {
        contentVisibility: 'auto',
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
        backgroundColor: '#fff',
        margin: 10,
        // display: 'grid',
        // gridTemplateColumns: '1fr 1fr 1fr',
        // justifyContent: 'space-evenly',
        // rowGap: '6px',
        // gridGap: '6px',
        [theme.breakpoints.down('xs')]: {
            padding: 0,
        },
        '& >div': {
            textAlign: 'center',
        },
        '& >div:first-child': {
            textAlign: 'right',
            cursor: 'pointer',
        },
        '& > a button': {
            width: '100%',
        },
        '& .selectForms': {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, 170px)',
            gap: 10,
            textAlign: 'left',
            justifyContent: 'space-evenly',
            alignContent: 'center',
            minHeight: 100,
            marginBottom: 20,
            '& div': {
                width: '100%',
            },
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
}));

const Comparison = (props) => {
    const classes = useStyles();
    const { brands, dataGetModel, errorGetModel, isLoading } = props;

    const [selectedValues, setSelectedValues] = useState(['all', 'all', 'all']);
    const [selectedModels, setSelectedModels] = useState([null, null, null]);
    const [isVersionList, setIsVersionList] = useState(false);
    const [modelIndex, setModelIndex] = useState(0);
    const [modelData, setModelData] = useState([]);
    const [selectedVersions, setSelectedVersions] = useState([]);
    const [selectedVersionIds, setSelectedVersionIds] = useState([]);
    const [localStorage, setLocalStorage] = useState([]);
    const [notification, setNotification] = useState({
        status: '',
        title: '',
        message: '',
        errors: {},
    });

    useEffect(() => {
        if (dataGetModel) {
            const currentModels = [...modelData];
            currentModels[modelIndex] = dataGetModel;
            setModelData([...currentModels]);
            props.actionSetGetModelToNull();
        }
        if (errorGetModel) {
            setNotification({
                status: 'ok_and_dismiss',
                title: 'Il a eu une erreur',
                message: 'Merci de ressayer',
                errors: {},
            });
            props.actionSetGetModelToNull();
        }
    }, [dataGetModel, errorGetModel]);

    useEffect(() => {
        if (modelData[modelIndex] && selectedVersionIds[modelIndex]) {
            const selected = modelData[modelIndex].versions.filter((version) => {
                return version.id === selectedVersionIds[modelIndex];
            });
            if (selected.length > 0) {
                const currentVersions = [...selectedVersions];
                currentVersions[modelIndex] = selected[0];
                setSelectedVersions([...currentVersions]);
            }
        }
    }, [modelData, selectedVersionIds]);

    const handleSelectChangeFromStorage = (index) => {
        localforage.getItem('modelsForComparison').then((value) => {
            const currentSelected = [...selectedValues];
            currentSelected[index] = value[index];
            setSelectedValues([...currentSelected]);
            setModelIndex(index);
            let selectedModel = [];
            brands.forEach((brand) => {
                if (selectedModel.length === 0) {
                    selectedModel = brand.models.filter((mod) => {
                        return mod.id === value[index];
                    });
                    if (selectedModel.length === 1) {
                        selectedModel[0].brand = brand.brand;
                    }
                }
            });
            props.actionGetModel(value[index]);
            const currentModels = [...selectedModels];
            currentModels[index] = selectedModel[0];
            setSelectedModels([...currentModels]);
            setIsVersionList(true);
        });
    };

    useEffect(() => {
        localforage.getItem('modelsForComparison').then((value) => {
            if (value && value.length > 0) {
                (async function awaitSet() {
                    await setLocalStorage([...value]);
                })();
                handleSelectChangeFromStorage(0);
            }
        });
    }, []);

    useEffect(() => {
        if (
            localStorage.length > 0 &&
            modelData.length > 0 &&
            modelData.length === selectedVersionIds.length &&
            modelData.length < localStorage.length
        ) {
            handleSelectChangeFromStorage(modelData.length);
            if (modelData.length === localStorage.length - 1) {
                setLocalStorage([]);
                localforage.removeItem('modelsForComparison');
            }
        }
    }, [modelData, localStorage, selectedVersionIds]);

    const handleSelectChange = (event) => {
        const currentSelected = [...selectedValues];
        const currentSelect = parseInt(event.target.name.replace('select-', ''), 10);
        currentSelected[currentSelect] = event.target.value;
        setSelectedValues([...currentSelected]);
        setModelIndex(currentSelect);
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
            props.actionGetModel(event.target.value);
            const currentModels = [...selectedModels];
            currentModels[currentSelect] = selectedModel[0];
            setSelectedModels([...currentModels]);
            setIsVersionList(true);
        } else {
            const currentModels = [...selectedModels];
            currentModels[currentSelect] = null;
            setSelectedModels([...currentModels]);
            const currentVersions = [...selectedVersions];
            currentVersions.pop();
            setSelectedVersions([...currentVersions]);
            const currentModelData = [...modelData];
            currentModelData.pop();
            setModelData([...currentModelData]);
        }
    };
    const handleSetSelect = () => {
        const options = [
            <MenuItem key={0} aria-label="Choisir" value="all">
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
    const handleVersionSelect = (event) => {
        setIsVersionList(false);
        const currentVersionIds = [...selectedVersionIds];
        currentVersionIds[modelIndex] = event.target.id;
        setSelectedVersionIds([...currentVersionIds]);
    };
    const handleSetSelectedDisabled = (ind) => {
        const mods = selectedVersions.length;
        if (ind === 0 && [2, 3].includes(mods)) {
            return true;
        }
        if (ind === 1 && [0, 3].includes(mods)) {
            return true;
        }
        if (ind === 2 && [0, 1].includes(mods)) {
            return true;
        }
        return false;
    };
    const handleClearAll = () => {
        setSelectedValues(['all', 'all', 'all']);
        setSelectedModels([null, null, null]);
        setIsVersionList(false);
        setModelIndex(0);
        setModelData([]);
        setSelectedVersions([]);
        setSelectedVersionIds([]);
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
            <Head>
                <title>
                    Comparatif voiture neuve au Maroc | prix, caracteristiques techniques,
                    equipements
                </title>
                <meta
                    name="description"
                    content="Comparatif toutes les voitures neuves, tous segments et types au Maroc.  "
                />
                <meta
                    property="og:title"
                    content="Comparatif voiture neuve au Maroc, prix, caracteristiques techniques,
                    equipements"
                />
                <meta
                    property="og:image"
                    content="https://www.soeezauto.ma/TODO/og/segment-petit-monospace-ford-b-max.jpg"
                />
                <meta
                    property="og:url"
                    content="https://www.soeezauto.ma/comparatif-voiture"
                />
                <link
                    rel="canonical"
                    href="https://www.soeezauto.ma/comparatif-voiture"
                />
            </Head>
            <main>
                <Breadcrumb
                    links={[
                        {
                            href: null,
                            text: 'Comparatif voitures',
                        },
                    ]}
                />
                {selectedVersionIds.length > modelData.length && isLoading && <Loading />}
                <div className="main-title">
                    <h1>Comparatif voiture neueve au Maroc</h1>
                </div>
                {localStorage.length > 0 && (
                    <NotifierInline message="Veuillez choisir les versions souhaitees pour chaque modele" />
                )}
                <NotifierDialog
                    notification={notification}
                    handleNotificationDismiss={handleNotificationDismiss}
                />
                <div className={classes.mainContainer}>
                    <Card className={classes.root}>
                        <CardHeader title={<h2>Choisir modeles & versions</h2>} />
                        <CardContent className={classes.cardContent}>
                            <div>
                                <Clear
                                    size="small"
                                    variant="outlined"
                                    onClick={handleClearAll}
                                    disabled={selectedVersions.length === 0}
                                />
                            </div>
                            <div className="selectForms">
                                {[...Array(3).keys()].map((ind) => (
                                    <form key={ind}>
                                        <FormControl variant="outlined">
                                            <InputLabel id={`select-${ind}-label`}>
                                                Choisir modele
                                            </InputLabel>
                                            <Select
                                                labelId={`select-${ind}-label`}
                                                name={`select-${ind}`}
                                                label="Choisir modele"
                                                value={selectedValues[ind]}
                                                onChange={handleSelectChange}
                                                variant="outlined"
                                                disabled={handleSetSelectedDisabled(ind)}
                                            >
                                                {handleSetSelect()}
                                            </Select>
                                            <span
                                                id="no_cat_search"
                                                className="form_error"
                                            />
                                        </FormControl>
                                    </form>
                                ))}
                            </div>
                            {isVersionList && (
                                <VersionList
                                    model={selectedModels[modelIndex]}
                                    handleVersionSelect={handleVersionSelect}
                                />
                            )}
                            <div className="selectForms">
                                <div>
                                    {modelData[0] && (
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_API_HOST}/images/models/${modelData[0].images[0].filename}`}
                                            alt={`${modelData[0].brand.brand}-${modelData[0].model}`}
                                            width={150}
                                            height={100}
                                        />
                                    )}
                                </div>
                                <div>
                                    {modelData[1] && (
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_API_HOST}/images/models/${modelData[1].images[0].filename}`}
                                            alt={`${modelData[1].brand.brand}-${modelData[1].model}`}
                                            width={150}
                                            height={100}
                                        />
                                    )}
                                </div>
                                <div>
                                    {modelData[2] && (
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_API_HOST}/images/models/${modelData[2].images[0].filename}`}
                                            alt={`${modelData[2].brand.brand}-${modelData[2].model}`}
                                            width={150}
                                            height={100}
                                        />
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className={classes.root}>
                        <CardHeader title={<h2>Caracteristiques techniques</h2>} />
                        <CardContent className={classes.cardContent}>
                            {selectedVersions.length > 0 ? (
                                <ModelSpecs versions={selectedVersions} />
                            ) : (
                                <Chip size="small" label="Aucune version" />
                            )}
                        </CardContent>
                    </Card>
                    <Card className={classes.root}>
                        <CardHeader title={<h2>Equipements</h2>} />
                        <CardContent className={classes.cardContent}>
                            {selectedVersions.length > 0 ? (
                                <ModelTrims versions={selectedVersions} />
                            ) : (
                                <Chip size="small" label="Aucune version" />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

Comparison.propTypes = {
    brands: PropTypes.array.isRequired,
    actionGetModel: PropTypes.func.isRequired,
    actionSetGetModelToNull: PropTypes.func.isRequired,
    dataGetModel: PropTypes.any,
    errorGetModel: PropTypes.any,
    isLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
    return {
        dataGetModel: state.model.dataGetModel,
        errorGetModel: state.model.errorGetModel,
        isLoading: state.model.isLoading,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionGetModel,
            actionSetGetModelToNull,
        },
        dispatch,
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Comparison);

export async function getStaticProps() {
    let brands = await getBrandsModelsForComparison();
    brands = brands.data.brands;
    return {
        props: {
            brands,
        },
    };
}
