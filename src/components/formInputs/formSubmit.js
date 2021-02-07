import React from 'react';
import { Button, FormGroup, Fab } from '@material-ui/core/';
import { Clear } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { LANG } from 'parameters';

const trans = {
    br: {
        submit: 'Enviar',
        clear: 'Apagar',
    },
    en: {
        submit: 'Submit',
        clear: 'Clear',
    },
};

const FormSubmit = (props) => {
    const { pristine, submitting, invalid, reset } = props;
    return (
        <div className="form_input form_submit">
            <FormGroup row>
                <Fab
                    disabled={pristine || submitting}
                    onClick={reset}
                    variant="round"
                    color="secondary"
                    size="small"
                    type="reset"
                    aria-label={trans[LANG].clear}
                >
                    <Clear />
                </Fab>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={pristine || submitting || invalid}
                    name="_submit"
                    type="submit"
                    aria-label={trans[LANG].submit}
                >
                    {trans[LANG].submit}
                </Button>
            </FormGroup>
        </div>
    );
};

FormSubmit.propTypes = {
    submitting: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
};

export default FormSubmit;
