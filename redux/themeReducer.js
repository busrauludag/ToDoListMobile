import { lightTheme, darkTheme } from './../Theme';
import { SWITCH_THEME } from './themeActions';

const initialState = {
  theme: { ...lightTheme }
}

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SWITCH_THEME:
      return { 
        theme: action.theme 
      };
      // let newState = {
      //   ...state,
      //   theme: { ...state.theme, ...action.theme }
      // }
      // return newState;

    default:
      return state;
  }
}

export default themeReducer;