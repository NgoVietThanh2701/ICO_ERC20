import { ethers } from "ethers";
import Erc20 from "./interfaces/Erc20Interface";
import { LCK_TOKEN_ADDRESS, getAbiLCKToken } from "./config";

export default class AGTContract extends Erc20 {
   constructor(provider: ethers.providers.Web3Provider) {
      super(provider, LCK_TOKEN_ADDRESS, getAbiLCKToken());
   }
}