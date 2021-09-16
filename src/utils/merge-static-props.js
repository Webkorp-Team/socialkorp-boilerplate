export default function mergeStaticProps(...functions){
  return async (context)=>{
    var props = {};
    for(const fun of functions){
      props = {
        ...props,
        ...((await fun(context)).props)
      }
    };
    return {props};
  }
}
