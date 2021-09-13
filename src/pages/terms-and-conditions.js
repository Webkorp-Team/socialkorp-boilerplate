import Header from 'templates/terms-and-conditions/Header';
import Content from 'templates/terms-and-conditions/Content';
import Footer from 'components/Footer';
import Meta from 'components/Meta';
import { staticPageDataToProps, useLivePage } from 'api/WebsitePage';

const pageName = 'terms';

export default function TermsAndConditions({staticPageData={}}){
  
  const {page} = useLivePage(pageName,staticPageData);

  const content = page.getSection('content');
  const header = page.getSection('header');
  const meta = page.getSection('meta');
  const footer = page.getSection('footer');

  return (
    <>
      <Meta section={meta}/>
      <Navbar section={footer}/>
      <Header section={header}/>
      <Content section={content} />
      <Footer section={footer}/>
    </>
  )
}

export const getStaticProps = staticPageDataToProps(pageName);
