export default function Temperature({ index, temperatureData }) {
	const highestTemperature = Math.max(
		...temperatureData.map((element) => element.temperatureRod),
	);
	const lowestTemperature = Math.min(
		...temperatureData.map((element) => element.temperatureRod),
	);
    
    function getStyle() {
		if (index < 1085) {
			return "landed";
		} else if (index > 12485) {
			return "landed";
		} else {
			return "flying";
		}
	}

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
					className={`temperature-slider w-full ${getStyle()}`}
				/>
				<p className="text-lg text-white text-nowrap">
					{highestTemperature} °C
				</p>
			</div>
		</div>
	);
}
