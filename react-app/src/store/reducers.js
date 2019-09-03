const initialState = {
  payments: [],
  user: null,
  balance: null
};
function rootReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_USER':
      return Object.assign({}, state, {
        user: action.user
      })
    case 'SET_BALANCE':
        return Object.assign({}, state, {
          balance: action.balance
        })
    case 'SET_PAYMENTS':
      return { 
        ...state,
        payments: [...state.payments, ...action.payments]
      }
    default:
      return state
  }
};
export default rootReducer;