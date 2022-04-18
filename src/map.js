import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker, Circle, DirectionsRenderer, DirectionsService } from "@react-google-maps/api";
import {StartPlaces, EndPlaces} from "./places"
import {Distance} from "./distance"
import "./styles.css"
/*global google*/
const libraries = ["places"]
export const Map = ()=>{

  const {isLoaded} = useLoadScript({
    googleMapsApiKey:process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  })
  const center = useMemo(()=>({lat: 44, lng:-80 }), []);
  const mapRef = useRef();
  const options = useMemo(()=>({
    disableDefaultUI: true,
    clickableIcons: false
  }), [])
  const onMapLoad = useCallback((map)=>{
    mapRef.current = map;
    console.log("map should only render once")
  }, [])

  const [start, setStart] = useState(null)
  const [end, setEnd] = useState(null)
  const [coordinatesOfInterest, setCoordinatesOfInterest] = useState([])
  const [directions, setDirections] = useState(null)
  const [hikes, setHikes] = useState([])
  const [markers, setMarkers] = useState([])
  // const [milesDriven, setMilesDriven] = useState(0)
  
useEffect(()=>{
  getNearbyHikes()
},[coordinatesOfInterest])

useEffect(()=>{
  generateCoordinatesBetweenStartEnd()
}, [directions])

useEffect(()=>{
  showHikes()
},[hikes])

  // const onMapClick = useCallback((event)=>{
  //   setMarkers((prevState) => [...prevState, 
  //     {
  //       lat: event.latLng.lat(),
  //       lng: event.latLng.lng(),
  //       time: new Date()
  //     }
  //   ])
  // },[])

  const showHikes = ()=>{
    if(hikes.length === 0 ){
      console.log("hikes array ios empty.")
    }
    hikes.map((hike)=>{
      setMarkers((prevState) =>[...prevState,
        {
          lat: hike.coordinates.latitude,
          lng: hike.coordinates.longitude,
          time: new Date()
        }

      ])

    })
  }

  

  // const pan = (position)=>{
  //   setOffice(position)
  //   mapRef.current.panTo(position)
  //   mapRef.current.setZoom(15)
  // }

  const getNearbyHikes = async ()=>{
    console.log("get nearby hikes")
    coordinatesOfInterest.forEach(async (coordinate) =>{
      const {lat, lng} = coordinate
      await fetch ('http://localhost:5000/' + lat + "/" + lng)
      .then(res => {
          // console.log(res)
          return (res.json())
      })
      .then(res => {
          // console.log(hikes)
          setHikes((hikes) => [...hikes, ...res.businesses])
          // setHikes({hikes: [...hikes, ...res.businesses]}, ()=>{ console.log(hikes)})
  
      })
    })
 

  }

  const fetchDirections = ()=>{  
    if(!start || !end) return     
    
    setCoordinatesOfInterest((coordinatesOfInterest) => [...coordinatesOfInterest, start, end ] )
    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        }
      }
    );
  }

  const generateCoordinatesBetweenStartEnd = ()=>{
    // console.log(directions.routes[0].overview_path[50].toJSON())
    // console.log(directions.routes[0].overview_path[100].toJSON())

    // console.log(directions.routes[0].overview_path.length)
  
    if(directions){
      let miles = 0
      let distanceTraveled = 0
      let midpoints = []
      //70000meters < 50 miles. 
      const diameter = 70000
      const steps = directions.routes[0].legs[0].steps


      for(let i = 0; i < steps.length; i += 1){
          miles += steps[i].distance.value;
          let count = 1;
          const temp = miles
          while(miles > diameter){
            
              let currentStepMiles = steps[i].distance.value;
              let prevRemainingStepMiles = temp - currentStepMiles;
              let factor = (diameter * count - prevRemainingStepMiles)/ currentStepMiles;
              let pathIndex = steps[i].path.length * factor; 
              // console.log("prevRemainder =" + prevRemainingStepMiles)
              // console.log(steps[i].path.length +'...' + pathIndex)
              
              midpoints.push(steps[i].path[Math.floor(pathIndex)].toJSON())
              miles -= diameter;
              count +=1

        
        }
        count = 1;
      }
      setCoordinatesOfInterest((coordinatesOfInterest) => [...coordinatesOfInterest, ...midpoints] )

// DEBUGGER:set markers below will show the COORD or coordinates of interest between start and end 
      // setMarkers((prevState) =>[...prevState, ...midpoints])
      // console.log(midpoints.length)


      
      // console.log(directions.routes[0].legs[0].steps[6].path.length)
      // console.log(directions.routes[0].legs[0].steps[6].distance.value)
      // console.log(directions.routes[0].legs[0].steps[6].instructions)
      // console.log(directions.routes[0].legs[0].steps[5].path[23].toJSON())
    }



  }


  if(!isLoaded) return <div>Loading...</div>
  
    return<>
    
    <div className="container">
      <div className="controls">
        <h1>Commute Controls</h1>
        <StartPlaces
           setStart = {setStart}
        />
        <EndPlaces
          setEnd = {setEnd}
        />
        <button onClick={fetchDirections}> Fetch  directions </button>
        <button onClick={showHikes}> Show Hikes </button>
      </div>


      {directions && (
        <>
        {/* the routes array is multiple different ways to travel from A to B */}
        <Distance leg={directions.routes[0].legs[0]}/>
        </>
      )}


      <div className="map">
        <GoogleMap 
          zoom={10} 
          center={center} 
          mapContainerClassName="map-container" 
          options={options}
          // onClick={onMapClick}
          onLoad={onMapLoad}
        >  

        {directions && (
          <>
          <DirectionsRenderer
            directions = {directions}
            options={
              {polylineOptions: {
                zIndex:50
                }
              }
            }
          />
          </>
        )}

{/* 
        {office && (
          <>
          <Marker position= {office}/>
          <Circle center={office} radius={10000} options={closeOptions}/>
          <Circle center={office} radius={30000} options={middleOptions}/>
          <Circle center={office} radius={45000} options={farOptions}/>

          </>
        )} */}
        

        {markers.map(marker =>
          <Marker 
          
            position={{lat: marker.lat, lng: marker.lng}}
            icon = {
              { url:"https://static.thenounproject.com/png/29961-200.png",
                scaledSize : new google.maps.Size(50,50)
              }
            } 
            onClick={()=>{console.log("you clicked a marker")}}
          />
        )}
        
        </GoogleMap>
      </div>
    </div>

  </>
}

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};
const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};
const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.05,
  strokeColor: "#FBC02D",
  fillColor: "#FBC02D",
};
const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: "#FF5252",
  fillColor: "#FF5252",
};
