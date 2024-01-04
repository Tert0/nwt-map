// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}
export type DataEntry = {
	distance1: number;
	distance2: number;
	distance3: number;
	latitude: number;
	longitude: number;
	pulse: number;
};

export {};
