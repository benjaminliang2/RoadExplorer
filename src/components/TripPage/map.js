import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { debounce, throttle } from 'lodash';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { setTripId, setWaypoints } from "../../Features/tripSlice";
import { useTrip } from './useTrip'

import { TripContainer } from "./TripContainer/TripContainer"
import { InfoModal } from "./InfoModal/InfoModal"
import { Navbar } from "../Navbar";
//styles.css required for google map rendering. 
import "../../styles/styles.css"
/*global google*/
import { Box } from "@mui/material";
import { setView } from "../../Features/tripContainerSlice";

const libraries = ["places"];

export const MapComponent = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  //tripId should always be defined
  let { tripId } = useParams();

  useEffect(() => {
    if (tripId === undefined) {
      dispatch(setView('create'))
      console.log('path is just /trip');
    } else {
      dispatch(setTripId(tripId))
      console.log('dispatching settripid')
    }
  }, [tripId])

  const { getMidpoints, addToTrip, getCustomBusinesses, businesses } = useTrip();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  })
  const center = useMemo(() => ({ lat: 44, lng: -80 }), []);
  const mapRef = useRef();
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

  const start = useSelector((store) => store.trip.origin)
  const end = useSelector((store) => store.trip.destination)
  const businessesSelected = useSelector((store) => store.trip.businessesSelected)
  const tripid2 = useSelector((store) => store.trip._id)
  const [directions, setDirections] = useState(null)
  const [googleWaypoints, setGoogleWaypoints] = useState([])
  const [activeMarker, setActiveMarker] = useState({ id: 'none' })
  const [selectedMarker, setSelectedMarker] = useState(false)
  const isMounted = useRef(false)

  useEffect(() => {
    if (isMounted.current) {
      navigate(`/trip/${tripid2}`)
    }
  }, [tripid2])

  useEffect(() => {
    getMidpoints(directions)
  }, [directions])

  useEffect(() => {
    const temp = []
    if (isMounted.current == true) {
      businessesSelected.forEach((business) => {
        temp.push({ location: { lat: business.coordinates.latitude, lng: business.coordinates.longitude } })
      })
      setGoogleWaypoints(temp)
      console.log(temp)
    }

  }, [businessesSelected])

  // const service = useMemo(() => new google.maps.DirectionsService(), [])

  const debouncedFetchDirections = useCallback(debounce(
    (s, e, w, bus) => {
      console.log("once")
      const service = new google.maps.DirectionsService()
      service.route(
        {
          origin: s.coordinates,
          destination: e.coordinates,
          travelMode: google.maps.TravelMode.DRIVING,
          waypoints: w,
          optimizeWaypoints: true
        },
        (result, status) => {
          if (status === "OK" && result) {
            setDirections(result);
            waypoint_order.current = result.routes[0].waypoint_order;
            const optimizedRoute = waypoint_order.current.map(index => bus[index])
            dispatch(setWaypoints(optimizedRoute))

          }
        }
      );
    },
    100),
    []
  );

  useEffect(() => {
    if (start && end) {
      debouncedFetchDirections(start, end, googleWaypoints, businessesSelected);
    }
  }, [start, end, googleWaypoints])



  useEffect(() => {
    isMounted.current = true;
    console.log('component has mounted')
    return () => console.log("component unmounted")
  }, [])

  const panTo = (position) => {
    mapRef.current.panTo(position)
    mapRef.current.setZoom(15)
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


    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box>
        <Navbar />
      </Box>
      <Box sx={{ width: '100%', height: '100%', postiion: 'relative' }}>

        <GoogleMap
          zoom={10}
          center={center}
          mapContainerClassName="map-container"
          options={options}
          // onClick={onMapClick}
          onLoad={onMapLoad}
        >
          <Box sx={{
            position: 'absolute', height: '100%', margin: '15px', borderRadius: '25px',
            ['@media screen and (max-width: 767.9)']: { // eslint-disable-line no-useless-computed-key
              position: 'relative'
            }
          }}>

            <TripContainer
              start={start}
              end={end}
              businesses={businesses}
              directions={directions}
              setActiveMarker={setActiveMarker}
              panTo={panTo}
              getCustomBusinesses={getCustomBusinesses}
            />
          </Box>
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

          {businesses && (
            businesses.map((hike, index) =>
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
                key={index}
              />
            )
          )}
        </GoogleMap>
      </Box>
    </Box>
  </>
}


