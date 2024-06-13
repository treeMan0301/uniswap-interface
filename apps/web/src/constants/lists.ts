// Lists we use as fallbacks on chains that our backend doesn't support
const COINGECKO_AVAX_LIST = 'https://tokens.coingecko.com/avalanche/all.json'
const COINGECKO_ZKSYNC_LIST = 'https://tokens.coingecko.com/zksync/all.json'

export const DEFAULT_INACTIVE_LIST_URLS: string[] = [COINGECKO_AVAX_LIST, COINGECKO_ZKSYNC_LIST]
