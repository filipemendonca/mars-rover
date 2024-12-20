import type ResponseData from "@/types/ResponseApi";
import http from "../http-common";
import type NasaType from "@/types/NasaModel";
import type RoverDTO from "@/types/Rover";

class WalkService {
  async Execute(data: NasaType, rovers: RoverDTO): Promise<ResponseData[]> {
    return (await http.post(`/rover?x=${data.x}&y=${data.y}`, rovers)).data;
  }
}

export default new WalkService();
