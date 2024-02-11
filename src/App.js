import './App.css';
import { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const APIKEY = process.env.APIKEY;

function App() {
  const [state, setState] = useState({
    query: '',
    searching: false,
    data: null,
    searched: '',
    position: [51.505, -0.09],
    showing: false
  });

  const getWeatherData = async (query) => {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${APIKEY}`);        

    setState(prevState => ({
      ...prevState,
      data: response.data,
      position: [response.data.coord.lat, response.data.coord.lon],
      showing: true
    }));
  }

  const search = () => {
    setState({
      ...state,
      searching: true
    });
  }

  const changePlace = async (event) => {
    setState({
      ...state,
      query: event.target.value
    });
  }

  const confirmSearch = async () => {
    if (state.searching && state.query !== '') {
      await getWeatherData(state.query);
      setState(prevState => ({
        ...prevState,
        searched: prevState.query
      }));
    }
  }

  return (
    <>
      <MapContainer key={state.position.join(',')} center={state.position} zoom={5} scrollWheelZoom={false} dragging={false} zoomControl={false} style={{ height: '100vh', position: 'relative', zIndex: 0 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />       
      </MapContainer>
    
      <div>
        <nav className='container'>
          <div className='centered options'>

            <div className='centered location whiteContainer'>
              <i className="bi bi-geo-alt-fill"></i>
              <p>{state.searched || 'Location'}</p>
            </div>

            <div className='search centered whiteContainer' onClick={search}>            
              <input type='text' placeholder='Somewhere' onInput={(e) => changePlace(e)}></input>
              <i className="bi bi-search" onClick={confirmSearch}></i>
            </div>
          </div>
        </nav>

        {state.data && (
          <div className='weatherData'>           
            {
              state.showing && (
                <div className='data'>
                  <div>
                    <i class="bi bi-thermometer-half"></i>
                    <p>{Math.round(state.data.main.temp - 273)} °C</p>
                  </div>

                  <div>
                    <i class="bi bi-droplet-half"></i>
                    <p>{Math.round(state.data.main.humidity)}</p>
                  </div>     

                  <div>
                    <i class="bi bi-wind"></i>
                    <p>{state.data.wind.speed} km/h</p>
                  </div>                    
                </div>
              )
            }
          </div>
        )}       
      </div>
    </>
  );
}

export default App;
