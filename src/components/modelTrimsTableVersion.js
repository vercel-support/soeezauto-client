import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
import { Check } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { sortArrayOfObjectsByValue } from 'tools/functions';
import { MUI_DATATABLES_TEXT_LABELS } from 'parameters';

const breakpoints = createBreakpoints({});
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
                    '& div:first-child': {
                        fontSize: '.8rem',
                        [breakpoints.down('md')]: {
                            display: 'none',
                        },
                    },
                    '& div:last-child': {
                        [breakpoints.down('md')]: {
                            width: '100%',
                        },
                    },
                    '& > p': {
                        fontSize: '.8rem',
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
                stackedParent: {
                    padding: '10px 8px',
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

const ModelTrimsTableVersion = ({ data, type, versions }) => {
    const [localData, setLocalData] = useState(data);
    useEffect(() => {
        const filtered = data.filter((trim) => {
            return trim.trimType === type;
        });
        const sorted = sortArrayOfObjectsByValue(filtered, 'trim');
        setLocalData([...sorted]);
    }, [data, type]);
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
    ];
    if (versions.length > 1) {
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
    }
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
        textLabels: MUI_DATATABLES_TEXT_LABELS,
    };
    if (localData) {
        return (
            <MuiThemeProvider theme={getMuiTheme()}>
                <MUIDataTable data={localData} columns={columns} options={options} />
            </MuiThemeProvider>
        );
    }
    return null;
};

ModelTrimsTableVersion.propTypes = {
    data: PropTypes.array.isRequired,
    versions: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
};

export default ModelTrimsTableVersion;
