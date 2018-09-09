export const TRACK_LINK_CLICK_PREVIEW = 'TRACK_LINK_CLICK_PREVIEW'

export const trackLink = ( actionType, eventData = {}) => {
  return {
    type: actionType,
    eventData,
  }
}
