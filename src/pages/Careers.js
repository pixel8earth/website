import React from 'react';
import { MDBIcon } from 'mdbreact';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import Blocks3 from '../assets/blocks_3.svg';
import Blocks2 from '../assets/blocks_2.svg';
import CareersPng from '../assets/careers_graphic.png';
import mainStyles from '../styles';


class Careers extends React.Component {

  constructor() {
    super();
    this.state = {
      jobShown: null
    };
  }

  componentDidMount() {
    this.mounted = true;
    if (window.scrollTo) window.scrollTo(0, 0);
    if (this.props.match.params.job) this.setJobShown();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.job !== prevProps.match.params.job) {
      this.setJobShown();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setJobShown = () => {
    if (this.mounted) {
      let jobShown = this.props.match.params.job;
      if (!jobShown) jobShown = null;
      this.setState({ jobShown });
    }
  }

  navToJob = (job) => this.props.history.push(`/careers/${job}`)

  render() {
    const { jobShown } = this.state;
    let titleText = '', overview = [], bulletedSections = [];

    if (jobShown === 'frontend') {
      titleText = 'Software Engineer - Frontend';
      overview = [
        'The Pixel8earth frontend engineer is responsible for designing, building and helping coordinate Pixel8earth’s front end applications and user services.',
        'Are you a front end engineer with expertise in React and interested in 3D visualization and data management? Looking for a fun and collaborative team tackling global scale crowdsourcing problems?'
      ];
      const requirements = [
        'Building a responsive web application using React and React Native with the potential to grow cross platform in the future.',
        'Creating interfaces for managing large amounts of 3D data contributed by users across the globe and stitched into a single continuous 3D model and feature database.',
        'Building and managing a 3D data visualization and analysis studio for users to create, interface and play with community data.',
        'Push the envelope for creative 3D global to local/micro scale visualizations that further incentivize user contributions and engagement'
      ];
      requirements.title = 'Frontend Engineer Responsibilities';
      const desired = [
        'BS/MS in Computer Science or a related technical field',
        '5+ years experience building consumer-facing applications',
        '5+ years experience with Javascript, HTML, CSS',
        'Strong knowledge of one or more modern JavaScript frameworks like React or Angular.',
        'Strong knowledge of Node.js',
        'Strong architecture and system design skills',
        'Comfortable with modern React tooling like ES6 and babel/webpack',
        'Have an interest in building software development processes and engineering culture',
        'Strong ability to evaluate and analyze tradeoffs between implementation time, maintainability, and impact'
      ];
      desired.title = 'Desired Qualifications';
      const bonus = [
        'Experience working in a startup or high-growth environment',
        'Experience working in React Native and/or Android or iOS',
        'Experience working with Three.js'
      ];
      bonus.title = 'Bonus Qaulities';
      bulletedSections = [
        requirements,
        desired,
        bonus
      ];
    } else if (jobShown === 'backend') {
      titleText = 'Software Engineer - Backend';
      overview = [
        'The Pixel8earth backend engineer is responsible for designing, building and helping coordinate Pixel8earth’s core platform and photogrammetry pipeline.', 
        'Are you a backend engineer with expertise in Python or C++ and interested in photogrammetry and image processing problems? Looking for a fun and collaborative team tackling big computer vision challenges?'
      ];
      const resp = [
        'Collaborate in a team environment across multiple scientific and engineering disciplines',
        'Write clean readable code, and efficiently debug complex problems in existing codebases.',
        'Apply software engineering principles, pragmatically, to highly mathematical software problems.',
        'Track, customize, and contribute back to open source photogrammetry projects',
        'Automate the production of containerized release packages for testing and deployment',
        'Learn constantly, dive into new areas with unfamiliar technologies, and embrace the ambiguity of AR and VR problem solving'
      ];
      resp.title = 'Backend Engineer Responsibilities';
      const dq = [
        'Bachelor in Computer Engineering, Computer Science, Electrical Engineering, Computer Sciences or related field',
        'Proven track record of software development, including shipping one or more products',
        'Problem solving and optimization experience',
        'Demonstrated experience working collaboratively in cross-functional teams',
        'Familiarity with version control via Git'
      ];
      dq.title = 'Desired Qualifications';
      const python = [
        '3 or more years of Python experience, including in the last 2 years.',
        'Experience with Python 3.x and scientific python tools such as NumPy, SciPy, and Jupyter',
        'Familiarity with computer vision libraries such as OpenCV',
        'Experience with Python packaging using pip and conda',
        'Ability to interface python with C/C++ via cython or pybind11',
        'Familiarity with Python testing frameworks'
      ];
      python.title = 'Python Qualifications';
      const c = [
        '3 or more years of modern C++ (ie C++11 and later) experience',
        'Experience with CMake build systems',
        'Familiarity working with with numerical libraries such as Eigen and optimization libraries such as Ceres',
        'Ability to interface C++ with python via pybind11',
        'Familiarity with C++ unit testing'
      ];
      c.title = 'C++ Qualifications';
      const bonus = [
        'Expertise in Physics, Mathematics, Optics, Computer Vision, Robotics, Sensor Fusion, or Machine Learning',
        'Experience in shipping computer vision or image processing product to customers',
        'Experience with containerized infrastructure using docker and kubernetes'
      ];
      bonus.title = 'Bonus Qualifications';
      bulletedSections = [
        resp,
        dq,
        python,
        c,
        bonus
      ];
    } 
    // else if (jobShown === 'devops') {
    //   titleText = 'Devops Infastructure Engineer';
    //   overview = ['foo', 'bar', 'baz'];
    //   bulletedSections = [];
    // }

    return (
      <div style={styles.main}>
        {!jobShown &&
          <>
            <img src={Blocks2} style={styles.topBlocks} alt="decorative blocks" />
            <div style={styles.topSection}>
              <div style={{ minWidth: '36.8%', maxWidth: '530px' }}>
                <div style={styles.title}>Careers</div>
                <div style={styles.openingP}>
                  Pixel8earth is building a crowdsourced and perpetually updating 3D map of the world for machines+humans. We fuse computer vision and geomatics to enable commodity video and photos to generate georeferenced 3D point clouds and meshes. This allows multiple high volume data sources to be utilized to generate and perpetually update 3D maps of the globe. The goal is to allow anyone to upload video or photos and create a 3D model of their geography and spatially fuse that model with the rest of the community. This data is then used to build feature databases and a visual positioning service, which is the core business. We are looking to build a team of engineers that love creating communities, building 3D worlds and enabling a future for augmented reality and autonomy applications.
                </div>
              </div>
              <img src={CareersPng} style={styles.employees} alt="building with employees" />
            </div>
            <div style={styles.bottomSection}>
              <div style={styles.positions}>
                <div style={styles.positionsTitle}>Open Positions</div>
                <div to="/careers/frontend" className="jobPosition" onClick={() => this.navToJob('frontend')}>
                  Software Engineer - Frontend
                  <div className="jobLine"></div>
                </div>
                <div className="jobPosition" onClick={() => this.navToJob('backend')}>
                  Software Engineer - Backend
                  <div className="jobLine"></div>
                </div>
                {/*<div className="jobPosition" onClick={() => this.navToJob('devops')}>
                  Devops Infastructure Engineer
                  <div className="jobLine"></div>
                </div>*/}
              </div>
              <img src={Blocks3} style={styles.bottomBlocks} alt="decorative blocks" />
            </div>
          </>
        }
        {jobShown !== null &&
          <>
            <Link to="/careers" className="backLink">
              <MDBIcon icon="chevron-left"/>Back
            </Link>
            <div style={styles.jobListingWrap}>
              <div className="pageTitle">
                {titleText}
              </div>
              <div style={styles.sectionTitle}>
                Overview
              </div>
              {overview.map((o, i)=> (
                <p style={styles.paragraph} key={i}>{o}</p>
              ))}
              { bulletedSections && bulletedSections.length > 0 && bulletedSections.map((section, idx) => {
                return (
                  <div key={idx}>
                    <div style={styles.sectionTitle}>
                      {`${section.title}:`}
                    </div>
                    <ul>
                      {section.map((r, i) => (
                        <li style={styles.paragraph} key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
              <p style={{ ...styles.paragraph, margin: '24px 0' }}>
                If this sounds like a good fit for you please use the button below or send us your resume via email at <a href={`mailto: sean.gorman@pixel8.earth?subject=${titleText}`} target="_blank" rel="noopener noreferrer" style={styles.link}>sean.gorman@pixel8.earth</a>.
              </p>
              <a
                className="btnP8"
                href={`mailto: sean.gorman@pixel8.earth?subject=${titleText}`}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.apply}
              >
                Apply
              </a>
            </div>
          </>
        }
      </div>
    );
  }
}

const styles = {
  main: {
    position: 'relative',
    maxWidth: '1440px',
    width: '100%',
    minHeight: '80vh',
    padding: '0 64px',
    background: 'linear-gradient(180deg, #FAFAFA 25%, #FFFFFF 100%)'
  },
  topBlocks: {
    position: 'absolute',
    top: 0,
    left: '-3.05%',
    zIndex: 0,
    opacity: '1',
    objectFit: 'contain'
  },
  title: {
    fontFamily: mainStyles.boldFont,
    fontSize: '56px',
    lineHeight: '68px',
    color: mainStyles.colors.primary,
    marginTop: '150px'
  },
  topSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap-reverse'
  },
  openingP: {
    color: '#5f5f5f',
    fontSize: '18px',
    lineHeight: '28px',
    maxWidth: '530px',
    marginTop: '32px'
  },
  employees: {
    minWidth: '350px',
    maxWidth: '600.17px',
    width: '41.68%',
    objectFit: 'contain',
    marginTop: '100px',
    zIndex: 1
  },
  bottomSection: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  positions: {
    maxWidth: '528px',
    marginTop: '226px',
    marginBottom: '180px'
  },
  positionsTitle: {
    fontSize: '32px',
    lineHeight: '40px',
    fontFamily: mainStyles.boldFont,
    marginBottom: '60px'
  },
  bottomBlocks: {
    maxWidth: '250px',
    objectFit: 'contain',
    width: '25vw',
    marginLeft: '45%'
  },
  /*BEGIN JOB LISTING PAGE CSS*/
  jobListingWrap: {
    marginTop: '72px',
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '640px',
    marginBottom: '84px'
  },
  sectionTitle: {
    fontFamily: mainStyles.boldFont,
    fontSize: '24px',
    lineHeight: '32px',
    color: mainStyles.colors.primary,
    margin: '24px 0'
  },
  paragraph: {
    color: '#5f5f5f',
    fontSize: '18px',
    lineHeight: '28px',
    marginBottom: '16px'
  },
  apply: {
    display: 'flex',
    justifyContent: 'center',
    maxWidth: '416px',
    width: '65%',
    alignSelf: 'center',
    marginTop: '100px',
    marginBottom: '220px'
  },
  link: {
    color: mainStyles.colors.gradientBlue
  }
};

export default withRouter(Careers);
