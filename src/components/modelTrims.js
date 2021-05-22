/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ExpandMore } from '@material-ui/icons';
import {
    FormControlLabel,
    Radio,
    RadioGroup,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    AppBar,
    Tabs,
    Tab,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { objectToMap } from 'tools/functions';
import ModelTrimsTable from './modelTrimsTable';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`spec-tabpanel-${index}`}
            aria-labelledby={`spec-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `spec-tab-${index}`,
        'aria-controls': `spec-tabpanel-${index}`,
    };
}

const useStyles = makeStyles(() => ({
    accordion: {
        contentVisibility: 'auto',
        display: 'block',
        padding: 0,
        '& div:first-child': {
            justifyContent: 'space-evenly',
        },
    },
    tabs: {
        '& .MuiTabs-flexContainer': {
            display: 'block',
        },
    },
}));

const ModelTrims = ({ versions }) => {
    const classes = useStyles();
    const [isDiff, setIsDiff] = useState(0);
    const [dataDiff, setDataDiff] = useState(null);
    const [dataAll, setDataAll] = useState(null);
    const [data, setData] = useState(null);
    const [tabValue, setTabValue] = useState(0);

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
    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const trimTypes = {
        help: 'assistance',
        sec: 'securite',
        ent: 'divertis.',
        easy: 'commodite',
        sty: 'style',
        com: 'confort',
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
                    <>
                        <AppBar position="static">
                            <Tabs
                                value={tabValue}
                                onChange={handleChange}
                                aria-label="specifications"
                                variant="scrollable"
                                scrollButtons="on"
                                className={classes.tabs}
                            >
                                {[...Array(Object.keys(trimTypes).length).keys()].map(
                                    (key) => (
                                        <Tab
                                            key={key}
                                            label={Object.entries(trimTypes)[key][1]}
                                            {...a11yProps(key)}
                                        />
                                    ),
                                )}
                            </Tabs>
                        </AppBar>
                        {[...Array(Object.keys(trimTypes).length).keys()].map((type) => (
                            <TabPanel value={tabValue} key={type} index={type}>
                                <ModelTrimsTable
                                    data={data}
                                    type={Object.entries(trimTypes)[type][0]}
                                    versions={versions}
                                />
                            </TabPanel>
                        ))}
                    </>
                )}
            </AccordionDetails>
        </Accordion>
    );
};

ModelTrims.propTypes = {
    versions: PropTypes.array.isRequired,
};

export default ModelTrims;
