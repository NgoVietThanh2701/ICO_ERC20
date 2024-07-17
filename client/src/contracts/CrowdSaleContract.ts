import { TransactionResponse } from "@ethersproject/abstract-provider";
import { ethers } from "ethers";
import BaseInterface from "./interfaces/BaseInterface.ts";
import { rpcProvider, CROWDSALE_ADDRESS, getAbiCrowSale } from "./config.ts";

export default class CrowdSaleContract extends BaseInterface {
   constructor(provider?: ethers.providers.Web3Provider) {
      super(provider || rpcProvider, CROWDSALE_ADDRESS, getAbiCrowSale());
      if (!provider) {
         this._contract = new ethers.Contract(this._contractAddress, this._abi, rpcProvider);
      }
   }

   async getBnbRate(): Promise<number> {
      const rate = await this._contract.BNB_rate();
      return this._toNumber(rate);
   }

   async buyTokenByBnB(amount: number) {
      const tx: TransactionResponse = await this._contract.buyTokenByBNB({
         ...this._option,
         value: this._parseToEth(amount),
      });
      return this._handleTransactionResponse(tx);
   }
}