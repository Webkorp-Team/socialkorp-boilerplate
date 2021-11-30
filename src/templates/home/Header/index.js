import * as S from './styles';
import ContentEditable from 'components/ContentEditable';
import ReactMarkdown from 'react-markdown';
import { Fragment } from 'react';

const markdown = props => <ReactMarkdown components={{p:Fragment}} allowedElements={['p','strong','em']} {...props}/>

const Header = ({ section, preview }) => {

  return (
    <S.Root>
      <ContentEditable component={S.Headline} section={section} elementName="headline" parserComponent={markdown} />
    </S.Root>
  )
};

export default Header;
