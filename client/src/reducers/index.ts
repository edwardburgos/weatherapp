import { City } from '../extras/types';

const initialState = {
  choosenCities: new Array<City>() 
}

export default function reducer(state = initialState, action: { type: string } & {[key: string]: City[]}) {
  switch (action.type) {
    case 'MODIFY_CHOOSEN_CITIES':
      return {
        ...state,
        choosenCities: action.choosenCities
      }
    default:
      return { ...state }
  }
}