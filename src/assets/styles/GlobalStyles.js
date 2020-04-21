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
        font-family: ProductSansRegular;
        font-size: 16px;
    }

    input[type=text], select {
      border-bottom: 1px solid #ccc;
      border-left: 0;
      border-right: 0;
      border-top: 0;
      height: 40px;
      padding: 6px 11px;
      width: 100%;
    }

    label {
      font-size: 14px;
    }

    .wrapper {
        display: flex;
        flex-wrap: wrap;
        height: 100vh;
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
      
              .form-content-submit-container {
                margin-top: 5px;
                padding: 10px 0 5px;
                text-align: center;
              }
      
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
    deposit-submit-top-up-buttons {
        text-align: center;
    }

    .fallback-container {
        align-items: center;
        display: flex;
        justify-content: center;
        max-width: 500px;
        min-height: 500px;
    }

    .mdc-button .mdc-button__icon {
        height: auto;
        width: auto;
    }

    .mdc-dialog .mdc-dialog__surface {
      border-radius: 15px;
    }

    progress {
      -webkit-appearance:none;
      border-radius: 7px;
      height: 10px;

      &::-webkit-progress-bar {
          background: #f5f5f5;
          border-radius: 7px;
      }

      &::-webkit-progress-value {
          background: #34A220;
          border-radius: 7px;
      }

      &::-moz-progress-bar {
          background: #34A220;
      }
    }

    @media only screen and(max-width: 23.438em) {
        .deposit-submit-buttons {
          > button {
            margin: 0 15px 15px;
          }
        }
    }
`;