import { ethers } from "ethers";
import Erc20 from "./interfaces/Erc20Interface.ts";
import { LCK_TOKEN_ADDRESS, getAbiLCKToken } from "./config.ts";

export default class LCKContract extends Erc20 {
   constructor(provider: ethers.providers.Web3Provider) {
      super(provider, LCK_TOKEN_ADDRESS, getAbiLCKToken());
   }
}