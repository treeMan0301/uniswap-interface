import { useEffect } from 'react'
import { ChainId } from 'uniswap/src/types/chains'
import { usePrevious } from 'utilities/src/react/hooks'
import { pushNotification } from 'wallet/src/features/notifications/slice'
import { AppNotificationType } from 'wallet/src/features/notifications/types'
import { useAppDispatch } from 'wallet/src/state'

export function useShowSwapNetworkNotification(chainId?: ChainId): void {
  const prevChainId = usePrevious(chainId)
  const appDispatch = useAppDispatch()
  useEffect(() => {
    // don't fire notification toast for first network selection
    if (!prevChainId || !chainId || prevChainId === chainId) {
      return
    }

    appDispatch(
      pushNotification({
        type: AppNotificationType.NetworkChanged,
        chainId,
        flow: 'swap',
        hideDelay: 2000,
      })
    )
  }, [chainId, prevChainId, appDispatch])
}
