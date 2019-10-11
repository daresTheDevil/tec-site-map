export const state = () => ({
  mapMarkers: null,
  newMarkers: null
})

export const mutations = {
  SET_MARKERS(state, payload) {
    state.mapMarkers = payload
  },
  SET_NEW_MARKERS(state, payload) {
    state.mapMarkers = payload
  }
}

export const getters = {
  getMapMarkers(state) {
    return state.mapMarkers
  }
}
