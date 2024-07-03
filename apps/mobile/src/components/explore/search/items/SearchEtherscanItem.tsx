import { default as React } from 'react'
import { useAppDispatch } from 'src/app/hooks'
import { getBlockExplorerIcon } from 'src/components/icons/BlockExplorerIcon'
import { Flex, ImpactFeedbackStyle, Text, TouchableArea, useSporeColors } from 'ui/src'
import { iconSizes } from 'ui/src/theme'
import { ElementName } from 'uniswap/src/features/telemetry/constants'
import { UniverseChainId } from 'uniswap/src/types/chains'
import { shortenAddress } from 'uniswap/src/utils/addresses'
import { Arrow } from 'wallet/src/components/icons/Arrow'
import { EtherscanSearchResult } from 'wallet/src/features/search/SearchResult'
import { addToSearchHistory } from 'wallet/src/features/search/searchHistorySlice'
import { ExplorerDataType, getExplorerLink, openUri } from 'wallet/src/utils/linking'

type SearchEtherscanItemProps = {
  etherscanResult: EtherscanSearchResult
}

export function SearchEtherscanItem({ etherscanResult }: SearchEtherscanItemProps): JSX.Element {
  const colors = useSporeColors()
  const dispatch = useAppDispatch()

  const { address } = etherscanResult

  const onPressViewEtherscan = async (): Promise<void> => {
    const explorerLink = getExplorerLink(UniverseChainId.Mainnet, address, ExplorerDataType.ADDRESS)
    await openUri(explorerLink)
    dispatch(
      addToSearchHistory({
        searchResult: etherscanResult,
      }),
    )
  }

  const EtherscanIcon = getBlockExplorerIcon(UniverseChainId.Mainnet)

  return (
    <TouchableArea
      hapticFeedback
      hapticStyle={ImpactFeedbackStyle.Light}
      testID={ElementName.SearchEtherscanItem}
      onPress={onPressViewEtherscan}
    >
      <Flex row alignItems="center" gap="$spacing12" justifyContent="space-between" px="$spacing8" py="$spacing12">
        <Flex centered row gap="$spacing12">
          <EtherscanIcon size="$icon.40" />
          <Text variant="body1">{shortenAddress(address)}</Text>
        </Flex>
        <Arrow color={colors.neutral2.val} direction="ne" size={iconSizes.icon24} />
      </Flex>
    </TouchableArea>
  )
}
