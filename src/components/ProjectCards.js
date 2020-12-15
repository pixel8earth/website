import React from 'react';

import Card from './Card';
/*import StreamCard from '../StreamCard';*/
import Spinner from './Spinner';
import mainStyles from '../styles';


class ProjectCards extends React.Component {
  render() {
    const {
      cards, fetching, atHome, onDelete, noEmptyState,
      userEmptyState, center, searchResultsEmpty, style = {},
      cardSectionStyle = {}
    } = this.props;

    return (
      <div style={{ ...styles.main, ...style }}>
        { fetching &&
          <div style={styles.spinner}>
            <Spinner earth />
          </div>
        }
        { !fetching && (cards.length > 0 ?
          <div style={{ ...styles.cardSection, justifyContent: center ? 'center' : 'unset', ...cardSectionStyle }}>
            {cards.map((item, i) => {
              if (item.project) {
                return (
                  <Card
                    key={i}
                    project={item}
                    onDelete={onDelete}
                  />
                );
              } else return <></>
              /*return (
                <StreamCard
                  key={i}
                  stream={item}
                  onDelete={onDelete}
                />
              );*/
            })}
          </div>
          :
          <div style={styles.emptyState}>
            {!fetching && !noEmptyState && !userEmptyState && !searchResultsEmpty &&
              (atHome
                ? 'Click + New Project to get started.'
                : 'Recently viewed projects will appear here.'
              )
            }
            {userEmptyState && !searchResultsEmpty &&
              'No public projects are available for this user.'
            }
            {searchResultsEmpty &&
              'No projects found matching your search.'
            }
          </div>)
        }
      </div>
    );
  }
}

const styles = {
  main: {
    marginLeft: '15px'
  },
  cardSection: {
    display: 'flex',
    flexFlow: 'wrap',
    marginBottom: mainStyles.spacing.large
  },
  emptyState: {
    display: 'flex',
    justifyContent: 'center',
    padding: '32px 64px',
    textAlign: 'center',
    fontSize: '1.5rem',
    marginTop: '20%',
    fontFamily: mainStyles.font,
    color: '#7e7e7e'
  },
  spinner: {
    color: mainStyles.colors.primary,
    textAlign: 'center',
    marginTop: '30%'
  }
};

export default ProjectCards;
