import { useState, useMemo, useEffect } from "react";

function addEventListener(_evName,callback){
  this.addListener(callback);
}
function removeEventListener(_evName,callback){
  this.removeListener(callback);
}


export default function useMediaQuery(query){
  const mediaQuery = useMemo(() => typeof window !== 'undefined' && window.matchMedia(query), [query]);
  const [matches, setMatch] = useState(mediaQuery.matches);
  useEffect(() => {
    if(!mediaQuery)
      return;

    const listener = e => setMatch(e.matches);

    // support older browsers
    if(!mediaQuery.addEventListener){
      mediaQuery.addEventListener = addEventListener;
      mediaQuery.removeEventListener = removeEventListener;
    }

    mediaQuery.addEventListener('change',listener);
    return () => mediaQuery.removeEventListener('change',listener);
  },[mediaQuery]);
  return matches;
};

