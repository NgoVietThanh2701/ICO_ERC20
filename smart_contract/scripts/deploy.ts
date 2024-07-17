import { ethers, hardhatArguments } from 'hardhat';
import * as Config from './config';

async function main() {
   await Config.initConfig();
   const network = hardhatArguments.network ?? 'dev';
   const [deployer] = await ethers.getSigners();
   console.log('deploy from address: ', deployer.address);

   // const LuckToken = await ethers.getContractFactory("LuckToken");
   // const luckToken = await LuckToken.deploy();
   // console.log("LuckToken address: ", luckToken.address);
   // Config.setConfig(network + '.LuckToken', luckToken.address);

   const Ico = await ethers.getContractFactory("LCKCrowdSale");
   const ico = await Ico.deploy(10000, '0xcCBF9BcaAbeaE9d0F382695d6fFe31c39E533F17', '0xdB868486B732DEc5c42Dd3E1CCB77355465DC0Ac')
   console.log("ICO address: ", ico.address);
   Config.setConfig(network + '.Ico', ico.address);

   await Config.updateConfig()
}

main()
   .then(() => process.exit(0))
   .catch(error => {
      console.log(error);
      process.exit(1)
   })