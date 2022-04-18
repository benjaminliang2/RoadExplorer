export const Distance = ({leg})=>{
    if(!leg.distance || !leg.duration) return null

    return(<>
    <h1>{leg.distance.value*3/5000} Miles</h1>
    <h1>{leg.duration.value / 60}</h1>
    </>)
}