export const ON_CHANGE = 'ON_CHANGE'

export const onChange = ( type, val ) => {
  return {
    type: ON_CHANGE,
    [ type ]: val,
  }
}