import { translateGoogle } from "./translateGoogle";
import { translateCopilot } from "./translateCopilot";

export const translators = {
  Copilot: translateCopilot,
  Google: translateGoogle,
};
