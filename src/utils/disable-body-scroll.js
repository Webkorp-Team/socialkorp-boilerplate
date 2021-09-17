import window from "./window";

export function disableBodyScroll(){
  if(!window)
    return;
  window.document.body.style.width='100%';
  window.document.body.style.overflowY = 'scroll';
  window.document.body.style.top = `${-window.document.scrollingElement.scrollTop}px`;
  window.document.body.previousScrollPosition = window.document.scrollingElement.scrollTop;
  window.document.body.style.position = 'fixed';
}
export function enableBodyScroll(reset=false){
  if(!window)
    return;
  window.document.body.style.position = 'initial';
  window.document.body.style.overflowY = 'initial';
  window.document.body.style.top = 'initial';
  window.document.body.style.width = 'initial';
  if(reset)
    window.document.body.previousScrollPosition = 0;
  else
    window.document.scrollingElement.scrollTop = window.document.body.previousScrollPosition;
}
export function getBodyScrollPosition(){
  if(!window)
    return 0;
  return (
    window.document.body.style.top
    ? parseInt((window.document.body.style.top.match(/^-([0-9.]+)px$/)||[0,window.document.scrollingElement.scrollTop])[1])
    : window.document.scrollingElement.scrollTop
  );
}
