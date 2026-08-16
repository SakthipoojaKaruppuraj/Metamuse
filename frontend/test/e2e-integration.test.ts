import test from 'node:test'
import assert from 'node:assert'
import { validateContractCode, getOwnerOf, getTokenURI } from '../lib/backend/ethereumService'
import { reconstructProvenance } from '../lib/backend/provenanceService'

test('Ethereum Mainnet RPC Integration Tests (Lil Pudgys #1)', async (t) => {
  const contractAddress = '0x524cab2ec69124574082676e6f654a18df49a048' // Lil Pudgys contract
  const tokenId = '1'

  await t.test('should validate contract bytecode exists on-chain', async () => {
    const isValid = await validateContractCode(contractAddress)
    assert.strictEqual(isValid, true, 'Contract bytecode should exist')
  })

  await t.test('should query the ownerOf the token', async () => {
    const owner = await getOwnerOf(contractAddress, tokenId)
    assert.ok(owner, 'Owner address should not be null')
    assert.strictEqual(owner.startsWith('0x'), true, 'Owner should be a valid hex address')
    assert.strictEqual(owner.length, 42, 'Owner address should be 42 characters long')
  })

  await t.test('should query the tokenURI from the contract', async () => {
    const uri = await getTokenURI(contractAddress, tokenId)
    assert.ok(uri, 'Token URI should not be null')
    assert.ok(uri.includes('ipfs://') || uri.startsWith('http'), 'URI should be ipfs or http link')
  })

  await t.test('should reconstruct transfer logs and detect the mint transaction', async () => {
    // Lil Pudgys #1 has a transfer log history.
    // Querying with no OpenSea key (it will print warning about OS events and return empty, but EVM logs will succeed!)
    const record = await reconstructProvenance(
      contractAddress,
      tokenId,
      '0x0000000000000000000000000000000000000000', // placeholder owner
      undefined
    )

    assert.ok(record)
    assert.strictEqual(record.identity.contractAddress, contractAddress)
    assert.strictEqual(record.identity.tokenId, tokenId)
    
    // Assert that mint event was resolved
    assert.ok(record.mint.transactionHash, 'Mint transaction hash should be resolved')
    assert.ok(record.mint.blockNumber, 'Mint block number should be resolved')
    assert.ok(record.mint.minter, 'Minter address should be resolved')
    
    // Assert that we have transfers in the timeline
    assert.ok(record.transfers.length > 0, 'Should have at least one transfer (the mint)')
    assert.strictEqual(record.transfers[0].type, 'MINT', 'First transfer event should be a MINT')
    assert.strictEqual(record.transfers[0].from, '0x0000000000000000000000000000000000000000')
    assert.strictEqual(record.transfers[0].to, record.mint.minter)
  })
})
