import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Check } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { sortArrayOfObjectsByValue } from 'tools/functions';
import { MUI_DATATABLES_TEXT_LABELS } from 'parameters';

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

const ModelTrimsTable = ({ data, type, versions }) => {
    const [localData, setLocalData] = useState(data);
    useEffect(() => {
        const filtered = data.filter((trim) => {
            return trim.trimType === type;
        });
        const sorted = sortArrayOfObjectsByValue(filtered);
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

ModelTrimsTable.propTypes = {
    data: PropTypes.array.isRequired,
    versions: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
};

export default ModelTrimsTable;
