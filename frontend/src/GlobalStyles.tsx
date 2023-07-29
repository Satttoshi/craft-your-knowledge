import { Global, css } from '@emotion/react';

export default function GlobalStyles() {
    return <Global styles={css`

      @font-face {
        font-family: 'Nunito Sans';
        src: url("/fonts/NunitoSans.ttf") format("truetype");
        font-weight: 1 999;
      }

      @font-face {
        font-family: 'Source Code Pro';
        src: url("/fonts/SourceCodePro.ttf") format("truetype");
        font-weight: 1 999;
      }
      
      :root {
        --fontSans: 'Nunito Sans', sans-serif;
        --fontCode: 'Source Code Pro', monospace;
      }
      
      body {
        font-family: var(--fontSans);
        color: antiquewhite;
        background-color: #1e1e1e;
      }

    `}/>
}