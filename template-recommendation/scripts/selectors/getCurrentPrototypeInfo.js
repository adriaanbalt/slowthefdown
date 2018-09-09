import { createSelector } from 'reselect'

const getQueue = state => state.QueueReducer

export default createSelector(
  getQueue,
  queue => queue[ queue.currentPrototype ]
)