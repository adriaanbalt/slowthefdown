
export const COLLECT_USER_INPUT_DATA = 'COLLECT_USER_INPUT_DATA'
export const COLLECT_TEMPLATE_DATA = 'COLLECT_TEMPLATE_DATA'

const pick = ( object, ...keys ) => {
  return keys.reduce(( newObject, key ) => {
    if ( !object[ key ]) console.warn( `Tried to get key ${ key } from an object but it didn't exist.` )
    newObject[ key ] = object[ key ]
    return newObject
  }, {})
}

const getRelevantTemplateData = ( object ) => pick( object,
  'websiteIdentifier',
  'websiteUrl',
  'displayName',
  'phoneImageAssetUrl',
  'websiteType'
)

export const collectUserInputData = ( data, key ) => {
  return {
    type: COLLECT_USER_INPUT_DATA,
    data,
    key,
  }
}

export const collectTemplateData = ( data, key ) => {
  return {
    type: COLLECT_TEMPLATE_DATA,
    data: data.map( getRelevantTemplateData ),
    key,
  }
}