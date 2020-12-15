import React from 'react';

import mainStyles from '../styles';
import Pramukta from '../assets/pramukta.png';
import Sean from '../assets/sean.png';
import Chris from '../assets/chris.png';
import Winnie from '../assets/winnie.png';
import Blocks1 from '../assets/blocks_1.svg';
import Blocks2 from '../assets/blocks_2.svg';


function AboutUs() {
  return (
  <div style={styles.content}>
    <img src={Blocks1} style={styles.blocks1} alt="decorative blocks" />
      <div style={styles.title}>Meet the Team</div>

      <div style={styles.bios}>
        <div style={styles.bioCard}>
          <div style={styles.bioHeader}>
            <img
              src={Pramukta}
              style={styles.photo}
              alt="employee"
            />
            <div>
              <div style={styles.name}>
                Pramukta Kumar PhD
              </div>
              <div style={styles.line}></div>
              <div style={styles.jobTitle}>CTO</div>
            </div>
          </div>
          <div style={styles.bio}>
            Pramukta is a co-founder of Pixel8earth and scientist specializing in computational data analysis. Prior to founding Pixel8earth he worked as a research professor at Stanford University’s Asner Lab. Pramukta was also an engineering leader at Timbr.io and GeoIQ, and was subsequently a Senior Software Developer at DigitalGlobe post acquisition. As an academic he was nominated as a US delegate to the Lindau Nobel Laureates meeting as a promising young physics researcher. His work at GeoIQ led to 2 granted patents. Pramukta holds a BS in physics from Georgetown University where he was the Treado Medal winner. His PhD is in Experimental Condensed Matter Physics also from Georgetown University.
          </div>
        </div>
        <div style={styles.bioCard}>
          <div style={styles.bioHeader}>
            <img
              src={Sean}
              style={styles.photo}
              alt="employee"
            />
            <div>
              <div style={styles.name}>
                Sean Gorman PhD
              </div>
              <div style={styles.line}></div>
              <div style={styles.jobTitle}>CEO</div>
            </div>
          </div>
          <div style={styles.bio}>
            Sean is a co-founder of Pixel8earth Inc. Previously he was the Head of Technical Product Management and Machine Learning Tools at DigitalGlobe helping build GBDX and next generation analytics for satellite imagery. Previously he was a founder of Timbr.io - a platform for enabling algorithm reusability and more accessible data science - acquired by DigitalGlobe in 2016. Before starting Timbr.io he was a founder of GeoIQ - a collaborative data and analytics company. GeoIQ was subsequently acquired by ESRI where Sean worked as a director of strategy. Sean has also previously worked in academia serving as a research professor at George Mason University. He is the author of 25 academic publications, four patents and one book. Sean received his PhD from George Mason University as the Provost's High Potential Research Candidate, Fisher Prize winner and an INFORMS Dissertation Prize recipient.
          </div>
        </div>
      </div>

      <div style={styles.bios}>
        <div style={styles.bioCard}>
          <div style={styles.bioHeader}>
            <img
              src={Chris}
              style={styles.photo}
              alt="employee"
            />
            <div>
              <div style={styles.name}>
                Chris Helm
              </div>
              <div style={styles.line}></div>
              <div style={styles.jobTitle}>Director of Analytics</div>
            </div>
          </div>
          <div style={styles.bio}>
            Chris is co-founder at Pixel8earth and a full stack analytics engineer specializing in data visualization and streaming analytics. He’s been contributing to open source projects for over 8 years, and was a lead engineer at GeoIQ, Esri and DigitalGlobe. While working at Esri he was the primary architect behind a successful open data pipeline project (Koop) and several cutting edge visualization projects. Prior to GeoIQ Chris was a data scientist at the National Renewable Energy Lab working on solar radiation time series algorithms. His academic/professional background is in the physical sciences, and his current work focuses on visualization of temporal and spatial patterns in large datasets. Chris holds a BS from University of Denver and a MS from the University of Colorado at Boulder.
          </div>
        </div>
        <div style={styles.bioCard}>
          <div style={styles.bioHeader}>
            <img
              src={Winnie}
              style={styles.photo}
              alt="employee"
            />
            <div>
              <div style={styles.name}>
                Winnie Palangpour
              </div>
              <div style={styles.line}></div>
              <div style={styles.jobTitle}>Software Engineer</div>
            </div>
          </div>
          <div style={styles.bio}>
            Winnie is a co-founder of Pixel8earth and works as a developer focusing on our web and mobile app front ends as well as API needs. She started with the team as an intern at Timbr.io and quickly moved to a full time contributor. After the acquisition of Timbr.io by DigitalGlobe Winnie was promoted three times in two years leaving DigitalGlobe, now Maxar, as a Senior Staff Software Development Engineer and a main contributor to the GBDX Notebooks web app. Prior to Timbr.io she worked in several fields including healthcare and biotech. She received a bachelor’s degree from the University of Missouri in Interdisciplinary Studies with emphases in biology, psychology, and art.
          </div>
        </div>
      </div>
      <img src={Blocks2} style={styles.blocks2} alt="decorative blocks" />
    </div>
  );
}

const styles = {
  content: {
    position: 'relative',
    padding: '0 4.44%',
    paddingBottom: '180px',
    background: 'linear-gradient(180deg, #FAFAFA 25%, #FFFFFF 100%)'
  },
  blocks1: {
    position: 'absolute',
    top: '36px',
    right: '-4.44%',
    zIndex: 0,
    maxWidth: '152px',
    objectFit: 'contain'
  },
  title: {
    fontFamily: mainStyles.boldFont,
    fontWeight: 'bold',
    fontSize: '56px',
    lineHeight: '68px', // identical to box height, or 121%
    color: mainStyles.colors.primary,
    marginBottom: '120px',
    marginTop: '80px',
    zIndex: 1
  },
  bios: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: '-16px',
    marginRight: '-16px'
  },
  bioCard: {
    maxWidth: '640px',
    margin: '16px',
    boxShadow: '0px 2px 12px rgba(0, 26, 16, 0.08)',
    borderRadius: '8px',
    flex: 1,
    zIndex: 1,
    backgroundColor: '#fff'
  },
  bioHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: '28px'
  },
  photo: {
    height: '120px',
    width: '120px',
    background: mainStyles.gradients.logo.background,
    borderRadius: '100%',
    padding: '2px',
    marginRight: '40px'
  },
  name: {
    color: mainStyles.colors.primary,
    fontFamily: mainStyles.boldFont,
    fontSize: '24px',
    lineHeight: '32px',
    marginBottom: '2px'
  },
  line: {
    background: 'linear-gradient(89.24deg, #278EDB 0%, #55BDDE 29.46%, #2FDC9D 76.2%, #06D48A 100%)',
    height: '2px'
  },
  jobTitle: {
    fontFamily: mainStyles.font,
    fontSize: '20px',
    lineHeight: '24px',
    color: '#5f5f5f',
    marginTop: '12px'
  },
  bio: {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#3f3f3f',
    display: 'flex',
    alignItems: 'center',
    margin: '28px',
    marginBottom: '56px'
  },
  blocks2: {
    position: 'absolute',
    left: '-4.44%',
    bottom: '12.29px',
    maxWidth: '216px',
    objectFit: 'contain'
  }
};

export default AboutUs;
