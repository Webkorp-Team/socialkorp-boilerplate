
import Api from 'api/Api';
import { useEffect, useState } from 'react';

const cache = {};
const promises = {};

export async function getListIndex(listName){
  return await Api.get('/list/index',{listName});
}

export default function useListIndex(listName){
  const [index, setIndex] = useState(cache[listName]||[]);

  useEffect(()=>{
    if(cache[listName])
      return;
    if(!promises[listName])
      promises[listName] = getListIndex(listName).then(result => (
        cache[listName] = result
      ));
    promises[listName].then(result => {
      setIndex(result);
    });
  },[]);

  return index;
}
