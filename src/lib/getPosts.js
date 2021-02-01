import { apiWp } from './functions';

const queryQl = `query AllPosts {
  posts(first: 10, where: {orderby: {field: DATE, order: ASC}}) {
    edges {
      node {
        title
        excerpt
        uri
        slug
        date
        tags {
          edges {
            node {
              description
            }
          }
        }
        categories {
          edges{
            node {
              name
              count
              description
            }
          }
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
        author {
          node {
            name
            firstName
            lastName
            avatar {
              url
            }
          }
        }
      }
    }
  }
}`;

const variables = {};

export default async function getPosts() {
    const posts = await apiWp(queryQl, variables);
    return posts;
}
