import OpenAI from "openai";
import { DEEPSEEK_KEY } from "./constants";
console.log("My API Key is:", DEEPSEEK_KEY); // This will likely print: "My API Key is: undefined"
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: DEEPSEEK_KEY,
  dangerouslyAllowBrowser: true,
});

export default openai;
