import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker, Circle, DirectionsRenderer, DirectionsService } from "@react-google-maps/api";
import {SearchPlaces} from "./places"
import {Distance} from "./distance"
import { Businesses} from "./BusinessesResults/businesses"
import { RouteView } from "./RouteView/Route_View";
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
  // console.log(yelpSearchPoints)
},[yelpSearchPoints])

useEffect(()=>{
  //if user changes origin or destination, then reset everything. 
  setYelpSearchPoints([start, end ])
  setHikes([])
  setMarkers([])
  setWaypoints([])
  setGoogleWaypoints([])

  console.log(yelpSearchPoints)

},[start, end])

useEffect(()=>{
  generateCoordinatesBetweenStartEnd()
}, [directions])

useEffect(()=>{
  // showHikes()
  console.log(hikes.length)
},[hikes])

useEffect(()=>{
  fetchDirections()
},[googleWaypoints])

useEffect(()=>{ 
  const temp= []
  waypoints?.map((waypoint) => {
    temp.push({location: {lat: waypoint.coordinates.latitude, lng: waypoint.coordinates.longitude}})
  })
  console.log(temp)
  setGoogleWaypoints(temp)
}, [waypoints])

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

  const showHikes = ()=>{
    if(hikes.length === 0 ){
      console.log("hikes array is empty.")
    }
    console.log(hikes.length)
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
    let businessesResults = []
    const results = await Promise.all(yelpSearchPoints.map(async point => {
      const {lat, lng} = point.coordinates;
      const resp = await fetch ('http://localhost:5000/' + lat + "/" + lng);

      return resp.json();
    }));
    results.forEach((result)=>{
      businessesResults.push(...result.businesses)

    })

    console.log(businessesResults)
    checkForDuplicateBusiness(businessesResults) 

  }



  const checkForDuplicateBusiness = (businessArray)=>{
    let noDuplicates = []
    businessArray.forEach(singleBusiness=>{
      if(!noDuplicates.some(each => each.id === singleBusiness.id)){
        noDuplicates = [...noDuplicates, singleBusiness]
      }
    })
    console.log(noDuplicates)
    setHikes(noDuplicates)
  }

  // const checkForDuplicateBusiness = (businessArray) => {
  //   const dataMap = new Map();
  //   hikes.concat(businessArray).forEach((res) => dataMap.set(res.id, res));
  //   // setHikes(Array.from(dataMap.values()));
  //   console.log(Array.from(dataMap.values()))
  // };


  const fetchDirections = ()=>{  
    if(!start || !end) return     
    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: start.coordinates,
        destination: end.coordinates,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: googleWaypoints,
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
      //right now, if i were to the yelpsearchpoints would include points from the first route and and routes after that
      setYelpSearchPoints((prevState) => [...prevState, ...midpoints] )

// DEBUGGER:set markers below will show the COORD or coordinates of interest between start and end 
      // setMarkers((prevState) =>[...prevState, ...midpoints])
      // console.log(midpoints.length)
    }
  }

const addToTrip=(isChecked, coordinates, title, yelpID)=>{
  if(isChecked){
    //check if the place is already added to waypoints
    console.log(waypoints)
    setWaypoints((waypoints)=>[...waypoints, {name:title, yelp_id:yelpID, coordinates:coordinates}])
  } else if(!isChecked){
    const newWaypoints = waypoints.filter((waypoint)=>waypoint.yelp_id !== yelpID)
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
            
            hikes = {hikes}
            addToTrip = {addToTrip}


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
