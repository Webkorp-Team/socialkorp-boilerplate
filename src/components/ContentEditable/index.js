import { useRouter } from "next/router";
import { cloneElement, createElement, createContext, useCallback, useContext, useMemo, useState, Fragment, useEffect } from "react";
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

const Text = styled(StyledChild)`
  white-space: pre-wrap;
  overflow-wrap: break-word;
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

const Span = styled.span`
  font: inherit;
  color: inherit;
`;



export default function ContentEditable({
  elementName,
  section,
  children: childrenFromProps,
  component: Component,
  readOnly,
  parserComponent = Fragment,
  ...propsFromAbove
}){

  const [focus, setFocus] = useState(false);
  const [counter, setCounter] = useState(0);

  const onUpdate = useOnEditableElementUpdate();

  const handleBlur = useCallback((e)=>{
    setFocus(false);
    setCounter(x=>x+1);
    return onUpdate({
      elementName,
      value: e.target.innerText,
    });
  },[onUpdate]);

  const handleFocus = useCallback(()=>{
    setFocus(true);
  },[]);

  const previewingProps = {
    contentEditable: true,
    suppressContentEditableWarning: true,
    onKeyDown: e=>{
      if(e.keyCode===27)//esc
        e.target.blur();
    },
    onBlur: handleBlur,
    onFocus: handleFocus,
    key: counter,
    ...propsFromAbove
  };

  const router = useRouter();

  const editable = Boolean(elementName);

  const previewing = router.pathname === '/preview' && editable;

  if(section && childrenFromProps)
    throw new Error('Either pass a section or a children');

  if(section && !elementName)
    throw new Error("Can't use property section without elementName");

  const props = {
    ...(previewing ? previewingProps : propsFromAbove)
  };

  const ParserComponent = previewing && focus ? Fragment : parserComponent;

  const children = (
    <ParserComponent>
      {(section ? section.get(elementName) : childrenFromProps) || (
        previewing ? '<empty>' : null
      )}
    </ParserComponent>
  );

  const renderingResult = (
    Component ? <Component {...props} children={children}/> :
    children && children.type ? cloneElement(children,props) :
    <Span {...props} children={children}/>
  );

  return <Text>{renderingResult}</Text>;
}
