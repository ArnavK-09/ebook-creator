/**
 * Imports required
 */
import { type ConsolaInstance, consola, createConsola } from "consola/basic";

/**
 * AI Provider Base Class
 */
export default class AIProvider {
	// Browser Logger
	logger: ConsolaInstance = createConsola({
		level: 5,
	});

	// Init logger
	constructor(model: "GEMINI" | "OPENAI") {
		this.logUI(`Initialized Generative AI Provider for Model:- ${model}`);
		consola.info(`Initialized Generative AI Provider for Model:- ${model}`);
	}

	// Fetching local file contents
	async fetchTemplate(route: string) {
		return await (await fetch(route)).text();
	}

	// log to ui
	logUI(msg: string, tag: string = "info") {
		const container = document.querySelector("#console div");
		const log = document.createElement("p");
		log.innerHTML = `<span>${tag}</span> ${msg}`;
		container?.insertBefore(log, container.firstChild);
	}
}

/**
 * Exporting all gen ai providers
 */
export * from "./gemini";
