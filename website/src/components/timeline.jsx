function formatSeconds(totalSeconds) {
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return { hours, minutes, seconds };
}

export default function Timeline({ max, index, setIndex }) {
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
		<div className="sticky top-0 left-0 right-0 gap-4 z-50 text-white flex flex-col items-center text-2xl p-4 background">
			<input
				type="range"
				min="0"
				max={max}
				value={index}
				onChange={(e) => setIndex(Number(e.target.value))}
				className={`w-full slider ${getStyle()}`}
				step={5}
			/>
			<p>
				{formatSeconds(index).hours.toString().padStart(2, "0")}:
				{formatSeconds(index).minutes.toString().padStart(2, "0")}:
				{formatSeconds(index).seconds.toString().padStart(2, "0")}
			</p>
		</div>
	);
}
