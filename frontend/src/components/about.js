import Suresh from './../assets/suresh.jpg';

function About() {
  return (
    <>
      <div style={{ marginTop: '2rem', width: '100%', height: '10px' }} className="about-scroll"></div>

      <div className="container about" style={{ marginBottom: '5rem' }}>
        <div className="row">
          <div className="col-md-6 text-center">
            <img alt="about" src={Suresh} className="selected-image-about" />
            <div className="mt-4 d-md-none"></div> {/* Spacing for mobile view */}
          </div>
          <div className="col-md-6">
            <p className="main-title about">ABOUT US</p>
            <p className="main-p">
              Fusion of TRADITION, TECHNOLOGY, and INNOVATION – <strong>Margam Farms</strong> is an exclusive edible and essential oil brand of Margam Farm Pvt Ltd – a wood-pressed oil company.
              <br /><br />
              <strong>Suresh</strong>, the <strong>founder CEO</strong>, is an entrepreneur and an IT Professional with over 22 years of experience across multiple industries. At Margam Farms, a team of experts constantly strives to ensure hygienic, nutrient-rich, and best-in-class edible and essential oils are produced.
              <br /><br />
              Our edible oils are extracted at room temperature using the age-old conventional Gaana / Chekku / Ghani extractor (Wooden) – a combination of tradition, technology, and innovation. We prepare various wood-pressed oils, and we have a team constantly monitoring to ensure hygienic, nutrient-rich, and best-in-class edible oil.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
