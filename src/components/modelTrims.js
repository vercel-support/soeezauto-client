/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import MUIDataTable from 'mui-datatables';
import { createMuiTheme, MuiThemeProvider, makeStyles } from '@material-ui/core/styles';
import { Check, ExpandMore } from '@material-ui/icons';
import {
    FormControlLabel,
    Radio,
    RadioGroup,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { objectToMap } from 'tools/functions';

const useStyles = makeStyles(() => ({
    accordion: {
        display: 'block',
        padding: 0,
        '& div:first-child': {
            justifyContent: 'space-evenly',
        },
    },
}));

const getMuiTheme = () =>
    createMuiTheme({
        overrides: {
            MUIDataTableHeadCell: {
                root: {
                    '&:nth-child(1)': {
                        width: '180px',
                    },
                    width: 90,
                },
            },
            MUIDataTableBodyCell: {
                root: {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    // cursor: 'pointer',
                    '& > p': {
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        // textTransform: 'capitalize',
                    },
                    '& >svg': {
                        color: 'green',
                    },
                },
                cellStackedSmall: {
                    height: 48,
                },
                responsiveStackedSmall: {
                    height: 48,
                },
            },
            MuiTypography: {
                h6: {
                    textTransform: 'capitalize',
                    fontWeight: 700,
                    letterSpacing: '.1em',
                },
            },
        },
    });

const ModelTrims = ({ versions }) => {
    const classes = useStyles();
    console.log('versions', versions);
    const [isDiff, setIsDiff] = useState(0);
    const [dataDiff, setDataDiff] = useState(null);
    const [dataAll, setDataAll] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        const trimList = {
            uniqueIds: [],
            unique: [],
        };
        versions.forEach((vs) => {
            vs.trims.forEach((trim) => {
                if (!trimList.uniqueIds.includes(trim.id)) {
                    trimList.uniqueIds.push(trim.id);
                    trimList.unique.push(trim);
                }
            });
        });
        const all = [];
        trimList.unique.forEach((trim, ind) => {
            all.push({
                trim: trim.trim,
                trimType: trim.trimType,
            });

            versions.forEach((vs) => {
                all[ind][vs.version] = 0;
                vs.trims.forEach((tri) => {
                    if (tri.id === trim.id) {
                        all[ind][vs.version] = 1;
                    }
                });
            });
        });
        const diff = all.filter((line) => {
            const lineMap = objectToMap(line);
            let sum = 0;
            for (const value of lineMap.values()) {
                if (typeof value === 'number') {
                    sum += value;
                }
            }
            return sum > 0 && sum < versions.length;
        });
        setDataDiff(diff);
        setDataAll(all);
        setData(all);
    }, [versions]);

    const handleInputChange = (event) => {
        setIsDiff(parseInt(event.target.value, 10));
        setData(event.target.value === '0' ? dataAll : dataDiff);
    };
    const trimTypes = {
        help: 'assistance',
        sec: 'securite',
        ent: 'entreteniment',
        easy: 'convenance',
        must: 'basique',
        sty: 'style',
        com: 'comfort',
    };
    const columns = [
        {
            name: 'trim',
            label: 'Equipement',
            options: {
                customBodyRender: (value) => {
                    return <p title={value}>{value}</p>;
                },
            },
        },
        {
            name: 'trimType',
            label: 'Type',
            options: {
                customBodyRender: (value) => {
                    return <p>{trimTypes[value]}</p>;
                },
            },
        },
    ];
    versions.forEach((version) => {
        columns.push({
            name: version.version,
            options: {
                filter: false,
                customBodyRender: (value) => {
                    return value === 1 && <Check />;
                },
            },
        });
    });
    const options = {
        sort: false,
        viewColumns: false,
        filter: true,
        print: false,
        download: false,
        filterType: 'dropdown',
        responsive: 'vertical',
        pagination: false,
        // rowsPerPage: trimList.uniqueIds.length,
        selectableRows: 'none',
        selectableRowsHeader: false,
    };
    return (
        <Accordion TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                Voir equipements
            </AccordionSummary>
            <AccordionDetails className={classes.accordion}>
                {versions.length > 1 && (
                    <RadioGroup
                        row
                        aria-label="difference"
                        name="trimOption"
                        value={isDiff}
                        onChange={handleInputChange}
                    >
                        <FormControlLabel value={0} control={<Radio />} label="tous" />
                        <FormControlLabel
                            value={1}
                            control={<Radio />}
                            label="differences"
                        />
                    </RadioGroup>
                )}
                {data && (
                    <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable data={data} columns={columns} options={options} />
                    </MuiThemeProvider>
                )}
            </AccordionDetails>
        </Accordion>
    );
};

ModelTrims.propTypes = {
    versions: PropTypes.array.isRequired,
};

export default ModelTrims;
