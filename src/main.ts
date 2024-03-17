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
const apikey = document.getElementById("api_key") as HTMLInputElement;
const submit_btn = document.getElementById("submitBTN") as HTMLButtonElement;
const download_link = document.getElementById(
  "download_link",
) as HTMLAnchorElement;
const download = document.getElementById("download") as HTMLDivElement;

/**
 * Function to creeate e - book
 */
const createEBOOK = async (event: SubmitEvent | MouseEvent) => {
  event.preventDefault();
  if (input.value.trim().length === 0) return;
  toggleLoading();
  const ai = new GeminiAI(input.value, apikey.value);
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

/**
 * Appends download link of text from sring
 * @param text
 */
export const downloadLinkFromText = (text: string) => {
  // Create a Blob object from the text content
  var blob = new Blob([text], { type: "text/plain" });

  // Create a temporary URL for the Blob object
  var url = URL.createObjectURL(blob);

  // Create a link element
  download_link.href = url;
  download.style.display = "grid";
  download_link.download = "ebook.html";

  // new window
  const newWindow = window.open();
  newWindow?.document.write(text);

  // Simulate a click on the link to trigger the download
  // link.click();
};
