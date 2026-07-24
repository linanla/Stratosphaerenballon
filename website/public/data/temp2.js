import fs from "fs";

const data = JSON.parse(fs.readFileSync("Gyro_datalog.json", "utf8"));



fs.writeFileSync(
    "Gyro_datalog_rotation.json",
    JSON.stringify(updatedData, null, 2),
);

console.log("Rotation data added.");
