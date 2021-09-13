import Header from 'templates/home/Header';
// import Content from 'templates/home/Content';
import Footer from 'components/Footer';
import { staticPageDataToProps, useLivePage } from 'api/WebsitePage';
import Meta from 'components/Meta';

const pageName = 'homepage';

export default function Home({staticPageData={}}){

  const {page,lists} = useLivePage(pageName,staticPageData);

  const header = page.getSection('header');
  // const content = page.getSection('content');
  
  const footer = page.getSection('footer');
  const meta = page.getSection('meta');

  // const services = lists.services || [];

  return (
    <>
      <Meta section={meta}/>
      <Header section={header} />
      {/* <Content section={content} services={services}/> */}
      <Footer section={footer} />
    </>  
  )
}

export const getStaticProps = staticPageDataToProps(pageName);
