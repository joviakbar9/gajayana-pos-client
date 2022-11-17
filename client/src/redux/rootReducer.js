const initailState = {
  loading: false,
  cartItems: [],
};

export const rootReducer = (state = initailState, action) => {
  switch (action.type) {
    case "addToCart":
      const items = [...state.cartItems]
      let shouldPush = true

      items.forEach(item => {
        if (item.kodeproduk === action.payload.kodeproduk) {
          item.quantity += 1
          shouldPush = false
        }
      });

      if (shouldPush) {
        items.push(action.payload)
      }
      
      return {
        ...state,
        cartItems: items,
      };
      case "deleteFromCart":
      return {
        ...state,
        cartItems: state.cartItems.filter((item)=>item._id !== action.payload._id),
      };
    case "updateCart":
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item._id == action.payload._id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'showLoading' : return{
        ...state,
        loading : true
    }
    case 'hideLoading' : return{
        ...state,
        loading:false
    }
    case "clearCart": return{
        ...state,
        cartItems: [],
      }
    default:
      return state;
  }
};