import { useFocusEffect, useNavigation } from '@react-navigation/core'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ListRenderItemInfo, SectionList } from 'react-native'
import { SvgProps } from 'react-native-svg'
import { useDispatch } from 'react-redux'
import { navigate } from 'src/app/navigation/rootNavigation'
import {
  OnboardingStackNavigationProp,
  SettingsStackNavigationProp,
  SettingsStackParamList,
} from 'src/app/navigation/types'
import {
  SettingsRow,
  SettingsSection,
  SettingsSectionItem,
  SettingsSectionItemComponent,
} from 'src/components/Settings/SettingsRow'
import { BackHeader } from 'src/components/layout/BackHeader'
import { Screen } from 'src/components/layout/Screen'
import { openModal } from 'src/features/modals/modalSlice'
import { promptPushPermission } from 'src/features/notifications/Onesignal'
import {
  NotificationPermission,
  useNotificationOSPermissionsEnabled,
} from 'src/features/notifications/hooks/useNotificationOSPermissionsEnabled'
import { showNotificationSettingsAlert } from 'src/screens/Onboarding/NotificationsSetupScreen'
import { Button, Flex, Text, useSporeColors } from 'ui/src'
import NotificationIcon from 'ui/src/assets/icons/bell.svg'
import GlobalIcon from 'ui/src/assets/icons/global.svg'
import TextEditIcon from 'ui/src/assets/icons/textEdit.svg'
import { iconSizes, spacing } from 'ui/src/theme'
import { AccountType } from 'uniswap/src/features/accounts/types'
import { MobileEventName, ModalName } from 'uniswap/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'uniswap/src/features/telemetry/send'
import { useUnitagByAddress } from 'uniswap/src/features/unitags/hooks'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'
import { UniverseChainId } from 'uniswap/src/types/chains'
import { MobileScreens, UnitagScreens } from 'uniswap/src/types/screens/mobile'
import { AddressDisplay } from 'wallet/src/components/accounts/AddressDisplay'
import { Switch } from 'wallet/src/components/buttons/Switch'
import { useENS } from 'wallet/src/features/ens/useENS'
import { EditAccountAction, editAccountActions } from 'wallet/src/features/wallet/accounts/editAccountSaga'
import { useAccounts, useSelectAccountNotificationSetting } from 'wallet/src/features/wallet/hooks'

type Props = NativeStackScreenProps<SettingsStackParamList, MobileScreens.SettingsWallet>

// Specific design request not in standard sizing type
const UNICON_ICON_SIZE = 56

