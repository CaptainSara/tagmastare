import { Link } from "react-router-dom";

function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

export default function TimeTable() {
  return (
    <div className="main">
      <div className="navbar">
        <div className="goback">
          <Link className="goback-link" to="/">X Gå tillbaka</Link>
        </div>
      </div>
      <div className="timetablemain">
        <div className="timetableupper">
          <div className="stationchooser">
            <button onclick="myFunction()" className="stationchooserdropdown">Välj Avgångsstation</button>
            <div id="myDropdown" class="dropdown-content">
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          <div className="datechooser">

          </div>
        </div>
        <div className="timetablelower">

        </div>
      </div>
    </div>
  )
}

