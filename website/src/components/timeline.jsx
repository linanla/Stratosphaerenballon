function formatSeconds(totalSeconds) {
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return { hours, minutes, seconds };
}

export default function Timeline({ max, index, setIndex }) {
	return (
		<div className="fixed top-0 left-0 z-54 gap-4 text-white bg-gray-800 flex flex-col items-center text-2xl w-full pt-4 px-4">
			<input
				type="range"
				min="0"
				max={max}
				value={index}
				onChange={(e) => setIndex(Number(e.target.value))}
				className="w-full slider"
				step={5}
			/>
			<p>{formatSeconds(index).hours.toString().padStart(2, '0')}:{formatSeconds(index).minutes.toString().padStart(2, '0')}:{formatSeconds(index).seconds.toString().padStart(2, '0')}</p>
		</div>
	);
}
