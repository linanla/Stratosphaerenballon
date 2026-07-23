import { useEffect, useState } from "react";
import Timeline from "./components/timeline";
import Globe from "./components/globe";
import Data from "./components/data";
import Cube from "./components/cube";

export default function App() {
	const [gpsData, setGpsData] = useState();
	const [gyroData, setGyroData] = useState();
	const [temperatureData, setTemperatureData] = useState();
	const [index, setIndex] = useState(0);

	useEffect(() => {
		async function loadData() {
			let res = await fetch(
				`${import.meta.env.BASE_URL}data/GPS_datalog.json`,
			).then((r) => r.json());
			setGpsData(res);
			res = await fetch(
				`${import.meta.env.BASE_URL}data/Gyro_datalog.json`,
			).then((r) => r.json());
			setGyroData(res);
			res = await fetch(
				`${import.meta.env.BASE_URL}data/Temperature_Pressure_datalog.json`,
			).then((r) => r.json());
			setTemperatureData(res);
		}
		loadData();
	}, []);
	if (!gpsData || !gyroData || !temperatureData) {
		return <div></div>;
	}
	return (
		<div className="bg-gray-800 h-dvh overflow-y-auto overflow-x-hidden">
			<Timeline
				max={gpsData[gpsData.length - 1].millis}
				index={index}
				setIndex={setIndex}
			/>
			<div className="flex flex-col gap-4">
				<div className="flex flex-row gap-4 h-123.75 pt-4">
					<Globe gpsData={gpsData} index={index} />
					<Cube
						point={gyroData.find(
							(element) => element.millis == index,
						)}
					/>
				</div>
				<div className="flex flex-row">
					<Data
						index={index}
						gpsData={gpsData}
						gyroData={gyroData}
						temperatureData={temperatureData}
					/>
				</div>
			</div>
		</div>
	);
}
