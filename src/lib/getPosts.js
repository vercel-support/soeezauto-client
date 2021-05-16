import { apiWp } from './functions';

const queryQl = `query AllPosts {
    posts(first: 10, where: {orderby: {field: DATE, order: DESC}, categoryNotIn: "167"}) {
        pageInfo {
            endCursor
            startCursor
            hasNextPage
            hasPreviousPage
        }
        edges {
            node {
                title
                excerpt
                uri
                slug
                date
                categories {
                    nodes {
                        name
                    }
                }
                featuredImage {
                    node {
                        sourceUrl
                    }
                }
            }
        }
    }
}
`;

const variables = {};

export default async function getPosts() {
    const posts = await apiWp(queryQl, variables);
    return posts;
}
