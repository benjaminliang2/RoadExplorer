import { useEffect } from "react"
import { useRef, useState } from "react"
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { add, remove } from "../../Features/tripSlice"


export const useTrip = () => {
    const start = useSelector((store) =>
        store.trip.origin
    )
    const end = useSelector((store) =>
        store.trip.destination
    )
    const businessesSelected = useSelector((store) =>
        store.trip.businessesSelected
    )
    const yelpCategory = useSelector((store) =>
        store.tripContainer.yelpCategory
    )
    const [middleman, setMiddleman] = useState([])
    const [businesses, setBusinesses] = useState(false)
    const [yelpSearchPoints, setYelpSearchPoints] = useState([])
    const controller = useRef()
    const dispatch = useDispatch()
    useEffect(() => {
        setYelpSearchPoints([start, end])
        setMiddleman([])
    }, [start, end])
    useEffect(() => {
        controller.current = new AbortController()
    }, [])
    useEffect(() => {
        const dataMap = new Map();
        middleman.forEach((res) => dataMap.set(res.id, res));
        setBusinesses(Array.from(dataMap.values()));

    }, [middleman])
    useEffect(() => {
        setMiddleman([])
        getNearbyBusinesses(yelpSearchPoints, yelpCategory)
    }, [yelpCategory])
    useEffect(() => {
        getNearbyBusinesses(yelpSearchPoints, yelpCategory)
    }, [yelpSearchPoints])

    // useEffect(() => {
    //     console.log(businesses)
    // }, [businesses])

    const getMidpoints = (directions) => {
        if (!directions) {
            return []
        }
        let miles = 0
        let midpoints = []
        //70,000meters < 50 miles. 
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
        if(midpoints.length > 0){
            setYelpSearchPoints((prevState) => [...prevState, ...midpoints])

        }

        return midpoints

    }
    //TODO refactor this logic into the tripSlice
    const addToTrip = (coordinates, name, yelpID, image) => {
        if (businessesSelected.some(business => business.id === yelpID) === false) {
            dispatch(add({ name: name, id: yelpID, coordinates: coordinates, image_url: image }))
        }
    }
    const removeFromTrip = (yelpID) => {
        const updatedBusSelected = businessesSelected.filter((business) => business.id !== yelpID)
        dispatch(remove(updatedBusSelected))


    }
    //TODO can this be improved? 
    const getNearbyBusinesses = async (points, searchCategory) => {
        controller.current.abort();
        // points.forEach(async (point) => {
        controller.current = new AbortController()
        let signal = controller.current.signal;
        // console.log("fetching hikes")
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

    const getCustomBusinesses = async (name, lat, lng) => {
        const response = await fetch('http://localhost:5000/category/' + lat + "/" + lng + '/' + name)
        const result = await response.json();
        setMiddleman([...result.businesses])
    }


    return { getMidpoints, addToTrip, removeFromTrip, getNearbyBusinesses, getCustomBusinesses, businesses, middleman, yelpSearchPoints }
}