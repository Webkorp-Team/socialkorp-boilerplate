import html from 'api/favicons-meta.html.json';
import ReactHtmlParser from 'react-html-parser';

export default function FaviconsMeta(){
  return ReactHtmlParser(html);
}
