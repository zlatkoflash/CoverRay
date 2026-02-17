"use client";

import { templatesActions } from '@/lib/features/templates/templatesSlice';
import { AppDispatch, RootState } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function TemplateSelection2() {
  // 1. Define the magazine data
  /*const magazines = [
    { id: 1, name: 'Pawsmipolitan', placeholder: 'PAWSMIPOLITAN', price: '$9.99' },
    { id: 2, name: 'Time Dog', placeholder: 'TIME DOG', price: '$9.99' },
    { id: 3, name: 'Bark Vogue', placeholder: 'BARK VOGUE', price: '$12.99' },
    { id: 4, name: 'Rolling Bone', placeholder: 'ROLLING BONE', price: '$8.50' },
    { id: 5, name: 'National Pawgraphic', placeholder: 'NAT PAW', price: '$10.00' },
    { id: 6, name: 'The New Barker', placeholder: 'THE NEW BARKER', price: '$11.00' },
  ];*/

  const dispatch = useDispatch<AppDispatch>();
  const templates = useSelector((state: RootState) => state.template.templates);
  const selectedTemplate = useSelector((state: RootState) => state.template.selectedTemplate);

  console.log("templates:", templates);

  // 2. State to handle the selected card
  // const [selectedId, setSelectedId] = useState(null);

  /*const handleSelect = (id: any, name: any) => {
    setSelectedId(id);
    console.log(`Selected: ${name}`);
    // You can call other logic here like selectMagazine(name)
  };*/

  return (
    <main className="selection-main">
      <div className="selection-header">
        <h3 className="selection-title" id="categoryTitle">Dog Lovers Collection</h3>
        <span className="selection-count" id="magazineCount">
          {templates.length} templates available
        </span>
      </div>

      <div className="magazines-grid" id="magazinesGrid">
        {/* 3. Map through the array */}
        {templates.map((template) => (
          <Link
            href={`/Editor/Template/${template.slug}`}
            key={template.id}
            className={`magazine-card ${selectedTemplate?.id === template.id ? 'selected-' : ''
              }`}
            onClick={() => {
              // handleSelect(template.id, template.name)
              // dispatch(templatesActions.setSelectedTemplate(template));
            }}
            style={{ position: 'relative', cursor: 'pointer' }}
          >
            <div className="magazine-preview">
              {
                template.thumbnail_url !== null ? (
                  // <img src={template.thumbnail_url} alt={template.name} className="magazine-cover" />
                  <Image src={template.thumbnail_url}
                    alt={template.name}
                    width={210} height={290}
                    data-src={template.thumbnail_url}
                    style={{
                      objectFit: 'cover', objectPosition: 'center',
                      width: '100%',
                      height: '100%',
                    }}
                    unoptimized={process.env.NODE_ENV === 'development'}
                  />
                ) : (
                  <div className="magazine-placeholder">{template.name}</div>
                )
              }
              {
                // <div className="magazine-price">{99}</div>
              }
            </div>
            <div className="magazine-name">{template.name}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}