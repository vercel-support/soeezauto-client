import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ResponsiveLine } from '@nivo/line';
import PropTypes from 'prop-types';
import { actionGetPreviousModels } from 'store/actions';

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const TODAY = new Date();
const CURRENT_MONTH = TODAY.getMonth();
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
    console.log('MODEl graph', model);
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
    const fillPriceInfo = (level, allPrices = null) => {
        let priceInfo = allPrices;
        if (!allPrices) {
            const pricesSort = [...model.versions];
            pricesSort.sort((a, b) => {
                return a.prices[0].price - b.prices[0].price;
            });
            const whichVersion = level === 'base' ? 0 : pricesSort.length - 1;
            priceInfo = pricesSort[whichVersion].prices;
        }
        const prices = current(priceInfo, 'price');
        for (let i = 0; i < 12; i++) {
            prices.forEach((pri) => {
                const isMonth =
                    new Date(pri.updatedAt).getMonth() <= CURRENT_MONTH - i + 12;
                if (isMonth && !info[`${level}Price`][i]) {
                    info[`${level}Price`].push({
                        x:
                            MONTHS[
                                CURRENT_MONTH - i < 0
                                    ? CURRENT_MONTH - i + 12
                                    : CURRENT_MONTH - i
                            ],
                        y: pri.price,
                    });
                }
            });
        }
        // populate min/max price
        // populate min price
        const sortedPrices = [...info[`${level}Price`]];
        sortedPrices.sort((a, b) => {
            return a.y - b.y;
        });

        if (level === 'base') {
            info.minPrice = sortedPrices[0].y;
        }
        if (level === 'top') {
            info.maxPrice = sortedPrices[sortedPrices.length - 1].y;
        }
    };
    const fillPromoInfo = (level, allPrices = null) => {
        let priceInfo = allPrices;
        if (!allPrices) {
            const pricesSort = [...model.versions];
            pricesSort.sort((a, b) => {
                return a.prices[0].price - b.prices[0].price;
            });
            const whichVersion = level === 'base' ? 0 : pricesSort.length - 1;
            priceInfo = pricesSort[whichVersion].prices;
        }
        const promos = current(priceInfo, 'promo');
        for (let i = 0; i < 12; i++) {
            promos.forEach((pri) => {
                const isMonth =
                    new Date(pri.updatedAt).getMonth() <= CURRENT_MONTH - i + 12;
                if (isMonth && !info[`${level}Promo`][i]) {
                    info[`${level}Promo`].push({
                        x:
                            MONTHS[
                                CURRENT_MONTH - i < 0
                                    ? CURRENT_MONTH - i + 12
                                    : CURRENT_MONTH - i
                            ],
                        y: pri.price,
                    });
                }
            });
        }
        // populate min price
        const sortedPromos = [...info[`${level}Promo`]];
        sortedPromos.sort((a, b) => {
            return a.y - b.y;
        });

        if (level === 'base') {
            info.minPrice =
                sortedPromos[0].y < info.minPrice ? sortedPromos[0].y : info.minPrice;
        }
    };
    useEffect(() => {
        const oldestUpdatedAtPrice =
            model.versions[0].prices[model.versions[0].prices.length - 1].updatedAt;
        if (Math.round((TODAY - new Date(oldestUpdatedAtPrice)) / MS_PER_DAY, 0) < 360) {
            props.actionGetPreviousModels({
                model: model.model,
                priceUpdatedAt: (TODAY.getFullYear() - 1).toString(),
            });
        } else {
            fillPriceInfo('base');
            fillPromoInfo('base');
            if (model.versions.length > 1) {
                fillPriceInfo('top');
                fillPromoInfo('top');
            }
            setMinMaxY({
                min: info.minPrice,
                max: info.maxPrice,
            });
            const data = [
                {
                    id: 'basePrice',
                    color: 'hsl(169, 70%, 50%)',
                    data: info.basePrice.reverse(),
                },
                {
                    id: 'topPrice',
                    color: 'hsl(193, 70%, 50%)',
                    data: info.topPrice.reverse(),
                },
                {
                    id: 'basePromo',
                    color: 'hsl(169, 70%, 50%)',
                    data: info.basePromo.reverse(),
                },
                {
                    id: 'topPromo',
                    color: 'hsl(193, 70%, 50%)',
                    data: info.topPromo.reverse(),
                },
            ];
            setPriceData(data);
        }
    }, [model]);

    useEffect(() => {
        if (dataGetPreviousModels) {
            const basePrices = dataGetPreviousModels[0].versions[0].prices;
            const topPrices =
                dataGetPreviousModels[0].versions[
                    dataGetPreviousModels[0].versions.length - 1
                ].prices;
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
            fillPriceInfo('base', allPrices.base);
            fillPromoInfo('base', allPrices.base);
            if (model.versions.length > 1) {
                fillPriceInfo('top', allPrices.top);
                fillPromoInfo('top', allPrices.top);
            }
            setMinMaxY({
                min: info.minPrice,
                max: info.maxPrice,
            });
            setIsModelChange(true);
            const dataAll = [
                {
                    id: 'basePrice',
                    color: 'hsl(169, 70%, 50%)',
                    data: info.basePrice.reverse(),
                },
                {
                    id: 'topPrice',
                    color: 'hsl(193, 70%, 50%)',
                    data: info.topPrice.reverse(),
                },
                {
                    id: 'basePromo',
                    color: 'hsl(169, 70%, 50%)',
                    data: info.basePromo.reverse(),
                },
                {
                    id: 'topPromo',
                    color: 'hsl(193, 70%, 50%)',
                    data: info.topPromo.reverse(),
                },
            ];
            setPriceData(dataAll);
        }
    }, [dataGetPreviousModels]);
    if (priceData) {
        return (
            <>
                {isModelChange ? <div>is model change</div> : null}
                <ResponsiveLine
                    data={priceData}
                    margin={{
                        top: 50,
                        right: 110,
                        bottom: 50,
                        left: 60,
                    }}
                    xScale={{ type: 'point' }}
                    yScale={{
                        type: 'linear',
                        min: minMaxY.min,
                        max: minMaxY.max,
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
                            anchor: 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: 100,
                            translateY: 0,
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
