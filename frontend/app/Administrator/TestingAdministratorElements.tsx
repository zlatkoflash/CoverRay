"use client";

import { getApiData } from "@/utils/api";


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

  return (
    <>
      <button type="button" onClick={() => {
        FixTheSizesOfTheTemplates();
      }}>

        Fix the sizes of the templates

      </button>
      <button type="button" onClick={() => {
        GetTheDataFromTheJSONHTMLTemplates();
      }}>

        Get The Data FROM the JSON HTML Templates

      </button>
    </>
  );
}