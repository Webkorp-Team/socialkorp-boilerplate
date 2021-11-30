import styled from 'styled-components';

export const Root = styled.section`

`;

export const Headline = styled.h1`
  text-transform: uppercase;
  font-weight: 200;
  font-size: 110px;
  & strong, & em{
    font-weight: 600;
    font-style: normal;
  }
`;
