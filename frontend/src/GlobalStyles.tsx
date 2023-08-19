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

      *,
      *::before,
      *::after {
        box-sizing: border-box;
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
        --shadow1: 0px 4px 0px rgba(0, 0, 0, 0.25);
        --shadow2: 0px 2px 0px 0px rgba(0, 0, 0, 0.25);
      }

      body {
        font-family: var(--fontSans);
        color: var(--colorWhite);
        background-color: var(--color1);
        margin: 0;
        
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      body::-webkit-scrollbar {
        width: 0.5rem;
        background: var(--color3);
      }

      body::-webkit-scrollbar-thumb {
        background: var(--color4);
      }

      #root {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

    `}/>
}
