import React, { useEffect, useState } from 'react';
import Head from 'next/head';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    CardHeader,
    CardContent,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import getModels from 'lib/getModels';
import getPosts from 'lib/getPosts';
import { urlWriter } from 'tools/functions';
import { apiQl } from 'lib/functions';
import ModelSpecs from 'components/modelSpecs';
import ModelTrims from 'components/modelTrims';
import ModelPrices from 'components/modelPrices';
import ModelVersions from 'components/modelVersions';
import Breadcrumb from 'components/breadcrumb';

const useStyles = makeStyles({
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
        padding: '10px',
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
    chart: {
        height: 400,
        backgroundColor: '#fff',
        margin: 5,
        padding: 0,
    },
});

const Model = ({ model }) => {
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
                                {`Select version ${i === 0 ? 'base' : i}`}
                            </InputLabel>
                            <Select
                                labelId={`version${i}-select-label`}
                                id={`version${i}-select`}
                                name={`version${i}`}
                                label={`Select version ${i}`}
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
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={classes.mainContainer}>
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
                    <h1>{`${model.brand.brand} ${model.model} neuve maroc`}</h1>
                </div>
                <Card className={classes.root}>
                    <CardHeader title={<h2>{`Versions ${model.model}`}</h2>} />
                    <CardContent className={classes.cardContent}>
                        <ModelVersions model={model} />
                    </CardContent>
                </Card>
                <Card className={classes.root}>
                    <CardHeader title={<h2>Selectionez versions pour comparison</h2>} />
                    <CardContent className={classes.cardContent}>
                        <div className="selectForms">{handleSetVersionSelect()}</div>
                    </CardContent>
                </Card>
                <Card className={classes.root}>
                    <CardHeader title={<h2>Caracteristiques techniques</h2>} />
                    <CardContent className={classes.cardContent}>
                        <ModelSpecs versions={selectedVersions} />
                    </CardContent>
                </Card>
                <Card className={classes.root}>
                    <CardHeader title={<h2>Equipements</h2>} />
                    <CardContent className={classes.cardContent}>
                        <ModelTrims versions={selectedVersions} />
                    </CardContent>
                </Card>
                <Card className={classes.root}>
                    <CardHeader title={<h2>Evolution prix et promotion</h2>} />
                    <CardContent className={classes.chart}>
                        <ModelPrices model={model} />
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

Model.propTypes = {
    model: PropTypes.object.isRequired,
};
/*
const mapStateToProps = (state) => {
    return {};
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionGetModelVersionsWithTrims,
        },
        dispatch,
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Model);
*/
export default Model;

const queryQl = `query getModel(
  	$id: ID!
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
        specs(_order: {year: "DESC", month: "DESC"}){
            id
            year
            month
            filename
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
    let posts = await getPosts();
    posts = posts.data.posts;
    const modelFilter = models.filter((mod) => {
        return urlWriter(mod.model) === modelParam;
    });
    const variables = {
        id: modelFilter[0].id,
    };
    const data = await apiQl(queryQl, variables, false);
    const model = data.data.model;
    return {
        props: {
            model,
            posts,
        },
    };
}
