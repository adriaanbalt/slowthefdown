export const GO_TO_TEMPLATE = 'GO_TO_TEMPLATE'
export const ACTIVATE_TEMPLATE = 'ACTIVATE_TEMPLATE'

export const gotoTemplate = ( index ) => {
  return {
    type: GO_TO_TEMPLATE,
    currentTemplateIndex: index,
  }
}

export const activateTemplate = ( index ) => {
  return {
    type: ACTIVATE_TEMPLATE,
    activeTemplateIndex: index,
  }
}