import html from 'api/pwa-meta.html.json';
import ReactHtmlParser from 'react-html-parser';

export default function PWAMeta(){
  return ReactHtmlParser(html);
}
