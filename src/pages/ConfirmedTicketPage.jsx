import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function ConfirmedTicketPage() {
  const location = useLocation();
  const data = location.state;


  return (
    <div>
      <h1>Ticket confirmed</h1>
      <p>Bookingid: {data.bookingId}</p>
      <p>Train: {data.trainNumber}</p>
      <p>Route: {data.route}</p>
      <p>DepartureTime: {data.departureTime}</p>
      <p>DepartureStation: {data.departureStation}</p>
      <p>ArrivalStation: {data.arrivalStation}</p>
      <p>Ticketprice: {data.ticketPrice} SEK</p>
      <br />
      <Link className="goback-link" to="/">X Gå tillbaka</Link>
    </div>
  );
}