"use client";

import { getApiData } from "@/utils/api";
import LoadSVGFileAndConvertToJSON from "./LoadSVGFileAndConvertToJSON";


export default function TestingAdministratorElements() {

  const FixTheSizesOfTheTemplates = async () => {
    console.log("FixTheSizesOfTheTemplates");

    const details = await getApiData("/administrator/fix-templates-sizes", "POST", {}, "authorize");
    console.log("details:", details);
  }

  const GetTheDataFromTheJSONHTMLTemplates = async () => {
    console.log("GetTheDataFromTheJSONHTMLTemplates");

    const details = await getApiData("/administrator/generate-data-from-json-html-templates", "POST", {}, "authorize");
    console.log("details:", details);
  }

  const GenerateJSONFromSVGDemo = async () => {
    console.log("GenerateJSONFromSVGDemo");

    const details = await getApiData("/administrator/generate-json-from-svg-demo", "POST", {}, "authorize");
    console.log("details:", details);
  }

  return (
    <>
      <button type="button" onClick={() => {
        FixTheSizesOfTheTemplates();
      }}>

        Fix the sizes of the templates

      </button>


      <div className="button-for-getting-the-templates-from-the-jsonHTML" style={{ marginBlock: '50px' }}>
        <p>This button will get all the templates from the json html file that Ray provided to me and will create the json elements.</p>
        <button type="button" onClick={() => {
          GetTheDataFromTheJSONHTMLTemplates();
        }}>

          Get The Data FROM the JSON HTML Templates

        </button>
      </div>


      <button type="button" onClick={() => {
        GenerateJSONFromSVGDemo();
      }}>

        Generate JSON from SVG Demo(this is not working good)

      </button>


      <LoadSVGFileAndConvertToJSON />



    </>
  );
}