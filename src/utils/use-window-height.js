import mediaQueries from "css-config/media-queries";
import { useCallback, useEffect, useState } from "react";
import useMediaQuery from "./use-media-query";

const cache = {
  height: null,
};

export default function useWindowHeight(){
  const [height, _setHeight] = useState(cache.height);
  const portrait = useMediaQuery(mediaQueries.portrait);
  const [polling, setPolling] = useState(!cache.height);

  const setHeight = useCallback((functionOrValue)=>{
    _setHeight(x => {
      const value = typeof functionOrValue === 'function' ? (
        functionOrValue(x)
      ):functionOrValue;
      cache.height = value;
      return value;
    });
  },[]);

  useEffect(()=>{
    const handleResize = ()=>{
      setPolling(true);
    };
    window.addEventListener('resize',handleResize);
    return ()=>{
      window.removeEventListener('resize',handleResize);
    };
  },[]);

  useEffect(()=>{
    if(!portrait || !polling)
      return;
    const element = document.getElementById('_windowHeight') || (
      (()=>{
        const e = document.createElement('div');
        e.style.position = "fixed";
        e.style.bottom = "0px";
        e.id = '_windowHeight';

        document.body.appendChild(e);
        return e;
      })()
    );
    const interval = setInterval(()=>{
      const value = element.getBoundingClientRect().bottom;
      if(value > 0)
        setPolling(false);
      setHeight(value);
    },50);
    return ()=>{
      clearInterval(interval);
    };
  },[portrait,polling]);

  return portrait ? height || undefined : undefined;
}
