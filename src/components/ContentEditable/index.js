import { useRouter } from "next/router";
import { cloneElement, createElement, createContext, useCallback, useContext, useMemo } from "react";
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
  ...propsFromAbove
}){

  const onUpdate = useOnEditableElementUpdate();

  const handleUpdate = useCallback((e)=>{
    return onUpdate({
      elementName,
      value: e.target.innerText,
    });
  },[onUpdate]);

  const previewingProps = {
    contentEditable: true,
    suppressContentEditableWarning: true,
    onKeyDown: e=>{
      if(e.keyCode===27)//esc
        e.target.blur();
    },
    onBlur: handleUpdate,
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

  const children = section ? section.get(elementName) : childrenFromProps;

  const renderingResult = (
    Component ? <Component {...props} children={children}/> :
    children && children.type ? cloneElement(children,props) :
    <Span {...props} children={children}/>
  );

  return <Text>{renderingResult}</Text>;
}
