import React from "react";
import { Link } from "react-router-dom";
import { Button } from '../components/bootstrap-components'
import ticketIcon from '../images/ticket.png';

export default function Ticket() {


  return (
    <div className='get-ticket-page'>
      <div className="goback">
       <Link className="goback-link" to="/">X Gå tillbaka</Link>
      </div>
      
      <div className='login-section'>
        <img src={ticketIcon} alt="Ticket Icon" />    
        <h3 className="page-text">Logga in för att se dina biljetter och årskort.
        Du kan också hämta biljetter med bokningsnummer.</h3>
        
        <form className='login-form'>
          <label>Email</label>
          <input
            type='text'
            readonly
            class='form-control-plaintext'
            id='staticEmail'
            placeholder='Email'/>
            
          <label>Lösenord</label>
          <input
            type='password'
            class='form-control'
            id='inputPassword'
            placeholder='Lösenord' />
          
          <Button className='logg-in-button'>Logga in</Button>
          <h4 className="page-text">Eller?</h4>
          <Button className="logg-in-button">
            <Link className="button-link" to="/get-ticket"> Hämta Biljett</Link>
          </Button>
        </form>
      </div>
    </div>
    
  );
}