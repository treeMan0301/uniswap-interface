import { Flex, Text, TouchableArea } from 'ui/src'
import Trace from 'uniswap/src/features/telemetry/Trace'
import { ElementNameType } from 'uniswap/src/features/telemetry/constants'

export interface ActionCardItem {
  title: string
  blurb: string
  icon: JSX.Element
  elementName: ElementNameType
  badgeText?: string
  onPress?: () => void
  BackgroundImageWrapperCallback?: React.FC<{ children: React.ReactNode }>
}

export const ActionCard = ({
  title,
  blurb,
  onPress,
  icon,
  elementName,
  BackgroundImageWrapperCallback,
}: ActionCardItem): JSX.Element => (
  <Trace logPress element={elementName}>
    <TouchableArea
      backgroundColor={BackgroundImageWrapperCallback ? undefined : '$surface1'}
      borderColor="$surface3"
      borderRadius="$rounded24"
      borderWidth={1}
      onPress={onPress}
    >
      <BackgroundWrapper BackgroundImageWrapper={BackgroundImageWrapperCallback}>
        <Flex centered shrink alignContent="center" gap="$spacing4" px="$spacing20" py="$spacing12">
          {icon}
          <Flex centered shrink alignContent="center">
            <Text textAlign="center" variant="buttonLabel3">
              {title}
            </Text>
            <Text color="$neutral2" textAlign="center" variant="body3">
              {blurb}
            </Text>
          </Flex>
        </Flex>
      </BackgroundWrapper>
    </TouchableArea>
  </Trace>
)

const BackgroundWrapper = ({
  children,
  BackgroundImageWrapper,
}: {
  children: React.ReactNode
  BackgroundImageWrapper?: React.FC<{ children: React.ReactNode }>
}): JSX.Element => {
  return BackgroundImageWrapper !== undefined ? (
    <BackgroundImageWrapper>{children}</BackgroundImageWrapper>
  ) : (
    <Flex>{children}</Flex>
  )
}
