import React from 'react';
import { MDBCol, MDBRow, MDBContainer } from 'mdbreact';

import ProjectCards from '../components/ProjectCards';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import mainStyles from '../styles';
import { streamsUrl } from '../lib/fetch';
import { api } from '../front_config';
import pixel8Fetch from '../lib/fetch';

import camerasSVG from '../assets/cameras.svg';
import photogrammetrySVG from '../assets/photogrammetry.svg';
import georeferenceSVG from '../assets/georeference.svg';
import bldgLeftSVG from '../assets/background_bldg_L.svg';
import bldgRightSVG from '../assets/background_bldg_R.svg';
import step1SVG from '../assets/step1.svg';
import step2SVG from '../assets/step2.svg';
import step3SVG from '../assets/step3.svg';
import lineSVG from '../assets/line.svg';
import worldSVG from '../assets/worldMap.svg';
import cityImage from "../assets/p8city.png";
import locationIcon from '../assets/location_icon.svg';
import phoneIcon from '../assets/phone_icon.svg';
import envelopeIcon from '../assets/envelope_icon.svg';

class Home extends React.Component {

  constructor() {
    super();
    this.state = {
      projects: [],
      screenWidth: null,
      canRenderCards: true
    };
  }

  componentDidMount() {
    this.mounted = true;
    
    window.addEventListener('resize', this.onWindowResize, false);
    const screenWidth = window.innerWidth > 1440
      ? 'large'
      : (window.innerWidth >= 780 ? 'medium' : 'small');

    this.setState({ screenWidth, canRenderCards: window.innerWidth >= 530 });
    pixel8Fetch('/projects/tags/p8-featured', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(r => {
        if (r.ok) return r.json();
        throw `${r.status} ${r.statusText || ''}`; //eslint-disable-line no-throw-literal
      })
      .then(r => {
        if (r && r.length > 0) {
          this.setState({ projects: r });
        }
      })
      .catch(err => {
        console.log('Error fetching projects by tag: ', err);
      })

    if (`${window.location.pathname}${window.location.hash}` === '/#login') {
      this.props.logout();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    window.removeEventListener('resize', this.onWindowResize);
  }

  onWindowResize = () => {
    const screenWidth = window.innerWidth >= 1440
      ? 'large'
      : (window.innerWidth >= 780 ? 'medium' : 'small');
    const canRenderCards = window.innerWidth >= 530;

    if (this.mounted && (screenWidth !== this.state.screenWidth || this.state.canRenderCards !== canRenderCards)) {
      this.setState({ screenWidth, canRenderCards });
    }
  }

  render() {
    const { projects, screenWidth, canRenderCards } = this.state;

    return (
      <MDBContainer fluid style={{ padding: 0, margin: 0 }}>
        <MDBRow style={{ margin: 0, padding: 0 }}>
          <MDBCol style={{ justifyContent: 'center', alignContent: 'center', padding: 0, margin: 0 }}>
            <NavBar
              {...this.props}
              style={{
                backgroundColor: 'transparent',
                marginLeft: 'auto',
                marginRight: 'auto',
                maxWidth: '1440px'
              }}
              links={['blog', 'about', 'careers']}
              logoStyle={screenWidth === 'small' ? { marginLeft: '6px' } : {}}
            />
            <div style={styles.main}>
            <div style={{
              background: 'linear-gradient(180deg, #FAFAFA 69.88%, rgba(251, 251, 251, 0.76) 75.83%, rgba(246, 246, 246, 0.81) 82.1%, #F3F3F3 88.51%, #F1F1F1 96.38%)',
              paddingBottom: screenWidth === 'small' ? '200px' : 'unset'
            }}>
              <div
                style={{
                  display: 'flex',
                  maxWidth: '1440px',
                  margin: '0 auto'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    maxHeight: '1269px',
                    height: screenWidth === 'small' ? 'unset' : '139vh',
                    flexDirection: screenWidth === 'small' ? 'column-reverse' : 'row'
                  }}
                >
                  <div style={{
                    margin: screenWidth === 'small' ? '0 64px' : '280px 64px 0px',
                    fontFamily: mainStyles.font,
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    color: '#000A1D',
                    zIndex: 1,
                    textAlign: screenWidth === 'small' ? 'center' : 'unset',
                  }}>
                    <div
                      style={{
                        fontFamily: mainStyles.boldFont,
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                        fontSize: '56px',
                        lineHeight: '68px'
                      }}
                    >
                      Help build<br/> an open 3D map<br/> of the world
                    </div>
                    <div style={{
                      marginTop: '36px',
                      fontFamily: mainStyles.font,
                      fontStyle: 'normal',
                      fontWeight: 'normal',
                      fontSize: '20px',
                      lineHeight: '24px',
                      color: '#01253D',
                      zIndex: 1,
                      maxWidth: '448px'
                    }}>
                      Pixel8earth is a crowdsourced and perpetually updating map that fuses terrestrial and aerial data into one model
                    </div>
                    <div
                      className="btnP8 btnP8HomeFeatured"
                      style={{
                        margin: '0px',
                        marginRight: screenWidth === 'small' ? 'unset' : '64px',
                        fontSize: '20px',
                        color: '#fff',
                        width: screenWidth === 'small' ? '100%' : '416px',
                        marginTop: '52px',
                        zIndex: 1,
                        maxWidth: '80vw'
                      }}
                    >
                      <a
                        href="https://forms.gle/17kEVw1yR57Jbi2q6"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'inherit' }}
                      >Be an Ambassador</a>
                    </div>
                  </div>
                  <img
                    src={cityImage}
                    alt="citySVG"
                    className="cityGraphic"
                  />
                </div>
              </div>
            </div>


              {/* section 2 (Tech) */}
              <div
                style={{
                  background: 'rgba(238, 238, 238, 0.8)',
                  height: 'fit-content',
                  width: '100%',
                  position: 'relative'
                }}
              >
                <img src={bldgRightSVG} alt="building_background" style={{
                  position: 'absolute',
                  left: 'calc(100% - 186px)',
                  top: '2%',
                  height: '961.64px',
                  zIndex: 0
                }} />
                <img src={bldgLeftSVG} alt="building_background" style={{
                  position: 'absolute',
                  width: '223px',
                  top: '46%',
                  height: '571.25px',
                  zIndex: 0
                }} />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: screenWidth === 'small' ? 'column' : 'row',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    width: '100%',
                    position: 'relative',
                    maxHeight: screenWidth === 'large' ? '412px' : 'unset'
                  }}
                >
                  <img src={camerasSVG} alt="cameras" style={{
                    position: 'relative',
                    width: screenWidth === 'small' ? '50%' : '28%',
                    height: '412px',
                    zIndex: 1
                  }} />
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'visible',
                      height: screenWidth === 'large' ? '115.19px' : '8vw'
                    }}>
                    { screenWidth !== 'small' &&
                      <img src={step1SVG} alt="step one" style={{
                        width: '8vw',
                        maxWidth: '120px',
                        height: '8vw',
                        maxHeight: '120px',
                        zIndex: 1
                      }} />
                    }
                    {screenWidth === 'large' &&
                      <img src={lineSVG} alt="connectiong line" style={{ zIndex: 0, height: '442px' }} />
                    }
                  </div>
                  <div style={{
                    position: 'relative',
                    width: screenWidth === 'small' ? '60%' : '28%',
                    zIndex: 1
                  }}>
                    <div style={{
                      fontSize: '32px',
                      lineHeight: '48px',
                      fontWeight: 'bold',
                      alignItems: 'center',
                      fontFamily: mainStyles.boldFont
                    }}>
                      Camera
                    </div>
                    <div style={{
                      fontSize: '20px',
                      color: '#5F5F5F',
                      lineHeight: '24px',
                      alignItems: 'center',
                      marginTop: '12px',
                      maxWidth: '400px'
                    }}>
                      You can use a wide variety of commodity cameras to capture imagery of large scale outdoor environments. 360 cameras are the best, but any camera will work well.
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: screenWidth === 'small' ? 'column' : 'row',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    width: '100%',
                    marginTop: '200px',
                    maxHeight: screenWidth === 'large' ? '392px' : 'unset'
                   }}
                >
                  <img src={photogrammetrySVG} alt="photogrammetry" style={{
                    width: screenWidth === 'small' ? '50%' : '28%',
                    maxHeight: '312px',
                    zIndex: 1
                  }} />
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'visible',
                      height: screenWidth === 'large' ? '115.19px' : '8vw'
                    }}
                  >
                    { screenWidth !== 'small' &&
                      <img src={step2SVG} alt="step two" style={{
                        width: '8vw',
                        maxWidth: '120px',
                        height: '8vw',
                        maxHeight: '120px',
                        zIndex: 1
                        }}
                      />
                    }
                    {screenWidth === 'large' &&
                      <img src={lineSVG} alt="connectiong line" style={{ zIndex: 0, height: '429px' }} />
                    }
                  </div>
                  <div style={{
                    width: screenWidth === 'small' ? '60%' : '28%',
                    zIndex: 1
                  }}>
                    <div style={{
                      fontSize: '32px',
                      lineHeight: '48px',
                      fontWeight: 'bold',
                      alignItems: 'center',
                      fontFamily: mainStyles.boldFont
                    }}>
                      Point Clouds
                    </div>
                    <div style={{
                      fontSize: '20px',
                      color: '#5F5F5F',
                      lineHeight: '24px',
                      alignItems: 'center',
                      marginTop: '12px',
                      maxWidth: '400px'
                    }}>
                      Images from the commodity cameras are then split into frames and photogrammetry is used to create point clouds to create 3D models from your video collections.
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: screenWidth === 'small' ? 'column' : 'row',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    width: '100%',
                    marginTop: '200px',
                    maxHeight: screenWidth === 'large' ? '392px' : 'unset'
                  }}
                >
                  <img src={georeferenceSVG} alt="georeference" style={{
                    width: screenWidth === 'small' ? '50%' : '28%',
                    maxHeight: '380px',
                    marginBottom: '12px',
                    zIndex: 1
                  }} />
                  { screenWidth !== 'small' &&
                    <img src={step3SVG} alt="step three" style={{
                      width: '8vw',
                      maxWidth: '120px',
                      height: '8vw',
                      maxHeight: '120px',
                      zIndex: 1
                    }} />
                  }
                  <div style={{
                    width: screenWidth === 'small' ? '60%' : '28%',
                    zIndex: 1
                  }}>
                    <div style={{
                      fontSize: '32px',
                      lineHeight: '48px',
                      fontWeight: 'bold',
                      alignItems: 'center',
                      fontFamily: mainStyles.boldFont
                    }}>
                      Georeference
                    </div>
                    <div style={{
                      fontSize: '20px',
                      color: '#5F5F5F',
                      lineHeight: '24px',
                      alignItems: 'center',
                      marginTop: '12px',
                      maxWidth: '400px'
                    }}>
                      Your 3D models are georeferenced, giving each pixel a latitude, longitude, and altitude. These coordinates are used to stitch all models together to map the world in 3D.
                    </div>
                  </div>
                </div>
              </div>


              {/* section 3 (Browse) */}
              <div
                style={{
                  background: 'linear-gradient(180deg, #FFFFFF 52.5%, rgba(251, 251, 251, 0.75) 68.18%, #F6F6F6 77.73%, #F3F3F3 88.27%, #F1F1F1 99.45%)',
                  transform: 'rotate(-180deg)',
                  zIndex: 0,
                  paddingBottom: '300px',
                  paddingTop: '200px',
                  marginTop: '0px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'end'
                }}
              >
                <div style={{
                  padding: '24px 0px',//64px',
                  fontSize: '32px',
                  lineHeight: '40px',
                  fontWeight: '700',
                  textAlign: 'center',
                  transform: 'rotate(-180deg)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div
                    style={{
                      padding: screenWidth === 'small' ? '0 10%' : '0 20%',
                      textAlign: 'center',
                      fontFamily: mainStyles.boldFont
                    }}
                  >
                    Anyone can browse publicly available content or create an account and build your 3D models of the planet
                  </div>
                  <div style={{
                    marginTop: '28px',
                    fontSize: '20px',
                    color: '#5F5F5F',
                    lineHeight: '24px',
                    textAlign: 'center',
                    fontWeight: '400',
                    padding: screenWidth === 'small' ? '0 10%' : 'unset'
                  }}>
                    Start exploring now by checking out a project below
                  </div>

                  {/* section 4 (Cards) */}
                  { canRenderCards &&
                    <div
                      style={{
                        paddingTop: '80px',
                        overflow: 'hidden',
                        height: '588px', // padding + card + enough room on bottom for boxShadow
                        margin: '0'
                      }}
                    >
                      <ProjectCards
                        cards={(projects || this.props.projects).slice(0, 3)}
                        noEmptyState
                        fetching={false}
                        center
                        style={{ marginLeft: 'unset' }}
                        cardSectionStyle={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', flexFlow: 'unset' }}
                      />
                    </div>
                  }
                  { !canRenderCards && (projects || this.props.projects).length > 0 &&
                    <div
                      style={{
                        paddingTop: '80px',
                        minHeight: '581px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}
                    >
                      {(projects || this.props.projects).slice(0, 3).map((p, i) => (
                        <a
                          key={p.uuid || i}
                          href={`${api.replace('/api/v1', '')}/projects/${p.uuid}`}
                          style={{
                            position: 'relative',
                            borderRadius: '8px',
                            width: '80%',
                            marginTop: i === 0 ? 0 : '36px',
                            overflow: 'hidden'
                          }}
                        >
                          <img
                            src={streamsUrl(`/streams/${p.uuid}/thumbnail/0`)}
                            alt="P8"
                            style={{
                              width: '100%',
                              height: '150px',
                              margin: '0px',
                              objectFit: 'cover'
                            }}
                         />
                          <div className="featuredSideNavLink" style={styles.pageLink}>
                            {p.name}
                          </div>
                        </a>
                      ))}
                    </div>
                  }
                </div>
              </div>

              {/* section 5 (Contact) */}
              <div style={{
                width: '100%',
                // height: '800px',
                backgroundImage: 'linear-gradient(14.27deg, rgba(189, 189, 189, 0.2) -1.59%, transparent 72.03%)'
              }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: '1440px',
                    margin: '0 auto',
                    backgroundImage: `url(${worldSVG})`,
                    backgroundPosition: 'center',
                    height: '800px',
                    width: '100%'
                  }}
                >
                  <div
                    style={{
                      fontFamily: mainStyles.boldFont,
                      fontWeight: 'bold',
                      fontSize: '56px',
                      lineHeight: '68px',
                      color: '#202020',
                      zIndex: 1,
                      padding: screenWidth === 'small' ? '24px' : '24px 64px',
                      textAlign: screenWidth === 'small' ? 'center' : 'left'
                    }}
                  >
                    Contact information
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: screenWidth === 'small' ? 'column' : 'row',
                      paddingTop: screenWidth === 'small' ? '86px' : '173px',
                      marginLeft: screenWidth === 'small' ? '24px' : '64px',
                      alignItems: 'center'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginLeft: '0px',
                        width: screenWidth === 'small' ? '275px' : 'unset',
                        paddingBottom: screenWidth === 'small' ? '24px' : 'unset'
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          maxWidth: '364px',
                          height: '48px',
                          alignItems: 'baseline',
                          zIndex: 2,
                          display: 'flex',
                          flexDirection: 'row'
                        }}
                      >
                        <img
                          src={locationIcon}
                          alt="location marker"
                          style={{
                            zIndex: 1,
                            color: '#5f5f5f',
                            position: 'relative',
                            top: '3px'
                          }}
                        />
                        <div
                          style={{
                            width: '332px',
                            height: '48px',
                            color: '#5f5f5f',
                            fontSize: '20px',
                            lineHeight: '24px',
                            display: 'flex',
                            marginLeft: '14px'
                          }}
                        >
                          169 Roosevelt Ave.<br/>
                          Lousiville, CO 80027
                        </div>
                      </div>

                      <div
                        style={{
                          width: '100%',
                          maxWidth: '364px',
                          height: '24px',
                          alignItems: 'baseline',
                          zIndex: 2,
                          marginTop: '32px',
                          display: 'flex',
                          flexDirection: 'row'
                        }}
                      >
                        <img
                          src={phoneIcon}
                          alt="phone icon"
                          style={{
                            zIndex: 1,
                            color: '#5f5f5f',
                            position: 'relative',
                            top: '3px'
                          }}
                        />
                        <div
                          style={{
                            width: '332px',
                            height: '48px',
                            color: '#5f5f5f',
                            fontSize: '20px',
                            lineHeight: '24px',
                            display: 'flex',
                            marginLeft: '14px'
                          }}
                        >
                          202-321-3914
                        </div>
                      </div>

                      <div
                        style={{
                          width: '100%',
                          maxWidth: '364px',
                          height: '24px',
                          alignItems: 'baseline',
                          zIndex: 2,
                          marginTop: '32px',
                          display: 'flex',
                          flexDirection: 'row'
                        }}
                      >
                        <img
                          src={envelopeIcon}
                          alt="envelope icon"
                          style={{
                            zIndex: 1,
                            color: '#5f5f5f',
                            position: 'relative',
                            top: '3px'
                          }}
                        />
                        <div
                          style={{
                            width: '332px',
                            height: '48px',
                            color: '#5f5f5f',
                            fontSize: '20px',
                            lineHeight: '24px',
                            display: 'flex',
                            marginLeft: '14px'
                          }}
                        >
                          sean.gorman@Pixel8.earth
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        width: screenWidth === 'small' ? 'unset' : '25vw',
                        maxWidth: screenWidth === 'small' ? 'unset' : '416px',
                        height: '188px',
                        marginLeft: screenWidth === 'small' ? 'unset' : 'auto',
                        marginRight: screenWidth === 'small' ? '24px' : '12.5%',
                        marginTop: screenWidth === 'small' ? '56px' : 'unset',
                        textAlign: screenWidth === 'small' ? 'center' : 'left'
                      }}
                    >
                      <div
                        style={{
                          fontSize: '32px',
                          lineHeight: '48px',
                          fontWeight: 'bold',
                          alignItems: 'center',
                          zIndex: 2,
                          position: 'relative',
                          bottom: '12px'
                        }}
                      >
                        Send Message
                      </div>
                      <div
                        style={{
                          fontSize: '20px',
                          color: '#5F5F5F',
                          lineHeight: '24px',
                          alignItems: 'center',
                          marginTop: '24px',
                          marginBottom: '32px',
                          zIndex: 2
                        }}
                      >
                        If you have additional questions, please write to us.
                      </div>
                      <div
                        className="btnP8"
                        style={{
                          fontSize: '18px',
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          fontFamily: mainStyles.boldFont,
                          lineHeight: '24px',
                          padding: '10px 20px',
                          margin: '0',
                          zIndex: 2,
                          width: screenWidth === 'small' ? 'calc(100% - 20vw)' : '25vw',
                          maxWidth: screenWidth === 'small' ? 'unset' : '416px',
                        }}
                      ><a
                        href="mailto: sean.gorman@pixel8.earth"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#fff', fontSize: '18px', margin: '0' }}
                      >Send Message</a></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MDBCol>
          <div
            style={{
              zIndex: 2,
              width: '100%',
              height: screenWidth === 'small' ? 'fit-content' : 'unset'
            }}
          >
            <Footer style={{ position: 'relative', left: '50%', transform: 'translate(-50%, 0%)', maxWidth: '1440px' }} />
          </div>
        </MDBRow>
      </MDBContainer>
    );
  }
}

const styles = {
  main: {
    fontFamily: mainStyles.font,
    position: 'relative',
    display: 'block',
    width: '100%',
    overflow: 'hidden'
  },
  pageLink: {
    position: 'absolute',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    wordBreak: 'break-all',
    textOverflow: 'ellipsis',
    bottom: '0px',
    width: '100%',
    textAlign: 'center',
    backgroundColor: 'rgba(135, 135, 135, 0.5)',
    padding: '4px',
    fontSize: '24px',
    lineHeight: '24px'
  }
};

export default Home;
