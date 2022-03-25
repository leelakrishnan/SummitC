import supportedChains from './chains'
import { IChainData } from './types'
const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID;

export function getChainData(chainId?: number): IChainData {
    if (!chainId) {
        return null
    }
    const chainData = supportedChains.filter(
        (chain: any) => chain.chain_id === chainId
    )[0]

    if (!chainData) {
        return null
        // throw new Error('ChainId missing or not supported')
    }

    if (
        chainData.rpc_url.includes('infura.io') &&
        chainData.rpc_url.includes('%API_KEY%') &&
        INFURA_ID
    ) {
        const rpcUrl = chainData.rpc_url.replace('%API_KEY%', INFURA_ID)

        return {
            ...chainData,
            rpc_url: rpcUrl,
        }
    }

    return chainData
}

export function ellipseAddress(address = '', width = 10): string {
    if (!address) {
        return ''
    }
    return `${address.slice(0, width)}...${address.slice(-width)}`
}
