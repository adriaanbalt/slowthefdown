import React from 'react'


export const OPEN_MODAL = 'OPEN_MODAL'
export const CLOSE_MODAL = 'CLOSE_MODAL'

export const openModal = ( component = () => <div>Hi there</div> ) => {
  return {
    type: OPEN_MODAL,
    component,
  }
}

export const closeModal = () => {
  return {
    type: CLOSE_MODAL,
  }
}