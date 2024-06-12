import { useAccountDrawer } from 'components/AccountDrawer/MiniPortfolio/hooks'
import { useActivePopups } from 'state/application/hooks'
import styled from 'styled-components'
import { Z_INDEX } from 'theme/zIndex'

import UniconV2InfoPopup, { showUniconV2InfoPopupAtom } from 'components/Popups/UniconV2InfoPopup'
import { useAtomValue } from 'jotai/utils'
import { AutoColumn } from '../Column'
import ClaimPopup from './ClaimPopup'
import PopupItem from './PopupItem'

const StickyContainer = styled.div`
  position: absolute;
  top: 12px;
  width: 100vw;
  display: flex;
  justify-content: end;
  padding-right: 12px;
`
const MobilePopupWrapper = styled.div`
  position: relative;
  max-width: 100%;
  margin: 0 auto;
  display: none;

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToSmall`
    display: block;
    padding-top: 20px;
  `};
`
const MobilePopupInner = styled.div`
  height: 99%;
  display: flex;
  flex-direction: row;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`
const FixedPopupColumn = styled(AutoColumn)<{
  drawerOpen: boolean
  showUniconV2InfoPopup: boolean
}>`
  position: fixed;
  max-width: 348px;
  width: 100%;
  z-index: ${Z_INDEX.fixed};
  transition: ${({ theme }) => `top ${theme.transition.timing.inOut} ${theme.transition.duration.slow}`};

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToSmall`
    display: none;
  `};
`

export default function Popups() {
  const accountDrawer = useAccountDrawer()

  // get all popups
  const activePopups = useActivePopups()
  const showUniconV2InfoPopup = useAtomValue(showUniconV2InfoPopupAtom)

  const hasPopups = showUniconV2InfoPopup || activePopups?.length > 0

  return (
    <>
      <StickyContainer>
        <FixedPopupColumn
          gap="20px"
          drawerOpen={accountDrawer.isOpen}
          showUniconV2InfoPopup={showUniconV2InfoPopup}
          data-testid="popups"
        >
          <ClaimPopup />
          <UniconV2InfoPopup />
          {activePopups.map((item) => (
            <PopupItem key={item.key} content={item.content} popKey={item.key} removeAfterMs={item.removeAfterMs} />
          ))}
        </FixedPopupColumn>
      </StickyContainer>
      {hasPopups && (
        <MobilePopupWrapper data-testid="popups">
          <MobilePopupInner>
            <UniconV2InfoPopup />
            {activePopups // reverse so new items up front
              .slice(0)
              .reverse()
              .map((item) => (
                <PopupItem key={item.key} content={item.content} popKey={item.key} removeAfterMs={item.removeAfterMs} />
              ))}
          </MobilePopupInner>
        </MobilePopupWrapper>
      )}
    </>
  )
}
