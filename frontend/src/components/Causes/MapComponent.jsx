import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import './MapComponent.css'; // For styling

const MapComponent = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const[events,setEvents]=useState("")
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log(position)
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
    
                // Use the latitude and longitude in your API request
                fetch(`http://localhost:5000/allLocalEvents?lng=${longitude}&lat=${latitude}`,{
                    headers: {
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                      },
                })
                    .then(response => response.json())
                    .then(data => {
                       setEvents(data);
                    })
                    .catch(error => {
                        console.error('Error fetching events:', error);
                    });
            },
            (error) => {
                console.error('Error getting location:', error);
            }
        );
    } else {
        console.log('Geolocation is not supported by this browser.');
    }
    

      const mapStyles = {
          height: "500px",
          width: "100%"
      };
  
      const defaultCenter = {
          lat: events.length > 0 ? parseFloat(events[0].latitude) ||  19.0760 :  19.0760,
          lng: events.length > 0 ? parseFloat(events[0].longitude) || 72.8777 : 72.8777
      };

    console.log(events)

    return (
        <div className="map-container">
            <h2 className="map-header">Explore Local Causes</h2>
            <LoadScript googleMapsApiKey="AIzaSyCdYKL5a3qqZBMphKPEIEZYQml02Qs8hLQ">
                <GoogleMap
                    mapContainerStyle={mapStyles}
                    zoom={12}
                    center={defaultCenter}
                >
                    {events && events.map(event => {
                         const lat = parseFloat(event.latitude);
                         const lng = parseFloat(event.longitude);

                        // Check for valid lat/lng
                        if (isNaN(lat) || isNaN(lng)) {
                            console.error(`Invalid lat/lng for event ${event._id}:`, event);
                            return null;
                        }

                        return (
                            <Marker
                                key={event.id}
                                position={{ lat: event.latitude, lng: event.longitude }}
                                onClick={() => setSelectedEvent(event)}
                            />
                        );
                    })}

                    {selectedEvent && (
                        <InfoWindow
                        position={{ lat: selectedEvent.latitude, lng: selectedEvent.longitude }}
                        onCloseClick={() => setSelectedEvent(null)}
                        >
                            <div className="info-window">
                                <h3>{selectedEvent.eventName}</h3>
                                {/* <p>{selectedEvent.description}</p> */}
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
};
export default MapComponent;
