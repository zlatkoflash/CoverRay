'use client';
import { AppDispatch, RootState } from '@/lib/store';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTemplates, templatesActions } from '@/lib/features/templates/templatesSlice';

export default function SidebarLayouts() {
  // 1. Define the data array
  /*const categories = [
    { id: 'dog', name: 'Dog Lovers', count: 18, icon: '🐕' },
    { id: 'cat', name: 'Cat Lovers', count: 15, icon: '🐱' },
    { id: 'celebrity', name: 'Celebrity', count: 12, icon: '⭐' },
    { id: 'boss', name: 'Best Boss', count: 8, icon: '💼' },
    { id: 'fishing', name: 'Fishing', count: 10, icon: '🎣' },
    { id: 'summer', name: 'Summer', count: 12, icon: '☀️' },
  ];*/
  const dispatch = useDispatch<AppDispatch>();

  const categories = useSelector((state: RootState) => state.template.categories);
  const selectedCategory = useSelector((state: RootState) => state.template.selectedCategory);

  // 2. State to track which category is currently selected
  // const [selectedCategory, setSelectedCategory] = useState('dog');

  return (
    <>
      <aside className="selection-sidebar">
        <h2 className="sidebar-title">Collections</h2>
        <p className="sidebar-subtitle">Choose a category to explore</p>

        <div className="category-list" id="categoryList">
          {/* 3. Map through the array to generate the JSX */}
          {categories.map((category) => (
            <div
              key={category.id}
              className={`category-item ${selectedCategory?.id === category.id ? 'selected' : ''}`}
              onClick={() => {
                // setSelectedCategory(category.id)
                dispatch(templatesActions.setSelectedCategory(category));
                dispatch(fetchTemplates(category.id));
                dispatch(templatesActions.setSelectedTemplate(null));
              }}
            >
              <div className="category-icon">{category.icon}</div>
              <div className="category-info">
                <div className="category-name">{category.label}</div>
                <div className="category-count">{
                  // category.count
                  category.template_count
                } templates</div>
              </div>
              <div className="category-check">✓</div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}