// const apiKey="AIzaSyCdYKL5a3qqZBMphKPEIEZYQml02Qs8hLQ"
// module.exports = async (address) => {
//     const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);
//     const data = await response.json();

//     if (data.status === 'OK') {
//         const location = data.results[0].geometry.location;
//         console.log(`Latitude: ${location.lat}, Longitude: ${location.lng}`);
//         return location;
//     } else {
//         console.error('Geocoding failed:', data.status,data.error_message);
//         return null;
//     }
// };


// module.exports=async (address)=> {
//     const query = encodeURIComponent(address); // Encode the address for use in a URL

//     const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
//     const data = await response.json();
    
//     if (data.length > 0) {
//         const location = data[0];
//         console.log(`Latitude: ${location.lat}, Longitude: ${location.lon}`);
//         return { lat: location.lat, lon: location.lon };
//     } else {
//         console.error('No location found');
//         return null;
//     }
// }


