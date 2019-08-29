import { DB } from '@/plugins/firebase.js'
const state = () => ({
  money: {
    balance: null,
    payments: null
  },
})

const getters = {
  BALANCE: state => state.money.balance,
  PAYMENTS: state => state.money.payments,
  PAY_ITEM: state => id => {
    if (state.money.payments) {
      return state.money.payments[id]
    }
  }
}

const mutations = {
  INIT (state, data) {
    if (data) {
      state.money.balance = data.balance || 0
      state.money.payments = data.payments || {}
    } else {
      state.money.balance = 0
      state.money.payments = {}
    }
  }
}

const actions = {
  PAY ({ state }, data) {
    const localUser = JSON.parse(localStorage.getItem('user'))
    const summ = +state.money.balance - data.summ
    DB.ref(`/users/${localUser.uid}/`).update({ balance: summ })
    return Promise.resolve(
      DB.ref(`/users/${localUser.uid}/payments`).push(data)
    )
  },
  async INIT ({ commit }) {
    const localUser = JSON.parse(localStorage.getItem('user'))
    await DB.ref(`/users/${localUser.uid}/`).on('value', async d => {
      commit('INIT', await d.val())
    })
  },

}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}