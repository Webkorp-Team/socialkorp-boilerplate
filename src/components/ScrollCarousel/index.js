import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import useExternalState from 'utils/use-external-state';


const Root = styled.div`
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  overflow: hidden;
`;
const ScrollElement = styled.div`
  overflow-x: scroll;
  overflow-y: hidden;
  padding-bottom: 50pxc;

  overscroll-behavior-x: none;

  @media landscape{
    &[data-mobileonly=true]{
      overflow: unset;
    }
  }
`;
const Wrapper = styled.div`
  display: inline-block;
  @media landscape{
    &[data-mobileonly=true]{
      display: block;
      width: 100%;
    }
  }
`;
const TrackElement = styled.div`
  & > *{
    scroll-snap-align: ${p => p.$align};
  }
`;
const DefaultTrack = styled.div`
  width: max-content;
  & > *{
    display: inline-block;
    max-width: 100vw;
  }
`;

const animationDuration = 450;

const ScrollCarousel = forwardRef(({
  currentSlide: extCurrentSlide=null,
  setCurrentSlide: extSetCurrentSlide=null,
  children,
  track=DefaultTrack,
  autoplayInterval=0,
  autoplayWait=10000,
  layoutMeasurementDelay=50,
  mobileOnly=false,
  align='start',
  snap=true,
  style={},
  debug,
  ...props
},ref)=>{

  // external states

  const [currentSlide,setCurrentSlide] = useExternalState(
    extCurrentSlide,
    extSetCurrentSlide,
    0
  );

  // dom information

  const scrollElement = useRef();

  const viewWidth = useRef(1);
  const [offsets,setOffsets] = useState([]);

  const numberOfSlides = useMemo(()=>(
    (children === null) ? 0 :
    Array.isArray(children) ? children.flat().length :
    0
  ),[children]);

  const [preferedRootHeight,setPreferedRootHeight] = useState('auto');  
  const [trackEndOffset,setTrackEndOffset] = useState(0);

  useEffect(()=>{

    const offsetAlign = {
      left: () => 0,
      center: (ew,vw) => vw/2 - ew/2,
      right: (ew,vw) => vw - ew,
    }[align] || (()=>0);

    const updateRefs = ()=>{
      setTimeout(()=>{
        if(!scrollElement.current)
          return;
        viewWidth.current = scrollElement.current.clientWidth;
        
        const track = scrollElement.current.firstElementChild.firstElementChild;
        setTrackEndOffset(track.offsetLeft + track.clientWidth - scrollElement.current.offsetLeft);

        const slides = track.children;
        const offsetsTemp = [];
        var i = 0;
        for(var el of slides)
          offsetsTemp[i++] = el.offsetLeft - scrollElement.current.offsetLeft - offsetAlign(el.clientWidth,viewWidth.current);
        setOffsets(offsetsTemp);

        setPreferedRootHeight(scrollElement.current.clientHeight - 50);
      },layoutMeasurementDelay);
    };
    updateRefs();

    const resize = ()=>{
      updateRefs();
    };

    window.addEventListener('resize',resize);
    const observer = new ResizeObserver(resize);
    observer.observe(scrollElement.current);
    return ()=>{
      window.removeEventListener('resize',resize);
      observer.disconnect();
    };
  },[numberOfSlides,setTrackEndOffset,layoutMeasurementDelay,align]);

  const slidesPerView = useMemo(()=>(
    offsets.map((x,idx) => x > viewWidth.current ? idx-1 : null).filter(x=>x)[0] || offsets.length || 1
  ),[viewWidth,offsets]);

  const numberOfViews = useMemo(()=>(
    //(numberOfSlides - slidesPerView + 1) || 1
    numberOfSlides
  ),[numberOfSlides,slidesPerView]);
  
  const extraMargin = useMemo(()=>(
    ['start','end','center'].includes(align) ? (
      viewWidth.current - (trackEndOffset - offsets[offsets.length-slidesPerView])
    ) : 0
  ),[offsets,trackEndOffset,slidesPerView,viewWidth,align]);

  // autoplay

  const [autoplay,setAutoPlay] = useState(true);
  const autoplayTimeout = useRef();

  const pauseAutoPlay = useCallback(()=>{
    clearTimeout(autoplayTimeout.current);
    setAutoPlay(false);
  },[autoplayTimeout,setAutoPlay]);
  const resumeAutoPlay = useCallback(()=>{
    clearTimeout(autoplayTimeout.current);
    autoplayTimeout.current = setTimeout(()=>{
      setAutoPlay(true);
    },autoplayWait);
  },[autoplayWait,autoplayTimeout,setAutoPlay]);

  useEffect(()=>{
    if(!autoplay || autoplayInterval === 0)
      return;
    const interval = setInterval(()=>{
      setCurrentSlide(x => x+1);
    },autoplayInterval);
    return ()=>{
      clearInterval(interval);
    };
  },[setCurrentSlide,numberOfSlides,autoplay,autoplayInterval]);

  // outside change detection and animation

  const [_snap,setSnap] = useState(true);

  const internalCurrentSlide = useRef(currentSlide);
  const targetScrollLeft = useRef(null);
  const initialScrollLeft = useRef(null);
  const initialScrollTime = useRef(null);

  const [animationRunning,setAnimationRunning] = useState(false);

  const animate = useCallback(()=>{
    initialScrollLeft.current = null;
    initialScrollTime.current = null;
    targetScrollLeft.current = offsets[currentSlide];
  },[offsets,currentSlide]);

  const [dragging,setDragging] = useState(null);
  useEffect(()=>{
    if(dragging === false)
      animate();
  },[dragging,animate]);

  useEffect(()=>{
    if(!offsets.length)
      return;

    const validated = (currentSlide+numberOfViews) % numberOfViews;
    if(currentSlide !== validated){
      setCurrentSlide(validated);
      return;
    }

    if(animationRunning)
      return;

    if(internalCurrentSlide.current === currentSlide)
      return;
    internalCurrentSlide.current = currentSlide;

    setAnimationRunning(true);

    animate();
  },[offsets,currentSlide,internalCurrentSlide,animationRunning,setAnimationRunning,numberOfViews,setCurrentSlide,animate]);
 
  useEffect(()=>{
    const step = (time)=>{
      if(!scrollElement.current)
        return;

      if(targetScrollLeft.current === null){
        setTimeout(()=>{
          window.requestAnimationFrame(step);
        },300);
        return;
      }

      if(initialScrollTime.current === null){
        setSnap(false);
        setTimeout(()=>{
          initialScrollTime.current = time;
          initialScrollLeft.current = scrollElement.current.scrollLeft;
          window.requestAnimationFrame(step);
        },1);
        return;
      }

      const ease = x => -(Math.cos(Math.PI * x) - 1) / 2;

      const t = (time - initialScrollTime.current)/animationDuration;
      
      if(t > 1){
        scrollElement.current.scrollLeft = targetScrollLeft.current;
        targetScrollLeft.current = null;
        setTimeout(()=>{
          setSnap(true);
          setTimeout(()=>{
            setAnimationRunning(false);
          },100);
        },100);
        window.requestAnimationFrame(step);
        return;
      }
      
      scrollElement.current.scrollLeft = (targetScrollLeft.current - initialScrollLeft.current)*ease(t) + initialScrollLeft.current;

      window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  },[]);

  // drag to scroll

  const drag = useRef({
    x0: 0,
    scrollLeft0: 0,
    active: false,
    waiting: false,
  });
  useEffect(()=>{
    const container = scrollElement.current;
    if(!container)
      return;
    if('ontouchstart' in window)
      return;
    const pointerDown = (ev)=>{
      drag.current.waiting = true;
      drag.current.x0 = ev.clientX;
      return true;
    };
    const pointerUp = (ev)=>{
      container.releasePointerCapture(ev.pointerId);
      drag.current.active = false;
      drag.current.waiting = false;
      resumeAutoPlay();

      setDragging(false);

      return true;
    };
    const pointerMove = (ev)=>{
      if(drag.current.waiting
        && Math.abs(drag.current.x0 - ev.clientX) > window.innerWidth/200
      ){
        container.setPointerCapture(ev.pointerId);

        drag.current.waiting = false;
        drag.current.active = true;
        drag.current.x0 = ev.clientX;
        drag.current.scrollLeft0 = container.scrollLeft;

        targetScrollLeft.current = null;
        setSnap(false);
        pauseAutoPlay();

        setDragging(true);
        return;
      }
      if(drag.current.active)
        container.scrollLeft = (
          drag.current.scrollLeft0 + (drag.current.x0 - ev.clientX)
        );
    };
    container.addEventListener('pointerdown',pointerDown);
    container.addEventListener('pointerup',pointerUp);
    container.addEventListener('pointermove',pointerMove);
    return ()=>{
      container.removeEventListener('pointerdown',pointerDown);
      container.removeEventListener('pointerup',pointerUp);
      container.removeEventListener('pointermove',pointerMove);
    };
  },[scrollElement,drag,targetScrollLeft,setSnap,pauseAutoPlay,resumeAutoPlay,setDragging]);  

  // current slide detection from scroll position

  const lastScrollComputed = useRef(0);
  useEffect(()=>{
    const container = scrollElement.current;
    const scroll = (ev)=>{
      if(performance.now() - lastScrollComputed.current < 100)
        return;
      lastScrollComputed.current = performance.now();

      if(!offsets.length)
        return;
      if(animationRunning)
        return;
      
      const meanOffsets = offsets.map((x,i,a) => i ? (x+a[i-1])/2 : x);

      var slide = meanOffsets.length-1;
      for(const s in meanOffsets)
        if(ev.target.scrollLeft < meanOffsets[s]){
          slide = s-1;
          break;
        }

      slide = Math.max(0,Math.min(slide,numberOfSlides));
      
      internalCurrentSlide.current = slide;
      setCurrentSlide(slide);
    };
    container.addEventListener('scroll',scroll);
    return ()=>{
      container.removeEventListener('scroll',scroll);
    };
  },[scrollElement,offsets,setCurrentSlide,animationRunning]);
  
  // stop animation if touch is detected

  useEffect(()=>{
    const container = scrollElement.current;
    const touch = (ev)=>{
      if(targetScrollLeft.current !== null){
        targetScrollLeft.current = null;
        setSnap(true);
      }
      pauseAutoPlay();
    };
    const touchEnd = (ev)=>{
      resumeAutoPlay();
    };
    container.addEventListener('touchstart',touch,{passive:true});
    container.addEventListener('touchmove',touch,{passive:true});
    container.addEventListener('touchend',touchEnd);
    container.addEventListener('touchcancel',touchEnd);
    return ()=>{
      container.removeEventListener('touchstart',touch);
      container.removeEventListener('touchmove',touch);
      container.removeEventListener('touchend',touchEnd);
      container.removeEventListener('touchcancel',touchEnd);
    };
  },[scrollElement,targetScrollLeft,setSnap,pauseAutoPlay,resumeAutoPlay]);

  // fix non zero scroll position at mount

  useEffect(()=>{
    if(!scrollElement.current)
      return;
    scrollElement.current.scrollTo(0,0);
  },[viewWidth,offsets]);

  // debug

  if(debug)
    console.log({
      internalCurrentSlide:internalCurrentSlide.current,
      currentSlide,
      // animationRunning,
      // scrollLeft: scrollElement.current && scrollElement.current.scrollLeft,
      numberOfSlides,
      slidesPerView,
      numberOfViews,
      // extraMargin,
      // offsets,
      // viewWidth: viewWidth.current,
    });

  // render
  
  return <>
    <Root
      ref={ref}
      {...props}
      style={{
        ...style,
        height: preferedRootHeight,
      }}
    >
      <ScrollElement
        data-mobileonly={mobileOnly}
        ref={scrollElement}       
        style={{
          scrollSnapType: snap && _snap ? 'x mandatory' : 'none',
        }}
      >
        <Wrapper data-mobileonly={mobileOnly} style={{marginRight: `${extraMargin}px`}}>
          <TrackElement as={track} $align={align}>
            {children}
          </TrackElement>
        </Wrapper>
      </ScrollElement>
    </Root>
  </>
});

export default ScrollCarousel;
