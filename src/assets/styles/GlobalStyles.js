import { createGlobalStyle } from 'styled-components'
import ProductSansRegular from '../fonts/ProductSans-Regular.ttf'
import ProductSansBold from '../fonts/ProductSans-Bold.ttf'
import ProductSansMedium from '../fonts/ProductSans-Medium-500.ttf'

export default createGlobalStyle`
    @font-face {
        font-family: 'ProductSansRegular';
        src: url(${ProductSansRegular}) format('truetype');
        font-display: swap;
    }

    @font-face {
        font-family: 'ProductSansBold';
        src: url(${ProductSansBold}) format('truetype');
        font-display: swap;
    }

    @font-face {
        font-family: 'ProductSansMedium';
        src: url(${ProductSansMedium}) format('truetype');
        font-display: swap;
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
`
