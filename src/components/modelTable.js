import React from 'react';
import Image from 'next/image';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import MUIDataTable from 'mui-datatables';
import PropTypes from 'prop-types';
import Link from 'components/link';
import { urlWriter } from 'tools/functions';

const getMuiTheme = () =>
    createMuiTheme({
        overrides: {
            MUIDataTableHeadCell: {
                root: {
                    '&:nth-child(1)': {
                        width: '120px',
                    },
                    '&:nth-child(2)': {
                        width: '120px',
                    },
                    '&:nth-child(3)': {
                        width: '120px',
                    },
                    '&:nth-child(4)': {
                        width: '120px',
                    },
                },
            },
            MUIDataTableBodyCell: {
                root: {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    // cursor: 'pointer',
                    '& > p': {
                        textTransform: 'capitalize',
                    },
                },
                cellStackedSmall: {
                    height: '48px',
                },
                responsiveStackedSmall: {
                    height: '48px',
                },
            },
            MuiTypography: {
                h6: {
                    textTransform: 'capitalize',
                    fontWeight: '700',
                    letterSpacing: '.1em',
                },
            },
        },
    });

const ModelTable = ({ currentModels }) => {
    const data = [];
    currentModels.map((model) =>
        data.push({
            id: model.id,
            marque: model.brand.brand,
            modele: model.model,
            model: () => (
                <Image
                    src={`${process.env.NEXT_PUBLIC_API_HOST}/images/models/${model.images[0].filename}`}
                    alt={`${model.brand.brand}-${model.model}`}
                    width="100"
                    height="67"
                    loading="eager"
                    priority
                />
            ),
            price:
                model.prices.length === 1
                    ? model.prices[0]
                    : `${model.prices[0]}-${model.prices[1]}`,
            power:
                model.power.length === 1
                    ? model.power[0]
                    : `${model.power[0]}-${model.power[1]}`,
            fuels: model.fuels.toString().replace(/,/g, '/'),
        }),
    );
    const columns = [
        {
            name: 'id',
            options: {
                display: false,
                filter: false,
            },
        },
        {
            name: 'marque',
            options: {
                display: false,
            },
        },
        {
            name: 'modele',
            options: {
                display: false,
            },
        },
        {
            name: 'model',
            label: 'Modele',
            options: {
                filter: false,
                customBodyRender: (value, tableMeta) => {
                    return (
                        <>
                            <Link
                                href={`/modeles-voiture/${urlWriter(
                                    tableMeta.rowData[1],
                                )}/${urlWriter(tableMeta.rowData[2])}`}
                            >
                                {value()}
                            </Link>
                            <p>{`${tableMeta.rowData[1]} ${tableMeta.rowData[2]}`}</p>
                        </>
                    );
                },
            },
        },
        {
            name: 'price',
            label: 'Prix',
            options: {
                filter: false,
                searchable: false,
            },
        },
        {
            name: 'power',
            label: 'Puissance ch',
            options: {
                filter: false,
                searchable: false,
            },
        },
        {
            name: 'fuels',
            label: 'Combustible',
            options: {
                filter: false,
                searchable: false,
            },
        },
    ];
    const options = {
        sort: false,
        viewColumns: false,
        filter: true,
        print: false,
        download: false,
        filterType: 'dropdown',
        responsive: 'vertical',
        rowsPerPageOptions: [10, 20, 50],
        selectableRows: 'none',
        selectableRowsHeader: false,
    };
    return (
        <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
                title="Modeles"
                data={data}
                columns={columns}
                options={options}
            />
        </MuiThemeProvider>
    );
};

ModelTable.propTypes = {
    currentModels: PropTypes.array.isRequired,
};

export default ModelTable;
