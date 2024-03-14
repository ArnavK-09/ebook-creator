/**
 * Imports required
 */
import { toggleLoading } from "./ui";
import GeminiAI from "./providers/gemini";

/**
 * HTML Components
 */
const form = document.getElementsByTagName("form")[0] as HTMLFormElement;
const input = document.getElementById("book_motive") as HTMLInputElement;
const btn = document.getElementById("submitBTN") as HTMLButtonElement;

/**
 * Function to creeate e - book
 */
const createEBOOK = async (event: SubmitEvent | MouseEvent) => {
	event.preventDefault();
	if (input.value.trim().length === 0) return;
	toggleLoading();
	const ai = new GeminiAI(input.value);
	await ai
		.startup()
		.then(async () => await ai.renderBook())
		.catch((e: Error) => {
			ai.logUI(e.message, "error");
			ai.logger.error(e);
		})
		.finally(toggleLoading);
};

/**
 * Appending Event Listeners
 */
form.addEventListener("submit", createEBOOK);
btn.addEventListener("click", createEBOOK);
