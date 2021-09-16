import NextLink from "next/link";


export default function Link({href,displayHref,preview,...props}){
  if(href && !preview)
    return <NextLink href={href} passHref={true} displayHref={displayHref}>
      <a {...props}/>
    </NextLink>;
  else
    return <a {...props}/>;
}
