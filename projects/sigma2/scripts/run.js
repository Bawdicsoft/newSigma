const hre = require("hardhat");
const fs = require("fs-extra");
const { ethers } = require("ethers");
const path = require("path");
// const { chalk } = require("zx/.");
// import 'zx/globals'
async function main() {
    let usdt,sigmaToken,sigmaV3;
    const owner = new ethers.Wallet(process.env.PRIVATE_KEY, process.env.PROVIDER);
    function EthToWei(n){
        const amount = ethers.parseEther(n);
        return amount;
    }
    // async function deployment(){
        const networkName = network.name
        // First phase 
        console.log(`owner:${owner.address}, Network:${networkName}`)
        const USDT = await hre.ethers.getContractFactory("BEP20USDT")
        usdt = await USDT.deploy(owner.address)
        const a = await usdt.address;
        await fs.outputJson(`./deployedContracts.json`, {USDT: a});

        const SigmaToken = await hre.ethers.getContractFactory("SigmaToken")
        sigmaToken = await SigmaToken.deploy(owner.address)
        const b = await sigmaToken.address;
        await fs.outputJson(`./deployedContracts.json`, {Sigma: b});

        // const PoolCreator = await hre.ethers.getContractFactory("PoolCreator")
        // poolCreator = await PoolCreator.deploy("0x8f213Ece742b7FA057A374DEAbb95d531aa86788")
        // console.log(`Sigma Token :${sigmaToken.address},\n USDT:${usdt.address}` );
        console.log(`Sigma Token :${sigmaToken.address},\nUSDT:${usdt.address}` );


        // Third Phase 
        const SigmaV3 = await hre.ethers.getContractFactory("SigmaV3")
        sigmaV3 = await SigmaV3.deploy(owner.address,process.env.FEE_C,usdt.address,sigmaToken.address)
        const c = await sigmaV3.address;

        console.log(`SigmaV3:${sigmaV3.address}` );
        await fs.outputJson(`./deployedContracts.json`, {
            "USDT": a,
            "Sigma": b,
            "Sigmav3": c
        });


        

    // }

    // const transferEth  = async () => {
    //     let a = async (num) => {
    //       const filePath = path.join(__dirname, "/wallets.json");
    //       const jsonData = await fs.readJson(filePath);
    //     //   const ad1 = jsonData[num].privateKey;
    //       const ad2 = jsonData[num].address;
    //     //   const wallet = new ethers.Wallet(ad1);
    //       // Get the signer from the wallet
    //     //   const signer = await wallet.connect(ethers.provider);
    //       // return signer;
    //       return ad2;
      
    //     };

    //     for (let i = 1; i < 31; i++) {
    //       let wallet = await a(i);
    //       console.log(`${i} : ${wallet}`);
    //       const owner = new ethers.Wallet(process.env.PRIVATE_KEY, process.env.PROVIDER);
    //         const tx = await owner.sendTransaction({
    //             to: wallet,
    //             value: ethers.parseEther("0.2")
    //         });
    //           await tx.wait();
    //           console.log(tx.hash);
    //     }
    //   }  
      
    // setTimeout(async () => { // Corrected setTimeout
    //     await transferEth();
    // }, 2000);
    async function transfers(){


        await usdt.connect(owner).transfer(testACC, amount)

    }

    
    // console.log(amount);
    // const bal = await usdt.balanceOf(testACC);
    // console.log("balance checking:",(bal).toString());

    // deployment()
    // transferEth()


}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
