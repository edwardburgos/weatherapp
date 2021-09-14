import { City, Country } from '../extras/types';

const initialState = {
  choosenCities: new Array<City>(),
  countries: new Array<Country>()
}

export default function reducer(state = initialState, action: { type: string, choosenCities: City[], countries: Country[]}) {
  switch (action.type) {
    case 'MODIFY_CHOOSEN_CITIES':
      return {
        ...state,
        choosenCities: action.choosenCities
      }
    case 'SET_COUNTRIES':
      return {
        ...state,
        countries: action.countries
      }
    default:
      return { ...state }
  }
}