import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const rpcs = [
  'https://eth.llamarpc.com',
  'https://rpc.ankr.com/eth',
  'https://ethereum-rpc.publicnode.com',
  'https://1rpc.io/eth',
  'https://gateway.tenderly.co/public/mainnet',
  'https://cloudflare-eth.com'
]

async function diagnose() {
  const address = '0x524cab2ec69124574082676e6f654a18df49a048' // Official Lil Pudgys contract address
  
  for (const rpc of rpcs) {
    console.log(`\nTesting RPC: ${rpc}...`)
    try {
      const client = createPublicClient({
        chain: mainnet,
        transport: http(rpc),
      })
      
      const block = await client.getBlockNumber()
      console.log(`  Success! Block number: ${block}`)
      
      const code = await client.getBytecode({ address })
      console.log(`  Bytecode length: ${code ? code.length : 'null'}`)
    } catch (err: any) {
      console.log(`  Failed: ${err.message}`)
    }
  }
}

diagnose()
