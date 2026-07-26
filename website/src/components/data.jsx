export default function Data({ index, gpsData, gyroData, temperatureData }) {
	const gpsPoint = gpsData.find((element) => element.millis == index);
	const gyroPoint = gyroData.find((element) => element.millis == index);
	const temperaturePoint = temperatureData.find(
		(element) => element.millis == index,
	);

	return (
		<div className="text-white flex flex-row px-4 pb-4 justify-start text-2xl flex-wrap gap-4 w-full">
			<div className="card flex-1">
				<div>
					<p className="text-gray-400 text-[22px]">Höhe: </p>
					<p className="pl-4 pb-2">
						{temperaturePoint?.altitude ?? "-"} m
					</p>
				</div>
				<div>
					<p className="text-gray-400 text-[22px]">
						Geschwindigkeit:
					</p>
					<p className="pl-4 pb-2">{gpsPoint?.kmh ?? "-"} km/h</p>
				</div>
				<div>
					<p className="text-gray-400 text-[22px]">
						Beschleunigung:{" "}
					</p>
					<p className="pl-4">
						{Math.sqrt(
							gyroPoint?.aX ** 2 +
								gyroPoint?.aY ** 2 +
								gyroPoint?.aZ ** 2,
						).toFixed(2) ?? "-"}
					</p>
				</div>
			</div>
			<div className="card flex-1">
				<div>
					<p className="text-gray-400 text-[22px]">
						Innentemperatur:{" "}
					</p>
					<p className="pl-4 pb-2">
						{temperaturePoint?.temperatureBMP ?? "-"} °C
					</p>
				</div>
				<div>
					<p className="text-gray-400 text-[22px]">UVIndex: </p>
					<p className="pl-4 pb-2">{gyroPoint?.UVIndex ?? "-"}</p>
				</div>
				<div>
					<p className="text-gray-400 text-[22px]">
						Luftfeuchtigkeit:{" "}
					</p>
					<p className="pl-4 pb-2">
						{temperaturePoint?.humidity ?? "-"} %
					</p>
				</div>
				<div>
					<p className="text-gray-400 text-[22px]">Luftdruck: </p>
					<p className="pl-4">
						{temperaturePoint?.pressure ?? "-"} Pa
					</p>
				</div>
			</div>
			<div className="card flex-1">
				<div>
					<p className="text-gray-400 text-[22px]">Sateliten: </p>
					<p className="pl-4 pb-2">{gpsPoint?.satellites ?? "-"}</p>
				</div>
				<div>
					<p className="text-gray-400 text-[22px]">HDOP: </p>
					<p className="pl-4">{gpsPoint?.hdop ?? "-"}</p>
				</div>
			</div>
			<div className="card flex-1 gap-8 flex flex-col">
				<div className="flex flex-row gap-8 flex-wrap">
					<div>
						<p className="text-gray-400 text-[22px]">gX: </p>
						<p className="pl-4 pb-2 text-nowrap">
							{gyroPoint?.gY ?? "-"} °/s
						</p>
					</div>
					<div>
						<p className="text-gray-400 text-[22px]">gY: </p>
						<p className="pl-4 pb-2 text-nowrap">
							{gyroPoint?.gX ?? "-"} °/s
						</p>
					</div>
					<div>
						<p className="text-gray-400 text-[22px]">gZ: </p>
						<p className="pl-4 pb-2 text-nowrap">
							{gyroPoint?.gZ ?? "-"} °/s
						</p>
					</div>
				</div>
				<span className="mx-4 border-[#263546] border-2"></span>
				<div className="flex flex-row gap-8 flex-wrap">
					<div>
						<p className="text-gray-400 text-[22px]">aX: </p>
						<p className="pl-4 pb-2 text-nowrap">
							{gyroPoint?.aY ?? "-"} g
						</p>
					</div>
					<div>
						<p className="text-gray-400 text-[22px]">aY: </p>
						<p className="pl-4 pb-2 text-nowrap">
							{gyroPoint?.aX ?? "-"} g
						</p>
					</div>
					<div>
						<p className="text-gray-400 text-[22px]">aZ: </p>
						<p className="pl-4 pb-2 text-nowrap">
							{gyroPoint?.aZ ?? "-"} g
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
