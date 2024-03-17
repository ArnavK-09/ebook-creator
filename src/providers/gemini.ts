/**
 * Imports Required
 */
import AIProvider from ".";
import { marked } from "marked";
import {
  type GenerativeModel,
  type ChatSession,
  GoogleGenerativeAI,
} from "@google/generative-ai";
import {
  SEPERATOR,
  bookPlaceholders,
  initPrompts,
  metaPrompts,
} from "../constants";
import { downloadLinkFromText } from "../main";

/**
 * Gemini Gen AI Provider
 */
export default class GeminiAI extends AIProvider {
  // vars
  #model: GenerativeModel;
  #ai: GoogleGenerativeAI;
  #book_motive: string = "E-book";
  #chat?: ChatSession;
  #pagesNo: number = 1;
  #pages: Array<string> = [];
  #pageGenPrompt: string = `Give me content for {{title}} page`;

  // init
  constructor(book_motive: string, apikey: string) {
    // extends
    super("GEMINI");

    // validating book title
    if (!book_motive) {
      this.logger.error("No motive for book specified...");
      this.logUI("No motive for book specified...", "error");
    }

    // creating gemini instance
    this.#ai = new GoogleGenerativeAI(apikey);
    this.#model = this.#ai.getGenerativeModel({ model: "gemini-pro" });
    this.#book_motive = book_motive;
    this.logger.success(`Connected To Gemini Pro....`);
    this.logUI(`Connected To Gemini Pro....`, "success");
  }

  async sendAIData(message: string): Promise<string> {
    this.logger.debug("Sent message to Generative AI...");
    this.logUI("Sent message to Generative AI...", "debug");
    message = message.trim();
    if (!message) return "";
    const result = await this.#chat!.sendMessage(message);
    const response = result.response;
    const text = response.text();
    this.logger.debug("Recived message to Generative AI...");
    this.logUI("Recived message to Generative AI...", "debug");
    return text;
  }

  public async startup() {
    this.logger.log("\n");
    this.logger.start(
      `Creating your E-book with title "${this.#book_motive}..."`,
    );
    this.logUI(
      `Creating your E-book with title "${this.#book_motive}..."`,
      "start",
    );
    this.#chat = this.#model.startChat();
    this.#pages.push(
      await this.sendAIData(initPrompts.gemini(this.#book_motive)),
    );
    this.logger.debug("Configured Generative AI Prompt...");
    this.logUI("Configured Generative AI Prompt...", "debug");
    this.continueAddingPages();
  }

  private async continueAddingPages(pagesNo: number = this.#pagesNo) {
    this.logger.log("\n");
    this.logger.start("Writing content for your book...");
    this.logUI("Writing content for your book...", "start");
    const _ = Array(pagesNo).fill(pagesNo);
    _.forEach(async (_, i) => {
      const content = this.sendAIData(
        this.#pageGenPrompt.replace("{{title}}", `Section ${i + 1}`),
      );
      this.#pages.push((await content).toString());
    });
    this.logger.success("Written content for your book...");
    this.logUI("Written content for your book...", "success");
    this.logger.log("\n");
  }

  public async renderBook() {
    // Basic variables for book rendering
    this.logger.info("Rendering your e-book into HTML Format explicitly...");
    this.logUI("Rendering your e-book into HTML Format explicitly...");
    const metaData = (await this.sendAIData(metaPrompts.gemini)).split(
      SEPERATOR,
    );
    const title: string = metaData[0] ?? "Book Title";
    const introduction: string = metaData[1] ?? "Book Introducion";
    const conclusion: string = metaData[2] ?? "Book Conclusion";
    let book: string = await this.fetchTemplate("ebook-creator/template.html");

    // Adding basic meta values to book
    book = book.replaceAll(bookPlaceholders.title, await marked.parse(title));
    book = book.replaceAll(
      bookPlaceholders.introduction,
      await marked.parse(introduction as string),
    );
    book = book.replaceAll(
      bookPlaceholders.conclusion,
      await marked.parse(conclusion),
    );

    // appending pages content
    this.logger.start("Appending content of your book into e-book format...");
    this.logUI("Appending content of your book into e-book format...", "start");
    const allPages: string[] = [];
    this.#pages.forEach((page) => {
      allPages.push(`<section>${marked.parse(page)}</section>`);
    });
    book = book.replaceAll(bookPlaceholders.content, allPages.join("\n"));
    this.logger.success("Rendered your e-book...");
    this.logUI("Rendered your e-book...", "success");
    this.logger.log("\n");

    // done render
    downloadLinkFromText(book);
  }
}
