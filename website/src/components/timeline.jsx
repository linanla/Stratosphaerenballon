export default function Timeline({ max, index, setIndex }) {

	return (
		<div className="sticky p-4 text-white flex flex-col items-center gap-4 text-2xl">
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
