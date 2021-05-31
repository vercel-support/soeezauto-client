import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { actionPostClientLog, actionSetClientLogToNull } from 'store/actions';
import NotifierInline from 'components/notifierInline';

const useStyles = makeStyles(() => ({
    notifierContainer: {
        display: 'grid',
        height: '50vh',
        alignContent: 'center',
        justifyContent: 'center',
    },
}));

const Custom404 = (props) => {
    const router = useRouter();
    const classes = useStyles();

    useEffect(() => {
        const asPath = router.asPath;
        const routes = ['/marques-voiture/', '/modeles-voiture/'];
        // check if includes uppercase characters
        const regexp = new RegExp('[A-Z][A-Z]{0,2}[a-z]{0,100}');
        if (
            (asPath.startsWith(routes[0]) || asPath.startsWith(routes[1])) &&
            regexp.test(router.asPath)
        ) {
            router.push(router.asPath.toLowerCase());
        }
        props.actionPostClientLog({
            url: router.pathname,
            message: '404',
            action: router.asPath,
        });
        props.actionSetClientLogToNull();
    }, [router]);

    return (
        <main>
            <div className="main-title">
                <h1>Erro 404 - pagina nao encontrada</h1>
            </div>
            <div className={classes.notifierContainer}>
                <NotifierInline
                    message={
                        <>
                            <p>Ooops, a pagina abaixo parece nao existir.</p>
                            <p>{router.asPath}</p>
                            <p>Verifique se esta toda escrita em letras minusculas</p>
                        </>
                    }
                    isNotClosable
                    severity="error"
                />
            </div>
        </main>
    );
};

Custom404.propTypes = {
    actionPostClientLog: PropTypes.func.isRequired,
    actionSetClientLogToNull: PropTypes.func.isRequired,
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

export default connect(null, mapDispatchToProps)(Custom404);
