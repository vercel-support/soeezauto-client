import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Card, CardActions, CardContent, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import {
    required,
    minLengthWithoutHTML,
    maxLength,
    minLength,
    isEmail,
} from 'tools/validator';
import Loading from 'components/loading';
import NotifierDialog from 'components/notifierDialog';
import NotifierInline from 'components/notifierInline';
import { renderInput } from 'components/formInputs/formInputs';
import FormSubmit from 'components/formInputs/formSubmit';
import { LANG } from 'parameters';
import styles from 'styles/contact.module.scss';
import { actionPostContactEmail } from 'store/actions';

const trans = {
    br: {
        success: 'Esta feito',
        messageSent: 'Mensagem enviada',
        somethingWrong: 'Algo deu errado',
        tryAgain: 'Favor tentar de novo',
        subject: 'Assunto',
        message: 'Mensagem',
        writeMessage: 'Escreva sua mensagem',
        send: 'Enviar',
        name: 'Nome',
        contact: 'Contato',
        messageCaption: 'Contate-nos via mensagem',
        messageReturn: 'Nos responderemos em breve',
    },
    en: {
        success: 'Success',
        messageSent: 'Your message was sent',
        somethingWrong: 'There was an error',
        tryAgain: 'Please try again',
        subject: 'Subject',
        message: 'Message',
        writeMessage: 'Write your message',
        send: 'Send',
        name: 'Name',
        contact: 'Contact',
        messageCaption: 'Send us a message',
        messageReturn: 'You will get back to you promptly',
    },
};

const minLengthWithoutHTML10 = minLengthWithoutHTML(10);
const maxLength50 = maxLength(50);
const maxLength150 = maxLength(150);
const maxLength500 = maxLength(500);
const minLength5 = minLength(5);

const TextEditor = dynamic(() => import('../components/formInputs/textEditor'), {
    ssr: false,
    loading: Loading,
});

const ContactEmailForm = (props) => {
    const {
        handleSubmit,
        submitting,
        invalid,
        error,
        pristine,
        reset,
        isLoading,
        dataPostContactEmail,
        errorPostContactEmail,
    } = props;
    const [notification, setNotification] = useState({
        status: '',
        title: '',
        message: '',
        errors: {},
    });
    const handleContactFormSubmit = () => {
        props.actionPostContactEmail(props.contactEmailForm.values);
    };

    const handleNotificationDismiss = () => {
        setNotification({
            status: '',
            title: '',
            message: '',
            errors: {},
        });
    };

    useEffect(() => {
        if (dataPostContactEmail) {
            const { result } = dataPostContactEmail;
            if (result) {
                setNotification({
                    status: 'ok_and_dismiss',
                    title: trans[LANG].success,
                    message: trans[LANG].messageSent,
                    errors: {},
                });
                reset();
            } else {
                setNotification({
                    status: 'ok_and_dismiss',
                    title: trans[LANG].somethingWrong,
                    message: trans[LANG].tryAgain,
                    errors: {},
                });
            }
        }
        if (errorPostContactEmail) {
            setNotification({
                status: 'ok_and_dismiss',
                title: trans[LANG].somethingWrong,
                message: trans[LANG].tryAgain,
                errors: {},
            });
        }
    }, [dataPostContactEmail, errorPostContactEmail, reset]);
    if (error) {
        return <div>{error.messageKey}</div>;
    }
    return (
        <div className="container">
            <Head>
                <title>Contato</title>
                <meta name="description" content="formulario de contato" />
                <meta name="robots" content="noindex follow" />
                <meta name="googlebot" content="noindex follow" />
            </Head>
            <main>
                {isLoading ? <Loading /> : null}
                <div className="main-title">
                    <h1>{trans[LANG].contact}</h1>
                </div>
                <Card id="noShadow" className={styles.root}>
                    <CardActions className={styles.header}>
                        <NotifierInline
                            message={
                                <>
                                    <Typography variant="subtitle1">
                                        {trans[LANG].messageCaption}
                                    </Typography>
                                    <Typography variant="body2">
                                        {trans[LANG].messageReturn}
                                    </Typography>
                                </>
                            }
                            severity="info"
                            isNotClosable
                        />
                    </CardActions>
                    <CardContent className={styles.content}>
                        <form
                            name="contact"
                            onSubmit={handleSubmit(handleContactFormSubmit)}
                        >
                            <div className="form_input">
                                <Field
                                    name="name"
                                    type="text"
                                    label={trans[LANG].name}
                                    variant="outlined"
                                    component={renderInput}
                                    validate={[required, minLength5, maxLength50]}
                                    autoFocus
                                />
                            </div>
                            <div className="form_input">
                                <Field
                                    name="email"
                                    type="email"
                                    label="Email"
                                    variant="outlined"
                                    component={renderInput}
                                    validate={[required, isEmail]}
                                />
                            </div>
                            <div className="form_input">
                                <Field
                                    name="subject"
                                    type="text"
                                    label={trans[LANG].subject}
                                    variant="outlined"
                                    component={renderInput}
                                    validate={[required, maxLength150]}
                                />
                            </div>
                            <div className="form_input">
                                <Field
                                    type="text"
                                    name="message"
                                    variant="outlined"
                                    placeholder={trans[LANG].writeMessage}
                                    component={TextEditor}
                                    validate={[
                                        required,
                                        minLengthWithoutHTML10,
                                        maxLength500,
                                    ]}
                                />
                            </div>
                            <FormSubmit
                                pristine={pristine}
                                submitting={submitting}
                                reset={reset}
                                invalid={invalid}
                            />
                        </form>
                    </CardContent>
                </Card>
                <NotifierDialog
                    notification={notification}
                    handleNotificationDismiss={handleNotificationDismiss}
                />
            </main>
        </div>
    );
};

ContactEmailForm.propTypes = {
    error: PropTypes.object,
    reset: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    dataPostContactEmail: PropTypes.any,
    errorPostContactEmail: PropTypes.any,
    isLoading: PropTypes.bool.isRequired,
    actionPostContactEmail: PropTypes.func.isRequired,
    contactEmailForm: PropTypes.any,
};

const mapStateToProps = (state) => {
    return {
        ...state.contactEmail,
        contactEmailForm: state.form.ContactEmailForm,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionPostContactEmail,
        },
        dispatch,
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    reduxForm({
        form: 'ContactEmailForm',
    })(ContactEmailForm),
);
