import { withRouter } from 'next/router'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import ErrorMessage from './ErrorMessage'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css';

export const productQuery = gql`
  query productQuery($slug: String!) {
    productBySlug(slug: $slug) {
      name
      description
      images(first: 100) {
        nodes {
          altText
          productUrl: url(style: PRODUCT)
          smallUrl: url(style: SMALL)
        }
      }
      price {
        amount
        currencyCode
      }
    }
  }
`

export function productQueryVars(productSlug) {
  return { slug: productSlug }
}

export function Product({ product }) {
  const { images: { nodes: images } } = product

  const imagesForGallery = images.map(image => {
    const imageAlt = image.altText || product.name
    return {
      original: image.productUrl,
      originalAlt: imageAlt,
      thumbnail: image.smallUrl,
      thumbnailAlt: imageAlt
    }
  })

  return (
    <article>
      {/* <pre>{JSON.stringify(product, null, 2)}</pre> */}
      <div>
        <ImageGallery items={imagesForGallery}
                      lazyLoad
                      showPlayButton={false}
                      slideDuration={150} />
      </div>
      <h1>{product.name}</h1>
      <div>{product.description}</div>
      <style jsx>{`
        article :global(.image-gallery) {
          float: left;
        }
        article :global(.image-gallery-image) {
          width: 240px;
        }
        `}</style>
    </article>
  )
}

const ProductPage = ({ router: { query: { slug }}}) => {
  return (
    <Query query={productQuery} variables={productQueryVars(slug)}>
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
}

export default withRouter(ProductPage)
