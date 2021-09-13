import Api from 'api/Api';
import { useEffect, useState } from 'react';

const cache = {
  settings: null,
};

export async function getSettings(){
  return Api.get('/settings');
}

const promise = getSettings().then(result => {
  cache.settings = result;
  return result;
});

export default function useSettings(serverSideSettings){
  const [settings, setSettings] = useState(cache.settings || serverSideSettings || null);

  useEffect(()=>{
    if(!cache.settings)
      promise.then(result => {
        setSettings(result);
      })
  },[]);

  return settings;
}