export function SettingsWallet({
  route: {
    params: { address },
  },
}: Props): JSX.Element {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const colors = useSporeColors()
  const addressToAccount = useAccounts()
  const currentAccount = addressToAccount[address]
  const ensName = useENS(UniverseChainId.Mainnet, address)?.name
  const { unitag } = useUnitagByAddress(address)
  const readonly = currentAccount?.type === AccountType.Readonly
  const navigation = useNavigation<SettingsStackNavigationProp & OnboardingStackNavigationProp>()

  const notificationOSPermission = useNotificationOSPermissionsEnabled()
  const notificationsEnabledOnFirebase = useSelectAccountNotificationSetting(address)
  const [notificationSwitchEnabled, setNotificationSwitchEnabled] = useState<boolean>(notificationsEnabledOnFirebase)

  const showEditProfile = !readonly

  useEffect(() => {
    // If the user deletes the account while on this screen, go back
    if (!currentAccount) {
      navigation.goBack()
    }
  }, [currentAccount, navigation])

  // Need to trigger a state update when the user backgrounds the app to enable notifications and then returns to this screen
  useFocusEffect(
    useCallback(
      () =>
        setNotificationSwitchEnabled(
          notificationsEnabledOnFirebase && notificationOSPermission === NotificationPermission.Enabled,
        ),
      [notificationOSPermission, notificationsEnabledOnFirebase],
    ),
  )

  const onChangeNotificationSettings = (enabled: boolean): void => {
    sendAnalyticsEvent(MobileEventName.NotificationsToggled, { enabled })
    if (notificationOSPermission === NotificationPermission.Enabled) {
      dispatch(
        editAccountActions.trigger({
          type: EditAccountAction.TogglePushNotification,
          enabled,
          address,
        }),
      )
      setNotificationSwitchEnabled(enabled)
    } else {
      promptPushPermission(() => {
        dispatch(
          editAccountActions.trigger({
            type: EditAccountAction.TogglePushNotification,
            enabled: true,
            address,
          }),
        )
        setNotificationSwitchEnabled(enabled)
      }, showNotificationSettingsAlert)
    }
  }

  const iconProps: SvgProps = {
    color: colors.neutral2.get(),
    height: iconSizes.icon24,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: '2',
    width: iconSizes.icon24,
  }

  const editNicknameSectionOption: SettingsSectionItem = {
    screen: MobileScreens.SettingsWalletEdit,
    text: t('settings.setting.wallet.label'),
    icon: <TextEditIcon fill={colors.neutral2.get()} {...iconProps} />,
    screenProps: { address },
    isHidden: !!ensName || !!unitag?.username,
  }

  const sections: SettingsSection[] = [
    {
      subTitle: t('settings.setting.wallet.preferences.title'),
      data: [
        ...(showEditProfile ? [] : [editNicknameSectionOption]),
        {
          action: (
            <Switch
              disabled={notificationOSPermission === NotificationPermission.Loading}
              value={notificationSwitchEnabled}
              onValueChange={onChangeNotificationSettings}
            />
          ),
          text: t('settings.setting.wallet.notifications.title'),
          icon: <NotificationIcon {...iconProps} />,
        },
        {
          screen: MobileScreens.SettingsWalletManageConnection,
          text: t('settings.setting.wallet.connections.title'),
          icon: <GlobalIcon {...iconProps} />,
          screenProps: { address },
          isHidden: readonly,
        },
      ],
    },
  ]

  const renderItem = ({
    item,
  }: ListRenderItemInfo<SettingsSectionItem | SettingsSectionItemComponent>): JSX.Element | null => {
    if ('component' in item) {
      return item.component
    }
    if (item.isHidden) {
      return null
    }
    return <SettingsRow key={item.screen} navigation={navigation} page={item} />
  }

  const onRemoveWallet = (): void => {
    dispatch(
      openModal({
        name: ModalName.RemoveWallet,
        initialState: { address },
      }),
    )
  }

  return (
    <Screen>
      <BackHeader alignment="center" mx="$spacing16" pt="$spacing16">
        <Flex shrink>
          <AddressDisplay hideAddressInSubtitle address={address} showAccountIcon={false} variant="body1" />
        </Flex>
      </BackHeader>

      <Flex fill p="$spacing24" pb="$spacing12">
        <Flex fill>
          <SectionList
            ItemSeparatorComponent={renderItemSeparator}
            ListHeaderComponent={showEditProfile ? <AddressDisplayHeader address={address} /> : undefined}
            keyExtractor={(_item, index): string => 'wallet_settings' + index}
            renderItem={renderItem}
            renderSectionFooter={(): JSX.Element => <Flex pt="$spacing24" />}
            renderSectionHeader={({ section: { subTitle } }): JSX.Element => (
              <Flex backgroundColor="$surface1" pb="$spacing12">
                <Text color="$neutral2" variant="body1">
                  {subTitle}
                </Text>
              </Flex>
            )}
            sections={sections.filter((p) => !p.isHidden)}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={false}
          />
        </Flex>
        <Button testID={TestID.Remove} theme="detrimental" onPress={onRemoveWallet}>
          {t('settings.setting.wallet.action.remove')}
        </Button>
      </Flex>
    </Screen>
  )
}

const renderItemSeparator = (): JSX.Element => <Flex pt="$spacing8" />

function AddressDisplayHeader({ address }: { address: Address }): JSX.Element {
  const { t } = useTranslation()
  const ensName = useENS(UniverseChainId.Mainnet, address)?.name
  const { unitag } = useUnitagByAddress(address)

  const onPressEditProfile = (): void => {
    if (unitag?.username) {
      navigate(MobileScreens.UnitagStack, {
        screen: UnitagScreens.EditProfile,
        params: {
          address,
          unitag: unitag.username,
          entryPoint: MobileScreens.SettingsWallet,
        },
      })
    } else {
      navigate(MobileScreens.SettingsWalletEdit, {
        address,
      })
    }
  }

  return (
    <Flex gap="$spacing12" justifyContent="flex-start" pb="$spacing24">
      <Flex shrink>
        <AddressDisplay
          address={address}
          captionVariant="subheading2"
          gapBetweenLines={spacing.spacing4}
          showIconBackground={true}
          size={UNICON_ICON_SIZE}
          variant="body1"
        />
      </Flex>
      {(!ensName || !!unitag) && (
        <Button color="$neutral1" fontSize="$small" size="medium" theme="secondary_Button" onPress={onPressEditProfile}>
          {unitag?.username
            ? t('settings.setting.wallet.action.editProfile')
            : t('settings.setting.wallet.action.editLabel')}
        </Button>
      )}
    </Flex>
  )
}
