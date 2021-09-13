import * as S from './styles';

import ContentEditable from 'components/ContentEditable';

const Header = ( {section}) => {
  return (
    <S.Root>
      <ContentEditable section={section} elementName="title" component={S.Title}/>
    </S.Root>
  )
}

export default Header;
