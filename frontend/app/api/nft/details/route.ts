import { NextResponse } from 'next/server'
import { serverCache } from '@/lib/backend/cache'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'INVALID_ID' }, { status: 400 })
    }

    const cachedNFT = serverCache.get(`nft:${id}`)
    if (!cachedNFT) {
      return NextResponse.json({ error: 'NFT_NOT_FOUND' }, { status: 404 })
    }

    return NextResponse.json(cachedNFT)
  } catch (err) {
    console.error('Failed to retrieve cached NFT detail:', err)
    return NextResponse.json({ error: 'UNKNOWN_ERROR' }, { status: 500 })
  }
}
