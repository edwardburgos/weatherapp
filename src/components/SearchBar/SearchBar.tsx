import React, {useState} from 'react';
import s from './SearchBar.module.css';
import { Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import { cities } from '../../extras/cities';
import { useDispatch, useSelector } from 'react-redux';
import { modifyChoosenCities } from '../../actions';
import { City, Flags} from '../../extras/types'


export default function SearchBar() {

  const [showModal, setShowModal] = useState(true)
  const [buttonState, setButtonState] = useState(false)
  const [buttonContent, setButtonContent] = useState('Search')
  const [city, setCity] = useState('')

  const dispatch = useDispatch();

  const choosenCities = useSelector((state: {choosenCities: City[] }) => state.choosenCities)


  async function searchCity(cityName: string) {
    if (cities.includes(cityName)) {
      return setButtonContent('Add');
    } else {
      const results = cities.filter(e => e.includes(cityName)).length
      if (results === 1) return setButtonContent('Add') 
      if (results) return setButtonContent('Search');
    }
  }

  function add() {
    dispatch(modifyChoosenCities([...choosenCities, { name: 'paolo', country: 'paolo', flag: 'paolo', weather: 'paolo', weatherIcon: `paolo`, temperature: 15, windSpeed: 16 }]))
    
  }

  function showResults() {

  }
  return (
    <>
    <div className={s.container}>
      <div className={s.searchContainer}>
        <Form.Control className={s.searchInput} placeholder="Enter a city" onChange={e => {setCity(e.target.value); searchCity(e.target.value)}} />
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