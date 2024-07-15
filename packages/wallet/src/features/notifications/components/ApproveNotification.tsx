import { AssetType } from 'uniswap/src/entities/assets'
import { buildCurrencyId } from 'uniswap/src/utils/currencyId'
import { LogoWithTxStatus } from 'wallet/src/components/CurrencyLogo/LogoWithTxStatus'
import { useWalletNavigation } from 'wallet/src/contexts/WalletNavigationContext'
import { NotificationToast } from 'wallet/src/features/notifications/components/NotificationToast'
import { NOTIFICATION_ICON_SIZE } from 'wallet/src/features/notifications/constants'
import { ApproveTxNotification } from 'wallet/src/features/notifications/types'
import { formApproveNotificationTitle } from 'wallet/src/features/notifications/utils'
import { useCurrencyInfo } from 'wallet/src/features/tokens/useCurrencyInfo'

export function ApproveNotification({
  notification: { address, chainId, tokenAddress, spender, txStatus, txType, hideDelay },
}: {
  notification: ApproveTxNotification
}): JSX.Element {
  const { navigateToAccountActivityList } = useWalletNavigation()

  const currencyInfo = useCurrencyInfo(buildCurrencyId(chainId, tokenAddress))

  const title = formApproveNotificationTitle(txStatus, currencyInfo?.currency, tokenAddress, spender)

  const icon = (
    <LogoWithTxStatus
      assetType={AssetType.Currency}
      chainId={chainId}
      currencyInfo={currencyInfo}
      size={NOTIFICATION_ICON_SIZE}
      txStatus={txStatus}
      txType={txType}
    />
  )

  return (
    <NotificationToast
      address={address}
      hideDelay={hideDelay}
      icon={icon}
      title={title}
      onPress={navigateToAccountActivityList}
    />
  )
}
