import * as L from 'leaflet';
import marker_red from '$lib/images/marker-red.svg';
import marker_yellow from '$lib/images/marker-yellow.svg';
import marker_shadow from '$lib/images/marker-shadow.svg';
import marker_svg from '$lib/images/marker.svg';

export const MARKER_RED_ICON = new L.Icon({
	iconUrl: marker_red,
	shadowUrl: marker_shadow,
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	tooltipAnchor: [16, -28],
	shadowSize: [41, 41]
});
export const MARKER_YELLOW_ICON = new L.Icon({
	iconUrl: marker_yellow,
	shadowUrl: marker_shadow,
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	tooltipAnchor: [16, -28],
	shadowSize: [41, 41]
});
export const MARKER_ICON = new L.Icon({
	iconUrl: marker_svg,
	shadowUrl: marker_shadow,
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	tooltipAnchor: [16, -28],
	shadowSize: [41, 41]
});


export const MARKER_ICON_SVGS = {
	0: marker_svg,
	1: marker_yellow,
	2: marker_red
};