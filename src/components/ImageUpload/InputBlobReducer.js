import imageBlobReduce from 'image-blob-reduce';
import { useCallback } from 'react';

const reducer = imageBlobReduce();
reducer._create_blob = function (env) {
  return this.pica.toBlob(env.out_canvas, 'image/jpeg', 0.85)
    .then(function (blob) {
      env.out_blob = blob;
      return env;
    });
};

const pngReducer = imageBlobReduce();
pngReducer._create_blob = function (env) {
  return this.pica.toBlob(env.out_canvas, 'image/png', 0.85)
    .then(function (blob) {
      env.out_blob = blob;
      return env;
    });
};

export default function InputBlobReducer({
  onChange=()=>{},
  accept="image/*",
  ...props
}){

  const handleChange = useCallback((e)=>{
    if(!e.target.files[0])
      return;
    const noResize = ['image/svg','image/svg+xml'].includes(accept);
    const pngOnly = (accept === 'image/png');
    if(noResize){
      const reader = new FileReader();
      reader.addEventListener("load", function () {
        onChange({
          value: reader.result,
          display: reader.result,
        });
      }, false);
      reader.readAsDataURL(resizedImage);
    }else{
      ( pngOnly ? pngReducer : reducer ).toBlob(e.target.files[0],{max:1600}).then(resizedImage => {
        const reader = new FileReader();
        reader.addEventListener("load", function () {
          onChange({
            value: reader.result,
            display: URL.createObjectURL(resizedImage)
          });
        }, false);
        reader.readAsDataURL(resizedImage);
      });
    }
  },[onChange]);

  return (
    <input onChange={handleChange} type="file" accept={accept} {...props} />
  );
}
