import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { actionPostClientLog, actionSetClientLogToNull } from 'store/actions';

const ClientLog = (props) => {
    const router = useRouter();
    const { dataClientLog } = props;
    const handleMessage = (errors) => {
        let message = [];
        if (Array.isArray(errors)) {
            errors.forEach((error) => {
                const key = Object.keys(error)[0];
                message = [key, error[key]];
            });
        } else {
            message.push(dataClientLog.message);
        }
        return message.toString();
    };

    useEffect(() => {
        if (dataClientLog) {
            props.actionPostClientLog({
                url: router.pathname,
                message: handleMessage(dataClientLog.message),
                action: dataClientLog.action,
            });
            props.actionSetClientLogToNull();
        }
    }, [dataClientLog, router]);

    return null;
};

ClientLog.propTypes = {
    dataClientLog: PropTypes.any,
    actionPostClientLog: PropTypes.func.isRequired,
    actionSetClientLogToNull: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    return {
        dataClientLog: state.system.dataClientLog,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionPostClientLog,
            actionSetClientLogToNull,
        },
        dispatch,
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(ClientLog));
