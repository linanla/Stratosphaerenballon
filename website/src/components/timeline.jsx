export default function Timeline({ max, index, setIndex }) {

	return (
		<div className="fixed top-0 left-0 z-50 p-4 text-white flex flex-col items-center gap-4 text-2xl w-full">
			<input
				type="range"
				min="0"
				max={max}
				value={index}
				onChange={(e) => setIndex(Number(e.target.value))}
				className="w-full"
				step={5}
			/>
			<p>{index}</p>
		</div>
	);
}
