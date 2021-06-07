// https://codesandbox.io/s/dynamic-size-of-react-window-list-items-64o9p?file=/src/Chat.js:1127-1134
import React, { Component, createRef } from 'react';
import { VariableSizeList as List } from 'react-window';
// import useWindowResize from 'tools/hooks/useWindowResize';
import PropTypes from 'prop-types';
import getPosts from 'lib/getPosts';
import { apiQl } from 'lib/functions';
import PromoBrand from 'components/promoBrand';

class Promotion2 extends Component {
    constructor(props) {
        super(props);
        this.listRef = createRef();
        this.listItemRef = createRef();
        this.promoBrandsRef = createRef();
        this.state = {
            listHeight: 0,
            indexes: ['0'],
        };
    }

    componentDidMount() {
        const listHeight = this.promoBrandsRef.current.offsetHeight;
        this.setState({ listHeight });
    }

    handleListItemChange = (ref) => {
        if (!this.state.indexes.includes(ref.id)) {
            this.setState((prevState) => ({
                indexes: [...prevState.indexes, ref.id],
            }));
            if (ref.getBoundingClientRect().height > this.state.listHeight) {
                this.setState({ listHeight: ref.getBoundingClientRect().height });
            }
        }
    };

    render() {
        const { listHeight } = this.state;
        const { brands } = this.props;
        return (
            <div ref={this.promoBrandsRef} className="chatHistory">
                {brands.length > 0 && (
                    <List
                        height={listHeight}
                        itemCount={brands.length}
                        itemSize={() => this.state.listHeight}
                        width="100%"
                    >
                        {({ index, style }) => (
                            <div style={style}>
                                <PromoBrand
                                    ref={this.listItemRef}
                                    index={index}
                                    brand={brands[index]}
                                    handleListItemChange={this.handleListItemChange}
                                />
                            </div>
                        )}
                    </List>
                )}
            </div>
        );
    }
}

Promotion2.propTypes = {
    brands: PropTypes.array.isRequired,
};

export default Promotion2;

const queryQl = `query getBrandsForPromo(
    $isActive: Boolean!,
    $isActiveModel: Boolean!
    $imageIsFeatured: Boolean!
    $isActivePrice: Boolean!
) {
    brands(
        isActive: $isActive
        _order: {brand: "ASC"}
    ) {
        id
        brand
        image
        models(
            isActive: $isActiveModel
            _order: {model: "ASC"}
        ){
            id
            model
            images(isFeatured: $imageIsFeatured) {
                filename
            }
            versions(exists: {prices:true}) {
                id
                version
                prices(
                    isActive: $isActivePrice
                ) {
                    id
                    updatedAt
                    price
                    promo
                }
            }
        }
    }
}`;

export async function getStaticProps() {
    const variables = {
        isActive: true,
        isActiveModel: true,
        imageIsFeatured: true,
        isActivePrice: true,
    };
    const data = await apiQl(queryQl, variables, false);
    const brands = data.data.brands;
    const promoBrands = brands.filter((brand) => {
        const promoModels = brand.models.filter((model) => {
            const promoVersions = model.versions.filter((version) => {
                return version.prices[0].promo;
            });
            // eslint-disable-next-line no-param-reassign
            model.versions = promoVersions;
            return promoVersions.length > 0;
        });
        // eslint-disable-next-line no-param-reassign
        brand.models = promoModels;
        return promoModels.length > 0;
    });
    let posts = await getPosts();
    posts = posts.data.posts;
    return {
        props: {
            brands: promoBrands,
            posts,
        },
    };
}
