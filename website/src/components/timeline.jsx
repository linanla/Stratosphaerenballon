export default function Timeline({ max, index, setIndex }) {

	return (
		<div className="fixed top-0 left-0 z-54 gap-4 text-white flex flex-col items-center text-2xl w-full pt-4 px-4">
			<input
				type="range"
				min="0"
				max={max}
				value={index}
				onChange={(e) => setIndex(Number(e.target.value))}
				className="w-full slider"
				step={5}
			/>
			<p>{index}</p>
		</div>
	);
}
