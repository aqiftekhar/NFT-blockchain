import { NFTAttribute } from "./NFTAttribute";

export interface NFTModel {
    id: number;
    name: string;
    description: string;
    image: string;
    attributes: NFTAttribute[];
}