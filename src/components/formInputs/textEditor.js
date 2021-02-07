/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-undef */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import PropTypes from 'prop-types';

const styles = (theme) => ({
    textEditor1: {
        // pointerEvents: 'all',
        '& div > div': {
            minHeight: '150px',
        },
        '& div > span > button': {
            marginRight: '5px',
        },
        '& div > span > span': {
            marginRight: '5px',
        },
        '& > div:first-of-type': {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(50px, auto))',
            alignItems: 'center',
        },
        [theme.breakpoints.down('md')]: {
            '& .ql-editor': {
                fontSize: '16px',
            },
        },
    },
    textEditor2: {
        '& div > div': {
            minHeight: '100px',
            maxHeight: '200px',
        },
        [theme.breakpoints.down('md')]: {
            '& .ql-editor': {
                fontSize: '16px',
            },
        },
    },
});

class TextEditor extends React.Component {
    componentDidMount() {
        // fixes tabindex
        const toolspans = document.querySelectorAll('div.ql-toolbar span');
        toolspans.forEach((span) => {
            // eslint-disable-next-line no-param-reassign
            span.tabIndex = -1;
        });
        const toolbuttons = document.querySelectorAll('div.ql-toolbar button');
        toolbuttons.forEach((button) => {
            // eslint-disable-next-line no-param-reassign
            button.tabIndex = -1;
        });
        // const editor = document.getElementsByClassName('ql-editor');
        // editor[0].tabIndex = 0;
    }

    onChange = (newValue, delta, source) => {
        const { input } = this.props;
        if (source === 'user') {
            input.onChange(newValue);
        }
    };

    onBlur = (range, source, quill) => {
        const { input } = this.props;
        input.onBlur(quill.getHTML());
    };

    render() {
        const {
            placeholder,
            input,
            meta: { touched, error, form },
            classes,
        } = this.props;
        const isCommentPostForm = form === 'CommentPostForm';
        const isContactEmailForm = form === 'ContactEmailForm';
        const toolbarOptions = () => {
            if (isCommentPostForm || isContactEmailForm) {
                return false;
            }
            return [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ indent: '-1' }, { indent: '+1' }],

                ['link'],
                [{ header: [1, 2, 3, 4, 5, 6, false] }],

                [{ color: [] }, { background: [] }],
                [{ align: [] }],
            ];
        };
        const modules = {
            toolbar: toolbarOptions(),
            // keyboard: { bindings: { tab: true } },
        };
        return (
            <>
                <ReactQuill
                    {...input}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    modules={modules}
                    placeholder={placeholder}
                    tabIndex={0}
                    className={
                        isCommentPostForm ? classes.textEditor1 : classes.textEditor2
                    }
                />
                <span className="form_error">{touched ? error : ''}</span>
            </>
        );
    }
}

TextEditor.propTypes = {
    meta: PropTypes.object.isRequired,
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TextEditor);
