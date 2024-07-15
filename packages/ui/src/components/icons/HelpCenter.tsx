import { Path, Svg } from 'react-native-svg'

// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths
import { createIcon } from '../factories/createIcon'

export const [HelpCenter, AnimatedHelpCenter] = createIcon({
  name: 'HelpCenter',
  getIcon: (props) => (
    <Svg fill="none" viewBox="0 0 24 24" {...props}>
      <Path
        d="M18 3H6C4 3 3 4 3 6V21L6 18H18C20 18 21 17 21 15V6C21 4 20 3 18 3ZM12.02 15C11.468 15 11.0149 14.552 11.0149 14C11.0149 13.448 11.458 13 12.01 13H12.02C12.573 13 13.02 13.448 13.02 14C13.02 14.552 12.572 15 12.02 15ZM13.345 11.051C12.789 11.421 12.713 11.608 12.71 11.616C12.597 11.918 12.3051 12.1121 11.9971 12.1121C11.9151 12.1121 11.833 12.098 11.752 12.069C11.367 11.932 11.1581 11.523 11.2891 11.135C11.4921 10.535 12.0849 10.087 12.5149 9.802C13.1509 9.379 13.1579 8.95004 13.1079 8.66504C13.0299 8.22404 12.6529 7.84604 12.2109 7.76904C11.8749 7.70804 11.5381 7.79494 11.2781 8.01294C11.0221 8.22794 10.876 8.542 10.876 8.875C10.876 9.289 10.54 9.625 10.126 9.625C9.71198 9.625 9.37598 9.289 9.37598 8.875C9.37598 8.097 9.71796 7.36401 10.314 6.86401C10.91 6.36401 11.6939 6.15402 12.4709 6.29102C13.5299 6.47702 14.399 7.34603 14.585 8.40503C14.769 9.45803 14.329 10.397 13.345 11.051Z"
        fill="currentColor"
      />
    </Svg>
  ),
})
