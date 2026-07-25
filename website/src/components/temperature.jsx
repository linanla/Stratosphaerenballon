import { Bubbles, House, MountainSnow, Refrigerator } from "lucide-react";

export default function Temperature({ index, temperatureData }) {
	const highestTemperature = Math.max(
		...temperatureData.map((element) => element.temperatureRod),
	);
	const lowestTemperature = Math.min(
		...temperatureData.map((element) => element.temperatureRod),
	);

	function getPosition(temperature) {
		return (
			((temperature - lowestTemperature) /
				(highestTemperature - lowestTemperature)) *
			100
		);
	}

	console.log(getPosition(-36));

	return (
		<div className="flex flex-col gap-4 items-center w-full">
			<p className="text-lg text-white text-nowrap">
				Außentemperatur:{" "}
				{temperatureData
					.sort(
						(a, b) =>
							Math.abs(a.millis - index) -
							Math.abs(b.millis - index),
					)[0]
					.temperatureRod.toFixed(2)}{" "}
				°C
			</p>
			<div className="flex flex-row gap-4 items-center px-4 w-full">
				<p className="text-lg text-white text-nowrap">
					{lowestTemperature} °C
				</p>
				<input
					type="range"
					min={lowestTemperature}
					max={highestTemperature}
					step={1}
					value={
						temperatureData.sort(
							(a, b) =>
								Math.abs(a.millis - index) -
								Math.abs(b.millis - index),
						)[0].temperatureRod
					}
					className="temperature-slider w-full"
				/>
				<p className="text-lg text-white text-nowrap">
					{highestTemperature} °C
				</p>
			</div>
		</div>
	);
}
