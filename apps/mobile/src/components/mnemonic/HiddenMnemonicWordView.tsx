import React from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text, TouchableArea, useShadowPropsMedium } from 'ui/src'
import { EyeSlash } from 'ui/src/components/icons'

const ROW_COUNT = 6

type HiddenMnemonicWordViewProps = {
  enableRevealButton?: boolean
  onRevealPress?: () => void
}
export function HiddenMnemonicWordView({
  enableRevealButton = false,
  onRevealPress,
}: HiddenMnemonicWordViewProps): JSX.Element {
  const { t } = useTranslation()
  const shadowProps = useShadowPropsMedium()

  return (
    <Flex mt="$spacing16">
      <Flex
        row
        alignItems="stretch"
        backgroundColor="$surface2"
        borderRadius="$rounded20"
        gap="$spacing36"
        px="$spacing32"
        py="$spacing24"
      >
        <HiddenWordViewColumn />
        <HiddenWordViewColumn />
      </Flex>
      {enableRevealButton && (
        <Flex centered height="100%" position="absolute" width="100%">
          <TouchableArea onPress={() => onRevealPress?.()}>
            <Flex
              {...shadowProps}
              row
              backgroundColor="$surface1"
              borderRadius="$rounded16"
              gap="$spacing4"
              paddingEnd="$spacing16"
              paddingStart="$spacing12"
              py="$spacing8"
            >
              <EyeSlash color="$accent1" size="$icon.20" />
              <Text color="$accent1" variant="buttonLabel3">
                {t('common.button.reveal')}
              </Text>
            </Flex>
          </TouchableArea>
        </Flex>
      )}
    </Flex>
  )
}

function HiddenWordViewColumn(): JSX.Element {
  return (
    <Flex grow gap="$spacing20">
      {new Array(ROW_COUNT).fill(0).map((_, idx) => (
        <Flex key={idx} backgroundColor="$surface3" borderRadius="$rounded20" height={10} />
      ))}
    </Flex>
  )
}
