import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'
import { Button, Flex, Text, useSporeColors } from 'ui/src'
import { Language } from 'ui/src/components/icons'
import { ElementName, ModalName } from 'uniswap/src/features/telemetry/constants'
import { isAndroid } from 'utilities/src/platform'
import { BottomSheetModal } from 'wallet/src/components/modals/BottomSheetModal'
import { SettingsLanguageModalProps } from 'wallet/src/components/settings/language/SettingsLanguageModalProps'
import { opacify } from 'wallet/src/utils/colors'

const openLanguageSettings = async (): Promise<void> => {
  if (isAndroid) {
    await Linking.openSettings()
  } else {
    await Linking.openURL('app-settings:')
  }
}

export function SettingsLanguageModal({ onClose }: SettingsLanguageModalProps): JSX.Element {
  const { t } = useTranslation()
  const colors = useSporeColors()

  return (
    <BottomSheetModal name={ModalName.LanguageSelector} onClose={onClose}>
      <Flex centered mt="$spacing16">
        <Flex
          borderRadius="$rounded12"
          p="$spacing12"
          style={{ backgroundColor: opacify(10, colors.DEP_blue300.val) }}>
          <Language color="$DEP_blue300" size="$icon.24" strokeWidth={1.5} />
        </Flex>
      </Flex>
      <Flex gap="$spacing24" pt="$spacing24" px="$spacing24">
        <Flex gap="$spacing8">
          <Text textAlign="center" variant="subheading1">
            {t('settings.setting.language.title')}
          </Text>
          <Text color="$neutral2" textAlign="center" variant="body3">
            {t('settings.setting.language.description.mobile')}
          </Text>
        </Flex>
        <Button
          testID={ElementName.OpenDeviceLanguageSettings}
          theme="tertiary"
          onPress={openLanguageSettings}>
          {t('settings.setting.language.button.navigate')}
        </Button>
      </Flex>
    </BottomSheetModal>
  )
}
