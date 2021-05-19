/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
    AppBar,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    Paper,
} from '@material-ui/core';

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

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        overflow: 'scroll',
        '& button': {
            minWidth: 'unset',
            maxWidth: 'unset',
            width: '33%',
            fontSize: '.75rem',
            fontWeight: 'bold',
        },
    },
    table: {
        tableLayout: 'fixed',
        '& td': {
            fontSize: '.75rem',
            textAlign: 'center',
        },
        '& th': {
            fontSize: '.75rem',
            width: 100,
        },
        '& th:first-child': {
            width: 180,
        },
    },
    versionTh: {
        height: 85,
    },
}));

const ModelSpecs = ({ versions }) => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="simple tabs example"
                >
                    <Tab label="Moteur" {...a11yProps(0)} />
                    <Tab label="Performance" {...a11yProps(1)} />
                    <Tab label="Dimensions" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="fiches techniques">
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    className={classes.versionTh}
                                    component="th"
                                    scope="row"
                                >
                                    Version
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.version}>
                                        {version.version || 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Carburant
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.id}>
                                        {version.motor.fuel || 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Puissance(ch)
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.id}>
                                        {version.motor.power || 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Cylindree(cm3)
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.id}>
                                        {version.motor.cc || 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Cylindres
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.id}>
                                        {version.motor.cylinder || 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Soupapes
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.id}>
                                        {version.motor.valves || 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Couple max(n/m)
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.id}>
                                        {version.motor.torque || 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Alimentation
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.id}>
                                        {version.motor.aspiration || 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Boite vitesse
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.id}>
                                        {version.gearbox || 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Roues motrices
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.id}>
                                        {version.traction || 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="fiches techniques">
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    className={classes.versionTh}
                                    component="th"
                                    scope="row"
                                >
                                    Version
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.version}>
                                        {version.version || 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Vitesse max(km/h)
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.id}>
                                        {version.performance.maxSpeed || 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    0 a 100 km/h (s)
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.id}>
                                        {version.performance.to100 || 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Conso. urbaine (l/100 km)
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.id}>
                                        {version.performance.mileageCity || 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Conso. route (l/100 m)
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.id}>
                                        {version.performance.mileageRoad || 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Conso. mixte (l/100 km)
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.id}>
                                        {version.performance.mileageMix || 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Autonomie (km)
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.id}>
                                        {version.measures.fuelTank
                                            ? Math.round(
                                                  version.measures.fuelTank *
                                                      (100 /
                                                          version.performance.mileageMix),
                                              )
                                            : 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Emission (co2)
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.id}>
                                        {version.performance.emissions || 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Roues motrices
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.id}>
                                        {version.traction || 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="fiches techniques">
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    className={classes.versionTh}
                                    component="th"
                                    scope="row"
                                >
                                    Version
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.version}>
                                        {version.version || 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Places
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.id}>
                                        {version.places || 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Portes
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.id}>
                                        {version.doors || 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Coffre
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.id}>
                                        {version.measures.trunkMin || 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Largeur (mm)
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.id}>
                                        {version.measures.width || 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Hauteur (mm)
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.id}>
                                        {version.measures.height || 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Longueur (mm)
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.id}>
                                        {version.measures.length || 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Empattement (mm)
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.id}>
                                        {version.measures.wheelbase || 'n/c'}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Poids vide/en charge
                                </TableCell>
                                {versions.map((version) => (
                                    <TableCell key={version.id}>
                                        {`${
                                            version.curbWeight ? version.curbWeight : '-'
                                        }/${version.gvw ? version.gvw : '-'}`}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>
        </div>
    );
};

ModelSpecs.propTypes = {
    versions: PropTypes.array.isRequired,
};

export default ModelSpecs;
