import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FadeIn } from 'react-native-reanimated'
import { useDispatch } from 'react-redux'
import { Button, Flex, SpinningLoader, isWeb, useHapticFeedback, useIsShortMobileDevice } from 'ui/src'
import { BackArrow } from 'ui/src/components/icons/BackArrow'
import { AnimatedFlex } from 'ui/src/components/layout/AnimatedFlex'
import { iconSizes } from 'ui/src/theme'
import { ProgressIndicator } from 'uniswap/src/components/ConfirmSwapModal/ProgressIndicator'
import { WarningModal } from 'uniswap/src/components/modals/WarningModal/WarningModal'
import { useAccountMeta } from 'uniswap/src/contexts/UniswapContext'
import { AccountType } from 'uniswap/src/features/accounts/types'
import { ModalName } from 'uniswap/src/features/telemetry/constants'
import { TransactionDetails } from 'uniswap/src/features/transactions/TransactionDetails/TransactionDetails'
import {
  TransactionModalFooterContainer,
  TransactionModalInnerContainer,
} from 'uniswap/src/features/transactions/TransactionModal/TransactionModal'
import {
  TransactionScreen,
  useTransactionModalContext,
} from 'uniswap/src/features/transactions/TransactionModal/TransactionModalContext'
import { useSwapFormContext } from 'uniswap/src/features/transactions/swap/contexts/SwapFormContext'
import { useSwapTxContext } from 'uniswap/src/features/transactions/swap/contexts/SwapTxContext'
import { useAcceptedTrade } from 'uniswap/src/features/transactions/swap/hooks/useAcceptedTrade'
import { useParsedSwapWarnings } from 'uniswap/src/features/transactions/swap/hooks/useSwapWarnings'
import { SubmitSwapButton } from 'uniswap/src/features/transactions/swap/review/SubmitSwapButton'
import { SwapDetails } from 'uniswap/src/features/transactions/swap/review/SwapDetails'
import { SwapErrorScreen } from 'uniswap/src/features/transactions/swap/review/SwapErrorScreen'
import { TransactionAmountsReview } from 'uniswap/src/features/transactions/swap/review/TransactionAmountsReview'
import { SwapCallback } from 'uniswap/src/features/transactions/swap/types/swapCallback'
import { isValidSwapTxContext } from 'uniswap/src/features/transactions/swap/types/swapTxAndGasInfo'
import { WrapCallback } from 'uniswap/src/features/transactions/swap/types/wrapCallback'
import { TransactionStep } from 'uniswap/src/features/transactions/swap/utils/generateTransactionSteps'
import { isUniswapX } from 'uniswap/src/features/transactions/swap/utils/routing'
import { isWrapAction } from 'uniswap/src/features/transactions/swap/utils/wrap'
import { CurrencyField } from 'uniswap/src/types/currency'
import { createTransactionId } from 'uniswap/src/utils/createTransactionId'
import { interruptTransactionFlow } from 'uniswap/src/utils/saga'
import { isInterface } from 'utilities/src/platform'

interface SwapReviewScreenProps {
  hideContent: boolean
  swapCallback: SwapCallback
  wrapCallback: WrapCallback
}

