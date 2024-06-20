import { ChainId, SOCKS_CONTROLLER_ADDRESSES, Token } from '@uniswap/sdk-core'
import { useAccount } from 'hooks/useAccount'
import { useTokenBalance } from 'lib/hooks/useCurrencyBalance'
import { useMemo } from 'react'

// technically a 721, not an ERC20, but suffices for our purposes
const SOCKS = new Token(ChainId.MAINNET, SOCKS_CONTROLLER_ADDRESSES[ChainId.MAINNET], 0)

export function useHasSocks(): boolean | undefined {
  const account = useAccount()

  const balance = useTokenBalance(account.address, account.chainId === ChainId.MAINNET ? SOCKS : undefined)

  return useMemo(() => Boolean(balance?.greaterThan(0)), [balance])
}
