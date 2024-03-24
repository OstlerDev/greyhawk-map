import React, { useEffect, useState } from 'react'
import L from 'leaflet'
import { MapContainer, useMap } from 'react-leaflet'
import { 
  Hexagon as HexagonIcon,
  Token as TokenIcon
} from '@mui/icons-material';

import LayerToggle from './LayerToggle';


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
  const [layersVisible, setLayersVisible] = useState({
    Hex: {
      label: "30 Mile Hexagons",
      visible: true,
      icon: <HexagonIcon color="action" style={{ marginRight: 8 }} />
    },
    Hex_6_mile: {
      label: "6 Mile Hexagons",
      visible: false,
      icon: <TokenIcon color="action" style={{ marginRight: 8 }} />
    }
    // ... Add the rest of our desired layers here
  });

  const toggleLayer = (layerId, isVisible) => {
    setLayersVisible((prevLayersVisible) => ({
      ...prevLayersVisible,
      [layerId]: {
        ...prevLayersVisible[layerId],
        visible: isVisible
      }
    }));
  };

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

          // After creating the overlay and adding it to the map
          const overlayElement = overlay.getElement();

          // Go through each layer and set its visibility
          Object.keys(layersVisible).forEach(layerId => {
            const layerElement = overlayElement.getElementById(layerId);
            if (layerElement) {
              layerElement.style.display = layersVisible[layerId].visible ? '' : 'none';
            }
          });
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
      zoomDelta={0.5}
      // wheelDebounceTime={250}
      // inertiaMaxSpeed={25}
      zoomAnimation={false}
      // zoomAnimationThreshold={10000}
      style={{ height: '100vh', width: '100%' }}
      renderer={L.Canvas}

      whenCreated={map => {
        map.options.zoomAnimation = true; // Ensure zoom animation is enabled
        L.Map.mergeOptions({
          zoomAnimationThreshold: 4,
        });
        map._zoomAnimated = true; // Private variable, use with caution
        L.DomUtil.TRANSITION = map.options.zoomAnimation && L.Browser.any3d ? L.DomUtil.TRANSITION : false;
        L.DomUtil.TRANSITION_DURATION = '0.25s'; // Set the duration of the zoom animation
      }}
    >
      <LayerToggle layersVisible={layersVisible} toggleLayer={toggleLayer} />
      <SvgOverlay
        url={`${process.env.PUBLIC_URL}/${encodeURIComponent(MAP_NAME)}`}
        bounds={bounds}
      />
    </MapContainer>
  )
}

export default ADnDMap
