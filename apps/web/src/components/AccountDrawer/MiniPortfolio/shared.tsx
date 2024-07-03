import Column from 'components/Column'
import Row from 'components/Row'
import { ReactNode } from 'react'
import { ArrowRight } from 'react-feather'
import styled, { useTheme } from 'styled-components'
import { ClickableStyle, ThemedText } from 'theme/components'
import { Text } from 'ui/src'

const Container = styled.button`
  border-radius: 16px;
  border: none;
  background: ${({ theme }) => theme.surface2};
  padding: 12px 16px;
  margin-top: 12px;
  ${ClickableStyle}
`

interface TabButtonProps {
  text: ReactNode
  icon: ReactNode
  extraWarning?: ReactNode
  onClick: () => void
  disabled?: boolean
  className?: string
}

export function TabButton({ text, icon, extraWarning, onClick, disabled, className }: TabButtonProps) {
  const theme = useTheme()

  return (
    <Container onClick={onClick} disabled={disabled} className={className}>
      <Row justify="space-between" align="center">
        <Row gap="md">
          {icon}
          <Column>
            <Text variant="buttonLabel4" color="$neutral2" lineHeight="20px" fontWeight="535">
              {text}
            </Text>
            {extraWarning && <ThemedText.LabelMicro>{extraWarning}</ThemedText.LabelMicro>}
          </Column>
        </Row>
        <ArrowRight color={theme.neutral2} size="20px" />
      </Row>
    </Container>
  )
}
