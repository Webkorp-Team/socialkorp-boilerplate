import Head from 'next/head';

import Content from 'templates/404/Content';
import Footer from 'components/Footer';
import { staticPageDataToProps, useLivePage } from 'api/WebsitePage';

const pageName = 'common';

export default function E404({staticPageData={}}){

  const {page} = useLivePage(pageName,staticPageData);

  const meta = page.getSection('meta');
  const footer = page.getSection('footer');

  return (
    <>
      <Head>
        <title>404 - {meta.get('title')}</title>
      </Head>
      <Content/>
      <Footer section={footer} />
    </>
  )
}

export const getStaticProps = staticPageDataToProps(pageName);
