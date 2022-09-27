import { Link } from "react-router-dom";


export default function TimeTable() {
  return (
    <div className="main">
      <div className="navbartimetable">
        <div className="goback">
          <Link className="goback-link" to="/">X Gå tillbaka</Link>
        </div>
      </div>
      <div className="timetablemain">
        <div className="timetableupper">
          <div className="stationchooser">
            <select className="stationval">
              <option value="stockholm">Stockholm</option>
              <option value="goteborg">Göteborg</option>
            </select>
          </div>
          <div className="datechooser">
            <input className="dateTable" type="date"></input>
          </div>
        </div>
        <div className="timetablelower">
          <div className="timetableheader">
            <div className="headeritem">Tågnr</div>
            <div className="headeritem">Sträcka</div>
            <div className="headeritem">Avgångsdatum</div>
            <div className="headeritem">Avgångstid</div>
          </div>
        </div>
      </div>
    </div>
  )
}

