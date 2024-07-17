import abiCrowdSale from './abis/lckCrowdSale.json';
import abiLCKToken from './abis/lckToken.json';
import { ethers } from "ethers";

export const LCK_TOKEN_ADDRESS: string = '0xdB868486B732DEc5c42Dd3E1CCB77355465DC0Ac';
export const CROWDSALE_ADDRESS: string = '0xBB54bd477dEAA42991B00a0c8efE91778bd39F7f';
export const getAbiLCKToken = () => abiLCKToken;
export const getAbiCrowSale = () => abiCrowdSale;
export const rpcProvider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_NEXT_PUBLIC_RPC_TESTNET || 'https://data-seed-prebsc-1-s1.binance.org:8545/');