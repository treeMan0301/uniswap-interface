import { useTranslation } from 'react-i18next'
import { Button, Flex, Text, useSporeColors } from 'ui/src'
import { Language } from 'ui/src/components/icons'
import { ModalName } from 'uniswap/src/features/telemetry/constants'
import { BottomSheetModal } from 'wallet/src/components/modals/BottomSheetModal'
import { SettingsLanguageModalProps } from 'wallet/src/components/settings/language/SettingsLanguageModalProps'
import { opacify } from 'wallet/src/utils/colors'

export function SettingsLanguageModal({ onClose }: SettingsLanguageModalProps): JSX.Element {
  const colors = useSporeColors()
  const { t } = useTranslation()

  return (
    <BottomSheetModal name={ModalName.LanguageSelector} onClose={onClose}>
      <Flex p="$spacing4" pt="$spacing8">
        <Flex centered>
          <Flex
            borderRadius="$rounded12"
            p="$spacing12"
            style={{ backgroundColor: opacify(10, colors.DEP_blue300.val) }}>
            <Language color="$DEP_blue300" size="$icon.24" strokeWidth={1.5} />
          </Flex>
        </Flex>
        <Flex gap="$spacing24" pt="$spacing24">
          <Flex gap="$spacing8">
            <Text textAlign="center" variant="subheading1">
              {t('settings.setting.language.title')}
            </Text>
            <Text color="$neutral2" textAlign="center" variant="body3">
              {t('settings.setting.language.description.extension')}
            </Text>
          </Flex>
          <Button theme="tertiary" onPress={() => onClose()}>
            {t('common.button.ok')}
          </Button>
        </Flex>
      </Flex>
    </BottomSheetModal>
  )
}
