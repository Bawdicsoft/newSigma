const fs = require("fs-extra");
const { ethers } = require("ethers");
const path = require("path");

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
const USDTABI = [ {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  }, {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }] 

const sigmv3ABI =  [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_admin",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_Maintainance",
          "type": "address"
        },
        {
          "internalType": "contract IERC20",
          "name": "_usdt",
          "type": "address"
        },
        {
          "internalType": "contract IERC20",
          "name": "_SigmaToken",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_user",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_ref",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_time",
          "type": "uint256"
        }
      ],
      "name": "NewUser",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "ClaimReward",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_newUser",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_ref",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "_free",
          "type": "bool"
        }
      ],
      "name": "FunctionalRegistration",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "IdToAddress",
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
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "IdtoAddress",
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
      "name": "LastIdUser",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "PoolReward",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_newUser",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_ref",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_exchangeRates",
          "type": "uint256"
        }
      ],
      "name": "Register",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "adminWithdrawls",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "claimedRewards",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "emergencyWithdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "exists",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "fee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "arr",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256",
          "name": "threshold",
          "type": "uint256"
        }
      ],
      "name": "isArraySumLessThan",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "isUserExists",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "rewardsDestribution",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "team",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_listNumber",
          "type": "uint256"
        }
      ],
      "name": "teamlist",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "user",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "userDetails",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]  

const USDTAdd = "0x90D6b067F0e06CE55c48C4F6cfc0EB541A0F24fe";
const sigmaAdd = "0x850bEf64442C617Fc255BC4a28fD1364273D7B91";
const sigma3 = "0xb184266b8A347BC12EFC61798478e2a9ebC03503";
const usdt = new ethers.Contract(USDTAdd,USDTABI,provider);
const sigmaTC = new ethers.Contract(sigmaAdd,USDTABI,provider);
const sigma3C = new ethers.Contract(sigma3,sigmv3ABI,provider);
const owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

function EthToWei(n){
    const amount = ethers.parseEther(n);
    return amount;
}

const transferEth  = async () => {
        let a = async (num) => {
          const filePath = path.join(__dirname, "/wallets.json");
          const jsonData = await fs.readJson(filePath);
        //   const ad1 = jsonData[num].privateKey;
          const ad2 = jsonData[num].address;
        //   const wallet = new ethers.Wallet(ad1);
          // Get the signer from the wallet
        //   const signer = await wallet.connect(ethers.provider);
          // return signer;
          return ad2;
      
        };

        for (let i = 1; i < 31; i++) {
          let wallet = await a(i);
          console.log(`${i} : ${wallet}`);
          const owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
            const tx = await owner.sendTransaction({
                to: wallet,
                value: ethers.parseEther("0.2")
            });
              await tx.wait();
              console.log(tx.hash);
        }
}  


    // setTimeout(async () => { // Corrected setTimeout
    //     await transferEth();
    // }, 3000);


const transferUSDT = async () =>{
    let a = async (num) => {
        const filePath = path.join(__dirname, "/wallets.json");
        const jsonData = await fs.readJson(filePath);
      //   const ad1 = jsonData[num].privateKey;
        const ad2 = jsonData[num].address;
      //   const wallet = new ethers.Wallet(ad1);
        // Get the signer from the wallet
      //   const signer = await wallet.connect(ethers.provider);
        // return signer;
        return ad2;
    
      };
      for (let i = 1; i < 31; i++) {
          let wallet = await a(i);

        
          console.log(`${i} : ${wallet}`);
        //   const amount = EthToWei("10");
        //   const tx = await usdt.connect(owner).transfer(wallet,amount);
        //   console.log(tx.hash);


            const amount = EthToWei("10");
            const tx = await usdt.connect(owner).transfer(wallet, amount);
            console.log(`Transaction hash (USDT transfer to ${wallet}): ${tx.hash}`);

            await tx.wait(); // Wait for transaction confirmation
            console.log(`Transaction confirmed (USDT transfer to ${wallet})`);

            // Add a delay (e.g., 1 second)
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

      
}    

setTimeout(async () => { // Corrected setTimeout
        await transferUSDT();
}, 3000);


// function approveTo
