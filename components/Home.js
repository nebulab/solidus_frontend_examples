import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import ErrorMessage from './ErrorMessage'
import Link from 'next/link'

export const homeQuery = gql`
  query homeQuery($productsFirst: Int!, $productsAfter: String) {
    products(first: $productsFirst, after: $productsAfter) {
      nodes {
        images(first: 1) {
          nodes {
            altText
            smallUrl: url(style: SMALL)
          }
        }
        name
        price {
          amount
          currencyCode
        }
        slug
      }
    }
  }
`

export const homeQueryVars = {
  productsFirst: 10,
  productsAfter: null
}

export function Product ({ product }) {
  const mainImage = product.images.nodes[0]
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.price.currencyCode
  }).format(product.price.amount);

  return (
    <article>
      {/* <pre>{JSON.stringify(product, null, 2)}</pre> */}
      <figure>
        <img src={mainImage.smallUrl} alt={mainImage.altText || product.name} width="100" height="100"/>
        <figcaption>
          <div>{product.name}</div>
          <div>{formattedPrice}</div>
        </figcaption>
      </figure>
      <style jsx>{`
        article {
          float: left;
        }
        `}</style>
    </article>
  )
}

export function Products (props) {
  return (
    props.products.map(v => <Product key={v.id} product={v}/>)
  )
}

export default function Home () {
  return (
    <Query query={homeQuery} variables={homeQueryVars}>
      {({ loading, error, data }) => {
        if (loading) return <div>Loading</div>
        if (error) return <ErrorMessage message='Error loading posts.' />
        return (
          <section>
            <Products products={data.products.nodes} />
          </section>
        )
      }}
    </Query>
  )
}
