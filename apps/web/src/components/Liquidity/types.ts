// eslint-disable-next-line no-restricted-imports
import { PositionStatus, ProtocolVersion } from '@uniswap/client-pools/dist/pools/v1/types_pb'
import { Currency, CurrencyAmount, Token } from '@uniswap/sdk-core'
import { Pair } from '@uniswap/v2-sdk'
import { FeeAmount, Pool, Position } from '@uniswap/v3-sdk'
import { Dispatch, SetStateAction } from 'react'
import { PositionField } from 'types/position'

export interface DepositState {
  exactField: PositionField
  exactAmount?: string
}

export type DepositContextType = {
  depositState: DepositState
  setDepositState: Dispatch<SetStateAction<DepositState>>
  derivedDepositInfo: DepositInfo
}

export interface DepositInfo {
  formattedAmounts?: { [field in PositionField]?: string }
  currencyBalances?: { [field in PositionField]?: CurrencyAmount<Currency> }
  currencyAmounts?: { [field in PositionField]?: CurrencyAmount<Currency> }
  currencyAmountsUSDValue?: { [field in PositionField]?: CurrencyAmount<Currency> }
}

interface BasePositionInfo {
  status: PositionStatus
  version: ProtocolVersion
  currency0Amount: CurrencyAmount<Currency>
  currency1Amount: CurrencyAmount<Currency>
  tokenId?: string
  tickLower?: string
  tickUpper?: string
  tickSpacing?: number
  liquidity?: string
  liquidityToken?: Token
  totalSupply?: CurrencyAmount<Currency>
  liquidityAmount?: CurrencyAmount<Currency>
  token0UncollectedFees?: string
  token1UncollectedFees?: string
}

type V2PairInfo = BasePositionInfo & {
  version: ProtocolVersion.V2
  pair?: Pair
  liquidityToken: Token
  feeTier: undefined
  v4hook: undefined
}

type V3PositionInfo = BasePositionInfo & {
  version: ProtocolVersion.V3
  tokenId: string
  pool?: Pool
  feeTier?: FeeAmount
  position?: Position
  v4hook: undefined
}

type V4PositionInfo = BasePositionInfo & {
  version: ProtocolVersion.V4
  tokenId: string
  position?: Position
  feeTier?: string
  v4hook?: string
}

export type PositionInfo = V2PairInfo | V3PositionInfo | V4PositionInfo
