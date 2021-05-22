import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ResponsiveLine } from '@nivo/line';
import PropTypes from 'prop-types';
import { actionGetPreviousModels } from 'store/actions';

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const TODAY = new Date();
const MONTHS = [
    'jan',
    'fev',
    'mar',
    'avr',
    'mai',
    'juin',
    'jui',
    'aou',
    'sep',
    'oct',
    'nov',
    'dec',
];

const ModelPrices = (props) => {
    const { model, dataGetPreviousModels } = props;
    const [priceData, setPriceData] = useState(null);
    const [minMaxY, setMinMaxY] = useState({
        min: null,
        max: null,
    });
    const [isModelChange, setIsModelChange] = useState(false);

    const info = {
        basePrice: [],
        basePromo: [],
        topPrice: [],
        topPromo: [],
        minPrice: 0,
        maxPrice: 0,
    };
    const current = (priceInfo, type) => {
        return priceInfo.map((prix) => {
            const price = () => {
                if (type === 'price') {
                    return Math.floor(Math.round(prix.price / 1000));
                }
                if (type === 'promo' && prix.promo) {
                    return Math.floor(Math.round(prix.promo / 1000));
                }
                return null;
            };
            return {
                price: price(),
                updatedAt: prix.updatedAt,
            };
        });
    };
    const fillInfo = (level, type, allPrices = null) => {
        let priceInfo = allPrices;
        if (!allPrices) {
            const pricesSort = [...model.versions];
            pricesSort.sort((a, b) => {
                return a.prices[0].price - b.prices[0].price;
            });
            const whichVersion = level === 'base' ? 0 : pricesSort.length - 1;
            priceInfo = pricesSort[whichVersion].prices;
        }
        const prices = current(priceInfo, type).reverse();
        const upperType = `${type.charAt(0).toUpperCase()}${type.slice(1)}`;
        for (let i = 11; i > -1; i--) {
            const now = new Date();
            const iDate = new Date(now.setMonth(now.getMonth() - i, 1));
            iDate.setHours(0, 0, 0);
            prices.forEach((pri) => {
                const priceDate = new Date(pri.updatedAt);
                priceDate.setDate(1);
                priceDate.setHours(0, 0, 0);
                if (priceDate <= iDate) {
                    info[`${level}${upperType}`][11 - i] = {
                        x: MONTHS[iDate.getMonth()],
                        y: pri.price,
                    };
                } else if (!info[`${level}${upperType}`][11 - i]) {
                    info[`${level}${upperType}`][11 - i] = {
                        x: MONTHS[iDate.getMonth()],
                        y: null,
                    };
                }
            });
        }
        // populate min/max price
        const sortedPricesASC = [...info[`${level}${upperType}`]];
        const sortedPricesDESC = [...info[`${level}${upperType}`]];
        sortedPricesASC.sort((a, b) => {
            return a.y - b.y;
        });
        sortedPricesDESC.sort((a, b) => {
            return b.y - a.y;
        });
        if (level === 'base' && type === 'price') {
            info.minPrice = sortedPricesASC[0].y;
        }
        if (level === 'base' && type === 'promo' && sortedPricesASC[0].y) {
            info.minPrice =
                sortedPricesASC[0].y < info.minPrice
                    ? sortedPricesASC[0].y
                    : info.minPrice;
        }
        if (level === 'top' && type === 'price') {
            info.maxPrice = sortedPricesDESC[0].y;
        }
    };

    useEffect(() => {
        const oldestUpdatedAtPrice =
            model.versions[0].prices[model.versions[0].prices.length - 1].updatedAt;
        if (Math.round((TODAY - new Date(oldestUpdatedAtPrice)) / MS_PER_DAY, 0) < 360) {
            props.actionGetPreviousModels({
                model: model.model,
            });
        }
        fillInfo('base', 'price');
        fillInfo('base', 'promo');
        if (model.versions.length > 1) {
            fillInfo('top', 'price');
            fillInfo('top', 'promo');
        }
        setMinMaxY({
            min: info.minPrice,
            max: info.maxPrice,
        });
        const data = [
            {
                id: 'Promo base',
                color: 'hsl(169, 70%, 50%)',
                data: info.basePromo,
            },
            {
                id: 'Prix base',
                color: 'hsl(169, 70%, 50%)',
                data: info.basePrice,
            },
            {
                id: 'Promo top',
                color: 'hsl(193, 70%, 50%)',
                data: info.topPromo,
            },
            {
                id: 'Prix top',
                color: 'hsl(193, 70%, 50%)',
                data: info.topPrice,
            },
        ];
        setPriceData(data);
    }, [model]);

    useEffect(() => {
        if (
            dataGetPreviousModels?.length > 0 &&
            dataGetPreviousModels[0].versions.length > 0
        ) {
            // filter out versions with prices updated older than 2 years
            const versions = dataGetPreviousModels[0].versions.filter((version) => {
                const prices = version.prices.filter((price) => {
                    return (
                        new Date(price.updatedAt).getFullYear() > TODAY.getFullYear() - 3
                    );
                });
                return prices.length > 0;
            });
            if (versions.length > 0) {
                const basePrices = versions[0].prices;
                const topPrices = versions[versions.length - 1].prices;
                // sort current model prices
                const pricesSort = [...model.versions];
                pricesSort.sort((a, b) => {
                    return a.prices[0].price - b.prices[0].price;
                });
                // const whichVersion = level === 'base' ? 0 : pricesSort.length - 1;
                // const priceInfo = pricesSort[whichVersion].prices;

                const allPrices = {
                    base: [...pricesSort[0].prices, ...basePrices],
                    top: [...pricesSort[pricesSort.length - 1].prices, ...topPrices],
                };
                fillInfo('base', 'price', allPrices.base);
                fillInfo('base', 'promo', allPrices.base);
                if (model.versions.length > 1) {
                    fillInfo('top', 'price', allPrices.top);
                    fillInfo('top', 'promo', allPrices.top);
                }
                setMinMaxY({
                    min: info.minPrice,
                    max: info.maxPrice,
                });
                setIsModelChange(true);
                const dataAll = [
                    {
                        id: 'Promo base',
                        color: 'hsl(169, 70%, 50%)',
                        data: info.basePromo,
                    },
                    {
                        id: 'Prix base',
                        color: 'hsl(169, 70%, 50%)',
                        data: info.basePrice,
                    },
                    {
                        id: 'Promo top',
                        color: 'hsl(193, 70%, 50%)',
                        data: info.topPromo,
                    },
                    {
                        id: 'Prix top',
                        color: 'hsl(193, 70%, 50%)',
                        data: info.topPrice,
                    },
                ];
                setPriceData(dataAll);
            }
        }
    }, [dataGetPreviousModels]);
    if (priceData) {
        return (
            <>
                {isModelChange ? <div>is model change</div> : null}
                <ResponsiveLine
                    data={priceData}
                    margin={{
                        top: 60,
                        right: 10,
                        bottom: 50,
                        left: 60,
                    }}
                    xScale={{ type: 'point' }}
                    yScale={{
                        type: 'linear',
                        min: minMaxY.min - 30,
                        max: minMaxY.max + 30,
                        stacked: false,
                        reverse: false,
                    }}
                    yFormat=" >-#.2~d"
                    curve="catmullRom"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        orient: 'bottom',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'mois',
                        legendOffset: 36,
                        legendPosition: 'middle',
                    }}
                    axisLeft={{
                        orient: 'left',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'prix',
                        legendOffset: -40,
                        legendPosition: 'middle',
                    }}
                    colors={{ scheme: 'category10' }}
                    pointSize={10}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{
                        from: 'serieColor',
                    }}
                    pointLabelYOffset={-12}
                    useMesh
                    legends={[
                        {
                            anchor: 'top',
                            direction: 'row',
                            justify: false,
                            translateX: -20,
                            translateY: -50,
                            itemsSpacing: 0,
                            itemDirection: 'left-to-right',
                            itemWidth: 80,
                            itemHeight: 20,
                            itemOpacity: 0.75,
                            symbolSize: 12,
                            symbolShape: 'circle',
                            symbolBorderColor: 'rgba(0, 0, 0, .5)',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemBackground: 'rgba(0, 0, 0, .03)',
                                        itemOpacity: 1,
                                    },
                                },
                            ],
                        },
                    ]}
                />
            </>
        );
    }
    return null;
};

ModelPrices.propTypes = {
    model: PropTypes.object.isRequired,
    actionGetPreviousModels: PropTypes.func.isRequired,
    dataGetPreviousModels: PropTypes.any,
};

const mapStateToProps = (state) => {
    return {
        dataGetPreviousModels: state.model.dataGetPreviousModels,
        errorGetPreviousModels: state.model.errorGetPreviousModels,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionGetPreviousModels,
        },
        dispatch,
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelPrices);
