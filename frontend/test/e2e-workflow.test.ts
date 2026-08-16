import test from 'node:test'
import assert from 'node:assert'

const BASE_URL = 'http://localhost:3000'

async function isServerRunning(): Promise<boolean> {
  try {
    const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(1000) })
    return res.ok || res.status === 200 || res.status === 404
  } catch {
    return false
  }
}

test('End-to-End Workflow Verification via Local Server', async (t) => {
  const serverUp = await isServerRunning()
  if (!serverUp) {
    console.log('Local dev server (http://localhost:3000) is not active. Skipping live server HTTP workflow tests...')
    return
  }

  await t.test('1. Landing page (/) should respond with HTTP 200', async () => {
    const res = await fetch(`${BASE_URL}/`)
    assert.strictEqual(res.status, 200, 'Landing page should return HTTP 200')
    const html = await res.text()
    assert.ok(html.includes('MetaMuse'), 'HTML should contain MetaMuse title')
  })

  await t.test('2. Analyze page (/analyze) should respond with HTTP 200', async () => {
    const res = await fetch(`${BASE_URL}/analyze`)
    assert.strictEqual(res.status, 200, 'Analyze page should return HTTP 200')
    const html = await res.text()
    assert.ok(html.includes('Identify your NFT'), 'HTML should contain form header')
  })

  await t.test('3. Analyze API (/api/nft/analyze) should process Lil Pudgys #1 and return full analysis', async () => {
    const openSeaUrl = 'https://opensea.io/assets/ethereum/0x524cab2ec69124574082676e6f654a18df49a048/1'
    const res = await fetch(`${BASE_URL}/api/nft/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ openSeaUrl }),
    })

    assert.strictEqual(res.status, 200, 'Analyze API should return HTTP 200')
    const data = await res.json()

    assert.ok(data.id, 'Should contain analysis ID')
    assert.ok(data.whyThisExists, 'Should contain "Why This NFT Exists" explanation')
    assert.ok(Array.isArray(data.evidence), 'Should contain evidence array')
    assert.ok(data.evidence.length > 0, 'Evidence array should not be empty')
    assert.ok(Array.isArray(data.provenance), 'Should contain provenance array')
    assert.ok(data.commitments.evidenceHash, 'Should contain evidenceHash commitment')
    assert.ok(data.commitments.provenanceHash, 'Should contain provenanceHash commitment')
    assert.ok(typeof data.provenanceConfidence === 'number', 'Should contain confidence score')
  })

  await t.test('4. Details API (/api/nft/details) should retrieve cached analysis for Lil Pudgys #1', async () => {
    const targetId = 'ethereum_0x524cab2ec69124574082676e6f654a18df49a048_1'
    const res = await fetch(`${BASE_URL}/api/nft/details?id=${targetId}`)
    assert.strictEqual(res.status, 200, 'Details API should return HTTP 200')
    const data = await res.json()

    assert.strictEqual(data.id, targetId)
    assert.ok(data.whyThisExists)
    assert.ok(Array.isArray(data.evidence))
  })
})
