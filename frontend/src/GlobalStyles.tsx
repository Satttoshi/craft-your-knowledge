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
        
        --color1: #000F18;
        --color2: #001928;
        --color3: #002343;
        --color4: #00B07E;
        --color5: #F2BD1D;
        --colorWhite: #F1EEE6;
        --colorBlack: #01090E;
      }
      
      body {
        font-family: var(--fontSans);
        color: var(--colorWhite);
        background-color: var(--color2);
      }

    `}/>
}
