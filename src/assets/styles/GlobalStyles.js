import { createGlobalStyle } from 'styled-components';
import ProductSansRegular from '../fonts/ProductSans-Regular.ttf';
import ProductSansBold from '../fonts/ProductSans-Bold.ttf';
import ProductSansMedium from '../fonts/ProductSans-Medium-500.ttf';

export default createGlobalStyle`
    @font-face {
        font-family: 'ProductSansRegular';
        src: url(${ProductSansRegular});
    }

    @font-face {
        font-family: 'ProductSansBold';
        src: url(${ProductSansBold});
    }

    @font-face {
        font-family: 'ProductSansMedium';
        src: url(${ProductSansMedium});
    }

    body {
        background-color: #ffffff;
        color: #767676;
        font-family: ProductSansRegular;
        font-size: 16px;
        margin: 0;
    }

    input[type=text],
    input[type=number],
    input[type=password],
    select {
      border-bottom: 1px solid #ccc;
      border-left: 0;
      border-right: 0;
      border-top: 0;
      color: rgba(0, 0, 0, 0.65);
      font-size: 16px;
      height: 40px;
      padding: 0 10px 0 0;
      width: 100%;

      &:focus {
        font-size: 16px;
        outline: none;
      }
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    input[type=number] {
      -moz-appearance: textfield;
    }

    label {
      font-size: 14px;
    }

    .input-errors {
      color: #f5222d;
      font-size: 14px;
      height: 21px;
      margin: 2px 0 0;
    }

    .wrapper {
        display: flex;
        flex-wrap: wrap;
        height: 100%;
        justify-content: center;
        padding-top: 75px;
      
        .container {
            margin: 0 20px;
            max-width: 500px;
            width: 100%;
      
          .form-content {
            background: #FFFFFF;
            border-radius: 15px;
            box-shadow: 0px 5px 10px 0px rgba(112,112,112,0.3);
      
            > header {
                padding: 10px 20px;
            }
      
            .header-bottom-border {
                border-bottom: 0.5px solid #E3E3E3;
            }
      
            > main {
                padding: 20px;
                position: relative;
      
              .form-content-submit-container,
              .form-content-submit-top-up-container {
                margin-top: 5px;
                padding: 10px 0 5px;
                text-align: center;
              }
            }
          }
        }
      
        .footer-submit-container {
            box-shadow: 0px -5px 10px -3px rgba(112,112,112,0.3);
            margin-top: 20px;
            padding-top: 10px;
            text-align: center;
            width: 100%;
        }
    }

    .deposit-submit-buttons,
    .deposit-submit-top-up-buttons {
        text-align: center;
    }

    .fallback-container {
        align-items: center;
        display: flex;
        justify-content: center;
        max-width: 500px;
        min-height: 500px;
    }

    .logo {
      margin: 25px 0;
      text-align: center;
    
      img {
        height: auto;
        max-width: 200px;
        width: 100%;
      }
    }

    .steps-bar-container {
      padding: 15px 0;
      text-align: center;
    }
    
    .progress-bar-container {
      color: rgba(0, 0, 0, 0.65);
      height: 200px;
      text-align: center;

      > img {
        animation: zoomInAndOut 0.5s ease-in-out;
        margin: 30px 0 2px;
      }
    
      > p {
        font-family: ProductSansRegular;
        font-size: 14px;
        font-weight: bold;
        margin: 0;
        text-align: center;
      }
    }

    progress {
      -webkit-appearance:none;
      border-radius: 7px;
      height: 8px;
      margin-bottom: 2px;
      width: 100%;

      &::-webkit-progress-bar {
          background: #f5f5f5;
          border-radius: 7px;
      }

      &::-webkit-progress-value {
          background: #34A220;
          border-radius: 7px;
          transition: width 0.5s linear;
      }

      &::-moz-progress-bar {
          background: #34A220;
      }
    }

    .mdc-button .mdc-button__icon {
        height: auto;
        width: auto;
    }

    .mdc-dialog .mdc-dialog__surface {
      border-radius: 15px;
    }

    @media (max-width: 47.999em) {
      .steps-container {
        display: none;
      }
    }

    @media (max-width: 37em) {
      .mdc-dialog .mdc-dialog__surface {
        max-width: calc(100vw - 41px);
      }
    }

    @media (max-width: 36em) {
      .steps-container {
        margin: 0rem 1rem;
      }
    }

    @media (min-width: 36em) {
      .progress-bar-container {
        min-width: 450px;
      }
    }

    @media (max-width: 23.438em) {
      .deposit-submit-buttons {
        > button {
          margin: 0 10px 20px;
        }
      }
    }

    @media only screen and (min-device-width : 25em) and (max-device-width : 26em) {
      .progress-bar-container {
          min-width: 325px;
      }
    }

    @media only screen and (min-device-width : 22em) and (max-device-width : 24em) {
      .progress-bar-container {
          min-width: 270px;
      }
    }

    @media (max-width: 22.438em) {
      .progress-bar-container {
          min-width: 232px;
      }
    }
    
    @keyframes zoomInAndOut {
      0% {
          transform: scale(1,1);
      }
      50% {
          transform: scale(1.2,1.2);
      }
      100% {
          transform: scale(1,1);
      }
    }
`;