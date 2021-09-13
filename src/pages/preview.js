import templates from "api/templates-preview.config";
import WebsitePage, { Section } from "api/WebsitePage";
import { ContentEditableListener } from "components/ContentEditable";
import { useRouter } from "next/router";
import { useMemo, useState, useEffect, useCallback } from "react";
import config from 'api/website.config.json';
import Api from "api/Api";

export default function Preview(){

  const router = useRouter();

  const pageName = router.query.page;
  const backgroundColor = router.query.bg;

  useEffect(()=>{
    if(!backgroundColor)
      return;
    window.document.documentElement.style.backgroundColor = backgroundColor;
  },[router.query]);

  const pageSchema = useMemo(()=>(
    !pageName ? null : config.pages.filter(page => page.name === pageName)[0]
  ),[pageName]);

  const sectionNames = useMemo(()=>(
    !pageSchema ? [] : pageSchema?.sections.map(section => section.name) || []
  ),[pageSchema]);

  const listNames = useMemo(()=>(
    pageSchema?.lists || []
  ),[pageSchema]);

  const [lists, setLists] = useState({});

  useEffect(()=>{
    for(const listName of listNames)
      Api.get('/list/index',{listName}).then(result => {
        setLists(lists => ({
          ...lists,
          [listName]: result
        }))
      });
  },[listNames]);

  const [otherSectionDependencies, setOtherSectionDependecies] = useState({});

  useEffect(()=>{
    if(!pageSchema)
      return;
    for(const section of pageSchema.sections)
      for(const dependency of (section.use || []))
        Api.get('/website/page',{
          name: dependency.page,
        }).then(pageData => {
          setOtherSectionDependecies(map => ({
            ...map,
            [section.name]:{
              ...map[section.name],
              [dependency.as]: new Section(pageData[dependency.section]),
            }
          }));
        });
  },[pageSchema]);

  const [page, setPage] = useState(null);

  const handleUpdate = useCallback(sectionName => update => {
    const newSection = page.getSection(sectionName).set(update.elementName,update.value);
    const newPage = page.setSection(sectionName,newSection);
    setPage(newPage);

    window.parent.postMessage({
      state: {
        pageDraft: newPage.export()
      }
    },'*');
  },[page]);

  useEffect(()=>{
    const listener = (ev)=>{
      if(ev.data.setState)
        setPage(new WebsitePage(ev.data.pageState));
    };

    window.addEventListener('message',listener);

    window.parent.postMessage('ready','*');

    return ()=> {
      window.removeEventListener('message',listener);
    };
  },[]);


  useEffect(()=>{
    const contentHeight = (
      window.document.body.scrollHeight < 50 ? '50vw' : `${window.document.body.scrollHeight}px`
    );
    window.parent.postMessage({contentHeight},'*'); 
  });


  useEffect(()=>{
    const listener = e => {
      if(e.key !== 's' || !e.ctrlKey)
        return true;
      e.preventDefault();
        
      window.parent.postMessage({save:true},'*'); 
        
      return false;
    };

    window.addEventListener('keydown',listener);
    return ()=>{
      window.removeEventListener('keydown',listener);
    };
  },[]);

  return !page || !otherSectionDependencies ? null : (
    sectionNames.map(sectionName => {
      const Template = templates[pageName]?.[sectionName] || (()=><div>Missing template for "{pageName}/{sectionName}"</div>);
      return (
        <ContentEditableListener key={sectionName} onUpdate={handleUpdate(sectionName)}>
          <Template section={page.getSection(sectionName)} preview={true} {...lists} {...otherSectionDependencies[sectionName]} />
        </ContentEditableListener>
      );
    })
  );
}
