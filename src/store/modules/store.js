// initial state
const state = {
  storeId: null
}

// getters
const getters = {
  storeId: state => state.storeId
}

// actions
const actions = {
  setStoreId ({commit}, storeId){
    commit('SET_STORE_ID', storeId)
  }
}

// mutations
const mutations = {
  SET_STORE_ID(state, storeId){
    state.storeId = storeId
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}