import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	base: "/Stratosphaerenballon/",
	define: {
		CESIUM_BASE_URL: JSON.stringify("/Stratosphaerenballon/cesium/"),
	},
});
