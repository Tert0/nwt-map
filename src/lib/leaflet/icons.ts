import * as L from 'leaflet';
import marker_red from '$lib/images/marker-red.svg';
import marker_orange from '$lib/images/marker-orange.svg';
import marker_shadow from '$lib/images/marker-shadow.svg';
import marker_blue from '$lib/images/marker-blue.svg';

export const MARKER_RED_ICON = new L.Icon({
	iconUrl: marker_red,
	shadowUrl: marker_shadow,
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	tooltipAnchor: [16, -28],
	shadowSize: [41, 41]
});
export const MARKER_ORANGE_ICON = new L.Icon({
	iconUrl: marker_orange,
	shadowUrl: marker_shadow,
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	tooltipAnchor: [16, -28],
	shadowSize: [41, 41]
});
export const MARKER_BLUE_ICON = new L.Icon({
	iconUrl: marker_blue,
	shadowUrl: marker_shadow,
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	tooltipAnchor: [16, -28],
	shadowSize: [41, 41]
});

export const MARKER_ICON_SVGS = {
	0: marker_blue,
	1: marker_orange,
	2: marker_red
};
