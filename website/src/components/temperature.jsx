import { useState } from "react";

export default function Temperature({ index, temperatureData }) {
	const [selectedMarker, setSelectedMarker] = useState(null);

	const interestingTemperatures = [
		{
			label: "Gefrierpunkt Wasser",
			temperature: 0,
		},
		{
			label: "Kühlschrank",
			temperature: 4,
		},
		{
			label: "Zimmertemperatur",
			temperature: 20,
		},
		{
			label: "Weinkeller",
			temperature: 12,
		},
		{
			label: "Celsius und Fahrenheit sind gleich",
			temperature: -40,
		},
		{
			label: "Handys gehen aus",
			temperature: -20,
		},
	];

	const highestTemperature = Math.max(
		...temperatureData.map((element) => element.temperatureRod),
	);

	const lowestTemperature = Math.min(
		...temperatureData.map((element) => element.temperatureRod),
	);

	const currentTemperature = temperatureData.reduce((prev, curr) =>
		Math.abs(curr.millis - index) < Math.abs(prev.millis - index)
			? curr
			: prev,
	);

	function calculatePercent(value) {
		return (
			((value - lowestTemperature) /
				(highestTemperature - lowestTemperature)) *
			100
		);
	}

	function getStyle() {
		if (index < 1085 || index > 12485) {
			return "landed-temp";
		}

		return "flying-temp";
	}

	return (
		<div className="px-4">
			<div className="flex flex-col gap-4 items-center w-full grow card">
				<p className="text-lg text-white text-nowrap">
					Außentemperatur:{" "}
					{currentTemperature.temperatureRod.toFixed(2)} °C
				</p>

				<div className="flex flex-row gap-4 items-center px-4 w-full">
					<p className="text-lg text-blue-700 text-nowrap">
						{lowestTemperature.toFixed(0)} °C
					</p>

					<div className="w-full h-10 relative">
						<div className="temperature-bar" />

						<span
							className={`temperature-marker ${getStyle()}`}
							style={{
								left: `${calculatePercent(
									currentTemperature.temperatureRod,
								)}%`,
							}}
						/>

						{interestingTemperatures.map((marker) => (
							<div
								key={marker.label}
								className="absolute top-1/2 -translate-y-1/2 cursor-pointer group"
								style={{
									left: `${calculatePercent(
										marker.temperature,
									)}%`,
								}}
								onClick={() =>
									setSelectedMarker(
										selectedMarker === marker.label
											? null
											: marker.label,
									)
								}
							>
								<div className="w-1 h-8 bg-white rounded-full" />

								<div
									className={`
										absolute bottom-10 left-1/2 -translate-x-1/2
										bg-gray-900 text-white text-sm
										px-3 py-2 rounded-lg
										whitespace-nowrap
										border border-gray-600
										z-10
										${selectedMarker === marker.label ? "block" : "hidden group-hover:block"}
									`}
								>
									<div className="font-bold">
										{marker.label}
									</div>
									<div>{marker.temperature} °C</div>
								</div>
							</div>
						))}
					</div>

					<p className="text-lg text-red-700 text-nowrap">
						{highestTemperature} °C
					</p>
				</div>
			</div>
		</div>
	);
}
