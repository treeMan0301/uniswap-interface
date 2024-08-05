import { BottomSheetSectionList } from '@gorhom/bottom-sheet'
import { memo, useCallback } from 'react'
import { ListRenderItemInfo, SectionList, SectionListData } from 'react-native'
import { FadeIn, FadeOut } from 'react-native-reanimated'
import { Text, TouchableArea, isWeb, useDeviceInsets } from 'ui/src'
import { AnimatedFlex } from 'ui/src/components/layout/AnimatedFlex'
import { spacing } from 'ui/src/theme'
import { SearchResultType } from 'uniswap/src/features/search/SearchResult'
import { WalletEventName } from 'uniswap/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'uniswap/src/features/telemetry/send'
import { AddressDisplay } from 'wallet/src/components/accounts/AddressDisplay'
import { SearchableRecipient } from 'wallet/src/features/address/types'
import { extractDomain } from 'wallet/src/features/search/SearchResult'
import { AccountType } from 'wallet/src/features/wallet/accounts/types'

interface RecipientListProps {
  renderedInModal?: boolean
  sections: SectionListData<SearchableRecipient>[]
  onPress: (recipient: string) => void
}

export function RecipientList({ onPress, sections, renderedInModal = false }: RecipientListProps): JSX.Element {
  const insets = useDeviceInsets()

  const onRecipientPress = useCallback(
    (recipient: SearchableRecipient) => {
      onPress(recipient.address)
    },
    [onPress],
  )

  const renderItem = function ({ item }: ListRenderItemInfo<SearchableRecipient>): JSX.Element {
    return (
      // TODO(EXT-526): re-enable `exiting` animation when it's fixed.
      <AnimatedFlex entering={FadeIn} exiting={isWeb ? undefined : FadeOut} py="$spacing12">
        <RecipientRow recipient={item} onPress={onRecipientPress} />
      </AnimatedFlex>
    )
  }

  const List = renderedInModal ? BottomSheetSectionList : SectionList

  return (
    <>
      <List
        contentContainerStyle={{
          paddingBottom: insets.bottom + spacing.spacing12,
        }}
        keyExtractor={key}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        renderItem={renderItem}
        renderSectionHeader={SectionHeader}
        sections={sections}
        showsVerticalScrollIndicator={false}
      />
    </>
  )
}

function SectionHeader(info: { section: SectionListData<SearchableRecipient> }): JSX.Element | null {
  return info.section.title ? (
    <AnimatedFlex
      backgroundColor="$surface1"
      entering={FadeIn}
      // TODO(EXT-526): re-enable `exiting` animation when it's fixed.
      exiting={isWeb ? undefined : FadeOut}
      py="$spacing8"
    >
      <Text color="$neutral2" variant="subheading2">
        {info.section.title}
      </Text>
    </AnimatedFlex>
  ) : null
}

function key(recipient: SearchableRecipient): string {
  return `recipient-${recipient.address}`
}

interface RecipientProps {
  recipient: SearchableRecipient
  onPress: (recipient: SearchableRecipient) => void
}

export const RecipientRow = memo(function RecipientRow({ recipient, onPress }: RecipientProps): JSX.Element {
  const domain = recipient.name
    ? extractDomain(recipient.name, recipient.isUnitag ? SearchResultType.Unitag : SearchResultType.ENSAddress)
    : undefined

  const onPressWithAnalytics = (): void => {
    if (domain) {
      sendAnalyticsEvent(WalletEventName.SendRecipientSelected, {
        domain,
      })
    }
    onPress(recipient)
  }

  const isViewOnlyWallet = recipient.type === AccountType.Readonly
  const isNonUnitagSubdomain = !recipient.isUnitag && domain !== undefined && domain !== '.eth'

  return (
    <TouchableArea hapticFeedback onPress={onPressWithAnalytics}>
      <AddressDisplay
        includeUnitagSuffix
        address={recipient.address}
        overrideDisplayName={isNonUnitagSubdomain && recipient.name ? recipient.name : undefined}
        showViewOnlyBadge={isViewOnlyWallet}
        size={35}
      />
    </TouchableArea>
  )
})
