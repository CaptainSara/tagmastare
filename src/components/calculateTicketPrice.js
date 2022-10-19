function calculateTicketPrice(
  arrivalOffsetArrival,
  departureOffsetDeparture,
  isFirstClass,
  occupancy,
  ticketType

) {
  let totalMin = arrivalOffsetArrival - departureOffsetDeparture;
  let price = isFirstClass ? totalMin * 3 : totalMin * 2;
  let occupancyFactor = 1.5 - (1 - occupancy);
  price = price * occupancyFactor;
  let typeFactor;

  switch (ticketType) {
    case "Vuxen":
      typeFactor = 1.0;
      break;
    case "Pensionär":
      typeFactor = 0.87;
      break;
    case "Student":
      typeFactor = 0.85;
      break;
    case "Barn/Ungdom(0-19 år)":
      typeFactor = 0.5;
      break;
    default:
      break;
  }
  price = price * typeFactor;
  return Math.round(price);
}

export default calculateTicketPrice;