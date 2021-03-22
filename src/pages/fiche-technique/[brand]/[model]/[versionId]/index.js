import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { apiQl } from 'lib/functions';
import ModelSpecs from 'components/modelSpecs';
import ModelTrims from 'components/modelTrims';
import ModelVersions from 'components/modelVersions';
import { actionGetModel } from 'store/actions';

const FicheTechnique = (props) => {
    const { version, dataGetModel, errorGetModel } = props;
    console.log('version', props);
    const [model, setModel] = useState(null);
    const [isPromo, setIsPromo] = useState(false);

    useEffect(() => {
        if (version.model.id) {
            props.actionGetModel(version.model.id);
        }
    }, []);

    useEffect(() => {
        if (dataGetModel) {
            setModel({ ...dataGetModel });
            const prom = dataGetModel.versions.filter((vs) => {
                return vs.prices[0].promo;
            });
            setIsPromo(prom.length > 0);
        }
    }, [dataGetModel, errorGetModel]);

    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                {version.version}
                <ModelSpecs versions={[version]} />
                <ModelTrims versions={[version]} />
                {model && <ModelVersions model={model} isPromo={isPromo} />}
            </main>
        </div>
    );
};

FicheTechnique.propTypes = {
    version: PropTypes.object.isRequired,
    dataGetModel: PropTypes.any,
    errorGetModel: PropTypes.any,
    actionGetModel: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    return {
        dataGetModel: state.model.dataGetModel,
        errorGetModel: state.model.errorGetModel,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionGetModel,
        },
        dispatch,
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(FicheTechnique);

const queryQl = `query getVersion(
  	$id: ID!
) {
    version(
        id: $id
    ){
        id
        version
        model {
            id
            model
        }
        bodyType
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
            isActive: true
        ) {
            id
            updatedAt
            price
            promo
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
        trims {
            id
            trim
            trimType
        }
    }
}`;

export async function getServerSideProps(context) {
    const {
        params: { versionId },
    } = context;
    console.log('versionid', versionId);
    const variables = {
        id: `/api/versions/${versionId}`,
    };
    const data = await apiQl(queryQl, variables, false);
    return {
        props: {
            version: data.data.version,
        },
    };
}