// eslint-disable-next-line complexity
export function SwapReviewScreen(props: SwapReviewScreenProps): JSX.Element | null {
  const { hideContent, swapCallback, wrapCallback } = props

  const dispatch = useDispatch()
  const { t } = useTranslation()
  const isShortMobileDevice = useIsShortMobileDevice()

  const [showWarningModal, setShowWarningModal] = useState(false)
  const [warningAcknowledged, setWarningAcknowledged] = useState(false)
  const [shouldSubmitTx, setShouldSubmitTx] = useState(false)

  // Submission error UI is currently interface-only
  const [submissionError, setSubmissionError] = useState<Error>()

  const account = useAccountMeta()
  const { bottomSheetViewStyles, onClose, authTrigger, setScreen } = useTransactionModalContext()

  const [steps, setSteps] = useState<TransactionStep[]>([])
  const [currentStep, setCurrentStep] = useState<{ step: TransactionStep; accepted: boolean } | undefined>()
  const showInterfaceReviewSteps = Boolean(isInterface && currentStep && steps.length > 1) // Only show review steps UI for interface, while a step is active and there is more than 1 step

  const swapTxContext = useSwapTxContext()
  const { gasFee } = swapTxContext
  const uniswapXGasBreakdown = isUniswapX(swapTxContext) ? swapTxContext.gasFeeBreakdown : undefined
  const { hapticFeedback } = useHapticFeedback()

  const {
    derivedSwapInfo,
    exactCurrencyField: ctxExactCurrencyField,
    focusOnCurrencyField,
    isSubmitting,
    updateSwapForm,
    isFiatMode,
  } = useSwapFormContext()

  const onSuccess = useCallback(() => {
    // On interface, the swap component stays mounted; after swap we reset the form to avoid showing the previous values.
    if (isInterface) {
      updateSwapForm({ exactAmountFiat: undefined, exactAmountToken: '', isSubmitting: false })
      setScreen(TransactionScreen.Form)
    }
    onClose()
  }, [onClose, setScreen, updateSwapForm])

  const {
    autoSlippageTolerance,
    chainId,
    currencies,
    currencyAmounts,
    currencyAmountsUSDValue,
    customSlippageTolerance,
    txId,
    wrapType,
    trade: { trade, indicativeTrade },
  } = derivedSwapInfo

  const isWrap = isWrapAction(wrapType)

  const { blockingWarning, reviewScreenWarning } = useParsedSwapWarnings()

  const {
    onAcceptTrade,
    acceptedDerivedSwapInfo: swapAcceptedDerivedSwapInfo,
    newTradeRequiresAcceptance,
  } = useAcceptedTrade({
    derivedSwapInfo,
    isSubmitting,
  })

  const acceptedDerivedSwapInfo = isWrap ? derivedSwapInfo : swapAcceptedDerivedSwapInfo
  const acceptedTrade = acceptedDerivedSwapInfo?.trade.trade

  const onPrev = useCallback(() => {
    if (!focusOnCurrencyField) {
      // We make sure that one of the input fields is focused (and the `DecimalPad` open) when the user goes back.
      updateSwapForm({ focusOnCurrencyField: ctxExactCurrencyField })
    }
    // On interface, closing the review modal should cancel the transaction flow saga and remove submitting UI.
    if (isInterface) {
      updateSwapForm({ isSubmitting: false })
      dispatch(interruptTransactionFlow())
    }

    setScreen(TransactionScreen.Form)
  }, [ctxExactCurrencyField, focusOnCurrencyField, setScreen, updateSwapForm, dispatch])

  const onFailure = useCallback(
    (error?: Error) => {
      setCurrentStep(undefined)

      // Create a new txId for the next transaction, as the existing one may be used in state to track the failed submission.
      const newTxId = createTransactionId()
      updateSwapForm({ isSubmitting: false, txId: newTxId })

      setSubmissionError(error)
    },
    [updateSwapForm],
  )

  const onWrap = useMemo(() => {
    const inputCurrencyAmount = currencyAmounts[CurrencyField.INPUT]
    const txRequest = isUniswapX(swapTxContext) ? undefined : swapTxContext.txRequest
    if (!txRequest || !isWrap || !account || !inputCurrencyAmount) {
      return (): void => {}
    }

    return () => {
      wrapCallback({
        account,
        inputCurrencyAmount,
        onSuccess,
        onFailure,
        txRequest,
        txId,
        wrapType,
        gasEstimates: swapTxContext.gasFeeEstimation.wrapEstimates,
      })
    }
  }, [account, currencyAmounts, isWrap, onSuccess, onFailure, swapTxContext, txId, wrapCallback, wrapType])

  const { onSwap, validSwap } = useMemo(() => {
    const isValidSwap = isValidSwapTxContext(swapTxContext)

    if (isValidSwap && account?.type === AccountType.SignerMnemonic) {
      return {
        onSwap: (): void => {
          swapCallback({
            account,
            swapTxContext,
            currencyInAmountUSD: currencyAmountsUSDValue[CurrencyField.INPUT],
            currencyOutAmountUSD: currencyAmountsUSDValue[CurrencyField.OUTPUT],
            isAutoSlippage: !customSlippageTolerance,
            onSuccess,
            onFailure,
            txId,
            isFiatInputMode: isFiatMode,
            setCurrentStep,
            setSteps,
          })
        },
        validSwap: true,
      }
    } else {
      return {
        onSwap: (): void => {},
        validSwap: false,
      }
    }
  }, [
    account,
    currencyAmountsUSDValue,
    customSlippageTolerance,
    isFiatMode,
    onSuccess,
    onFailure,
    swapCallback,
    swapTxContext,
    txId,
  ])

  const submitTransaction = useCallback(() => {
    if (reviewScreenWarning && !showWarningModal && !warningAcknowledged) {
      setShouldSubmitTx(true)
      setShowWarningModal(true)
      return
    }

    isWrap ? onWrap() : onSwap()
  }, [reviewScreenWarning, showWarningModal, warningAcknowledged, isWrap, onWrap, onSwap])

  const onSwapButtonClick = useCallback(async () => {
    updateSwapForm({ isSubmitting: true })

    await hapticFeedback.success()

    if (authTrigger) {
      await authTrigger({
        successCallback: submitTransaction,
        failureCallback: onFailure,
      })
    } else {
      submitTransaction()
    }
  }, [authTrigger, hapticFeedback, onFailure, submitTransaction, updateSwapForm])

  const submitButtonDisabled =
    (!validSwap && !isWrap) || !!blockingWarning || newTradeRequiresAcceptance || isSubmitting

  const showUniswapXSubmittingUI = isUniswapX(swapTxContext) && isSubmitting && !isInterface

  const onConfirmWarning = useCallback(() => {
    setWarningAcknowledged(true)
    setShowWarningModal(false)

    if (shouldSubmitTx) {
      isWrap ? onWrap() : onSwap()
    }
  }, [shouldSubmitTx, isWrap, onWrap, onSwap])

  const onCancelWarning = useCallback(() => {
    if (shouldSubmitTx) {
      onFailure()
    }

    setShowWarningModal(false)
    setWarningAcknowledged(false)
    setShouldSubmitTx(false)
  }, [onFailure, shouldSubmitTx])

  const onShowWarning = useCallback(() => {
    setShowWarningModal(true)
  }, [])

  const onCloseWarning = useCallback(() => {
    setShowWarningModal(false)
  }, [])

  if (hideContent || !acceptedDerivedSwapInfo || (!isWrap && !indicativeTrade && (!acceptedTrade || !trade))) {
    // We forcefully hide the content via `hideContent` to allow the bottom sheet to animate faster while still allowing all API requests to trigger ASAP.
    // A missing `acceptedTrade` or `trade` can happen when the user leaves the app and comes back to the review screen after 1 minute when the TTL for the quote has expired.
    // When that happens, we remove the quote from the cache before refetching, so there's no `trade`.
    return (
      // The value of `height + mb` must be equal to the height of the fully rendered component to avoid any jumps.
      <Flex centered height={377} mb="$spacing28">
        {!hideContent && <SpinningLoader size={iconSizes.icon40} />}
      </Flex>
    )
  }

  const currencyInInfo = currencies[CurrencyField.INPUT]
  const currencyOutInfo = currencies[CurrencyField.OUTPUT]

  if (
    !currencyInInfo ||
    !currencyOutInfo ||
    !currencyAmounts[CurrencyField.INPUT] ||
    !currencyAmounts[CurrencyField.OUTPUT] ||
    !acceptedDerivedSwapInfo.currencyAmounts[CurrencyField.INPUT] ||
    !acceptedDerivedSwapInfo.currencyAmounts[CurrencyField.OUTPUT]
  ) {
    // This should never happen. It's just to keep TS happy.
    throw new Error('Missing required props in `derivedSwapInfo` to render `SwapReview` screen.')
  }

  if (submissionError) {
    return (
      <SwapErrorScreen
        submissionError={submissionError}
        setSubmissionError={setSubmissionError}
        resubmitSwap={onSwapButtonClick}
        onClose={onPrev}
      />
    )
  }

  return (
    <>
      <TransactionModalInnerContainer bottomSheetViewStyles={bottomSheetViewStyles} fullscreen={false}>
        {reviewScreenWarning?.warning.title && (
          <WarningModal
            caption={reviewScreenWarning.warning.message}
            rejectText={blockingWarning ? undefined : t('common.button.cancel')}
            acknowledgeText={blockingWarning ? t('common.button.ok') : t('common.button.confirm')}
            isOpen={showWarningModal}
            modalName={ModalName.SwapWarning}
            severity={reviewScreenWarning.warning.severity}
            title={reviewScreenWarning.warning.title}
            onReject={onCancelWarning}
            onClose={onCloseWarning}
            onAcknowledge={onConfirmWarning}
          />
        )}

        <>
          <AnimatedFlex entering={FadeIn} gap="$spacing16" pt={isWeb ? '$spacing8' : undefined}>
            <TransactionAmountsReview
              acceptedDerivedSwapInfo={acceptedDerivedSwapInfo}
              newTradeRequiresAcceptance={newTradeRequiresAcceptance}
              onClose={onPrev}
            />

            {showInterfaceReviewSteps ? (
              <ProgressIndicator currentStep={currentStep} steps={steps} />
            ) : isWrap ? (
              <TransactionDetails
                chainId={chainId}
                gasFee={gasFee}
                warning={reviewScreenWarning?.warning}
                onShowWarning={onShowWarning}
              />
            ) : (
              <SwapDetails
                acceptedDerivedSwapInfo={acceptedDerivedSwapInfo}
                autoSlippageTolerance={autoSlippageTolerance}
                customSlippageTolerance={customSlippageTolerance}
                derivedSwapInfo={derivedSwapInfo}
                gasFee={gasFee}
                newTradeRequiresAcceptance={newTradeRequiresAcceptance}
                uniswapXGasBreakdown={uniswapXGasBreakdown}
                warning={reviewScreenWarning?.warning}
                onAcceptTrade={onAcceptTrade}
                onShowWarning={onShowWarning}
              />
            )}
          </AnimatedFlex>
        </>
      </TransactionModalInnerContainer>
      {!showInterfaceReviewSteps && (
        <TransactionModalFooterContainer>
          <Flex row gap="$spacing8">
            {!isWeb && !showUniswapXSubmittingUI && (
              <Button
                icon={<BackArrow />}
                size={isShortMobileDevice ? 'medium' : 'large'}
                theme="tertiary"
                onPress={onPrev}
              />
            )}
            <SubmitSwapButton
              disabled={submitButtonDisabled}
              showUniswapXSubmittingUI={showUniswapXSubmittingUI}
              warning={reviewScreenWarning?.warning}
              onSubmit={onSwapButtonClick}
            />
          </Flex>
        </TransactionModalFooterContainer>
      )}
    </>
  )
}
