import firebase from '@/plugins/firebase'
import { DB } from '@/plugins/firebase'

export default {
  namespaced: true,
  state: {
    fb: null,
  },
  mutations: {
    LOGIN(state, user) {
      state.fb = user
    },
    LOGOUT(state) {
      firebase.auth().signOut().then(function() {
        state.fb = null
        localStorage.removeItem('user')
      }).catch(function(error) {
        console.error('➡️ ' + 'err', error)// eslint-disable-line
      });
    },
  },
  actions: {
    async USER_CHECK ({ commit }) {
      return new Promise(async (resolve, reject) => {
        const user = await firebase.auth().currentUser
        const localUser = JSON.parse(localStorage.getItem('user'))
        if (!user && !localUser) {
          commit('LOGOUT')
          reject('не авторизованиый пользователь')
        }
        else if (user) {
          commit('LOGIN', user)
          resolve(user.displayName)
        }
        else if (!user && localUser) {
          commit('LOGIN', localUser)
          resolve(localUser.displayName)
        } else {
          commit('LOGOUT')
          reject('не авторизованиый пользователь')
        }

      })
    },
    LOGIN({ commit }, user) {
      return new Promise((resolve, reject) => {
        firebase
          .auth()
          .signInWithEmailAndPassword(user.email, user.pass)
          .then(() => {
            const currentUser = firebase.auth().currentUser
            commit('LOGIN', currentUser)
            localStorage.setItem('user', JSON.stringify(currentUser))
            resolve({ ok: true, role:  currentUser.displayName})
          })
          .catch(function(error) {
            commit('LOGOUT')
            console.error('➡️ ' + 'err', error)// eslint-disable-line
            reject({ ok: false, code: error.code })
          })
      })
    },
    SIGN_UP({ commit }, user) {
      return new Promise(async (resolve, reject) => {
        firebase
          .auth()
          .createUserWithEmailAndPassword(user.email, user.pass)
          .then(async (res) => {
            await DB.ref('users/' + res.user.uid).update({ 
              balance: 100,
              email: user.email })
            localStorage.setItem('user', JSON.stringify(res.user))
            commit('LOGIN', res.user)
            resolve({ ok: true, role: res.user.displayName })
          })
          .catch(function(error) {
            commit('LOGOUT')
            console.error('➡️ ' + 'err', error)// eslint-disable-line
          reject({ ok: false })
          })
      })
    },
    LOGOUT({ commit }) {
      return new Promise((resolve, reject) => {
        firebase.auth().signOut().then(function() {
          commit('LOGOUT')
          resolve({ ok: true })
        }).catch(function(error) {
          console.error('➡️ ' + 'err', error)// eslint-disable-line
          reject({ ok: false })
        });
      })
    },
  },
  getters: {
    USER: state => state.fb,
  },
}