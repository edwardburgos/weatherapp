import React, { useState, useEffect } from 'react';
import s from './SearchBar.module.css';
import { Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { modifyChoosenCities } from '../../actions';
import { City, Flags, AvailableCity, Country } from '../../extras/types';


export default function SearchBar() {

  const countries = useSelector((state: { countries: Country[] }) => state.countries)
  // const [countries, setCountries] = useState<Country[]>([])
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  const [buttonState, setButtonState] = useState(false)
  const [buttonContent, setButtonContent] = useState('Search')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('default')

  const dispatch = useDispatch();

  const choosenCities = useSelector((state: { choosenCities: City[] }) => state.choosenCities)

  

  useEffect(() => {
    //if (country !== 'default') setAvailableCities(countriesCities.filter(f => f.country === country)[0]['cities'])
  }, [country])

  async function searchCity(cityName: string) {
    console.log(availableCities.filter(e => e.includes(cityName)))
    // const filterInfo = info.filter((e: AvailableCity) => e.name.toLowerCase() === cityName.toLowerCase())
    // if (filterInfo.length === 1) { 
    //   console.log(filterInfo)
    //   return setButtonContent('Add');



    // } else {
    //   const results = info.filter((e: AvailableCity) => e.name.toLowerCase().includes(cityName)).length
    //   if (results === 1) return setButtonContent('Add')
    //   if (results) return setButtonContent('Search');
  }

  function add() {
    //dispatch(modifyChoosenCities([...choosenCities, { name: 'paolo', country: 'paolo', flag: 'paolo', weather: 'paolo', weatherIcon: `paolo`, temperature: 15, windSpeed: 16 }]))

  }

  function showResults() {

  }

  return (
    <>
      <div className={s.container}>
        <div className={s.searchContainer}>
          <select className={`form-control mb-3`} id="countrySelector" value={country} onChange={e => { setCountry(e.target.value); }} name="country">
            <option key='default' value='default'>Select a country</option>
            {countries.length ?
            countries.map(e => <option key={e.code} value={e.name}>{e.name}</option>)
          : null}
          </select>
          <Form.Control className={s.searchInput} placeholder="Enter a city" onChange={e => { setCity(e.target.value); searchCity(e.target.value) }} />
          <button className={`btn btn-primary ${s.searchButton}`} onClick={() => buttonContent === 'Add' ? add() : showResults()} disabled={!city}>{buttonContent}</button>
        </div>
      </div>

      <Modal
        show={showModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => setShowModal(false)}
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Complete this form
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h1>MODAL</h1>
        </Modal.Body>
      </Modal>
    </>
  )
};