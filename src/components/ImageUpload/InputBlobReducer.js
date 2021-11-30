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

export default function InputBlobReducer({
  onChange=()=>{},
  ...props
}){

  const handleChange = useCallback((e)=>{
    if(!e.target.files[0])
      return;
    reducer.toBlob(e.target.files[0],{max:1600}).then(resizedImage => {
      const reader = new FileReader();
      reader.addEventListener("load", function () {
        onChange({
          value: reader.result,
          display: URL.createObjectURL(resizedImage)
        });
      }, false);
      reader.readAsDataURL(resizedImage);
    });
  },[onChange]);

  return (
    <input onChange={handleChange} type="file" accept="image/*" {...props} />
  );
}
