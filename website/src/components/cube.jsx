import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Cube({ point }) {
	const containerRef = useRef(null);
	const cubeRef = useRef(null);
	const initialized = useRef(false);

	useEffect(() => {
		if (initialized.current) return;
		initialized.current = true;

		const scene = new THREE.Scene();

		const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

		camera.position.set(3, 3, 5);
		camera.lookAt(0, 0, 0);

		const renderer = new THREE.WebGLRenderer({
			antialias: true,
		});

		renderer.setSize(400, 400);

		containerRef.current.appendChild(renderer.domElement);

		const geometry = new THREE.BoxGeometry();

		const materials = [
			new THREE.MeshStandardMaterial({ color: 0xff0000 }), // +X
			new THREE.MeshStandardMaterial({ color: 0x00ff00 }), // -X
			new THREE.MeshStandardMaterial({ color: 0x0000ff }), // +Y
			new THREE.MeshStandardMaterial({ color: 0xffff00 }), // -Y
			new THREE.MeshStandardMaterial({ color: 0xff00ff }), // +Z
			new THREE.MeshStandardMaterial({ color: 0x00ffff }), // -Z
		];

		const cube = new THREE.Mesh(geometry, materials);

		cubeRef.current = cube;

		scene.add(cube);

		scene.add(new THREE.AmbientLight(0xffffff, 2));

		const light = new THREE.DirectionalLight(0xffffff, 2);
		light.position.set(5, 5, 5);
		scene.add(light);

		let animationId;

		function animate() {
			animationId = requestAnimationFrame(animate);
			renderer.render(scene, camera);
		}

		animate();

		return () => {
			cancelAnimationFrame(animationId);

			renderer.dispose();
			geometry.dispose();

			materials.forEach((material) => material.dispose());

			if (containerRef.current?.contains(renderer.domElement)) {
				containerRef.current.removeChild(renderer.domElement);
			}

			cubeRef.current = null;
			initialized.current = false;
		};
	}, []);

	useEffect(() => {
		if (!cubeRef.current || !point) return;

		const pitch = THREE.MathUtils.degToRad(point.pitch ?? 0);
		const roll = THREE.MathUtils.degToRad(point.roll ?? 0);

		cubeRef.current.rotation.set(pitch, 0, roll);
	}, [point?.pitch, point?.roll]);

	return <div ref={containerRef} />;
}
