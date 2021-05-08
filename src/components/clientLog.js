import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { actionPostClientLog } from 'store/actions';

const ClientLog = (props) => {
    console.log('CLIENT LOG', props);
    const router = useRouter();
    const {
        errorGetModelsWithAutomaticGearboxForBrand,
        errorGetModelsWithAirCondAutoForBrand,
        errorGetModelsWithDisplayMultimediaForBrand,
        errorGetModelsWithFuelForBrand,
        errorGetModelsWithLeatherSeatsForBrand,
        errorGetModelsWithPowerRangeForBrand,
        errorGetModelsWithPriceRangeForBrand,
    } = props;

    const handleMessage = (errors) => {
        const message = errors.map((error) => {
            const key = Object.keys(error)[0];
            return <li key={`${key} - ${error[key]}`}>{error[key]}</li>;
        });
        return <ul>{message}</ul>;
    };

    useEffect(() => {
        if (errorGetModelsWithAutomaticGearboxForBrand?.length > 0) {
            actionPostClientLog({
                url: router.url,
                message: handleMessage(errorGetModelsWithAutomaticGearboxForBrand),
            });
        }
    }, [errorGetModelsWithAutomaticGearboxForBrand, router]);

    useEffect(() => {
        if (errorGetModelsWithAirCondAutoForBrand?.length > 0) {
            actionPostClientLog({
                url: router.url,
                message: handleMessage(errorGetModelsWithAirCondAutoForBrand),
            });
        }
    }, [errorGetModelsWithAirCondAutoForBrand, router]);

    useEffect(() => {
        if (errorGetModelsWithDisplayMultimediaForBrand?.length > 0) {
            actionPostClientLog({
                url: router.url,
                message: handleMessage(errorGetModelsWithDisplayMultimediaForBrand),
            });
        }
    }, [errorGetModelsWithDisplayMultimediaForBrand, router]);

    useEffect(() => {
        if (errorGetModelsWithFuelForBrand?.length > 0) {
            actionPostClientLog({
                url: router.url,
                message: handleMessage(errorGetModelsWithFuelForBrand),
            });
        }
    }, [errorGetModelsWithFuelForBrand, router]);

    useEffect(() => {
        if (errorGetModelsWithLeatherSeatsForBrand?.length > 0) {
            actionPostClientLog({
                url: router.url,
                message: handleMessage(errorGetModelsWithLeatherSeatsForBrand),
            });
        }
    }, [errorGetModelsWithLeatherSeatsForBrand, router]);

    useEffect(() => {
        if (errorGetModelsWithPowerRangeForBrand?.length > 0) {
            actionPostClientLog({
                url: router.url,
                message: handleMessage(errorGetModelsWithPowerRangeForBrand),
            });
        }
    }, [errorGetModelsWithPowerRangeForBrand, router]);

    useEffect(() => {
        if (errorGetModelsWithPriceRangeForBrand?.length > 0) {
            actionPostClientLog({
                url: router.url,
                message: handleMessage(errorGetModelsWithPriceRangeForBrand),
            });
        }
    }, [errorGetModelsWithPriceRangeForBrand, router]);

    return null;
};

ClientLog.propTypes = {
    errorGetModelsWithAutomaticGearboxForBrand: PropTypes.any,
    errorGetModelsWithAirCondAutoForBrand: PropTypes.any,
    errorGetModelsWithDisplayMultimediaForBrand: PropTypes.any,
    errorGetModelsWithFuelForBrand: PropTypes.any,
    errorGetModelsWithLeatherSeatsForBrand: PropTypes.any,
    errorGetModelsWithPowerRangeForBrand: PropTypes.any,
    errorGetModelsWithPriceRangeForBrand: PropTypes.any,
};

const mapStateToProps = (state) => {
    return {
        errorGetModelsWithAutomaticGearboxForBrand:
            state.brand.errorGetModelsWithAutomaticGearboxForBrand,
        errorGetModelsWithAirCondAutoForBrand:
            state.brand.errorGetModelsWithAirCondAutoForBrand,
        errorGetModelsWithDisplayMultimediaForBrand:
            state.brand.errorGetModelsWithDisplayMultimediaForBrand,
        errorGetModelsWithFuelForBrand: state.brand.errorGetModelsWithFuelForBrand,
        errorGetModelsWithLeatherSeatsForBrand:
            state.brand.errorGetModelsWithLeatherSeatsForBrand,
        errorGetModelsWithPriceRangeForBrand:
            state.brand.errorGetModelsWithPriceRangeForBrand,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionPostClientLog,
        },
        dispatch,
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientLog);
