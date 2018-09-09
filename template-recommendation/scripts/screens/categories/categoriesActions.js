export const SELECT_IMAGE = 'SELECT_IMAGE'
export const DESELECT_IMAGE = 'DESELECT_IMAGE'

export const deselectImage = ( label ) => {
  return {
    type: DESELECT_IMAGE,
    label,
  }
}

export const selectImage = ( label ) => {
  return {
    type: SELECT_IMAGE,
    label,
  }
}