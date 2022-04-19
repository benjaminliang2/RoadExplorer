import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker, Circle, DirectionsRenderer, DirectionsService } from "@react-google-maps/api";
import {SearchPlaces} from "./places"
import {Distance} from "./distance"
import { Businesses} from "./BusinessesResults/businesses"
import { RouteView } from "./RouteView/Route_View";
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
  const [yelpSearchPoints, setYelpSearchPoints] = useState([])
  const [directions, setDirections] = useState(null)
  const [hikes, setHikes] = useState([])
  const [markers, setMarkers] = useState([])
  const [googleWaypoints, setGoogleWaypoints] = useState([])
  const [waypoints, setWaypoints] = useState([])
  // const [milesDriven, setMilesDriven] = useState(0)
  
useEffect(()=>{
  getNearbyHikes()
  console.log(yelpSearchPoints)
},[yelpSearchPoints])

useEffect(()=>{
  generateCoordinatesBetweenStartEnd()
}, [directions])

useEffect(()=>{
  showHikes()
},[hikes])

useEffect(()=>{
  fetchDirections()
},[googleWaypoints])

useEffect(()=>{ 
  const temp= []
  waypoints?.map((waypoint) => {
    temp.push({location: {lat: waypoint.coordinates.latitude, lng: waypoint.coordinates.longitude}})
  })
  setGoogleWaypoints(temp)
}, [waypoints])

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
      console.log("hikes array is empty.")
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
    console.log(yelpSearchPoints)
    yelpSearchPoints.forEach(async (point) =>{
      const {lat, lng} = point.coordinates
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

    setYelpSearchPoints((prevState) => [...prevState, start, end ] )
    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: start.coordinates,
        destination: end.coordinates,
        travelMode: google.maps.TravelMode.DRIVING,
        // waypoints: googleWaypoints,
        // optimizeWaypoints: true
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
              
              midpoints.push({coordinates:steps[i].path[Math.floor(pathIndex)].toJSON()})
              miles -= diameter;
              count +=1

        
        }
        count = 1;
      }
      setYelpSearchPoints((intermediatePoints) => [...intermediatePoints, ...midpoints] )

// DEBUGGER:set markers below will show the COORD or coordinates of interest between start and end 
      // setMarkers((prevState) =>[...prevState, ...midpoints])
      // console.log(midpoints.length)
    }
  }

const addToTrip=(isChecked, coordinates, title, yelpID)=>{
  if(isChecked){
    setWaypoints((waypoints)=>[...waypoints, {name:title, yelp_id:yelpID, coordinates:coordinates}])
  } else if(!isChecked){
    const newWaypoints = (yelpID)=>{
      waypoints.filter((waypoint)=>waypoint.yelp_id !== yelpID)
    }
    setWaypoints(newWaypoints)
  }


  // setGoogleWaypoints((waypoints) =>[...waypoints, {location: {lat: coordinates.latitude, lng: coordinates.longitude}}]);  
}

 
  if(!isLoaded) return <div>Loading...</div>
  
    return<>
    
    <div className="container">
      <div className="controls">
        <h1>Route Controls</h1>
        
        <SearchPlaces

        setStart={setStart}
        setEnd={setEnd}
        />
        <button onClick={fetchDirections}> Fetch  directions </button>
        <button onClick={showHikes}> Show Hikes </button>
        {directions && (
        <>
        {/* the routes array is multiple different ways to travel from A to B */}
        <Distance leg={directions.routes[0].legs[0]}/>
        </>
        )}
          <h4>Route Detail View</h4>

        {(directions && 
          <RouteView
            start={start}
            end={end}
            waypoints = {waypoints}

          />)}
      </div>

      {hikes.length>0 && (
          <Businesses
            img = {hikes[0].image_url}
            title = {hikes[0].name}
            location = {hikes[0].location.address1}
            description = {hikes[0].categories[0].title}
            star = {hikes[0].rating}
            reviewCount = {hikes[0].review_count}
            addToTrip = {addToTrip}
            coordinates= {hikes[0].coordinates}
            yelpID = {hikes[0].id}
            

          />
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
