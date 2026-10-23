import type { ExpoWebGLRenderingContext } from "expo-gl";
import { WebGLRenderer } from "three";

// expo-gl logs an error for every pixelStorei parameter it doesn't implement, and three sets several per texture upload.
const SUPPORTED_PIXEL_STORE = new Set([0x0cf5 /* UNPACK_ALIGNMENT */, 0x9240 /* UNPACK_FLIP_Y_WEBGL */]);

let warningsFiltered = false;

function filterThreeWarnings() {
	if (warningsFiltered) return;
	warningsFiltered = true;
	const warn = console.warn;
	console.warn = (...args: unknown[]) => {
		const first = String(args[0] ?? "");
		if (first.startsWith("THREE.WebGLRenderer:") || first.startsWith("THREE.WebGLProgram:")) {
			console.log("Warning:", ...args);
			return;
		}
		warn(...args);
	};
}

export function createRenderer(gl: ExpoWebGLRenderingContext): WebGLRenderer {
	filterThreeWarnings();

	const pixelStorei = gl.pixelStorei.bind(gl);
	gl.pixelStorei = (pname: number, param: number | boolean) => {
		if (SUPPORTED_PIXEL_STORE.has(pname)) pixelStorei(pname, param as number);
	};

	const width = gl.drawingBufferWidth;
	const height = gl.drawingBufferHeight;
	const canvas = {
		width,
		height,
		style: {},
		addEventListener: () => {},
		removeEventListener: () => {},
		clientWidth: width,
		clientHeight: height,
		getContext: () => gl,
	} as unknown as HTMLCanvasElement;

	const renderer = new WebGLRenderer({
		canvas,
		context: gl as unknown as WebGL2RenderingContext,
		antialias: false,
		depth: true,
	});
	renderer.setPixelRatio(1);
	renderer.setSize(width, height, false);
	renderer.setClearColor(0x000000, 1);
	return renderer;
}
