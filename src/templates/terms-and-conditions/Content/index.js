import * as S from './styles';

import { Fragment } from 'react';
import useSettings from 'api/use-settings';
import ContentEditable from 'components/ContentEditable';

const Content = ({ section }) => {

  const settings = useSettings();

  const count = Number(settings?.website.terms.sectionCount) || 1;

  return (
    <S.Root>
      <S.Text>
        {[...Array(count).keys()].map(idx => <Fragment key={idx}>
          <h2>
            <ContentEditable section={section} elementName={`section-${idx}-title`} />
          </h2>
          <p>
            <ContentEditable section={section} elementName={`section-${idx}-text`} />
          </p>
        </Fragment>)}
      </S.Text>
    </S.Root>
  )
}

export default Content;
