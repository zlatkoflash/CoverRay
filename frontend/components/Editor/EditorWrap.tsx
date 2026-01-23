"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { POSTER_H } from '@/utils/editor';

const KonvaStageNoSSR = dynamic(() => import('@/components/Editor/KonvaStage'), {
  ssr: false
});


export default function EditorWrap({
  // template 
}: {
    // this should be .json file with pages, we will use the pages[0] as default
    // in example-templates there are the example of the templates
    // template: any;
  }) {
  /*const [items, setItems] = useState<any[]>(
    
    template.pages[0].children
  );*/
  // const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Design Canvas Dimensions
  const [scalePoster, setScalePoster] = useState(1);

  const engineRef = useRef<HTMLDivElement>(null);

  console.log('It is working');
  useLayoutEffect(() => {
    console.log("It is working inside");
    const measure = () => {
      console.log("engineRef.current:", engineRef.current);
      if (engineRef.current) {
        console.log("We are mesuring");
        // This gets the exact width/height of the div
        const { width, height } = engineRef.current.getBoundingClientRect();
        setDimensions({ width, height });
        console.log(width, height);
        if (height < POSTER_H + 80) {
          setScalePoster(height / (POSTER_H + 80));
        }
      }
    };

    // Measure initially
    measure();

    // Re-measure if window resizes
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
    }
  }, []);

  // if (dimensions.width === 0 || dimensions.height === 0) return null;

  return (
    <div
      className="editor-canvas-engine absolute top-0 left-0 w-full h-full bg-zinc-950 overflow-hidden flex flex-col"
      id="editor-canvas-engine"
      ref={engineRef}
    >


      <KonvaStageNoSSR
        // items={items}
        // setItems={setItems}
        // selectedId={selectedId}
        // setSelectedId={setSelectedId}
        scale={scalePoster}
        onScaleChange={setScalePoster}
        dimensions={{ width: dimensions.width, height: dimensions.height }}
      // initialItems={template.pages[0].children}
      />
    </div>
  );
}