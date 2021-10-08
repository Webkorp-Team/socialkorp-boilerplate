
import version from 'code-version.json';
import { useEffect } from 'react';

export default function CodeVersion(){
  return version ? <meta name="sk:version" content={version}/> : null;
}
