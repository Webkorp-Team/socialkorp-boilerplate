import NextLink from "next/link";


export default function Link({href,displayHref,preview,external=false,scroll=true,...props}){
  if(href && !preview){
    if(external){
      return <a href={href} rel="noopener noreferrer" target="_blank" {...props}/>;
    }else{
      return <NextLink href={href} passHref={true} as={displayHref} scroll={scroll}>
        <a {...props}/>
      </NextLink>;
    }
  }else
    return <a style={preview ? {cursor: 'default'} : undefined} {...props}/>;
}
