import { Map } from "immutable";
import { useEffect, useState, useMemo, useRef } from 'react';
import { resolvePromises } from "utils/promises-utils";
import Api from "./Api";
import config from './website.config.json';

class ExtendableMap{
  #map;
  constructor(data={}){
    if(data instanceof ExtendableMap)
      return data;
    this.#map = Map(data);
  }
  set(key,value){
    const newMap = this.#map.set(key,value);
    if(newMap === this.#map)
      return this;
    return new this.constructor(newMap);
  }
  get(key){ return this.#map.get(key); }
  toObject(){ return this.#map.toObject(); }
  keys(){ return this.#map.keys(); }
  toString(){
    return `ExtendableMap`;
  }
}

export class Section extends ExtendableMap{
  constructor(data){
    super(data);
  }
  get(elementName){
    const value = super.get(elementName);
    return !value?.trim() ? '<empty>' : value;
  }
  set(elementName,value){
    return super.set(elementName,value);
  }
  export(){
    return this.toObject();
  }
  toString(){ return 'Section()'}
}

const emptySection = new Section({});

export default class WebsitePage extends ExtendableMap{
  #timestamp;

  constructor(data,timestamp=null){
    if(data instanceof WebsitePage && !timestamp)
      return data;
    const keys = data.keys ? data.keys() : Object.keys(data);
    const sections = {};
    
    for(const sectionName of keys)
      sections[sectionName] = new Section(
        data.get ? data.get(sectionName) : data[sectionName]
      );
    
    super(sections);
    this.#timestamp = timestamp || Date.now();
  }
  getTimestamp(){
    return this.#timestamp;
  }
  updateTimestamp(timestamp=null){
    return new WebsitePage(this,timestamp || Date.now());
  }
  getSectionNames(){
    return this.keys();
  }
  getSection(sectionName){
    return this.get(sectionName) || emptySection;
  }
  setSection(sectionName,section){
    return this.set(sectionName,section);
  }
  export(){
    const data = {};
    for(const sectionName of this.getSectionNames())
      data[sectionName] = this.getSection(sectionName).export();
    return data;
  }
  toString(){ return 'WebsitePage()'}
}

var common = null;
async function getRawPageData(name){
  const page = await Api.get('/website/page',{name});
  if(!common)
    common = await Api.get('/website/page',{name:'common'});

  const listNames = config.pages.filter(p => p.name === name)[0]?.lists || [];
  const listsArray = await resolvePromises(
    listNames.map( listName => Api.get('/list/index',{listName}) )
  );

  const lists = listNames.reduce(
    (lists,listName,idx)=>({
      ...lists,
      [listName]: listsArray[idx],
    }),{}
  );

  const meta = (
    Object.keys(page.meta||{})
    .concat(Object.keys(common.meta||{}))
    .reduce(
      (meta,elementName)=>({
        ...meta,
        [elementName]: page.meta?.[elementName] || common.meta?.[elementName]
      }),{}
    )
  );
  
  return {
    pageData:{
      ...common,
      ...page,
      meta
    },
    lists
  };
}

export function staticPageDataToProps(pageName){
  return async () => ({props:{staticPageData:await getRawPageData(pageName)}});
}

export function useLivePage(pageName,staticData,noonce=0){

  const staticPage = useMemo(()=>(
    new WebsitePage(staticData?.pageData || {})
  ),[staticData]);
    
  const [data, setData] = useState({
    page:staticPage,
    lists:staticData?.lists || {},
  });

  useEffect(()=>{
    if(!pageName)
      return;
    const requestTime = Date.now();
    getRawPageData(pageName).then(({lists,pageData}) => {
      setData({
        page: new WebsitePage(pageData,requestTime),
        lists
      });
    });
  },[pageName,noonce]);

  return data;
}



