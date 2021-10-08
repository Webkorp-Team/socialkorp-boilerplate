import * as S from './styles';
import ContentEditable from 'components/ContentEditable';

const Header = ({ section, preview }) => {

  return (
    <S.Root>
      <ContentEditable section={section} elementName="headline" component={S.Headline}/>
      Ready
    </S.Root>
  )
};

export default Header;
