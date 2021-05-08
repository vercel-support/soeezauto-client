/* eslint-disable no-param-reassign */
import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import getModels from 'lib/getModels';
import getModelsWithAirCondAuto from 'lib/getModelsWithAirCondAuto';
import getModelsWithDisplayMultimedia from 'lib/getModelsWithDisplayMultimedia';
import getModelsWithHybrid from 'lib/getModelsWithHybrid';
import getModelsWithLeatherSeats from 'lib/getModelsWithLeatherSeats';
import getModelsWithAutomaticGearbox from 'lib/getModelsWithAutomaticGearbox';
import getModelsWithPowerBetween150200 from 'lib/getModelsWithPowerBetween150200';
import getModelsWithPriceBetween0200 from 'lib/getModelsWithPriceBetween0200';
import getModelsWithPriceBetween200300 from 'lib/getModelsWithPriceBetween200300';
import getModelsWithPriceBetween300400 from 'lib/getModelsWithPriceBetween300400';
import getModelsWithPriceHigherThan400 from 'lib/getModelsWithPriceHigherThan400';
import getPosts from 'lib/getPosts';
import { CONVERSION_FUEL } from 'parameters';
import ModelFilter from 'components/modelFilter';

const Models = ({ allModels, filters }) => {
    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <ModelFilter allModels={allModels} filters={filters} />
            </main>
        </div>
    );
};

Models.propTypes = {
    allModels: PropTypes.array.isRequired,
    filters: PropTypes.object.isRequired,
};

export default Models;

export async function getStaticProps() {
    let allModels = await getModels();
    allModels = allModels.data.models;
    // get price range, power range
    allModels.forEach((model) => {
        model.brand = model.brand.brand;
        const prices = model.versions.map((version) => {
            return Math.round(version.prices[0].price / 1000);
        });
        model.prices = Array.from(new Set([Math.min(...prices), Math.max(...prices)]));
        const power = model.versions.map((version) => {
            return version.motor.power;
        });
        model.power = Array.from(new Set([Math.min(...power), Math.max(...power)]));
        let fuels = model.versions.map((version) => {
            return version.motor.fuel;
        });
        fuels = Array.from(new Set(fuels));
        fuels.forEach((item, i) => {
            fuels[i] = CONVERSION_FUEL[item];
        });
        model.fuels = fuels.sort();
    });
    const modelsWithAirCondAuto = await getModelsWithAirCondAuto();
    const modelsWithDisplayMultimedia = await getModelsWithDisplayMultimedia();
    const modelsWithHybrid = await getModelsWithHybrid();
    const modelsWithLeatherSeats = await getModelsWithLeatherSeats();
    const modelsWithAutomaticGearbox = await getModelsWithAutomaticGearbox();
    const modelsWithPowerBetween150200 = await getModelsWithPowerBetween150200();
    const modelsWithPriceBetween0200 = await getModelsWithPriceBetween0200();
    const modelsWithPriceBetween200300 = await getModelsWithPriceBetween200300();
    const modelsWithPriceBetween300400 = await getModelsWithPriceBetween300400();
    const modelsWithPriceHigherThan400 = await getModelsWithPriceHigherThan400();
    const filters = {
        airCondAuto: modelsWithAirCondAuto.data.models.map((mod) => mod.id),
        displayMultimedia: modelsWithDisplayMultimedia.data.models.map((mod) => mod.id),
        hybrid: modelsWithHybrid.data.models.map((mod) => mod.id),
        leatherSeats: modelsWithLeatherSeats.data.models.map((mod) => mod.id),
        automaticGearbox: modelsWithAutomaticGearbox.data.models.map((mod) => mod.id),
        powerBetween150200: modelsWithPowerBetween150200.data.models.map((mod) => mod.id),
        priceBetween0200: modelsWithPriceBetween0200.data.models.map((mod) => mod.id),
        priceBetween200300: modelsWithPriceBetween200300.data.models.map((mod) => mod.id),
        priceBetween300400: modelsWithPriceBetween300400.data.models.map((mod) => mod.id),
        priceHigherThan400: modelsWithPriceHigherThan400.data.models.map((mod) => mod.id),
    };
    let posts = await getPosts();
    posts = posts.data.posts;
    return {
        props: {
            allModels,
            filters,
            posts,
        },
    };
}
