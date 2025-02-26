import { ethers, network } from 'hardhat'
import { configs } from '@pancakeswap/common/config'
import { tryVerify } from '@pancakeswap/common/verify'
import fs from 'fs'
import { abi } from '@pancakeswap/v3-core/artifacts/contracts/PancakeV3Factory.sol/PancakeV3Factory.json'

import { parseEther } from 'ethers/lib/utils'
const currentNetwork = network.name

async function main() {
  // const [owner] = await ethers.getSigners()

  const privateKey = "0xcaea4dbb3e45cc13c141dc00c940a6fd09bb5b4927953e69a2ae6648beee387d"; // Ensure the 0x prefix

  const owner = new ethers.Wallet(privateKey, ethers.provider);
  
  // Remember to update the init code hash in SC for different chains before deploying
  const networkName = network.name
  const config = configs[networkName as keyof typeof configs]
  if (!config) {
    throw new Error(`No config found for network ${networkName}`)
  }

  const v3DeployedContracts = await import(`@pancakeswap/v3-core/deployments/${networkName}.json`)
  const mcV3DeployedContracts = await import(`@pancakeswap/masterchef-v3/deployments/${networkName}.json`)

  const pancakeV3Factory_address = v3DeployedContracts.PancakeV3Factory

  const PancakeV3LmPoolDeployer = await ethers.getContractFactory('PancakeV3LmPoolDeployer')
  const pancakeV3LmPoolDeployer = await PancakeV3LmPoolDeployer.connect(owner).deploy(mcV3DeployedContracts.MasterChefV3)

  console.log('pancakeV3LmPoolDeployer deployed to:', pancakeV3LmPoolDeployer.address)

  const pancakeV3Factory = new ethers.Contract(pancakeV3Factory_address, abi, owner)

  await pancakeV3Factory.connect(owner).setLmPoolDeployer(pancakeV3LmPoolDeployer.address)

  const contracts = {
    PancakeV3LmPoolDeployer: pancakeV3LmPoolDeployer.address,
  }
  fs.writeFileSync(`./deployments/${networkName}.json`, JSON.stringify(contracts, null, 2))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
