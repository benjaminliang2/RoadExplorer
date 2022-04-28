import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker, Circle, DirectionsRenderer, DirectionsService } from "@react-google-maps/api";
import {SearchPlaces} from "./TripView/Places"
import { Businesses} from "./BusinessesView/businesses"
import { TripView } from "./TripView/Trip_View"
import { InfoModal } from "./InfoModal"
import "./styles.css"
/*global google*/
const libraries = ["places"]


export const MapComponent = ()=>{

  const {isLoaded} = useLoadScript({
    googleMapsApiKey:process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  })
  const center = useMemo(()=>({lat: 44, lng:-80 }), []);
  const mapRef = useRef();
  const waypoint_order = useRef();
  const options = useMemo(()=>({
    disableDefaultUI: true,
    clickableIcons: false
  }), [])
  const onMapLoad = useCallback((map)=>{
    mapRef.current = map;
  }, [])

  const [start, setStart] = useState(null)
  const [end, setEnd] = useState(null)
  const [yelpSearchPoints, setYelpSearchPoints] = useState([])
  const [directions, setDirections] = useState(null)
  const [middleman, setMiddleman] = useState([]);
  const [hikes, setHikes] = useState([])
  const [waypoints, setWaypoints] = useState();
  const [waypointsSelected, setWaypointsSelected] = useState([])
  const [googleWaypoints, setGoogleWaypoints] = useState([])
  const [activeMarker, setActiveMarker] = useState({id: 'none'})
  const [selectedMarker, setSelectedMarker] = useState(false)
  const isMounted = useRef(false)

  
  
useEffect(()=>{
  if (isMounted.current) {
    getNearbyHikes(yelpSearchPoints)
  } 
},[yelpSearchPoints])

useEffect(()=>{
  //if user changes origin or destination, then reset everything. 
  if (isMounted.current) {
    setYelpSearchPoints([start, end])
    setMiddleman([])
    setHikes([])
    setWaypointsSelected([])
    setGoogleWaypoints([])
  }
},[start, end])

useEffect(()=>{
  if (isMounted.current) {
      generateCoordinatesBetweenStartEnd()
  }
}, [directions])

useEffect(()=>{ 
  if (isMounted.current) {
    const dataMap = new Map();
    middleman.forEach((res) => dataMap.set(res.id, res));
    setHikes(Array.from(dataMap.values()));
  }
}, [middleman])



useEffect(()=>{
  if (isMounted.current) {
    fetchDirections()
  }
},[googleWaypoints])

useEffect(()=>{ 
  if (isMounted.current && waypointsSelected.length > 0) {
    const temp= []
    waypointsSelected.map((waypoint) => {
      temp.push({location: {lat: waypoint.coordinates.latitude, lng: waypoint.coordinates.longitude}})
    })
    console.log(temp)
    setGoogleWaypoints(temp)
  }

}, [waypointsSelected])

useEffect(()=>{
  isMounted.current = true;
},[])
// useEffect(()=>{
//   console.log("markers length = " + markers.length)
// }, [markers])

  // const onMapClick = useCallback((event)=>{
  //   setMarkers((prevState) => [...prevState, 
  //     {
  //       lat: event.latLng.lat(),
  //       lng: event.latLng.lng(),
  //       time: new Date()
  //     }
  //   ])
  // },[])


  

  // const pan = (position)=>{
  //   setOffice(position)
  //   mapRef.current.panTo(position)
  //   mapRef.current.setZoom(15)
  // }


  
   const getNearbyHikes = (points)=>{
    points.forEach(async (point) =>{
      if(point){
        const {lat, lng} = point.coordinates
        const response = await fetch('http://localhost:5000/' + lat + "/" + lng)
        const result = await response.json();
        setMiddleman((prevState) => [...prevState, ...result.businesses])
      }
    })
  }

  const fetchDirections = ()=>{  
    if(!start || !end) return     
    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: start.coordinates,
        destination: end.coordinates,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: googleWaypoints,
        optimizeWaypoints: true
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
          waypoint_order.current = result.routes[0].waypoint_order;
          sortWaypoints();
        }
      }
    );
  }

  const sortWaypoints = ()=>{
    const optimizedRoute = waypoint_order.current.map(index =>waypointsSelected[index])
    setWaypoints(optimizedRoute)   
  }

  const generateCoordinatesBetweenStartEnd =()=>{
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
              
              midpoints.push({coordinates:steps[i].path[Math.floor(pathIndex)].toJSON()})
              miles -= diameter;
              count +=1
        }
        count = 1;
      }
      if(midpoints.length>0){
        setYelpSearchPoints((prevState) => [...prevState, ...midpoints] )
      }
      

      // DEBUGGER:set markers below will show the COORD or coordinates of interest between start and end 
      // setMarkers((prevState) =>[...prevState, ...midpoints])
      // console.log(midpoints.length)
    }
  }

const addToTrip= (coordinates, title, yelpID, image)=>{
  //check if the place is already added to waypoints
  if(waypointsSelected.some(waypoint => waypoint.yelp_id === yelpID)){
  } else {
    setWaypointsSelected((waypoints)=>[...waypoints, {name:title, yelp_id:yelpID, coordinates:coordinates, imgURL:image}])

  }
}
const removeFromTrip = (yelpID) =>{
  //remove waypoint
  console.log(waypointsSelected)
  const newWaypoints = waypointsSelected.filter((waypoint)=>waypoint.yelp_id !== yelpID)
  setWaypointsSelected(newWaypoints)

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
        <button onClick={sortWaypoints}> sort waypoints </button>

        <h4>Route Detail View</h4>

        {(directions && 
          <TripView
            start={start}
            end={end}
            waypoints = {waypoints}
            directions = {directions}

          />)}
      </div>

      {hikes.length>0 && (
          <Businesses
            hikes = {hikes}
            addToTrip = {addToTrip}
            setActiveMarker = {setActiveMarker}
          />          
      )}

      {selectedMarker && (
          <InfoModal
            selectedBusiness = {selectedMarker}
            setSelectedMarker= {setSelectedMarker}
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
        

        {hikes.map(hike =>
          <Marker 
          
            position={{lat: hike.coordinates.latitude, lng: hike.coordinates.longitude}}
            icon = {
              { url:"https://static.thenounproject.com/png/29961-200.png",
                scaledSize : new google.maps.Size(50,50)
              }
            } 
            
            animation={ 
              (activeMarker.id === hike.id
                ? 1 : undefined)
            }       
            onClick={()=>{setSelectedMarker(hike)}}
            // onClick={()=>{console.log(hike)}}

          />
        )}

        {/* {hikes.map(hike =>{
          const marker = new google.maps.Marker({
            map: mapRef.current,
            animation: google.maps.Animation.DROP,
            position: {lat: hike.coordinates.latitude, lng: hike.coordinates.longitude},
          })
          const listener = google.maps.event.addListener(marker, 'click', function () {
            // do something with this marker ...
            console.log(listener)
          });
        })} */}
        
        </GoogleMap>
      </div>
    </div>

  </>
}
