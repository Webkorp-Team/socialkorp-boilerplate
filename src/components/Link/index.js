import NextLink from "next/link";


export default function Link({href,displayHref,preview,...props}){
  const style = preview ? {cursor: 'default'} : undefined;
  if(href && !preview)
    return <NextLink href={href} passHref={true} displayHref={displayHref}>
      <a style={style} {...props}/>
    </NextLink>;
  else
    return <a style={style} {...props}/>;
}
