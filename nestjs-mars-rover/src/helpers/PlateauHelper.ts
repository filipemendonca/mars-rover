import { PlateauDTO } from "../dto/PlateauDto";

export class PlateauHelper {
  static async getDirectionsArray(landingPosition: string): Promise<string[]> {
    return landingPosition.toUpperCase().replace(/\s+/g, "").split("");
  }

  static async getInstructions(instructions: string): Promise<string[]> {
    return instructions.toUpperCase().replace(/\s+/g, "").split("");
  }

  static buildPlateau = async (plateau: PlateauDTO): Promise<string[][]> =>
    Array(+plateau.x)
      .fill("")
      .map(() => Array(+plateau.y).fill(""));
}
