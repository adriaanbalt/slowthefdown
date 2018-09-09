import axios from 'axios'
import TaxonomyBrain from '@sqs/taxonomy-brain'

const GETTY_SEARCH_TERMS = 'http://sorex.machine-learning.svc.eqx.dal.stage.kubernetes:8080/sorex/getty_frequent_searches'
const IMAGE_TO_IMAGE = 'http://getty-image2image-index.machine-learning.svc.eqx.dal.stage.kubernetes:8080/neighbors/batch'
const TEXT_TO_IMAGE = 'http://getty-captions-keywords-search-index.machine-learning.svc.eqx.dal.stage.kubernetes:8080/ranking/'
export const IMAGE_DATASET = [ 'https://s3.amazonaws.com/squarespace-ml/ml/datasets/getty_top_searches_image_dataset/', '.jpg' ]
const TEMPLATE_TO_TEMPLATE = 'https://template-to-template-search.stage.sqsp.net/neighbors/batch'
const TEXT_TO_TEMPLATE = 'https://template-search.stage.sqsp.net/ranking/'

const CUSTOMER_EXAMPLES_TO_RECOMMENDATIONS = 'http://ml-customer-examples-to-template.machine-learning.svc.drt.ewr.stage.kubernetes:9000'

const flattenBatch = ( batch ) => batch.reduce(( arr, item ) => {
  return [ ...arr, ...item.neighbors.map(( neighbor ) => neighbor.id ) ]
}, [])

export const getSimilarImages = async ( images ) => {
  const result = await axios.post( IMAGE_TO_IMAGE, {
    query: images,
  })
  return flattenBatch( result.data.batch )
}

export const getSimilarTemplatesVisually = async ( templatesList, length = 10 ) => {
  const result = await axios.post( TEMPLATE_TO_TEMPLATE, {
    query: templatesList,
    settings: {
      n: length,
    },
  })
  return flattenBatch( result.data.batch )
}

export const getRecommendationsByCustomerExamples = async ( customerExampleList ) => {
  const result = await axios.post( CUSTOMER_EXAMPLES_TO_RECOMMENDATIONS, {
    query: customerExampleList,
  })
  return result.data.results
}

// use site title to populate initial tinder list in future
export const getTemplatesFromText = async ( searchTerm ) => {
  const result = await axios.post( TEXT_TO_TEMPLATE, {
    query: searchTerm,
  })
  return result.data.results
}

export const getTemplates = async ( templateNames ) => {
  const query = {
    websiteTypes: [ 1, 4 ],
    locale: 'en-US',
    custom: null,
  }

  const sort = {
    order: templateNames,
    orderKey: 'websiteIdentifier',
    key: 'releasedOn',
  }

  const results = await TaxonomyBrain.getTemplates( query, sort )
  return results.slice( 0, templateNames.length ).map(( template ) => template )
}

export const searchForImages = async ( searchTerm ) => {
  const response = await axios.post( TEXT_TO_IMAGE, {
    query: searchTerm,
  })
  return response.data.results
}

export const mapTemplatesToScreenshots = async ( templateNames, resolution = 500 ) => {
  const results = await getTemplates( templateNames )
  return results.map(( template ) => template.phoneImageAssetUrl + '?format=' + resolution + 'w' )
}
