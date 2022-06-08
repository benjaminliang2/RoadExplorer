import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker, Circle, DirectionsRenderer, DirectionsService } from "@react-google-maps/api";
import { SearchBox, TripTitle } from "./components/TripView/Places"
import { Businesses } from "./components/BusinessesView/businesses"
import { TripView } from "./components/TripView/Trip_View"
import { InfoModal } from "./components/InfoModal/InfoModal"
import { WelcomeModal } from "./components/WelcomeModal/WelcomeModal";
import "./styles.css"
import { Category } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
/*global google*/
const libraries = ["places"]


export const MapComponent = () => {

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  })
  const center = useMemo(() => ({ lat: 44, lng: -80 }), []);
  const mapRef = useRef();
  const controller = useRef()
  const waypoint_order = useRef();
  const options = useMemo(() => ({
    mapId: 'e9159de94dc8cc93',
    disableDefaultUI: true,
    clickableIcons: false,
    minZoom: 3.5
  }), [])
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, [])

  const start = useSelector((randomname) =>
    randomname.originDestination.origin
  )
  const end = useSelector((configureStore) =>
    configureStore.originDestination.destination
  )

  const [showEditTripModal, setShowEditTripModal] = useState(false)
  const [directions, setDirections] = useState(null)
  const [searchCategory, setSearchCategory] = useState('tourist')
  const [yelpSearchPoints, setYelpSearchPoints] = useState([])
  const [middleman, setMiddleman] = useState([]);
  const [hikes, setHikes] = useState(null)
  const [waypoints, setWaypoints] = useState();
  const [waypointsSelected, setWaypointsSelected] = useState([])
  const [googleWaypoints, setGoogleWaypoints] = useState([])
  const [activeMarker, setActiveMarker] = useState({ id: 'none' })
  const [selectedMarker, setSelectedMarker] = useState(false)
  const isMounted = useRef(false)
  
  useEffect(() => {
    if (isMounted.current) {
      getNearbyHikes(yelpSearchPoints)
    }
  }, [yelpSearchPoints])

  useEffect(() => {
    //if user changes origin or destination, then reset everything. 
    if (isMounted.current) {
      setYelpSearchPoints([start, end])
      setMiddleman([])
      setWaypointsSelected([])
      setGoogleWaypoints([])
    }
  }, [start, end])

  useEffect(() => {
    if (isMounted.current) {
      generateCoordinatesBetweenStartEnd()
    }
  }, [directions])

  useEffect(() => {
    if (isMounted.current) {
      const dataMap = new Map();
      middleman.forEach((res) => dataMap.set(res.id, res));
      setHikes(Array.from(dataMap.values()));
    }
  }, [middleman])

  // useEffect(() => {
  //   // console.log(hikes)
  // }, [hikes])

  useEffect(() => {
    if (isMounted.current) {
      fetchDirections()
    }
  }, [googleWaypoints])

  useEffect(() => {
    if (isMounted.current) {
      if (waypointsSelected.length > 0) {
        const temp = []
        waypointsSelected.map((waypoint) => {
          temp.push({ location: { lat: waypoint.coordinates.latitude, lng: waypoint.coordinates.longitude } })
        })
        console.log(temp)
        setGoogleWaypoints(temp)
      } else {
        setGoogleWaypoints([])
      }

    }

  }, [waypointsSelected])
  useEffect(() => {
    if (isMounted.current) {
      console.log(searchCategory)
      setMiddleman([])
      getNearbyHikes(yelpSearchPoints)
    }
  }, [searchCategory])

  useEffect(() => {
    isMounted.current = true;
    controller.current = new AbortController();
  }, [])


  const panTo = (position) => {
    mapRef.current.panTo(position)
    mapRef.current.setZoom(15)
  }


  const getNearbyHikes = async (points) => {
    controller.current.abort();
    // points.forEach(async (point) => {
    controller.current = new AbortController()
    let signal = controller.current.signal;
    console.log("fetching hikes")
    for (let point of points) {
      if (point) {
        const { lat, lng } = point.coordinates
        const response = await fetch('http://localhost:5000/category/' + lat + "/" + lng + '/' + searchCategory, { signal })
        const result = await response.json();
        setMiddleman((prevState) => [...prevState, ...result.businesses])
        // controller.abort()
      }
    }
  }

  const getCustomResults = async (name, lat, lng) => {
    console.log("getting custom search results")
    const response = await fetch('http://localhost:5000/category/' + lat + "/" + lng + '/' + name)
    const result = await response.json();
    setMiddleman([...result.businesses])

  }



  const fetchDirections = () => {
    if (!start || !end) return
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

  const sortWaypoints = () => {
    const optimizedRoute = waypoint_order.current.map(index => waypointsSelected[index])
    console.log("optimized routing", optimizedRoute)
    setWaypoints(optimizedRoute)
  }

  const generateCoordinatesBetweenStartEnd = () => {
    if (directions) {
      let miles = 0
      let midpoints = []
      //70000meters < 50 miles. 
      const diameter = 70000
      const steps = directions.routes[0].legs[0].steps


      for (let i = 0; i < steps.length; i += 1) {
        miles += steps[i].distance.value;
        let count = 1;
        const temp = miles
        while (miles > diameter) {

          let currentStepMiles = steps[i].distance.value;
          let prevRemainingStepMiles = temp - currentStepMiles;
          let factor = (diameter * count - prevRemainingStepMiles) / currentStepMiles;
          let pathIndex = steps[i].path.length * factor;

          midpoints.push({ coordinates: steps[i].path[Math.floor(pathIndex)].toJSON() })
          miles -= diameter;
          count += 1
        }
        count = 1;
      }
      if (midpoints.length > 0) {
        setYelpSearchPoints((prevState) => [...prevState, ...midpoints])
      }


      // DEBUGGER:set markers below will show the COORD or coordinates of interest between start and end 
      // setMarkers((prevState) =>[...prevState, ...midpoints])
      // console.log(midpoints.length)
    }
  }

  const addToTrip = (coordinates, title, yelpID, image) => {
    //check if the place is already added to waypoints
    if (waypointsSelected.some(waypoint => waypoint.yelp_id === yelpID)) {
    } else {
      setWaypointsSelected((selectedWaypoints) => [...selectedWaypoints, { name: title, yelp_id: yelpID, coordinates: coordinates, imgURL: image }])

    }
  }
  const removeFromTrip = (yelpID) => {
    //remove waypoint
    console.log(waypointsSelected)
    const newWaypoints = waypointsSelected.filter((waypoint) => waypoint.yelp_id !== yelpID)
    setWaypointsSelected(newWaypoints)

  }



  if (!isLoaded) return <div>Loading...</div>

  return <>
    {selectedMarker && (
      <InfoModal
        selectedBusiness={selectedMarker}
        setSelectedMarker={setSelectedMarker}
        addToTrip={addToTrip}
      />
    )}


    {isLoaded && <WelcomeModal setShow={setShowEditTripModal} />}
    {showEditTripModal && <WelcomeModal setShow={setShowEditTripModal} />}


    <div className="container">
      <div className="controls">
        <TripTitle setShowModal={setShowEditTripModal} />

        {(directions &&
          <>
            <h4>Trip Summary</h4>
            <TripView
              start={start}
              end={end}
              waypoints={waypoints}
              directions={directions}
              removeFromTrip={removeFromTrip}
              hikes={hikes}

            />
          </>)}
      </div>

      {hikes && (
        <Businesses
          hikes={hikes}
          addToTrip={addToTrip}
          setSearchCategory={setSearchCategory}
          setActiveMarker={setActiveMarker}
          panTo={panTo}
          getCustomResults={getCustomResults}
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
                directions={directions}
                options={
                  {
                    polylineOptions: {
                      zIndex: 50
                    }
                  }
                }
              />
            </>
          )}

          {hikes && (
            hikes.map((hike, index) =>
              <Marker

                position={{ lat: hike.coordinates.latitude, lng: hike.coordinates.longitude }}
                // icon={
                //   {
                //     url: "https://static.thenounproject.com/png/29961-200.png",
                //     scaledSize: new google.maps.Size(50, 50)
                //   }
                // }
                label={(index + 1).toString()}
                animation={
                  (activeMarker.id === hike.id
                    ? 1 : undefined)
                }
                onClick={() => { setSelectedMarker(hike) }}
              // onClick={()=>{console.log(hike)}}

              />
            )
          )}

        </GoogleMap>
      </div>
    </div>

  </>
}
