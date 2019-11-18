export default function(context, inject) {
  const { store } = context
  const _vuexModule = 'eger'
  if (store) {
    // Register eger vuex module to manage error list
    // eger is simple of error-manager!
    store.registerModule(_vuexModule, {
      namespaced: true,
      state: () => ({
        errorList: [], // errorList is an array of object that implement of {error: string, msg: string}
        system: {} // system is an object for storing "auto clear error" action
      }),
      mutations: {
        /**
         * Add an error to error list
         * @param {Object} state access vuex state by default, dont care this when commit this mutation
         * @param {String} errorType type of error, default global
         * @param {String} errorMessage error message
         */
        addError(state, { errorType, errorMessage }) {
          if (errorType === undefined) errorType = 'global'
          if (errorMessage === undefined) errorMessage = null
          state.errorList.push({ error: errorType, msg: errorMessage })
        },
        /**
         * Remove all error match error type
         * @param {Object} state access vuex state by default, dont care this when commit this mutation
         * @param {string} errorType the error type you want to remove
         */
        removeError(state, errorType) {
          if (state.errorList && state.errorList.length) {
            state.errorList = state.errorList.filter(
              (value) => value.error !== errorType
            )
          }
        },
        /**
         * Clear all error in error list
         * @param {Object} state access vuex state by default, dont care this when commit this mutation
         */
        clearAll(state) {
          state.errorList = []
        },
        /**
         *
         * @param {*} state access vuex state by default, dont care this when commit this mutation
         * @param {Stirng} errorType the name of system time out error-type, which will remove error in error list after the time you set before, default: all
         */
        deleteSystemSchedule(state, errorType = 'all') {
          if (state.system[errorType]) {
            state.system[errorType].clearTimeout()
            state.system[errorType] = undefined
          }
        },
        addSchedule(state, { name, value }) {
          state.system[name] = value
        },
        removeSchedule(state, name) {
          state.system[name] = undefined
        },
        stopAndRemoveSchedule(state, name) {
          if (state.system[name]) {
            state.system[name].clearTimeout()
            state.system[name] = undefined
          }
        }
      },
      actions: {
        clearAllErrorSchedule({ commit, state }, { time }) {
          const errorType = 'all'
          if (time && typeof time === 'number')
            commit('addSchedule', {
              name: errorType,
              value: setTimeout(() => {
                commit('clearAll')
                commit('removeSchedule', errorType)
              }, time)
            })
        },
        clearErrorScheduleByType({ commit, state }, { errorType, time }) {
          if (errorType === undefined) errorType = 'global'
          if (time && typeof time === 'number')
            commit('addSchedule', {
              name: errorType,
              value: setTimeout(() => {
                commit('removeError', errorType)
                commit('removeSchedule', errorType)
              }, time)
            })
        },
        deleteClearErrorSchedule({ commit }, { errorType }) {
          if (errorType === 'undefined') errorType = 'all'
          commit('deleteSystemSchedule', errorType)
        }
      }
    })
  }
  inject('errors', {
    hasError(errorType = 'global') {
      return (
        store.state[_vuexModule].errorList.map(
          (value) => (value.errorType = errorType)
        ).length > 0
      )
    },
    addError(errorType = 'global', errorMessage = '', timeout = 0) {
      store.commit(_vuexModule + '/addError', {
        errorType,
        errorMessage
      })
      if (timeout > 0)
        store.dispatch(_vuexModule + '/clearErrorScheduleByType', {
          errorType,
          time: timeout
        })
    },
    getErrorMessageList(errorType = 'global') {
      return store.state[_vuexModule].errorList.map((value) => value.msg)
    },
    removeError(errorType = 'global') {
      store.commit(_vuexModule + '/removeError', errorType)
      store.commit(_vuexModule + '/stopAndRemoveSchedule', errorType)
    }
  })
}
