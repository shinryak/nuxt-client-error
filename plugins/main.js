module.exports = function(context) {
  const { store } = context
  if (store) {
    // eger is simple of error-manager!
    store.registerModule('eger', {
      namespaced: true,
      state: () => ({
        // errorList is an array of object that implement of {error: string, msg: string}
        errorList: []
      }),
      mutations: {
        /**
         * Add an error to error list
         * @param {Object} state access vuex state by default, dont care this when commit
         * @param {Object} params an object include errorType (default: global) and errorMessage you want to add to error list
         */
        addError(state, params) {
          const { errorType, errorMessage } = params
          if (errorMessage && typeof errorMessage === 'string') {
            if (errorType && typeof errorType === 'string') {
              state.errorList.push({ error: errorType, msg: errorMessage })
            } else state.errorList.push({ error: 'global', msg: errorMessage })
          }
        },
        /**
         * Remove all error match error type
         * @param {Object} state access vuex state by default, dont care this when commit
         * @param {string} errorType the error type you want to remove
         */
        removeError(state, errorType) {
          if (state.errorList && state.errorList.lenght)
            state.errorList = state.errorList.map(
              (value) => value.errorType && value.errorType !== errorType
            )
        },
        clearAll(state) {
          state.errorList = []
        }
      }
    })
  }
}
