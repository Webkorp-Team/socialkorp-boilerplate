const { css } = require("styled-components");

const cssReset = () => css`
  /* @todo: sort rules alphabetically */
  *{
    padding: 0;
    margin: 0;
    border: none;
    outline: none;
    box-sizing: border-box;
  }
  h1,h2,h3,h4{
    font-size: 1em;
    font-weight: inherit;
  }
  a{
    font: inherit;
    color: inherit;
    cursor: pointer;
    text-decoration: none;
  }
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
    overflow: auto;
  }
  html{
    max-width: 100vw;
  }
  body {
    line-height: 1;
    background-color: #fff;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  input,textarea,button{
    outline: none;
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    border-radius: 0;
    box-shadow: none;

    &::placeholder{
      opacity: 1;
      color: inherit;
    }
    &[type=submit],&[type=button]{
      appearance: none;
    }
  }
  button{
    appearance: none;
    display: inline-block;
    text-align: left;
  }
  .grecaptcha-badge { visibility: hidden; }
`;

module.exports = cssReset;
