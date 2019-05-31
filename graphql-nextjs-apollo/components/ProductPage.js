import { withRouter } from 'next/router'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import ErrorMessage from './ErrorMessage'
import ImageGallery from 'react-image-gallery'
import { UIDReset, UIDFork, UIDConsumer } from 'react-uid'

import 'react-image-gallery/styles/css/image-gallery.css'

export const productQuery = gql`
  fragment VariantFields on Variant {
    price {
      amount
      currencyCode
    }
    images(first: 10) {
      nodes {
        altText
        productUrl: url(style: PRODUCT)
        smallUrl: url(style: SMALL)
      }
    }
  }

  query productQuery($slug: String!) {
    productBySlug(slug: $slug) {
      name
      description
      images(first: 10) {
        nodes {
          altText
          productUrl: url(style: PRODUCT)
          smallUrl: url(style: SMALL)
        }
      }
      masterVariant {
        ...VariantFields
      }
      price {
        amount
        currencyCode
      }
      variants(first: 25) {
        nodes {
          id
          ...VariantFields
          optionValues {
            nodes {
              presentation
              optionType {
                presentation
              }
            }
          }
        }
      }
    }
  }
`

export function productQueryVars(productSlug) {
  return { slug: productSlug }
}

export class OptionVariantSelectItem extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    this.props.onOptionVariantSelectChange(e.target.value);
  }

  render() {
    const { props: { selectedVariant, variant, uid } } = this

    return (
      <li>
        <input type="radio"
               id={uid}
               value={variant.id}
               onChange={this.handleChange}
               checked={selectedVariant.id === variant.id} />
        <label htmlFor={uid}>
          {variant.optionValues.nodes.map(optionValue => {
            return `${optionValue.optionType.presentation}: ${optionValue.presentation}`
          }).reduce((prev, curr) => [prev, ', ', curr])}
        </label>
      </li>
    )
  }
}

export const OptionVariantSelect = ({ selectedVariant, variants, onOptionVariantSelectChange }) => {
  return (
    <div>
      <ul>
        <UIDFork>
          {variants.map(variant => {
            return (
              <div key={variant.id}>
                <UIDConsumer>
                  {uid =>
                    <OptionVariantSelectItem variant={variant}
                                             selectedVariant={selectedVariant}
                                             onOptionVariantSelectChange={onOptionVariantSelectChange}
                                             uid={uid} />}
                </UIDConsumer>
              </div>
            )
          })}
        </UIDFork>
      </ul>
      <style jsx>{`
        ul {
          list-style-position: inside;
        }
      `}</style>
    </div>
  )
}

export const SelectedVariant = ({ variant }) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: variant.price.currencyCode
  }).format(variant.price.amount)
  return (
    <div>
      <h3>Price</h3>
      <div>{formattedPrice}</div>
    </div>
  )
}

export class Product extends React.Component {
  constructor(props) {
    super(props)

    const { props: { product } } = this
    const { masterVariant, variants: { nodes: variants } } = product

    this.product = product
    this.masterVariant = masterVariant
    this.optionVariants = variants

    this.handleOptionVariantSelectChange = this.handleOptionVariantSelectChange.bind(this);

    this.state = {
      selectedVariant: this.anyOptionVariant() ? this.optionVariants[0] : masterVariant
    }
  }

  anyOptionVariant() {
    return this.optionVariants.length > 0
  }

  imagesForGallery() {
    const { state: { selectedVariant: { images: { nodes: images } } } } = this
    const { product: { name: productName } } = this

    return images.map(image => {
      const imageAlt = image.altText || productName

      return {
        original: image.productUrl,
        originalAlt: imageAlt,
        thumbnail: image.smallUrl,
        thumbnailAlt: imageAlt
      }
    })
  }

  handleOptionVariantSelectChange(variantId) {
    const selectedVariant = this.optionVariants.find(variant => variant.id === variantId)
    this.setState({ selectedVariant: selectedVariant })
  }

  render() {
    return (
      <article>
        <div>
          <ImageGallery items={this.imagesForGallery()}
                        lazyLoad={true}
                        showPlayButton={false}
                        slideDuration={150} />
          <div className="product-aside-image-gallery">
            <h1>{this.product.name}</h1>
            <div>{this.product.description}</div>
              {this.anyOptionVariant() &&
                <div className="option-variant-select-wrapper">
                  <h3>Variants</h3>
                  <OptionVariantSelect variants={this.optionVariants}
                                       selectedVariant={this.state.selectedVariant}
                                       onOptionVariantSelectChange={this.handleOptionVariantSelectChange} />
                </div>}
            <div className="selected-variant-wrapper">
              <SelectedVariant variant={this.state.selectedVariant}/>
            </div>
          </div>
        </div>
        <style jsx>{`
          article :global(.image-gallery) {
            float: left;
          }
          article :global(.image-gallery-image) {
            width: 240px;
          }
          .product-aside-image-gallery {
            float: left;
            width: calc(100% - 240px);
          }
          .option-variant-select-wrapper,
          .selected-variant-wrapper {
            float: left;
          }
          `}</style>
      </article>
    )
  }
}

const ProductPage = ({ router: { query: { slug }}}) => {
  return (
    <Query query={productQuery} variables={productQueryVars(slug)}>
      {({ loading, error, data }) => {
        if (loading) return <div>Loading</div>
        if (error) return <ErrorMessage message='Error loading data.' />
        return (
          <div>
            <UIDReset>
              <Product product={data.productBySlug} />
            </UIDReset>
          </div>
        )
      }}
    </Query>
  )
}

export default withRouter(ProductPage)
