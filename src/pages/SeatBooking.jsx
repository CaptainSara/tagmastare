import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import store from '../functions/localstorage'

export default function SeatBooking() {

  let data = store;
  const navigate = useNavigate();


  return (
    <div className="main">

      <div className="navbar">
        <div className="goback">
          <Link className="goback-link" to="/">X Gå tillbaka</Link>
        </div>
      </div>

      <div className="container">
        <div className="content">
          <div className="user-data" style={{ borderStyle: "solid", borderColor: "red", width: "100%" }}>
            <h3>Plats bokning för rutt : {data.originStation} - {data.destinationStation} </h3>
            <p>{JSON.stringify(data.routeData)}</p>
            <button onClick={() => confirmBookingAndTickets(data)}>Confirm booking</button>


          </div>
        </div>
      </div>

      {/* Im leaving a temp link here to illustrate the flow of the page. You'd pick your seat and then 
          navigate to "Köp" or something - grayed out if you havent selected all seats you choose persons for vuxna , kids etc. */}
      <Link className="temp-pay-link" to="/payment">Temp goto payment</Link>
    </div>
  )


  async function createBooking(data) {
    const response = await fetch('http://localhost:3000/api/booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ticketAmount: 1,
        routeId: data.routeId,
        totalPrice: 100
      })
    });
    return await response.json();
  }

  async function createTicket(data, bookingResponse) {
    const ticketresponse = await fetch('http://localhost:3000/api/tickets', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        bookingId: bookingResponse._id,
        trainNumber: data.trainId,
        route: data.routeId,
        departureTime: data.date,
        departureStation: data.originStationId,
        arrivalStation: data.destinationStationId,
        ticketPrice: 100
      })
    });
    return await ticketresponse.json();

  }

  async function confirmBookingAndTickets(data) {

    try {
      const bookingResponse = await createBooking(data);
      const ticketResponse = await createTicket(data, bookingResponse);
      navigate('/ConfirmedTicketPage', { state: ticketResponse });
    } catch (error) {
      console.error(error);
    }
  }
}