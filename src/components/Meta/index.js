import Head from "next/head";
import { useMemo } from "react";

export default function Meta({section}){

  const {
    title,
    description,
    picture,
  } = useMemo(()=>section.export(),[section]);

  return <Head>
    {/* Standard tags */}
    <title>{title}</title>
    <meta name="title" content={title}/>
    <meta name="description" content={description}/>

    {/* Open Graph / Facebook */}
    <meta property="og:type" content="website"/>
    <meta property="og:title" content={title}/>
    <meta property="og:description" content={description}/>
    <meta property="og:image" content={picture}/>

    {/* Twitter */}
    <meta property="twitter:card" content="summary_large_image"/>
    <meta property="twitter:title" content={title}/>
    <meta property="twitter:description" content={description}/>
    <meta property="twitter:image" content={picture}/>
  </Head>

}
