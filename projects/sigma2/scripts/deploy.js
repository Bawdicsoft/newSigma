// import { tryVerify } from '@pancakeswap/common/verify'
const hre = require("hardhat");
// import fs from 'fs'

/*

owner:0xDE0De5e58938054A71fbCC5C4732E6866FF1490A, 
Network:ganache
Sigma Token:0x219aedb89d32dDD715523db2c45bD632f0124068,
USDT:0x37F555F2e85783cEAF2675eA6b2454D455A92079

phase 2 : 
Sigma Token :   0x2dC855161feb6f72F29C532a296B03AA88d868d2,
USDT:           0x31469D7C4B5Eed2BB40527Be0FB63ad4CdFf48BF
poolcreator:    0xE056E610805bD7C54940B40E13A8381662901D87

*/

async function main() {
    // const privateKey = "0xcaea4dbb3e45cc13c141dc00c940a6fd09bb5b4927953e69a2ae6648beee387d"; // Ensure the 0x prefix
    const privateKey = "0xbdb960d9bbd40b5ac052c50cc99ded712abf82275665b75b354821f60aa4ef11"; // Ensure the 0x prefix
    const OwnerAddress = "0x1f9BBfD9c1E984530E96D799Cf5d95998E3a689D";
    const feeCollector = "0xF51C374BCaA108be1d8642D1750CDf2E80B91a52";

    const owner = new ethers.Wallet(privateKey, ethers.provider);
    // Create a wallet (signer) from the private key
    // const [owner] = await ethers.getSigners()
    // const networkName = network.name
    // First phase 
    // console.log(`owner:${owner.address}, Network:${networkName}`)
    const USDT = await hre.ethers.getContractFactory("BEP20USDT")
    const usdt = await USDT.connect(owner).deploy(OwnerAddress)
    const SigmaToken = await hre.ethers.getContractFactory("SigmaToken")
    const sigmaToken = await SigmaToken.connect(owner).deploy(OwnerAddress)


    // const USDT = await hre.ethers.getContractFactory("BEP20USDT")
    // const usdt = await USDT.connect(owner).deploy(OwnerAddress)
    // const SigmaToken = await hre.ethers.getContractFactory("SigmaToken")
    // const sigmaToken = await SigmaToken.connect(owner).deploy(OwnerAddress)
    // const PoolCreator = await hre.ethers.getContractFactory("PoolCreator")
    // const poolCreator = await PoolCreator.connect(owner).deploy("0x8f213Ece742b7FA057A374DEAbb95d531aa86788")
    console.log(`Sigma Token :${sigmaToken.address},\n USDT:${usdt.address}` );

   

    // Third Phase 
    const SigmaV3 = await hre.ethers.getContractFactory("SigmaV3")
    const sigmaV3 = await SigmaV3.connect(owner).deploy(OwnerAddress,feeCollector,usdt.address,sigmaToken.address)

    // console.log(`SigmaV3:${poolCreator.address}` );
    console.log(`SigmaV3:${sigmaV3.address}` );

    //     const contracts = {
    //     USDT: usdt.target,
    //     SigmaToken: sigmaToken.target,
    //     SigmantarianV3: sigmaV3.target,
    //     }
  

//   fs.writeFileSync(`./deployments/${networkName}.json`, JSON.stringify(contracts, null, 2))
}
/*

      SigmaToken :0x9434986F641157ebd24D802AE4F5817EEfe9Cbb2,
      USDT:0x18757632aBcAC54C47092fA6dF28FE8df6Ca9E0E
      SigmaV3:0x53071180D9369dBEd61c932b20BD1b951EfF2Dd1
*/
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
