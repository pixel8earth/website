import React from 'react';
import { withRouter } from 'react-router';
import {
  MDBCard, MDBIcon,
  MDBCardImage, MDBCardTitle
} from "mdbreact";


import { api } from '../front_config';
import Spinner from './Spinner';
import mainStyles from '../styles';
import { streamsUrl } from '../lib/fetch';

import icon3DSVG from '../assets/3Dicon.svg';
import cityImage from "../assets/p8city.png";

var linkApi = api.replace('/api/v1', '');

class Card extends React.Component {

  constructor(props) {
    super(props);
    this.timeout = 20000;
    this.active = false;
    this.state = {
      polling: false,
      project: props.project,
      shareModal: false,
      deleteModal: false,
      deleting: false,
      location: null
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.setUp(this.props.project);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.project && this.props.project && this.props.project.uuid !== prevProps.project.uuid) {
      this.setState({ project: null });
      this.setUp(this.props.project);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setUp = (project) => {
    if (project && project.center) {
      const latDir = project.center[1] > 0 ? 'N' : 'S';
      const longDir = project.center[0] > 0 ? 'E' : 'W';
      const location = `${Math.abs(project.center[1]).toFixed(2)} ${latDir}, ${Math.abs(project.center[0]).toFixed(2)} ${longDir}`;

      this.setState({ location });
    }
  }

  goToDetails = (id, link=false) => {
    if (!link) this.props.history.push(`/projects/${id}`);
  }

  getVizLink = (project) => {
    const vizLink = project && (project.state.densifying === 'complete' || project.state.complete)
      ? `/groups/${project.uuid}`
      : project && (project.state.building === 'complete') && project.cloudId
        ? `/clouds/${project.cloudId}`
        : project && (project.state.uploading === 'complete')
          ? `/groups/${project.uuid}/telemetry`
          : '/404';

    if (window.location.hostname === 'www.pixel8.earth') {
      return `${linkApi}${vizLink}`;
    }      
    return vizLink;
  }

  buildDetailsLink = link => {
    return `https://explore.pixel8.earth${link}`;
  }

  render() {
    const project = this.state.project || this.props.project;

    if (!project) {
      return (
        <MDBCard style={styles.main}>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'center', marginTop: '32px', color: mainStyles.colors.gradientBlue }}>
            <Spinner />
          </div>
        </MDBCard>
      );
    }

    const thumbnailUrl = project && project.imageCount > 0
      ? streamsUrl(`/streams/${project.uuid}/thumbnail/0`)
      : '';

    const date = new Date(project.createdAt);
    const creationDate = date.toLocaleDateString();
    const projectTitle = project.name;
    let imageReady = true;
    const isPublic = project.public;

    const disabledExplore = project.state && !project.state.complete && project.state.uploading !== 'complete';

    return (
      <MDBCard style={styles.main}>
        <div style={{ position: 'relative' }}>
          { imageReady &&
            <MDBCardImage
              className="card-img-top"
              src={thumbnailUrl}
              waves={false}
              style={styles.cardImage}
            />
          }
          { !imageReady &&
            <div style={styles.imgPlaceholder}>
            <img
              src={cityImage}
              style={{
                height: '192px',
                objectFit: 'contain'
              }}
              alt="3D city"
            />
            </div>
          }
        </div>
        <div style={styles.cardBody}>
          <div style={{ display: 'block', width: '100%' }}>
            <MDBCardTitle style={{ color: mainStyles.colors.primary, alignItems: 'center', display: 'flex', margin: 0 }}>
              <a
                className="cardTitleLink"
                style={styles.title}
                href={this.buildDetailsLink(`/projects/${project.uuid}`)}
                target="_blank"
                rel="noopener noreferrer"
              >{projectTitle}</a>
            </MDBCardTitle>
            <div style={styles.metaRow}>
              <div style={{ ...styles.info, ...styles.oneLineEllipsis, maxWidth: '250px' }}>
                <MDBIcon icon="map-marker-alt" style={{ color: '#7e7e7e', fontSize: '20px', marginRight: '6px' }} />&nbsp;&nbsp;{project.locationName || this.state.location || 'undetermined location'}
              </div>
              <div style={{ ...styles.info, alignItems: 'baseline', width: '112px', justifyContent: 'flex-start' }}>
                <MDBIcon icon="calendar-day" style={{ color: '#7e7e7e', fontSize: '20px', marginRight: '6px' }} />&nbsp;&nbsp;{creationDate.replace(/\//g, '.')}
              </div>
            </div>
            <div style={styles.metaRow}>
              <div 
                style={{ ...styles.infoLink, ...styles.oneLineEllipsis, maxWidth: '250px' }}
              >
                <MDBIcon icon="user" style={{ fontSize: '20px', marginRight: '6px' }} />
                &nbsp;&nbsp;{project.username}
              </div>
              <div style={{ ...styles.info, alignItems: 'baseline', width: '112px', justifyContent: 'flex-start' }}>
                {isPublic
                  ? <MDBIcon icon="eye" size="sm" style={{ ...styles.moreIcon, color: '#7e7e7e', fontSize: '20px', position: 'relative', top: '1px', marginRight: '6px' }} />
                  : <MDBIcon icon="eye-slash" size="sm" style={{ ...styles.moreIcon, color: '#7e7e7e', fontSize: '20px', position: 'relative', top: '1px', marginRight: '6px' }} />
                }&nbsp;&nbsp;
                {isPublic ? 'Public' : 'Private'}
              </div>
            </div>
            <div style={styles.actionsRow} className="cardActions">
              <a
                href={`${linkApi}${this.getVizLink(project)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ pointerEvents: disabledExplore ? 'none' : 'unset' }}
              >
                <button
                  className="btnP8"
                  style={{ lineHeight: '24px', fontSize: '16px', padding: '10px 16px', margin: '0', alignItems: 'center' }}
                  disabled={disabledExplore}
                >
                  <img src={icon3DSVG} alt="3D icon" style={{ height: '16px', backgroundColor: 'transparent', pointerEvents: 'none' }} />&nbsp;&nbsp;Explore in 3D
                </button>
              </a>
              <a
                className="moreLink"
                href={this.buildDetailsLink(`/projects/${project.uuid}`)}
              >
                Learn More<MDBIcon icon="chevron-right" size="sm" style={{ ...styles.moreIcon, marginLeft: '19.19px' }} />
              </a>
            </div>
          </div>
        </div>
      </MDBCard>
    );
  }
}

const styles = {
  main: {
    width: '416px', //'330px',
    minWidth: '416px', //'330px',
    // height: '460px',
    margin: mainStyles.spacing.medium,
    fontFamily: mainStyles.font,
    position: 'relative',
    borderRadius: '8px'
  },
  cardImage: {
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    objectFit: 'cover',
    height: '192px', //'150px',
    width: '416px', //'330px',
    pointerEvents: 'none',
    cursor: 'default'
  },
  cardBody: {
    padding: '24px',
    display: 'block'
  },
  actionsRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '28px',
    paddingBottom: '16px'
  },
  action: {
    ...mainStyles.btn,
    backgroundColor: mainStyles.colors.secondary,
    color: mainStyles.colors.light,
    marginRight: '18px'
  },
  metaRow: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: mainStyles.spacing.normal,
    color: '#5f5f5f',
    margin: '18px 0',
  },
  info: {
    fontSize: '16px',
    fontWeight: 400,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: '#5f5f5f'
  },
  infoLink: {
    fontSize: '16px',
    fontWeight: 400,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline'
  },
  status: {
    color: mainStyles.colors.success
  },
  progress: {
    backgroundColor: '#f0f0f0',
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px',
    textAlign: 'center',
    height: '192px', //'150px',
    borderRadius: '8px',
    borderBottom: 'none',
    position: 'relative'
  },
  moreIcon: {
    verticalAlign: 'baseline'
  },
  shareIcon: {
    marginLeft: mainStyles.spacing.normal,
    float: 'right',
    cursor: 'pointer',
    color: mainStyles.colors.secondary
  },
  deleteIcon: {
    marginLeft: mainStyles.spacing.normal,
    marginRight: mainStyles.spacing.normal,
    float: 'right',
    cursor: 'pointer',
    color: mainStyles.colors.secondary
  },
  exploreWrapper: {
    display: 'block',
    position: 'absolute',
    bottom: '0px',
    right: '0px',
    backgroundColor: 'rgba(135, 135, 135, 0.5)',
    color: '#fff',
    padding: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    pointerEvents: 'inherit'
  },
  stepperWrap: {
    padding: '0px 16px',
    width: '100%',
    position: 'relative',
    top: '-18px'
  },
  oneLineEllipsis: {
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical'
  },
  imgPlaceholder: {
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    minHeight: '192px', // '150px',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '16px',
    flexDirection: 'row',
    alignItems: 'center',
    background: 'linear-gradient(180deg, #FFFFFF 69.88%, rgba(251, 251, 251, 0.76) 75.83%, rgba(246, 246, 246, 0.81) 82.1%, #F3F3F3 88.51%, #F1F1F1 96.38%)'
  },
  privacy: {
    color: '#5f5f5f',
    fontSize: '0.9rem'
  },
  title: {
    fontFamily: mainStyles.boldFont,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    fontSize: '24px',
    lineHeight: '32px',
    cursor: 'pointer',
    overflow: 'overlay',
    margin: 0
  }
};

export default withRouter(Card);
