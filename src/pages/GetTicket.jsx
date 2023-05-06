import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { Button } from '../components/bootstrap-components'
import imageIcon from '../images/ticket.png'

export default function GetTicket() {

  const [inputTicketId, setInputTicketId] = useState('')
  const [myTicket, setMyTicket] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(inputTicketId)
    fetchTicket()


  }
  const fetchTicket = async () => {
    const response = await (await fetch(`http://localhost:3000/api/booking/${inputTicketId}`)).json()
    console.log(response)
    setMyTicket(response)
  }

  useEffect(() => {

    fetchTicket()
  }, [])

  return (
    <div className="get-ticket-page">
      <div className="goback">
        <Link className="goback-link" to="/ticket">X Gå tillbaka</Link>
      </div>

      <div className="get-ticket-section">
        <img src={imageIcon} alt="ticket-logo" />

        <form className='ticket-form' onSubmit={handleSubmit}>
          <label>Ange bokningsnummer</label>
          <input
            type="text"
            id="cutomerTicket"
            placeholder='Bokningsnummer'
            onChange={e => setInputTicketId(e.target.value)}
            value={inputTicketId} />

          <Button className='logg-in-button' type='submit'
          /* onClick={() => setMyTicket()} */ > Hämta Biljett</Button>
        </form>

        <div className='ticket'>

          <div>{myTicket && myTicket.map((myTicket) => (
            <h1 key={myTicket._id}>{myTicket.routeId}</h1>
          ))}</div>

          <div>{myTicket && myTicket.map((myTicket) => (
            <p key={myTicket._id}>
              My: {myTicket.totalPrice}
            </p>

          ))}</div>
        </div>
      </div>
    </div>
  )
}
