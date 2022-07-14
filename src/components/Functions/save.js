import { useSelector } from "react-redux";
import { useEffect } from "react";

export const useSave = () => {
    const destination = useSelector((store) =>
        store.trip.destination
    )
    const origin = useSelector((store) =>
        store.trip.origin
    )
    useEffect(() => {
        //save into database
        console.log('saving into DB')
        fetch(
            'http://localhost:5000/savetrip', {
            mode: 'cors',
            credentials: 'include',
            method: "post",
            body: JSON.stringify({ origin, destination }),
            headers: {
                'Content-Type': 'application/json'
            },

        }
        )
            .then(res => res.json())
            .then(response => {
                console.log(response)
            })
    }, [origin, destination])
}