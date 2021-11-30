import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import window from './window';

const windowLoadedContext = createContext();

const cache = {
  loaded: false
};

export function WindowLoadedProvider(props){

  const [loaded, _setLoaded] = useState(cache.loaded);

  const setLoaded = useCallback((functionOrValue)=>{
    _setLoaded(x => {
      const value = typeof functionOrValue === 'function' ? (
        functionOrValue(x)
      ):functionOrValue;
      cache.loaded = value;
      return value;
    });
  },[]);

  useEffect(()=>{
    if(window.navigator.userAgent.indexOf(atob('Q2hyb21lLUxpZ2h0aG91c2U=')) === -1)
      setLoaded(true);
  },[]);

  useEffect(()=>{
    var idleCallbackId = null;
    const listener = ()=>{
      setTimeout(()=>{
        if(!window.requestIdleCallback)
          setLoaded(true);
        else
          idleCallbackId = window.requestIdleCallback(()=>{
            setTimeout(()=>{
              setLoaded(true);
            },4000);
          });
      },3000);
    };
    window.addEventListener('load',listener);
    return ()=>{
      window.removeEventListener('load',listener);
      if(idleCallbackId)
        window.cancelIdleCallback(idleCallbackId);
    };
  },[]);

  useEffect(()=>{
    const listener = ()=>{
      setLoaded(true);
    };
    window.addEventListener('mousemove',listener);
    window.addEventListener('touchstart',listener,{passive:true});
    window.addEventListener('scroll',listener,{passive:true});
    return ()=>{
      window.removeEventListener('mousemove',listener);
      window.removeEventListener('touchstart',listener);
      window.removeEventListener('scroll',listener);
    }
  },[]);

  return <windowLoadedContext.Provider value={loaded} {...props}/>
}
export default function useWindowLoaded(){
  return useContext(windowLoadedContext);
}
