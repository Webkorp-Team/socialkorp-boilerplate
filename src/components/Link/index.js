import NextLink from "next/link";


export default function Link({href,displayHref,preview,external=false,...props}){
  if(href && !preview){
    if(external){
      return <a href={href} rel="noopener noreferrer" target="_blank" {...props}/>;
    }else{
      return <NextLink href={href} passHref={true} displayHref={displayHref}>
        <a {...props}/>
      </NextLink>;
    }
  }else
    return <a style={preview ? {cursor: 'default'} : undefined} {...props}/>;
}
