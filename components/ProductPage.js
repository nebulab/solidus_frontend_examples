import { withRouter } from 'next/router'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import ErrorMessage from './ErrorMessage'

export const productQuery = gql`
  query productQuery($slug: String!) {
    productBySlug(slug: $slug) {
      id
      slug
    }
  }
`

export function productQueryVars(productSlug) {
  return {
    "slug": productSlug
  }
}

export function Product(props) {
  return (
    <pre>{JSON.stringify(props.product, null, 2)}</pre>
  )
}

export default withRouter(props => {
  return (
    <Query query={productQuery} variables={productQueryVars(props.router.query.slug)}>
      {({ loading, error, data }) => {
        if (loading) return <div>Loading</div>
        if (error) return <ErrorMessage message='Error loading data.' />
        return (
          <div>
            <Product product={data.productBySlug} />
          </div>
        )
      }}
    </Query>
  )
})
