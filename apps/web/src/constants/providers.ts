import { CHAIN_IDS_TO_NAMES } from 'constants/chains'
import AppJsonRpcProvider from 'rpc/AppJsonRpcProvider'
import ConfiguredJsonRpcProvider from 'rpc/ConfiguredJsonRpcProvider'
import { UNIVERSE_CHAIN_INFO } from 'uniswap/src/constants/chains'
import { SUPPORTED_CHAIN_IDS, UniverseChainId } from 'uniswap/src/types/chains'

function getAppProvider(chainId: UniverseChainId) {
  const info = UNIVERSE_CHAIN_INFO[chainId]
  return new AppJsonRpcProvider(
    info.rpcUrls.appOnly.http.map(
      (url) => new ConfiguredJsonRpcProvider(url, { chainId, name: CHAIN_IDS_TO_NAMES[chainId] }),
    ),
  )
}

/** These are the only JsonRpcProviders used directly by the interface. */
export const RPC_PROVIDERS = Object.fromEntries(
  SUPPORTED_CHAIN_IDS.map((chain) => [chain as UniverseChainId, getAppProvider(chain)]),
) as Record<UniverseChainId, AppJsonRpcProvider>
