import fs from "fs";

const data = JSON.parse(fs.readFileSync("Gyro_datalog.json", "utf8"));

const updatedData = data.map((point) => {
	const roll = Math.atan2(point.aY, point.aZ);

	const pitch = Math.atan2(
		-point.aX,
		Math.sqrt(point.aY * point.aY + point.aZ * point.aZ),
	);

	return {
		...point,
		roll: (roll * 180) / Math.PI,
		pitch: (pitch * 180) / Math.PI,
	};
});

fs.writeFileSync(
	"Gyro_datalog_rotation.json",
	JSON.stringify(updatedData, null, 2),
);

console.log("Rotation data added.");
