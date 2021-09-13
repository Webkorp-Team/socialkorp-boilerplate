import * as S from './styles';

import ContentEditable from 'components/ContentEditable';

const Footer = ({ section,preview }) => {
  return !section ? null : <S.Root>
    <ContentEditable section={section} elementName="copyright"/>
  </S.Root>;
}

export default Footer;
