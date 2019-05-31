import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import ErrorMessage from './ErrorMessage'
import Link from 'next/link'

export const homeQuery = gql`
  query homeQuery($productsFirst: Int, $productsAfter: String) {
    products(first: $productsFirst, after: $productsAfter) {
      nodes {
        id
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
      <Link prefetch as={`/products/${product.slug}`} href={`/product?slug=${product.slug}`}>
        <a>
          <figure>
            <img src={mainImage.smallUrl} alt={mainImage.altText || product.name} width="100" height="100"/>
            <figcaption>
              <div>{product.name}</div>
            </figcaption>
          </figure>
        </a>
      </Link>
      <div>{formattedPrice}</div>
      <style jsx>{`
        article {
          float: left;
          margin: 0 1em;
          width: 240px;
        }
        figure {
          margin: 0;
        }
        `}</style>
    </article>
  )
}

export function Products ({ products }) {
  return (
    products.map(v => <Product key={v.id} product={v}/>)
  )
}

export default function HomePage () {
  return (
    <Query query={homeQuery} variables={homeQueryVars}>
      {({ loading, error, data }) => {
        if (loading) return <div>Loading</div>
        if (error) return <ErrorMessage message='Error loading data.' />
        return (
          <section>
            <Products products={data.products.nodes} />
          </section>
        )
      }}
    </Query>
  )
}
