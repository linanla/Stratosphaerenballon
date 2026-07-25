export default function Data({ index, gpsData, gyroData, temperatureData }) {
	const gpsPoint = gpsData.find((element) => element.millis == index);
	const gyroPoint = gyroData.find((element) => element.millis == index);
	const temperaturePoint = temperatureData.find(
		(element) => element.millis == index,
	);

	return (
		<div className="text-white flex flex-row px-8 pb-4 justify-between text-2xl flex-wrap">
			<div className="flex flex-col gap-4">
				<div className="w-96">
					<p>
						Höhe:&nbsp;&nbsp;{temperaturePoint?.altitude ?? "-"} m
					</p>
					<p>
						Geschwindigkeit:&nbsp;&nbsp;{gpsPoint?.kmh ?? "-"} km/h
					</p>
					<p>
						Beschleunigung:&nbsp;&nbsp;
						{Math.sqrt(
							gyroPoint?.aX ** 2 +
								gyroPoint?.aY ** 2 +
								gyroPoint?.aZ ** 2,
						).toFixed(2) ?? "-"}
					</p>
				</div>
				<div className="w-96">
					<p>
						Außentemperatur:&nbsp;&nbsp;
						{temperaturePoint?.temperatureRod ?? "-"} °C
					</p>
					<p>
						Innentemperatur:&nbsp;&nbsp;
						{temperaturePoint?.temperatureBMP ?? "-"} °C
					</p>
					<p>UVIndex:&nbsp;&nbsp;{gyroPoint?.UVIndex ?? "-"}</p>
					<p>
						Luftfeuchtigkeit:&nbsp;&nbsp;
						{temperaturePoint?.humidity ?? "-"} %
					</p>
					<p>
						Luftdruck:&nbsp;&nbsp;
						{temperaturePoint?.pressure ?? "-"} Pa
					</p>
				</div>
			</div>
			<div className="flex flex-col gap-4">
				<div className="w-72">
					<p>Sateliten:&nbsp;&nbsp;{gpsPoint?.satellites ?? "-"}</p>
					<p>HDOP:&nbsp;&nbsp;{gpsPoint?.hdop ?? "-"}</p>
				</div>
				<div className="w-72">
					<p>gX:&nbsp;&nbsp;{gyroPoint?.gY ?? "-"} °/s</p>
					<p>gY:&nbsp;&nbsp;{gyroPoint?.gX ?? "-"} °/s</p>
					<p>gZ:&nbsp;&nbsp;{gyroPoint?.gZ ?? "-"} °/s</p>
					<p>aX:&nbsp;&nbsp;{gyroPoint?.aY ?? "-"} g</p>
					<p>aY:&nbsp;&nbsp;{gyroPoint?.aX ?? "-"} g</p>
					<p>aZ:&nbsp;&nbsp;{gyroPoint?.aZ ?? "-"} g</p>
				</div>
			</div>
		</div>
	);
}
