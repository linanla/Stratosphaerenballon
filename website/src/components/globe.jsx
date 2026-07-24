import { useEffect, useRef } from "react";
import * as Cesium from "cesium";

Cesium.Ion.defaultAccessToken =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYmJmM2EyYy1kMzY5LTQyODMtOTQ0OS0wNDIyZmQ0NzNiNDEiLCJpZCI6NDU5NjQyLCJzdWIiOiJsaW5hbmxhIiwiaXNzIjoiaHR0cHM6Ly9hcGkuY2VzaXVtLmNvbSIsImF1ZCI6IlVudGl0bGVkIiwiaWF0IjoxNzg0ODE5MjM5fQ.kFxpOjEriUBjLKqcfyR3oARYJ4mW4DQkR8683ksaYak";

export default function Globe({ index, gpsData }) {
	const containerRef = useRef(null);
	const viewerRef = useRef(null);
	const balloonRef = useRef(null);

	useEffect(() => {
		const viewer = new Cesium.Viewer(containerRef.current, {
			terrain: Cesium.Terrain.fromWorldTerrain(),
			animation: false,
			timeline: false,
			baseLayerPicker: false,
		});

		viewerRef.current = viewer;

		console.log("GPS data length:", gpsData.length);
		console.log("First GPS point:", gpsData[0]);
		console.log("Last GPS point:", gpsData[gpsData.length - 1]);

		if (gpsData.length > 0) {
			const segments = [];
			let currentSegment = [];

			let missingCount = 0;
			let normalCount = 0;

			for (let i = 0; i < gpsData.length; i++) {
				const point = gpsData[i];

				currentSegment.push(
					Cesium.Cartesian3.fromDegrees(
						point.longitude,
						point.latitude,
						point.altitude,
					),
				);

				if (i < gpsData.length - 1) {
					const nextPoint = gpsData[i + 1];

					const timeDifference = nextPoint.millis - point.millis;

					console.log(
						`Point ${i}:`,
						"current millis:",
						point.millis,
						"next millis:",
						nextPoint.millis,
						"difference:",
						timeDifference,
					);

					if (timeDifference > 5) {
						console.warn("Missing data detected!", {
							from: point,
							to: nextPoint,
							gap: timeDifference,
						});

						missingCount++;

						if (currentSegment.length > 1) {
							segments.push({
								positions: currentSegment,
								missing: false,
							});

							normalCount++;
						}

						segments.push({
							positions: [
								Cesium.Cartesian3.fromDegrees(
									point.longitude,
									point.latitude,
									point.altitude,
								),
								Cesium.Cartesian3.fromDegrees(
									nextPoint.longitude,
									nextPoint.latitude,
									nextPoint.altitude,
								),
							],
							missing: true,
						});

						currentSegment = [];
					}
				}
			}

			if (currentSegment.length > 1) {
				segments.push({
					positions: currentSegment,
					missing: false,
				});

				normalCount++;
			}

			console.log("Created segments:", segments.length);
			console.log("Green segments:", normalCount);
			console.log("Red segments:", missingCount);

			segments.forEach((segment, index) => {
				console.log(
					"Drawing segment:",
					index,
					segment.missing ? "RED" : "GREEN",
					"points:",
					segment.positions.length,
				);

				viewer.entities.add({
					polyline: {
						positions: segment.positions,
						width: 3,
						material: segment.missing
							? Cesium.Color.RED
							: Cesium.Color.LIME,
					},
				});
			});

			balloonRef.current = viewer.entities.add({
				position: Cesium.Cartesian3.fromDegrees(
					gpsData[0].longitude,
					gpsData[0].latitude,
					gpsData[0].altitude,
				),
				point: {
					pixelSize: 15,
					color: Cesium.Color.GREENYELLOW,
				},
			});

			viewer.zoomTo(viewer.entities);
		}

		return () => {
			viewer.destroy();
			viewerRef.current = null;
			balloonRef.current = null;
		};
	}, [gpsData]);

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

	return <div ref={containerRef} className="pt-24 grow" />;
}
