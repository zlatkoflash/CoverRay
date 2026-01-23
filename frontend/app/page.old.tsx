import GridOccationType from "@/components/grids/GridOccationType";
import GridPersonType from "@/components/grids/GridPersonType";
import ScreenHeader from "@/components/headers/ScreenHeader.delete";
import Image from "next/image";
import Link from "next/link";




export default function Home() {
  return (
    <>
      <div className="screen">
        <ScreenHeader>
          {/*<button className="header-btn">Browse All Templates →</button>*/}
          <Link className="header-btn" href="/">Browse All Templates →</Link>
        </ScreenHeader>
        <div className="content" style={{ textAlign: "center" }}>
          <div className="entry-title">Let's find the perfect cover</div>
          <div className="entry-subtitle">Answer a couple questions, or <a href="#" style={{ color: "#7c3aed" }}>skip to
            browse all</a></div>

          <div style={{ textAlign: "left", maxWidth: "700px", margin: "0 auto" }}>

            <GridPersonType />
            <GridOccationType />

          </div>

          <div className="cta-section">
            {
              /*
              <button className="btn-primary">Show Me Templates →</button>
              */
            }
            <Link className="btn-primary" href="/SelectTemplate">Show Me Templates →</Link>
            <div className="cta-subtext">Showing 3 templates</div>
          </div>
        </div>
      </div>
    </>
  );
}
