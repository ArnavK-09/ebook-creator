/**
 * Imports required
 */
import AIProvider from ".";

/**
 * Open AI Gen provider
 */
export default class OpenAI extends AIProvider {
  constructor() {
    super("OPENAI");
    this.logger.error(new Error("OpenAI Model not implmented yet!"));
  }
}
