import React, { useState, useEffect } from "react";
import { json, Link } from "react-router-dom";
import TicketTravelers from "../components/Travelers";
import { useNavigate } from 'react-router-dom'
import store from '../functions/localstorage'

export default function Booking() {

  const navigate = useNavigate()

  const [locations, setLocations] = useState([]);
  const [locationMatch, setLocationMatch] = useState([]);
  const [dateValue, setDateValue] = useState('');

  function handleDateChange(event) {
    setDateValue(event.target.value);
  }

  // Where route data is stored for the users ticket.
  let [route, setRoute] = useState([]);
  // Used in concert with above to print how many departures there are that day.
  let [timeTable, setTimeTable] = useState([]);

  const [travelerMap, setTravelerMap] = useState({
    vuxen: 0,
    barn: 0,
    student: 0,
    pensioner: 0
  });

  const addToHashmap = (key, value) => {
    setTravelerMap(prevHashmap => ({
      ...prevHashmap,
      [key]: value
    }));
  };

  // If I had time I would have created a dropdown 
  // component for these. /Tim 
  const [from, setFrom] = useState([]);
  // second dropdown list
  const [to, setTo] = useState([]);
  useEffect(() => {
    async function fetchData() {

    }
    fetchData();
  }, [travelerMap]);

  useEffect(() => {
    const loadLocations = async () => {

      fetch("http://localhost:3000/api/getUniqueStations")
        .then((res) => res.json())
        .then((json) => {
          // console.log(json);
          setLocations(json);
        })
    };


    loadLocations();
  }, []);

  const searchFromLocations = (text) => {
    setFrom(text);

    let matches = locations.filter((location) => {
      const regex = new RegExp(`${text}`, "gi");
      // console.log("Autocomplete -> " + location.match(regex));
      return location.match(regex);
    })

    setLocationMatch(matches);
  };

  const searchToLocations = (text) => {
    setTo(text);

    let matches = locations.filter((location) => {
      const regex = new RegExp(`${text}`, "gi");
      // console.log("Autocomplete -> " + location.match(regex));
      return location.match(regex);
    })

    setLocationMatch(matches);
  };

  function handleFromLocation(setName) {
    setFrom(setName);
    updateSearch(setName, to);
  }

  function handleToLocation(setName) {
    setTo(setName);
    updateSearch(from, setName);
  }

  // Lifted from the internet /Tim.
  function toHoursAndMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
  }

  // Handle a single routes offsets.
  function getRouteTimeOffsets(departure, routeElement) {
    // arrival time.

    let startDeparture = departure['startHour'];

    let arrivalMin = routeElement['station'][0]['arrivalOffset'];

    let arrTime = toHoursAndMinutes(startDeparture * 60 + arrivalMin);

    if (arrTime.hours >= 24) {
      arrTime.hours = arrTime.hours - 24;
    }

    let arrivalTime = (arrTime.hours + ":" + arrTime.minutes);

    // departure time

    let departureMin = routeElement['station'][0]['departureOffset'];

    let offset = departureMin - arrivalMin; // diffrence.

    let destTime = toHoursAndMinutes(startDeparture * 60 + (arrivalMin + offset));
    if (destTime.hours >= 24) {
      destTime.hours = destTime.hours - 24;
    }

    let departTime = (destTime.hours + ":" + destTime.minutes);


    return ({ arrivalTime, departTime })
  }

  // get routes search timetables aswell.
  function updateSearch(from, to) {
    console.log("SEARCH -> " + "http://localhost:3000/api/seekRoute/" + from + "+" + to);
    let routeId = "err";
    let routeName = "err";

    // First I get the route AND update to our from,to variables.
    fetch("http://localhost:3000/api/seekRoute/" + from + "+" + to)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setRoute(json);

        // console.log("TEXT : " + json[0]['_id']);
        routeId = json[0]['_id'];
        routeName = json[0]['routeName'];

        // Set current route timeTables based on user location in our trainRoute.
        if (routeId != "err") {
          // Get timeTable
          fetch("http://localhost:3000/api/getTimeTableByRouteId/" + routeId)
            .then((res) => res.json())
            .then((json) => {

              // Even if this succeeds - we have not populated enough timetable entries 
              // per route. In that case I will fill them in so all routes have atleast 
              // three.
              //..
              // For now only "Göteborg C - Malmö Hyllie (via Malmö C)" have four entries
              // for the days 24,25,26,27 October.
              console.log("Timetable success");
              console.log(json);

              if (json.length != 0) {
                // use the data.
                console.log(routeName + " have timetable data. Lenght " + json.length);
                setTimeTable(json);
              }
              else {
                console.log(routeName + " no timeTables for that route - make some up.")

                // For now Im thinking about the date.
                // startHour counts forward from midnight.
                const mockTimeTable =
                  [
                    {
                      _id: "mocked timetable",
                      startHour: 6, // start at midnight 
                      startMinute: 0,
                      runsWeekends: true,
                      date: "2022-10-20T00:00:00.000Z",
                      routeId: routeId
                    },
                    {
                      _id: "mocked timetable",
                      startHour: 12,
                      startMinute: 25,
                      runsWeekends: true,
                      date: "2022-10-20T00:00:00.000Z",
                      routeId: routeId
                    },
                    {
                      _id: "mocked timetable",
                      startHour: 18,
                      startMinute: 25,
                      runsWeekends: true,
                      date: "2022-10-20T00:00:00.000Z",
                      routeId: routeId
                    },
                  ]

                setTimeTable(mockTimeTable);
                console.log(mockTimeTable);
              }
            })
        }
        else {
          console.log("Could not fetch timetable due to invalid routeId");
          setTimeTable([]);
        }
      })
  }

  // Controls the dropdown menu on search fields; I would like 
  // to encapsulate the dropdown into a component in the future.
  const [dd_from_isOpen, dd_from_setIsOpen] = useState(false);
  const [dd_to_isOpen, dd_to_setIsOpen] = useState(false);

  // Sends our data from timetable and route to local storage so we can use it on seat-picker page.
  function onClickDepCard(timeTableData, routeData, dateValue, routeTime) {
    console.log("Clicked departure card");

    const dateString = dateValue + "T" + routeTime.departTime + "0";
    const date = new Date(dateString);

    store.timeTable = timeTableData;
    store.routeData = routeData;
    store.date = date;



    // Just for my own sanity Im picking out a few things I especially 
    // want to show on seat picking page. Just to show that data is indeed stored.
    store.originRoute = routeData[0]['routeName'];
    store.routeId = routeData[0]['_id'];
    store.trainId = routeData[0]['train'];

    // Meanwhile I could have just read "from" , "to" - I rather use the data structure 
    // that was created in route as it would be very confusing to debug. 

    // start location
    store.originStation = routeData[0]['station'][0]['stationName'];
    store.originStationId = routeData[0]['station'][0]['_id']

    // end destination 
    let lastRouteIndex = (Object.keys(routeData).length - 1);

    let lastIndex = routeData[lastRouteIndex]['station'].length - 1;
    store.destinationStation = routeData[lastRouteIndex]['station'][lastIndex]['stationName'];
    store.destinationStationId = routeData[lastRouteIndex]['station'][lastIndex]['_id'];

    store.save();

    navigate("/seatbooking")
  }

  return (
    <div className="main">
      <div className="navbar">
        <div className="goback">
          <Link className="goback-link" to="/">X Gå tillbaka</Link>
        </div>
      </div>
      <div className="container">
        <div className="content">

          <div className="input">
            <div className="searchText">
              <p>Sök Resa</p>
            </div>


            <input className="searchfield"
              type="search"
              placeholder="Från"
              onChange={(e) => searchFromLocations(e.target.value)}
              onFocus={() => dd_from_setIsOpen(true)}
              onBlur={() => dd_from_setIsOpen(false)}
              value={from}
            ></input>

            <div className="search-form">
              <div className={'dropdown-' + (dd_from_isOpen ? 'open' : 'closed')}>
                {locationMatch.map(location => {
                  return (
                    <a href="#" onMouseDown={() => handleFromLocation(location)} >{location}</a>
                  )
                })}
              </div>
            </div>

            {/* Från search field */}

            <input className="searchfield"
              type="search"
              placeholder="Till"
              onChange={(e) => searchToLocations(e.target.value)}
              onFocus={() => dd_to_setIsOpen(true)}
              onBlur={() => dd_to_setIsOpen(false)}
              value={to}
            ></input>

            <div className="search-form">
              <div className={'dropdown2-' + (dd_to_isOpen ? 'open' : 'closed')}>
                {locationMatch.map(location => {
                  return (
                    <a href="#" onMouseDown={() => handleToLocation(location)}>{location}</a>
                  )
                })}
              </div>
            </div>

            <input className="datefield" type="date" onChange={handleDateChange} value={dateValue}></input>

          </div>
        </div>
      </div>

      {timeTable.map(departure => {
        if (timeTable.length > 0) {

          let routeTime = getRouteTimeOffsets(departure, route[0]);

          return (<>
            <div className="departure-card" onClick={() => onClickDepCard(timeTable, route, dateValue, routeTime)} style={{ display: 'block', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', outline: "dashed 1px black", borderRadius: "1px", marginLeft: "150px", marginRight: "150px" }}>
              <h3>Från : {from} - Till : {to}</h3>
              <h3>Tid : {routeTime.arrivalTime} - Avgång : {routeTime.departTime} </h3>
              <h3>Resedatum: {dateValue}</h3>

              {route.map(item => {
                let stations = new Array();

                item.station.forEach(element => {
                  stations.push(element['stationName'] + ",");
                });


                return (<>
                  <h3>Linje {item['routeName']}</h3>
                  {/* <h3 className="departure-stations">Path : {stations}</h3> */}
                </>
                )
              })
              }

              <h3>Byten : {route.length - 1}</h3>

            </div>
          </>
          )
        }
        else {
          <h3>Inga avgångar</h3>
        }
      })
      }

      {/* Depature cards , what contains the departure elements*/}


      {/* Debug area */}
      {/* <div style={{ display: "flex", flexDirection: "column" }}>
       <h3 style={{color: "red"}}>Debug panel</h3>


        {route.map(item => 
        {
          let stations = new Array();

          item.station.forEach(element => {
            stations.push(element['stationName'] + ",");
          });

          return (<>
            <h3>Route name : {item['routeName']}</h3>
            <h3>Path : {stations}</h3>
            </>
          )
        })
        }

      </div> */}

    </div>
  )
}