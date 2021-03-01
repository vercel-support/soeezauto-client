import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { apiQl } from 'lib/functions';

const FicheTechnique = ({ version }) => {
    console.log('version', version);

    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>{version.version}</main>
        </div>
    );
};

FicheTechnique.propTypes = {
    version: PropTypes.object.isRequired,
};

export default FicheTechnique;

const queryQl = `query getVersion(
  	$id: ID!
) {
    version(
        id: $id
    ){
        id
        version
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
