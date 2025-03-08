const { ethers } = require("ethers");
// const hre = require("hardhat");

const abi =  [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenA",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "tokenB",
          "type": "address"
        },
        {
          "internalType": "uint24",
          "name": "_fee",
          "type": "uint24"
        }
      ],
      "name": "CreatePool",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "Pool",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "_pool",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
 
  
const NonfungiblePositionManager = "0xC84A94966Cb926e03f73882575C7ddD9Df8c2E86";
const poolCreatorAddress = "0xE056E610805bD7C54940B40E13A8381662901D87";  
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
const poolCreator = new ethers.Contract(poolCreatorAddress, abi, provider);
const privateKey = "0xcaea4dbb3e45cc13c141dc00c940a6fd09bb5b4927953e69a2ae6648beee387d"; 
const owner = new ethers.Wallet(privateKey, provider);
const TestPool = "0x709484e24b3cdfa710657113B93180ECd686De28"


const SigmaToken = "0x2dC855161feb6f72F29C532a296B03AA88d868d2";
const USDT = "0x31469D7C4B5Eed2BB40527Be0FB63ad4CdFf48BF"
// async function creatingPool(){

//     const PoolAddress = await poolCreator.connect(owner).CreatePool(SigmaToken,USDT,100)
    
//     console.log("Pool address:", PoolAddress);
// }
async function creatingPool() {
    try {
        // const tx = await poolCreator.CreatePool(SigmaToken, USDT, 100);
        const tx = await poolCreator.connect(owner).CreatePool(SigmaToken, USDT, 100);
        await tx.wait();
        console.log("Pool created:", tx);
        const add = await poolCreator.Pool();
        console.log("pool:",add);
    } catch (error) {
        console.error("Error creating pool:", error);
    }
}
creatingPool();

async function addLiquidity(){

}
addLiquidity()
// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error)
//     process.exit(1)
// })
