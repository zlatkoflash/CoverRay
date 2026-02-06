import Image from "next/image";
import the_dog_example from '@/assets/images/doga-example.jpg';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { templatesActions } from "@/lib/features/templates/templatesSlice";

export default function MobileMagazinesPanels() {
  // 1. Define your array of magazine objects
  /*const magazines = [
    {
      id: "1",
      name: "Dogue",
      price: "$9.99",
      image: the_dog_example, // Uses the imported image
      selected: true,
    },
    {
      id: "2",
      name: "Pawsmipolitan",
      price: "$9.99",
      image: null, // No image yet, will show placeholder
    },
    {
      id: "3",
      name: "Time Dog",
      price: "$9.99",
      image: null,
    },
    {
      id: "4",
      name: "Bark",
      price: "$9.99",
      image: null,
    },
    {
      id: "5",
      name: "Dog Fancy",
      price: "$9.99",
      image: null,
    },
    {
      id: "6",
      name: "Modern Dog",
      price: "$9.99",
      image: null,
    },
  ];*/


  const dispatch = useDispatch<AppDispatch>();
  const templates = useSelector((state: RootState) => state.template.templates);
  const selectedTemplate = useSelector((state: RootState) => state.template.selectedTemplate);


  return (
    <>
      <div className="section-header">
        <div className="section-number">2</div>
        <div className="section-title">Available options</div>
      </div>

      <div className="magazines-wrapper">
        <div className="magazines-grid" id="magazinesGrid">
          {templates.map((template) => (
            <div
              key={`template-${template.id}`}
              className={`magazine-card ${selectedTemplate?.id === template.id ? "selected" : ""}`}
              data-id={template.id}
              data-name={template.name}
              onClick={() => {
                dispatch(templatesActions.setSelectedTemplate(template));
              }}
            // Note: In React, we use onClick={handleFunction} instead of onclick=""
            // I'm leaving the data- attributes for your existing logic
            >
              <div className="magazine-preview">
                {template.thumbnail_url && template.thumbnail_url !== "" ? (
                  /* Show Image if it exists */
                  <Image src={template.thumbnail_url} alt={template.name} width={1000} height={1000} />
                ) : (
                  /* Show Placeholder if image is null */
                  <div className="magazine-placeholder">
                    {template.name.toUpperCase()}
                  </div>
                )}
                {
                  // <div className="magazine-price">{mag.price}</div>
                }
              </div>
              <div className="magazine-name">{template.name}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}