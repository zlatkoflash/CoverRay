import { fetchTemplates, templatesActions } from "@/lib/features/templates/templatesSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";

export default function MobileCategories() {
  // 1. Define the data array
  /*const collections = [
    { id: "celebrity", name: "Celebrity", count: 12 },
    { id: "fishing", name: "Fishing", count: 8 },
    { id: "boss", name: "Best Boss", count: 6 },
    { id: "cat", name: "Cat", count: 15 },
    { id: "summer", name: "Summer", count: 10 },
    { id: "dog", name: "Dog", count: 18, selected: true }, // Added a flag for the 'selected' state
  ];*/

  const dispatch = useDispatch<AppDispatch>();

  const stateTemplate = useSelector((state: RootState) => state.template);
  const categories = stateTemplate.categories;
  const selectedCategory = stateTemplate.selectedCategory;
  // templatesActions


  return (
    <>
      <div className="section-header">
        <div className="section-number">1</div>
        <div className="section-title">Select from our different magazine collections</div>
      </div>

      <div className="collections-wrapper">
        <div className="collections-grid" id="collectionsGrid">
          {/* 2. Map through the array */}
          {categories.map((category) => (
            <div
              key={`category-${category.id}`}
              className={`collection-card ${selectedCategory === category.id ? 'selected' : ''}`}
              data-category={category.id}
              onClick={() => {
                dispatch(templatesActions.setSelectedCategory(category.id));
                dispatch(fetchTemplates(category.id));
                dispatch(templatesActions.setSelectedTemplate(null));
              }}
            >
              <div className="collection-name">{category.label}</div>
              <div className="collection-count">{category.template_count} templates</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}