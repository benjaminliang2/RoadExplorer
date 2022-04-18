function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    var chicago = new google.maps.LatLng(41.850033, -87.6500523);
    var mapOptions = {
      zoom:7,
      center: chicago
    }
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
    directionsRenderer.setMap(map);
}
  
const calcRoute= ()=> {
    var start = document.getElementById("startingPoint").value;
    var end = document.getElementById("endingPoint").value
    let pointsofinterst = [
        {location:"los angeles", stopover: true}, 
        {location:"1140 newberry lane", stopover: true},
        {location:"new york", stopover: true},
        {location:"baltimore", stopover: true}
    ]
    var request = {
      origin: start,
      destination: end,
      travelMode: 'DRIVING',
      waypoints: pointsofinterst,
      optimizeWaypoints: true
      
    };
    directionsService.route(request, function(result, status) {
      if (status == 'OK') {
        directionsRenderer.setDirections(result);
      }
    });
}
