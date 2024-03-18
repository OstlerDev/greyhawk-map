import React, { useEffect } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'

// import 'leaflet.offline'

const MAP_NAME = "World of Greyhawk, Darlene, Rev 12c.svg"

const topLeftLatitude = 0
const topLeftLongitude = 0
const bottomRightLatitude = 90 // 74
const bottomRightLongitude = 180 // 147

const centerPosition = [65, 90]
const zoomLevel = 2.75
const minZoomLevel = 2.75
const maxZoomLevel = 10

const ADnDMap = () => {
  // Define the bounds of the SVG overlay
  // These bounds should correspond to the actual geographical bounds your SVG represents
  const bounds = [
    [topLeftLatitude, topLeftLongitude],
    [bottomRightLatitude, bottomRightLongitude]
  ]

  // Custom component to add the SVG overlay
  const SvgOverlay = ({ url, bounds }) => {
    const map = useMap()

    useEffect(() => {
      // Fetch the SVG file
      fetch(url)
        .then(response => response.text())
        .then(svgString => {
          // Create a DOM parser to parse the SVG string
          const parser = new DOMParser();
          const svgElement = parser.parseFromString(svgString, "image/svg+xml").documentElement;

          // Create a new Leaflet SVG overlay
          const overlay = L.svgOverlay(svgElement, bounds, { interactive: true });

          // Add it to the map
          overlay.addTo(map);

          // Add event listeners for interactivity if required
          // Example: Add a hover effect
          // const svgElement = overlay.getElement()
          // svgElement.addEventListener('mouseover', function(e) {
          //   // Your hover effect code here
          // })
        })

      return () => {
        // Remove the overlay when the component is unmounted
        map.eachLayer(layer => {
          if (layer instanceof L.SVGOverlay) {
            map.removeLayer(layer)
          }
        })
      }
    }, [url, bounds, map])

    return null // This component does not render anything to the DOM itself
  }

  return (
    <MapContainer 
      center={centerPosition} 
      zoom={zoomLevel} 
      minZoom={minZoomLevel} 
      maxZoom={maxZoomLevel}
      zoomSnap={0.25}
      zoomDelta={0.05}
      // wheelDebounceTime={250}
      // inertiaMaxSpeed={25}
      // zoomAnimation={false}
      // zoomAnimationThreshold={10000}
      style={{ height: '100vh', width: '100%' }}
      renderer={L.SVG}
    >
      {/* Include your SVG Overlay here */}
      <SvgOverlay
        url={`${process.env.PUBLIC_URL}/${encodeURIComponent(MAP_NAME)}`}
        bounds={bounds}
      />
    </MapContainer>
  )
}

export default ADnDMap
