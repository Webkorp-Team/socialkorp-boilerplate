import { cloneElement, forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import randomstring from 'randomstring';
import { useOnEditableElementUpdate } from "components/ContentEditable";
import { useRouter } from "next/router";
import styled from "styled-components";
import imageBlobReduce from 'image-blob-reduce';

const placeholder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolA\
AAABlBMVEV6enoYGBg7fN05AAAAAnRSTlO/v04Q0VIAAAB/SURBVGje5c4xDQAADMOw8ie9MehtqcrrI8n1VgCwQ\
ABiAgDAAgGICQAACwQgJgAALBCAmAAAsEAAYgIAwAIBiAkAAAsEICYAACwQgJgAALBAAGICAMACAYgJAAALBCAmA\
AAsEICYAACwQABiAgDAAgGICQAACwQgJgAALAjgAYpp8OIKb2kyAAAAAElFTkSuQmCC";

const reducer = imageBlobReduce();
reducer._create_blob = function (env) {
  return this.pica.toBlob(env.out_canvas, 'image/jpeg', 0.85)
    .then(function (blob) {
      env.out_blob = blob;
      return env;
    });
};

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
  attribute='src',
  ...propsFromAbove
},ref){
  
  const router = useRouter();

  const editable = Boolean(elementName);

  const previewing = router.pathname === '/preview' && editable;

  const [id, setId] = useState('null');

  useEffect(()=>{
    setId(`fileinput--${randomstring.generate(8)}`);
  },[]);

  const [src, setSrc] = useState(srcFromProps);

  useEffect(()=>{
    if(!section){
      setSrc(srcFromProps);
      return;
    }
    const url = section.get(elementName);
    if(!url)
      return;
    else if(url === '<empty>')
      setSrc(previewing ? placeholder : undefined);
    else
      setSrc(src => url.startsWith('data:') && src ? src : url);
  },[srcFromProps,section,elementName,previewing]);

  const onUpdate = useOnEditableElementUpdate();

  const handleChange = useCallback((e)=>{
    if(!e.target.files[0])
      return;
    reducer.toBlob(e.target.files[0],{max:1600}).then(resizedImage => {
      const reader = new FileReader();
      reader.addEventListener("load", function () {
        setSrc(URL.createObjectURL(resizedImage));
        onUpdate({
          elementName,
          value: reader.result,
        });
      }, false);
      reader.readAsDataURL(resizedImage);
    });
  },[onUpdate,elementName]);

  
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
      <input onChange={handleChange} id={id} type="file" accept="image/*" style={{display:'none'}} />
      {renderingResult}
    </Label>
  ) : renderingResult;
});

export default ImageUpload;
