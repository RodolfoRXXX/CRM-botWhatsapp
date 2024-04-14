// Archivo modularizado de flujos que contiene la declaración de cada uno de los flujos

import { createFlow } from "@builderbot/bot";
import { flowWelcome } from "./bot1.flow";

export const flow = createFlow([flowWelcome])