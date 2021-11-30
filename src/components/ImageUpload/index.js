import { cloneElement, forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useOnEditableElementUpdate } from "components/ContentEditable";
import { useRouter } from "next/router";
import styled from "styled-components";
import generateRandomString from "utils/generate-random-string";
import dynamic from 'next/dynamic'

const InputBlobReducer = dynamic(() => import('./InputBlobReducer'));

const placeholder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolA\
AAABlBMVEV6enoYGBg7fN05AAAAAnRSTlO/v04Q0VIAAAB/SURBVGje5c4xDQAADMOw8ie9MehtqcrrI8n1VgCwQ\
ABiAgDAAgGICQAACwQgJgAALBCAmAAAsEAAYgIAwAIBiAkAAAsEICYAACwQgJgAALBAAGICAMACAYgJAAALBCAmA\
AAsEICYAACwQABiAgDAAgGICQAACwQgJgAALAjgAYpp8OIKb2kyAAAAAElFTkSuQmCC";

const Img = styled.img`

`;

const Label = styled.label`
  & > *{
    border: 1px dashed transparent;
    cursor: crosshair;
    transition: filter 200ms opacity 200ms;
    &:hover{
      filter: brightness(80%) saturate(50%);
      opacity: 0.75;
      border-color: #0008;
    }
  }
`;


const ImageUpload = forwardRef(function _ImageUpload({
  elementName,
  section,
  children,
  component: Component,
  src: srcFromProps,
  initialSrc,
  attribute='src',
  ...propsFromAbove
},ref){
  
  const router = useRouter();

  const editable = Boolean(elementName);

  const previewing = router.pathname === '/preview' && editable;

  const [id, setId] = useState('null');

  useEffect(()=>{
    setId(`fileinput--${generateRandomString()}`);
  },[]);

  const [src, setSrc] = useState(srcFromProps);

  useEffect(()=>{
    if(!section){
      setSrc(srcFromProps);
      return;
    }
    const url = section.get(elementName);
    if(!url || url === '<empty>')
      setSrc(previewing ? srcFromProps || placeholder : srcFromProps || undefined);
    else if (url === initialSrc)
      setSrc(srcFromProps || url);
    else
      setSrc(src => url.startsWith('data:') && src ? src : url);
  },[srcFromProps,section,elementName,previewing]);

  const onUpdate = useOnEditableElementUpdate();

  const handleChange = useCallback((result)=>{
    setSrc(result.display);
    onUpdate({
      elementName,
      value: result.value,
    });
  },[onUpdate,elementName,setSrc]);
  
  const props = {
    ...propsFromAbove,
    ref,
    ...(src ? {[attribute]:src.replace(/(\r\n|\n|\r)/gm, "")} : {}),
  };

  if(section && !elementName)
    throw new Error("Can't use property section without elementName");

  const renderingResult = (
    Component ? <Component {...props}/> :
    children && children.type ? cloneElement(children,props) :
    <Img {...props}/>
  );

  return previewing ? (
    <Label htmlFor={id}>
      <InputBlobReducer onChange={handleChange} id={id} style={{display:'none'}} />
      {renderingResult}
    </Label>
  ) : renderingResult;
});

export default ImageUpload;
