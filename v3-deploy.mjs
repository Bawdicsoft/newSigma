#!/usr/bin/env zx
import 'zx/globals'

const networks = {
  eth: 'eth',
  goerli: 'goerli',
  bscMainnet: 'bscMainnet',
  bscTestnet: 'bscTestnet',
  hardhat: 'hardhat',
}

// let network = process.env.NETWORK
let network = "hardhat"
console.log(network, 'network')
if (!network || !networks[network]) {
  throw new Error(`env NETWORK: ${network}`)
}

// await $`yarn workspace @pancakeswap/v3-core run hardhat run scripts/deploy.ts --network ${network}`

// await $`yarn workspace @pancakeswap/v3-periphery run hardhat run scripts/deploy2.ts --network ${network}`

// await $`yarn workspace @pancakeswap/smart-router run hardhat run scripts/deploy2.ts --network ${network}`

// await $`yarn workspace @pancakeswap/masterchef-v3 run hardhat run scripts/deploy2.ts --network ${network}`


// await $`yarn workspace @pancakeswap/v3-lm-pool run hardhat run scripts/deploy2.ts --network ${network}`
await $`yarn workspace @pancakeswap/v3-core run hardhat run scripts/deploy.ts --network ganache`
await $`yarn workspace @pancakeswap/v3-periphery run hardhat run scripts/deploy2.ts --network ganache`
await $`yarn workspace @pancakeswap/smart-router run hardhat run scripts/deploy2.ts --network ganache`
await $`yarn workspace @pancakeswap/masterchef-v3 run hardhat run scripts/deploy2.ts --network ganache`
await $`yarn workspace @pancakeswap/v3-lm-pool run hardhat run scripts/deploy2.ts --network ganache`
await $`yarn workspace @pancakeswap/v3-lm-pool hardhat run scripts/run.js --network ganache`
// await $`cd projects/sigma2`
// await $`cd ..`
console.log(chalk.blue('Done!'))

const m = await fs.readJson(`./projects/masterchef-v3/deployments/ganache.json`)
const r = await fs.readJson(`./projects/router/deployments/ganache.json`)
const c = await fs.readJson(`./projects/v3-core/deployments/ganache.json`)
const p = await fs.readJson(`./projects/v3-periphery/deployments/ganache.json`)
const l = await fs.readJson(`./projects/v3-lm-pool/deployments/ganache.json`)


// const m = await fs.readJson(`./projects/masterchef-v3/deployments/${network}.json`)
// const r = await fs.readJson(`./projects/router/deployments/${network}.json`)
// const c = await fs.readJson(`./projects/v3-core/deployments/${network}.json`)
// const p = await fs.readJson(`./projects/v3-periphery/deployments/${network}.json`)
// const l = await fs.readJson(`./projects/v3-lm-pool/deployments/${network}.json`)

const addresses = {
  ...m,
  ...r,
  ...c,
  ...p,
  ...l,
}

console.log(chalk.blue('Writing to file...'))
console.log(chalk.yellow(JSON.stringify(addresses, null, 2)))

// fs.writeJson(`./deployments/${network}.json`, addresses, { spaces: 2 })
fs.writeJson(`./deployments/ganache.json`, addresses, { spaces: 2 })
