import { G, Path, Svg } from 'react-native-svg'

// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths
import { createIcon } from '../factories/createIcon'

export const [FileListCheck, AnimatedFileListCheck] = createIcon({
  name: 'FileListCheck',
  getIcon: (props) => (
    <Svg viewBox="0 0 38 38" fill="none" {...props}>
      <G id="file-list-check">
        <Path
          id="file-list-check_2"
          d="M20.1357 8.42298V5.02298L26.9357 11.823H23.5357C21.1481 11.823 20.1357 10.8105 20.1357 8.42298ZM20.1206 30.4852C20.2112 30.7874 19.9996 31.0896 19.6974 31.0896H9.93568C6.91346 31.0896 5.40234 29.5785 5.40234 26.5563V8.42298C5.40234 5.40076 6.91346 3.88965 9.93568 3.88965H17.869V8.42298C17.869 12.0799 19.8788 14.0896 23.5357 14.0896H28.069V19.3181C28.069 19.5599 27.8725 19.7563 27.6307 19.7714C23.2636 19.9981 19.7579 23.6399 19.7579 28.0674C19.7579 28.9136 19.8788 29.7297 20.1206 30.4852ZM12.5801 23.5341C12.5801 22.9085 12.0724 22.4008 11.4468 22.4008C10.8212 22.4008 10.3135 22.9085 10.3135 23.5341C10.3135 24.1597 10.8212 24.6674 11.4468 24.6674C12.0724 24.6674 12.5801 24.1597 12.5801 23.5341ZM12.5801 17.4896C12.5801 16.864 12.0724 16.3563 11.4468 16.3563C10.8212 16.3563 10.3135 16.864 10.3135 17.4896C10.3135 18.1152 10.8212 18.623 11.4468 18.623C12.0724 18.623 12.5801 18.1152 12.5801 17.4896ZM18.6246 23.5341C18.6246 22.9085 18.1168 22.4008 17.4912 22.4008H15.2246C14.599 22.4008 14.0912 22.9085 14.0912 23.5341C14.0912 24.1597 14.599 24.6674 15.2246 24.6674H17.4912C18.1168 24.6674 18.6246 24.1597 18.6246 23.5341ZM22.0246 18.623C22.6502 18.623 23.1579 18.1152 23.1579 17.4896C23.1579 16.864 22.6502 16.3563 22.0246 16.3563H15.2246C14.599 16.3563 14.0912 16.864 14.0912 17.4896C14.0912 18.1152 14.599 18.623 15.2246 18.623H22.0246ZM34.1135 28.0674C34.1135 31.4055 31.4071 34.1119 28.069 34.1119C24.731 34.1119 22.0246 31.4055 22.0246 28.0674C22.0246 24.7294 24.731 22.023 28.069 22.023C31.4071 22.023 34.1135 24.7294 34.1135 28.0674ZM30.4928 26.2737C30.1982 25.9791 29.7191 25.9791 29.4244 26.2737L27.4404 28.2578L26.7165 27.5325C26.4219 27.2378 25.9428 27.2378 25.6481 27.5325C25.3535 27.8272 25.3535 28.3062 25.6481 28.6008L26.9069 29.8596C27.0489 30.0017 27.2409 30.0802 27.4418 30.0802C27.6428 30.0802 27.8347 30.0001 27.9768 29.8596L30.4958 27.3406C30.7874 27.0474 30.7875 26.5699 30.4928 26.2737Z"
          fill={'currentColor' ?? '#FC74FE'}
        />
      </G>
    </Svg>
  ),
  defaultFill: '#FC74FE',
})
