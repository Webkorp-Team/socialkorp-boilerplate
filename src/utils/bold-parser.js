import { Fragment } from "react";

export function parseBold(string){
  const matches = string.match(/\*[^\*]+\*/g) || [];
  var result = [string];
  for(const match of matches){
    const component = <strong>{match.slice(1,-1)}</strong>;
    const newResult = [];
    for(const substr of result){
      if(typeof substr !== 'string'){
        newResult.push(substr);
        continue;
      }
      const split = substr.split(match);
      const tmp = [];
      for(const piece of split){
        tmp.push(piece);
        tmp.push(component);
      }
      tmp.pop();
      newResult.push(...tmp);
    }
    result = newResult;
  }
  return result.map((element,idx) => (
    <Fragment key={idx}>{element}</Fragment>
  ));
}

export default function BoldParser({
  children
}){
  const result = parseBold(children);
  return result;
  // return <>{
  //   parseBold(children).map((element,i) => (
  //     <Fragment key={i}>{element}</Fragment>
  //   ))
  // }</>;
}
