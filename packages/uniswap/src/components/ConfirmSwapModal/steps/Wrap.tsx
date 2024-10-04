import { useTranslation } from 'react-i18next'
import { StepRowProps, StepRowSkeleton } from 'uniswap/src/components/ConfirmSwapModal/steps/StepRowSkeleton'
import { StepStatus } from 'uniswap/src/components/ConfirmSwapModal/types'
import { uniswapUrls } from 'uniswap/src/constants/urls'
import { WrapTransactionStep } from 'uniswap/src/features/transactions/swap/utils/generateTransactionSteps'

export function WrapTransactionStepRow({ step, status }: StepRowProps<WrapTransactionStep>): JSX.Element {
  const { t } = useTranslation()

  const { amount } = step
  const { currency } = amount
  const { symbol } = currency

  const title = {
    [StepStatus.Active]: t('common.wrapIn', { symbol }),
    [StepStatus.InProgress]: t('common.wrappingToken', { symbol }),
    [StepStatus.Preview]: t('common.wrap', { symbol }),
    [StepStatus.Complete]: t('common.wrap', { symbol }),
  }[status]

  return (
    <StepRowSkeleton
      title={title}
      currency={currency}
      learnMore={{
        url: uniswapUrls.helpArticleUrls.wethExplainer,
        text: t('common.whyWrap', { symbol: currency.symbol }),
      }}
      status={status}
    />
  )
}
