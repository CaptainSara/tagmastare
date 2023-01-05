
import PlusMinus from './PlusMins';
function TicketTravelers({ addToHashmap, travelerMap }) {
  return (

    <div className="ticketcontainer">
      <div className="ticketamounts">

        <div className='traveler'>
          Vuxen:
          <PlusMinus
            traveler='vuxen'
            setTravelerArr={addToHashmap}
            travelerArray={travelerMap}
          />
        </div>
        <div className='traveler'>
          Barn / Ungdom:
          <PlusMinus
            traveler='barn'
            setTravelerArr={addToHashmap}
            travelerArray={travelerMap}
          />
        </div>
        <div className='traveler'>
          Pensionär:
          <PlusMinus
            traveler='pensioner'
            setTravelerArr={addToHashmap}
            travelerArray={travelerMap}
          />
        </div>
        <div className='traveler'>
          Student:
          <PlusMinus
            traveler='student'
            setTravelerArr={addToHashmap}
            travelerArray={travelerMap}
          />
        </div>
      </div>
    </div>



  );
}

export default TicketTravelers;