import { useRouter } from "next/router";
import { cloneElement, createElement, createContext, useCallback, useContext, useMemo, useState, Fragment, useEffect, useRef } from "react";
import styled from "styled-components";

const onUpdateContext = createContext(()=>{});
export function ContentEditableListener({onUpdate,...props}){
  return <onUpdateContext.Provider value={onUpdate} {...props}/>
}
export function useOnEditableElementUpdate(){
  return useContext(onUpdateContext);
}

function StyledChild({children,className}){
  return cloneElement(children,{
    className: `${children.props?.className||''} ${className}`
  });
}

const Text = styled.span`
  font: inherit;
  color: inherit;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  &[data-editable],
  &[contenteditable]{
    border: 1px dashed transparent;
    &:not(:focus):hover{
      background: #fff8;
      border: 1px dashed #0008;
      cursor: crosshair;
    }
    &:focus{
      border: 1pxc dashed #000;
      background: #fff4;
      cursor: text;
    }
  }
`;




export default function ContentEditable({
  elementName,
  section,
  children: childrenFromProps,
  component: Component,
  readOnly,
  parserComponent: ParserComponent = Fragment,
  ...props
}){

  const [focus, setFocus] = useState(false);
  const [inputInitialized, setInputInitialized] = useState(false);

  const onUpdate = useOnEditableElementUpdate();

  const inputRef = useRef();

  const handleBlur = useCallback((e)=>{
    setFocus(false);
    setInputInitialized(false);
    return onUpdate({
      elementName,
      value: e.currentTarget.innerText.replace(/\n$/,''),
    });
  },[onUpdate]);

  const handleFocus = useCallback(()=>{
    setFocus(true);
  },[]);

  const [counter, setCounter] = useState(0);
  useEffect(()=>{
    if(!focus)
      return;
    if(!inputRef.current){
      setCounter(x=>x+1);
      return;
    }
    if(inputInitialized)
      return;

    inputRef.current.innerText = section.get(elementName);
    inputRef.current.focus();

    setInputInitialized(true);
  },[focus,inputInitialized,section,elementName,counter]);

  const router = useRouter();

  const editable = Boolean(section && elementName);

  const previewing = router.pathname === '/preview' && editable;

  const inputProps =  {
    contentEditable: true,
    onKeyDown: e=>{
      if(e.keyCode===27)// esc
        e.target.blur();
      if (e.keyCode == 13){ // enter/return
        // e.stopPropagation();
        // e.preventDefault();
        // var selection = window.getSelection();
        // if(!selection)
        //   return;
        // const range = selection.getRangeAt(0);
        // const br = document.createElement("br");
        // range.deleteContents();
        // range.insertNode(br);
        // range.insertNode(br);
        // range.collapse();
      }
    },
    onInput: e=>{
      // e.currentTarget.querySelector('br:last-child')?.remove();
      // if(!e.currentTarget.innerText.endsWith("\n")){
      //   const br = document.createElement("br");
      //   e.currentTarget.appendChild(br);
      // }
    },
    onBlur: handleBlur,
    onFocus: handleFocus
  };

  if(section && childrenFromProps)
    throw new Error('Either pass a section or a children');

  if(section && !elementName)
    throw new Error("Can't use property section without elementName");

  const children = previewing && focus ? (
    <Text ref={inputRef} key="edit" {...inputProps}/>
  ):(
    <Text data-display={true} data-editable={previewing} onClick={previewing ? handleFocus : undefined} key="display">
      <ParserComponent key="display">{
        (section ? section.get(elementName) : childrenFromProps) || (
          previewing ? '<empty>' : null
        )
      }</ParserComponent>
    </Text>
  );

  return (
    Component ? <Component {...props} children={children}/> :
    children && children.type ? cloneElement(children,props) :
    <Fragment {...props} children={children}/>
  );
}
