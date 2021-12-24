import { useEffect, useState } from "react";
import Api from "./Api";

export default function useFindItem(listName,query){
  const [item, setItem] = useState(null);

  useEffect(()=>{
    if(!listName || !query)
      return;
    Api.get('/list/item',{
      listName,
      query,
    }).then(result => {
      setItem(result);
    }).catch((err)=>{
      console.error(err);
      setItem(null);
    });
  },[listName,JSON.stringify(query)]);

  return item;
}
