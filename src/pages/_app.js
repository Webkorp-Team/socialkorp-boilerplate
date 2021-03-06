import { StyleSheetManager, ThemeProvider } from 'styled-components';
import theme from 'styles/theme';

import initResponsiveToolkit from 'styled-components-responsive-toolkit';
import cssReset from 'css-config/css-reset';
import viewport from 'css-config/viewport';
import fonts from 'css-config/fonts';
import mediaQueries from 'css-config/media-queries';
import CodeVersion from 'components/CodeVersion';
import Head from 'next/head';

const {
  GlobalStyles,
  plugins,
} = initResponsiveToolkit({
  cssReset,
  viewport,
  fonts,
  mediaQueries,
});

function App({ Component, pageProps }) {
  return (
    <>

      <Head>
        <CodeVersion/>
      </Head>
      <GlobalStyles/>
      <ThemeProvider theme={ theme }>
        <StyleSheetManager stylisPlugins={plugins}>
          <Component {...pageProps} />
        </StyleSheetManager>
      </ThemeProvider>
    </>
  )
}

export default App;
