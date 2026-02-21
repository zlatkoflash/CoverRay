"use client";

import { EditorActions } from '@/lib/features/editor/editorSlice';
import { fetchSubcategories, fetchTemplates, templatesActions } from '@/lib/features/templates/templatesSlice';
import { AppDispatch, RootState } from '@/lib/store';
import { LS_DeleteImageFromIndexDB } from '@/utils/editor-local-storage';
import { ITemplateCategoryWithCount } from '@/utils/interfaceDatabase';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function TemplateSelection() {
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
  // const templates = useSelector((state: RootState) => state.template.templates);
  const selectedTemplate = useSelector((state: RootState) => state.template.selectedTemplate);

  // console.log("templates:", templates);

  // 2. State to handle the selected card
  // const [selectedId, setSelectedId] = useState(null);

  /*const handleSelect = (id: any, name: any) => {
    setSelectedId(id);
    console.log(`Selected: ${name}`);
    // You can call other logic here like selectMagazine(name)
  };*/

  // const parentNames = ['Category 1', "Category 2"];
  // const selectedParent = ["Category 1"];
  // const [selectedCategory, setSelectedCategory] = useState("");
  // const [selectedParent, setSelectedParent] = useState("Category 1");
  // const grouped = [{ id: 1, name: "sub 1" }, { id: 2, name: "sub 2" }, { id: 3, name: "sub 3" }];

  // const [selectedCategory, setSelectedCategory] = useState<ITemplateCategoryWithCount>({ id: 0 } as ITemplateCategoryWithCount);
  const templatesState = useSelector((state: RootState) => state.template);
  const categories = templatesState.categories;
  const subcategories = templatesState.subcategories;
  const templates = templatesState.templates;
  const selectedCategory = templatesState.selectedCategory;
  const selectedSubCategory = templatesState.selectedSubCategory;

  const [searchQ, setSearchQ] = useState("");

  console.log("selectedCategory:", selectedCategory);

  const templatesForTheGrid = () => {
    if (selectedCategory === null) {
      return templatesState.featured_templates;
    }
    else {
      return templatesState.templates;
    }
  }

  return (
    <main className="selection-main">

      {
        /* <div className="selection-header">
          <h3 className="selection-title" id="categoryTitle">Dog Lovers Collection</h3>
          <span className="selection-count" id="magazineCount">
            {templates.length} templates available
          </span>
        </div>*/
      }

      <div className="editor-landing-hero">
        <div className="editor-landing-copy">
          <h1 className="editor-landing-title">Magazine Covers for Every Occasion</h1>
          <p className="editor-landing-subtitle">
            Browse our collection of personalized magazine covers.
          </p>
        </div>
        <div className="editor-landing-search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm0-2a9 9 0 0 1 5.93 15.76l4.16 4.17-1.42 1.41-4.17-4.16A9 9 0 1 1 11 2Z" fill="currentColor" />
          </svg>
          <input
            type="search"
            placeholder="Search magazines..."
            value={searchQ}
            onChange={(e) => {
              setSearchQ(e.target.value);
              console.log("searchQ:", searchQ);
            }}
            aria-label="Search magazines"
          />
        </div>
      </div>


      <div className="editor-landing-categories">
        <div className="editor-landing-tabs">
          <button
            key={0}
            className={`editor-landing-tab ${selectedCategory === null
              ? "active" : ""}`}
            onClick={() => {
              dispatch(templatesActions.setSelectedCategory(null));
              dispatch(fetchSubcategories(0));
              setSearchQ("");
            }}
          >
            Featured Magazines
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`editor-landing-tab ${selectedCategory !== null && selectedCategory.id === category.id
                ? "active" : ""}`}
              onClick={() => {
                // setSelectedParent(category.label);
                // const first = grouped?.[0];
                /*if (first) {
                  handleCategoryClick(first.id);
                }*/
                dispatch(templatesActions.setSelectedCategory(category));
                dispatch(templatesActions.setSelectedSubCategory(null));
                dispatch(fetchSubcategories(category.id));
                setSearchQ("");
              }}
            >
              {category.label}
            </button>
          ))}
        </div>

        {
          selectedCategory !== null &&
          <div className="category-row">
            <span className="category-label">{selectedCategory?.label || "Collections"}</span>
            <div className="category-chips">
              <button
                className={`category-chip ${selectedSubCategory === null ? "active" : ""}`}
                onClick={() => {
                  // handleCategoryClick(0)
                  dispatch(templatesActions.setSelectedSubCategory(null));
                  dispatch(fetchTemplates(
                    selectedCategory !== null ? selectedCategory?.id : 0
                  ));
                  setSearchQ("");
                }}
              >
                All
              </button>
              {
                // (grouped.get(selectedParent) || []).map((category) => (
                subcategories.map((subCategory) => (
                  <button
                    key={`category-${subCategory.id}`}
                    className={`category-chip ${selectedSubCategory !== null && selectedSubCategory.id === subCategory.id
                      ? "active" : ""}`}
                    onClick={() => {
                      console.log("subCategory.id:", subCategory.id);
                      // handleCategoryClick(category.id)
                      dispatch(templatesActions.setSelectedSubCategory(subCategory));
                      dispatch(fetchTemplates(
                        subCategory.id
                      ));
                      setSearchQ("");
                    }}
                  >
                    {subCategory.label ?? "Untitled"}
                  </button>
                ))}
            </div>
          </div>
        }
      </div>


      <div className="magazines-grid" id="magazinesGrid">
        {/* 3. Map through the array */}
        {templatesForTheGrid().filter((template) => template.name.toLowerCase().includes(searchQ.toLowerCase())).map((template) => (
          <Link
            href={`/Editor/Template/${template.slug}`}
            key={template.id}
            className={`magazine-card ${selectedTemplate?.id === template.id ? 'selected-' : ''
              }`}
            onClick={async (e) => {
              //e.preventDefault();
              // handleSelect(template.id, template.name)
              // dispatch(templatesActions.setSelectedTemplate(template));
              //  await LS_DeleteImageFromIndexDB(template.slug);
              // delete the basic image url when open new template
              if (selectedTemplate !== null && selectedTemplate.id !== template.id) {
                LS_DeleteImageFromIndexDB("");
                dispatch(EditorActions.resetEditor());
              }

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