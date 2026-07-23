import { useEffect, useRef } from "react";
import * as Cesium from "cesium";

export default function Globe({ index, gpsData }) {
	const containerRef = useRef(null);
	const viewerRef = useRef(null);
	const balloonRef = useRef(null);

	// Create Cesium viewer and draw flight path
	useEffect(() => {
		const viewer = new Cesium.Viewer(containerRef.current, {
			terrain: Cesium.Terrain.fromWorldTerrain(),
			animation: false,
			timeline: false,
			baseLayerPicker: false,
		});

		viewerRef.current = viewer;

		if (gpsData.length > 0) {
			const positions = gpsData.map((point) =>
				Cesium.Cartesian3.fromDegrees(
					point.longitude,
					point.latitude,
					point.altitude,
				),
			);

			// Draw flight path
			viewer.entities.add({
				polyline: {
					positions: positions,
					width: 2,
					material: Cesium.Color.RED,
				},
			});

			// Create balloon marker
			balloonRef.current = viewer.entities.add({
				position: positions[0],
				point: {
					pixelSize: 15,
					color: Cesium.Color.GREENYELLOW,
				},
			});

			// Zoom to flight path
			viewer.zoomTo(viewer.entities);
		}

		return () => {
			viewer.destroy();
			viewerRef.current = null;
		};
	}, [gpsData]);

	// Update balloon position when timeline changes
	useEffect(() => {
		const point = gpsData.find((element) => element.millis == index);

		if (!balloonRef.current) {
			return;
		}

		if (!point) {
			balloonRef.current.position = undefined;
			return;
		}

		balloonRef.current.position = Cesium.Cartesian3.fromDegrees(
			point.longitude,
			point.latitude,
			point.altitude,
		);
	}, [index, gpsData]);

	return (
		<div
			ref={containerRef}
			className="w-full h-96"
		/>
	);
}
