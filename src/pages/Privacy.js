import React from 'react';
import { MDBCol, MDBRow, MDBContainer } from 'mdbreact';

import mainStyles from '../styles';


class Privacy extends React.Component {
  constructor() {
    super();
    this.state = {
      section: 'A'
    };
  }

  componentDidMount() {
    this.mounted = true;
    if (window.scrollTo) window.scrollTo(0, 0);
    window.addEventListener('hashchange', this.setSection, false);
    if (window.location.hash) this.setSection();
  }

  componentWillUnmount() {
    this.mounted = false;
    window.removeEventListener('hashchange', this.setSection)
  }

  setSection = () => {
    if (this.mounted && window.location.hash !== this.state.section) {
      this.setState({ section: window.location.hash.replace('#/terms#', '') });
    }
  }

  goTo = (id) => () => {
    const el = document.getElementById(id);
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  render() {
    const { section = '' } = this.state;
    /* eslint-disable jsx-a11y/anchor-is-valid */
    return (
      <div style={styles.main}>
        <div style={styles.content}>
          <div style={styles.title}>
            Pixel8 Privacy Policy
            <p style={{ fontSize: '14px', fontFamily: mainStyles.font, lineHeight: '18px' }}>
              v.1 Effective Date: December 2020
            </p>
          </div>
          <div style={styles.opening}>
            <p style={styles.openingP}>
              We respect your right to privacy and will only process your Personal Data in accordance with applicable data protection and privacy laws.
            </p>
            <p style={styles.openingP}>
              In this Privacy Policy, "we," "us," "its" and "our" refer to Pixel8Earth, Inc. ("Pixel8"), organized under the laws of Delaware. Please read carefully this Privacy Policy ("Policy") relating to your submission of Content (as defined in Pixel8’s Terms of Use) to and use of Pixel8 applications, services and sites. Capitalized terms not defined in this Policy will have the meanings assigned to such terms in the Terms of Use.
            </p> 
            <p style={styles.openingP}>
            Pixel8 is self-certified as compliant with the <a href="https://www.privacyshield.gov/welcome" target="_blank" rel="noopener noreferrer">EU-US and Swiss-US Privacy Shield Frameworks</a>, administered by the US Department of Commerce regarding the collection, use, and retention of personal information transferred from the European Union, the United Kingdom and Switzerland, as applicable, to the United States, as set forth in the EU-US Privacy Policy set forth below. In the event of any conflict or inconsistency with the terms of this Policy and the terms of EU-US Privacy Policy, the terms of the EU-US Privacy Policy will control.
            </p>   
          </div>
          <MDBContainer fluid style={{ padding: 0, margin: 0 }}>
            <MDBRow style={{ margin: 0, padding: 0 }}>
              <MDBCol size="3" style={{ justifyContent: 'left', alignContent: 'center', padding: '0' }}>
                <div style={styles.sectionNumbers} id="termsList">
                  <a
                    className={`${(section === '' || section === '#/privacy' || section === '#/privacy#A') ? 'is-active' : ''}`}
                    href="#/privacy#A"
                  >A. Introduction</a>
                  <a className={`${~section.indexOf('#B') ? 'is-active' : ''}`} href="#/privacy#B">B. Information Collected</a>
                  <a className={`${~section.indexOf('#C') ? 'is-active' : ''}`} href="#/privacy#C">C. Cookie Policy</a>
                  <a className={`${~section.indexOf('#D') ? 'is-active' : ''}`} href="#/privacy#D">D. Our Use of Information</a>
                  <a className={`${~section.indexOf('#E') ? 'is-active' : ''}`} href="#/privacy#E">E. Sharing Information</a>
                  <a className={`${~section.indexOf('#F') ? 'is-active' : ''}`} href="#/privacy#F">F. No Guarantee of Security</a>
                  <a className={`${~section.indexOf('#G') ? 'is-active' : ''}`} href="#/privacy#G">G. Password</a>
                  <a className={`${~section.indexOf('#H') ? 'is-active' : ''}`} href="#/privacy#H">H. International Transfers</a>
                  <a className={`${~section.indexOf('#I') ? 'is-active' : ''}`} href="#/privacy#I">I. Children</a>
                  <a className={`${~section.indexOf('#J') ? 'is-active' : ''}`} href="#/privacy#J">J. Policy Changes</a>
                  <a className={`${~section.indexOf('#K') ? 'is-active' : ''}`} href="#/privacy#K">K. Your Information, Rights and Choices</a>
                  <a className={`${~section.indexOf('#L') ? 'is-active' : ''}`} href="#/privacy#L">L. Questions</a>
                  <a className={`${~section.indexOf('#CA') ? 'is-active' : ''}`} href="#/privacy#CA">CALIFORNIA PRIVACY RIGHTS</a>  
                </div>
              </MDBCol>
              <MDBCol size="6" style={{ justifyContent: 'center', alignContent: 'center', padding: '0', marginLeft: '10vw' }}>
                {(section === '#/privacy#A' || section === '' || section === '#/privacy') &&
                  <>
                    <div id="A" style={styles.sectionHeading}>A. Introduction</div>
                    <div style={styles.section}>
                      <p style={styles.sectionP}>
                        This Policy explains how Pixel8 collects, stores, uses and discloses information from you when you submit Content to and use Pixel8 products, services, mobile applications and Sites. This Policy applies to users of the Pixel8 "Service", defined as the services, APIs, and functionality we make available through our the Site, via private sites or repositories, or through third party sites that utilize our services and functionality, as well as through Pixel8 Software and Pixel8 App.
                      </p>
                      <p style={styles.sectionP}>
                        This Policy does not apply to Sites, applications, or services that do not display or link to this Policy or that display or link to different privacy statements; nor does this Policy apply to practices of companies that we do not control or to people we do not employ or manage.
                      </p>
                      <p style={styles.sectionP}>
                        It may be possible for you to browse certain parts of the Site without telling us who you are or revealing any information that enables us to directly identify you as an individual. However, you may lose anonymity once you give us Personal Data about you.
                      </p>
                    </div>
                  </>
                }
                {section.indexOf('#B') > -1 &&
                  <>
                    <div id="B" style={styles.sectionHeading}>B. Information Collected</div>
                    <div style={styles.section}>
                      <p style={styles.sectionP}>
                        We collect information in various ways when you use our Service and as set forth in this Policy and the Terms of Use. Some of this information may be Personal Data attributable to you. As used in this Policy, "Personal Data" means any information (either alone or in combination with other information we hold) that directly or indirectly may be used to identify or identifies you as an individual, such as your name, address and physical location, account numbers, email addresses, or telephone numbers.
                      </p>
                      <p style={styles.sectionP}>
                        Faces of individuals and vehicle license plates could be understood as Personal Data included in Content that you may upload for further processing by us via the Services. However such Content is removed and not displayed publicly or in Pixel8 Content, and is made available only to you. As this is an automated process, we welcome any requests or comments if there is something we missed, by e-mail to <a href="mailto: sean.gorman@pixel8.earth" target="_blank" rel="noopener noreferrer">sean.gorman@pixel8.earth</a>.
                      </p>
                      <p style={styles.sectionP}>
                      As well as Personal Data, we also collect some information that is not personally identifying, including aggregate information, which is data we collect about use of the Service or about a group or category of users from which it is not possible to identify you (“Nonpersonal Data”; together with Personal Data, collectively "Information").
                      </p>
                      <p style={{ ...styles.sectionP, fontStyle: 'italic' }}>
                        Personal Data
                      </p>
                      <p style={styles.sectionP}>
                        When you register for an account, and in the course of your use of the Service, we collect and process the following Personal Data attributable to you as a user:
                      </p>
                      <ul style={styles.list}>
                        <li>your sign-on credentials (email and hashed password);</li>
                        <li>email address;</li>
                        <li>username;</li>
                        <li>any profile or biographical information you elect to provide;</li>
                        <li>if you elect to sign-on through Google, we may receive your username, email address, profile picture, and language preference;</li>
                        <li>any Personal Data revealed in your Content either on the Service or via our Blog or Forum; and</li>
                        <li>geolocation data included in Content that you have submitted;</li>
                      </ul>
                      <p style={styles.sectionP}>
                        When you use our Service, we automatically collect Nonpersonal Data sent to us by your computer, mobile device or other access device, such as a device ID or unique identifier, device type, model and brand, geo-location information, computer, network and connection information, access times, operating system and browser version, type and language, app crash data, and the Site you visited before our Site. We also collect Nonpersonal Data about your usage and activity on the Service, and in the form of Metadata (as that term is defined in the Pixel8 Terms of Use). This Policy does not restrict or limit our collection and use of Nonpersonal Data.
                      </p>
                    </div>
                  </>
                }
                {section.indexOf('#C') > -1 &&
                  <>
                    <div id="C" style={styles.sectionHeading}>C. Cookie Policy</div>
                    <div style={styles.section}>
                      <p style={styles.sectionP}>
                        The Service may utilize "cookies", which are small text files placed on your computer or device. We may also use pixel tags, web beacons and other similar technologies. Such devices are used to help analyze our web page flow, customize our services and optimize our user interfaces, and measure promotional effectiveness. Our analytics cookies collect data such as the identity of the applicable internet service provider, the user's IP address of his or her terminal device, the type of browser software and operating system in use, the date and time of site access, the Site address, if any, from which the user linked to the Site, and other similar traffic-related information sent by a device (i.e. device type, device model, device brand and computer network). We may also aggregate such information with similar data collected from other users and disclose such aggregate information to third parties. Certain features are only available through the use of cookies, and generally we need to use cookies to help identify and maintain your signed-in status. You are always free to decline cookies via your browser settings, although doing so may interfere with your use of the Service. You may encounter cookies from non-affiliated third parties on certain pages of the service. To learn more about cookies, please visit allaboutcookies.org.
                      </p>
                      <p style={styles.sectionP}>
                        Here is a list of the cookies that will be used and installed as essential, as well as those analytics cookies that may be used and installed on your computer or device with your consent (optional).
                      </p>
                      <table style={styles.table}>
                        <thead style={styles.tableHead}>
                          <tr>
                            <th style={styles.tableCell}>Purpose</th>
                            <th style={styles.tableCell}>Source</th>
                            <th style={styles.tableCell}>Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={styles.tableCell}>User authentication</td>
                            <td style={styles.tableCell}>Pixel8</td>
                            <td style={styles.tableCell}>Essential</td>
                          </tr>
                          <tr>
                            <td style={styles.tableCell}>Site analytics</td>
                            <td style={styles.tableCell}>Google</td>
                            <td style={styles.tableCell}>Optional</td>
                          </tr>
                        </tbody>
                      </table>
                      <p style={styles.sectionP}>
                        User authentication—these cookies allow us to customize the Website based on your login status (i.e. whether you're signed in or signed out of your Pixel8 account).
                      </p>
                      <p style={styles.sectionP}>
                        Site analytics—these cookies help us to understand how visitors use our Site, so we can improve how the Site works.
                      </p>
                    </div>
                  </>
                }
                {section.indexOf('#D') > -1 &&
                  <>
                    <div id="D" style={styles.sectionHeading}>D. Our Use of Information</div>
                    <div style={styles.section}>
                      <p style={styles.sectionP}>
                        We use Information collected through our Service for the purposes and as described in this Policy, as disclosed to you on our Pixel8 App, Pixel8 Software, and as set forth in the Terms of Use. We process your Personal Data and your Nonpersonal Data to operate, maintain, customize, measure and improve our Service and to fulfill the purposes disclosed when you provided your information to us (through the Terms of Use). The Content you provide may be used to create map data and images that we license to users, customers and researchers. It may also be used to provide “sample” sets of image data to members of the public. In order to protect the personal integrity of individuals caught in the data, we automatically remove any individuals and vehicles in any submitted Content before it is posted to the Site as Pixel8 Content.
                      </p>
                      <p style={styles.sectionP}>
                        We process the Personal Data on the basis of our legitimate interest of properly providing and improving our Service and on the basis that it is necessary for us to fulfil our obligations to you in our Terms of Use.
                      </p>
                      <p style={styles.sectionP}>
                        If any Personal Data attributable to you is included in submitted Content, we will process such Personal Data in order to properly provide our Service. This processing is done on the basis of our legitimate interest of providing our Service. In order to protect your personal integrity, we automatically remove any faces and vehicle license plates in any submitted Content before it is made available as Pixel8 Content.
                      </p>
                      <p style={{ ...styles.sectionP, fontStyle: 'italic' }}>
                        Retention policy
                      </p>
                      <p style={styles.sectionP}>
                        We only store your Personal Data as long as it is needed for the purpose for which it was collected. In relation to our registered users we will keep your submitted Personal Data only as long as you are registered as a user. However, after you de-register as a user we may process such Personal Data as is necessary for us to fulfill an agreement with you, or such Personal Data as we are required to keep by law.
                      </p>
                      <p style={styles.sectionP}>
                        In order for us to provide our Service and for the purposes described in this policy, we will keep any submitted Content, as well as data and statistics regarding your use of the Service and geolocational data included in the Content, indefinitely. However, at your request, we will remove all information in relation to such Content, data and/or statistics, which connects it to you as a user.
                      </p>
                      <p style={styles.sectionP}>
                        In relation to visitors of our Site, all Information that we process connected to cookies are stored in accordance with our cookie policy (see section C above).
                      </p>
                      <p style={{ ...styles.sectionP, fontStyle: 'italic' }}>
                        Your choices regarding our use of your Personal Data for marketing purposes
                      </p>
                      <p style={styles.sectionP}>
                        If you no longer wish to receive marketing-related emails from us on a going-forward basis, you may opt-out of receiving these marketing-related emails by following the unsubscribe instructions in any such message, or by emailing us at <a href="mailto: sean.gorman@pixel8.earth" target="_blank" rel="noopener noreferrer">sean.gorman@pixel8.earth</a>. We aim to comply with such request(s) as soon as reasonably practicable. Please note that if you do opt-out of receiving marketing-related emails from us, we may still send you administrative messages; you cannot opt-out from receiving administrative messages.
                      </p>
                      <p style={{ ...styles.sectionP, fontStyle: 'italic' }}>
                        General
                      </p>
                      <p style={styles.sectionP}>
                        We may use and provide data and information to our partners and customers for commercial purposes after we have removed your name or any other Personal Data from it, or have combined it with other people's data in a way that it is no longer associated with you.
                      </p>
                      <p style={styles.sectionP}>
                        We also may combine your Information with information we collect from other sources to improve our products and services. Nothing in this Policy should be construed to prevent us from charging a fee to parties who wish to access Pixel8 Content or to use the Service.
                      </p>
                      <p style={styles.sectionP}>
                        You have the option of submitting Content anonymously as the user name and e-mail address you submit may be created specifically to avoid identifying you as an individual. If you do not submit a valid e-mail address however, this may interfere with your use of the Service through a loss of relevant notifications. Moreover, we cannot guarantee absolute anonymity and make no guarantee that other users will never be able to determine your identity, such as (without limitation) by observations of your activity, the manner in which you express yourself, and other patterns of conduct or behavior. Moreover, all of your activities on the Service will be traceable by others users to your username, from which your actual identity may be known. Notices may be sent to other users regarding suspicious activity and policy violations and refer to usernames and specific items. Please understand that if your username identifies you or is linked to an e-mail address, other users will be able to personally identify your activities.
                      </p>
                      <p style={styles.sectionP}>
                        Further, we may use Personal Data to respond to legal requirements, in connection with a merger, sale of assets, or other similar corporate transactions, to respond to claims that Content violates the rights of others, or to protect the rights, property, or safety or any person.
                      </p>
                    </div>
                  </>
                }
                {section.indexOf('#E') > -1 &&
                  <>
                    <div id="E" style={styles.sectionHeading}>E. Sharing Information</div>
                    <div style={styles.section}>
                      <p style={styles.sectionP}>
                        We do not disclose, sell or rent your Personal Data to third parties for their marketing purposes without your prior consent. If you do consent but later change your mind, you may contact us and we will cease any such activity. We only share your Personal Data as follows:
                      </p>
                      <p style={styles.sectionP}>
                        (i) at your direction and control via your normal and intended operation of the Service, or with your consent, for example, when you agree to our sharing your Personal Data with other selected third parties for their own marketing purposes subject to their separate privacy policies;
                      </p>
                      <p style={styles.sectionP}>
                        (ii) with service providers, consultants or similar contractors, or third parties who provide services or content in connection with our Service in order to support or enhance our or such parties’ products and services or our or such parties’ business operations, or to make available and consummate initiated transactions;
                      </p>
                      <p style={styles.sectionP}>
                        (iii) to comply with laws or respond to lawful requests and legal process or to enforce or apply our terms of use/service, license terms, or other agreements between us, and to protect the rights, safety and property of Pixel8, our agents, employees, customers, members, and others; and
                      </p>
                      <p style={styles.sectionP}>
                        (iv) under written obligations of confidentiality, in connection with or during negotiation of any merger, financing, acquisition, or dissolution, transaction, or proceeding involving sale, transfer, divestiture, or disclosure of all or a portion of our business or assets to another company.
                      </p>
                      <p style={styles.sectionP}>
                        We may also share and disclose Nonpersonal Data for the same purposes as described above.
                      </p>
                      <p style={styles.sectionP}>
                        When other companies, e.g. our service providers, process your Personal Data on our behalf, we always enter into binding data processing agreements that ensure that your Personal Data always enjoys the same level of protection as under this Policy.
                      </p>
                    </div>
                  </>
                }
                {section.indexOf('#F') > -1 &&
                  <>
                    <div id="F" style={styles.sectionHeading}>F. No Guarantee of Security</div>
                    <div style={styles.section}>
                      <p style={styles.sectionP}>
                        We apply appropriate technical and organizational safeguards and take all reasonable steps to help protect your Personal Data in an effort to prevent loss, misuse, and unauthorized access, disclosure, alteration, and destruction. However, no one can create a completely secure Site, app or service and third parties may unlawfully intercept, steal or access transmissions or private communications. Therefore, we cannot guarantee that your Information or private communications that you transfer over the internet to us will always be secure or remain confidential.
                      </p>
                    </div>
                  </>
                }
                {section.indexOf('#G') > -1 &&
                  <>
                    <div id="G" style={styles.sectionHeading}>G. Password</div>
                    <div style={styles.section}>
                      <p style={styles.sectionP}>
                        Your password deserves careful thought and protection. Use unique numbers, letters, and special characters and do not disclose your password to anyone. You shall not share your password or your personal sign-in credentials with others, and please remember that you are responsible for all actions taken in the name of your account. If you lose control of your password, you may lose substantial control over your Personal Data and may be subject to legally binding actions taken on your behalf. If your password has been compromised for any reason, you should immediately access your profile to change your password and notify us immediately at <a href="mailto: sean.gorman@pixel8.earth" target="_blank" rel="noopener noreferrer">sean.gorman@pixel8.earth</a>.
                      </p>
                    </div>
                  </>
                }
                {section.indexOf('#H') > -1 &&
                  <>
                    <div id="H" style={styles.sectionHeading}>H. International Transfers</div>
                    <div style={styles.section}>
                      <p style={styles.sectionP}>
                        We may process Information on servers located in a number of countries. Accordingly, we may share Information with our service providers and affiliated companies for such companies to carry out any of the activities specified in this Policy. We may also subcontract processing to or share Information with third parties located in countries other than your home country. Information collected within the European Economic Area, for example, may be transferred to, and processed by our affiliates or other third parties identified above that are located in, a country outside of the EEA. However, regardless of country, we will always process Information in accordance with this Policy. In respect to our service providers, we will always enter into a data processing agreement that ensure that their processing gives the same level of protection to your Personal Data as this Policy.
                      </p>
                      <p style={styles.sectionP}>
                        In addition to the above, any transfer of Personal Data from the EEA to a third country outside the EEA, will only be made if permitted by the applicable EU Personal Data protection regulation. This means that we will only initiate such transfer of Personal Data if the receiving country outside the EEA has been deemed by the EU Commission to ensure an appropriate level of protection, if we have entered into the Commission’s standard data protection clauses with the receiving company, or if there are other safeguards in place that permits such a transfer.
                      </p>
                    </div>
                  </>
                }
                {section.indexOf('#I') > -1 &&
                  <>
                    <div id="I" style={styles.sectionHeading}>I. Children</div>
                    <div style={styles.section}>
                      <p style={styles.sectionP}>
                        The Services are not directed at or intended for children under sixteen (16) years of age, and we do not knowingly collect Personal Data from such children. If you believe that we might have any Personal Data from a child under 16 years of age, please contact us at <a href="mailto: sean.gorman@pixel8.earth" target="_blank" rel="noopener noreferrer">sean.gorman@pixel8.earth</a>.
                      </p>
                    </div>
                  </>
                }
                {section.indexOf('#J') > -1 &&
                  <>
                    <div id="J" style={styles.sectionHeading}>J. Policy Changes</div>
                    <div style={styles.section}>
                      <p style={styles.sectionP}>
                        We may amend this Policy from time to time. If we make any changes to this Policy, we will post the amended terms on Pixel8.earth, change the "Last Revised" date above, and where appropriate, notify you by email or via our other notification mechanisms.
                      </p>
                    </div>
                  </>
                }
                {section.indexOf('#K') > -1 &&
                  <>
                    <div id="K" style={styles.sectionHeading}>K. Your Information, Rights and Choices</div>
                    <div style={styles.section}>
                      <p style={styles.sectionP}>
                        You have the right to ask us not to process your Personal Data for marketing or promotional purposes. We will usually inform you (before collecting your Personal Data) if we intend to use your Personal Data for such purposes or if we intend to disclose your information to any third party for such purposes. You may also opt out of receiving promotional emails from us by following the instructions in the emails themselves or by emailing <a href="mailto: sean.gorman@pixel8.earth" target="_blank" rel="noopener noreferrer">sean.gorman@pixel8.earth</a>. If you opt out, we may still send you non-promotional emails, such as emails about your accounts or our ongoing business relations.
                      </p>
                      <p style={styles.sectionP}>
                        You can see, review and change your Personal Data by logging into the Service or by contacting us at <a href="mailto: sean.gorman@pixel8.earth" target="_blank" rel="noopener noreferrer">sean.gorman@pixel8.earth</a>. You should promptly update your Personal Data if it changes or is inaccurate.
                      </p>
                      <p style={styles.sectionP}>
                        You have the right to receive confirmation on whether or not we process Personal Data concerning you, and in such cases get access to such Personal Data and also information regarding the Personal Data and how we process it.
                      </p>
                      <p style={styles.sectionP}>
                        You have the right to have inaccurate Personal Data concerning you rectified without undue delay. Taking into account the purposes of the processing, you also have the right to have incomplete Personal Data about you completed.
                      </p>
                      <p style={styles.sectionP}>
                        You have, under certain circumstances, the right to have Personal Data concerning you erased, for example if the Personal Data are no longer necessary in relation to the purposes for which they were collected or if the Personal Data have been unlawfully processed.
                      </p>
                      <p style={styles.sectionP}>
                        You have the right to withdraw a consent provided by you at any time by contacting us. If your consent is withdrawn, we will no longer process your Personal Data for the purpose that you had given your consent to.
                      </p>
                      <p style={styles.sectionP}>
                        In some circumstances you have the right to obtain restriction of the processing of your Personal Data. For example if you contest the accuracy of the Personal Data, you can also require that we restrict the processing of your Personal Data for such a period that enables us to verify the accuracy of the Personal Data.
                      </p>
                      <p style={styles.sectionP}>
                        You have the right to object to processing of your Personal Data that is based on our legitimate interests. If this is done, we must provide compelling legitimate grounds for the processing which overrides your interests, rights and freedoms, in order to proceed with the processing of your Personal Data. 
                      </p>
                      <p style={styles.sectionP}>
                        You have the right to receive the Personal Data relating to you and that you have provided to us, in a commonly used electronic format. You have the right to transmit that data to another controller (data portability).
                      </p>
                      <p style={styles.sectionP}>
                        You may always contact Pixel8 at support@Pixel8.earth if you have any questions or comments regarding our processing of your Personal Data. You also have the right to complain about the processing of your Personal Data by lodging a complaint to the relevant data protection authority.
                      </p>
                      <p style={styles.sectionP}>
                        You may delete your account any time by emailing support@Pixel8.earth. Deletion is your sole means of terminating your account. We will in our own discretion keep Nonpersonal Data and explicitly the images submitted and the associated geolocation data which is required, if any, to maintain the uninterrupted and intended Pixel8 Solution functionality. This Nonpersonal Data may be stored under a new username not attributable to you.
                      </p>
                      <p style={styles.sectionP}>
                        In addition to the above, you may opt-out of providing Information via the Pixel8 App to Pixel8 at any time by uninstalling the application using the standard uninstall process available on your mobile device or via the mobile application marketplace or store.
                      </p>
                      <p style={styles.sectionP}>
                        Please note that once you make a public posting, you may not be able to change or remove it.
                      </p>
                    </div>
                  </>
                }
                {section.indexOf('#L') > -1 &&
                  <>
                    <div id="L" style={styles.sectionHeading}>L. Questions</div>
                    <div style={styles.section}>
                      <p style={styles.sectionP}>
                        If you have any questions about this Policy, please contact us at <a href="mailto: sean.gorman@pixel8.earth" target="_blank" rel="noopener noreferrer">sean.gorman@pixel8.earth</a>.
                      </p>
                    </div>
                  </>
                }
                {section.indexOf('#CA') > -1 &&
                  <>
                    <div id="CA" style={styles.sectionHeading}>CALIFORNIA PRIVACY RIGHTS</div>
                    <div style={styles.section}>
                      <p style={styles.sectionP}>
                        If you are a California resident, California law may provide you with certain rights regarding our use of information about you.
                      </p>
                      <p style={styles.sectionP}>
                        A. “Do Not Track” under the California Online Privacy Protection Act. We support “do not track” (a preference you may be able to set in your web browser to inform Sites that you do not want to be tracked). We are not aware of any processes for others collecting information about your activities on our Sites over time and across third party Sites, apps, or other online services, nor do we knowingly collect information about your activities over time across third party sites and services.
                      </p>
                      <p style={styles.sectionP}>
                        B. California's "Shine the Light" law (Civil Code Section § 1798.83). This law permits users of our Site that are California residents to request certain information regarding our disclosure of personal information, as defined by the Shine the Light law, to third parties for their direct marketing purposes. To make such a request, please send an email to us at privacy@Pixel8.earth.
                      </p>
                      <p style={styles.sectionP}>
                        C. California Consumer Privacy Act (CCPA). This part (C) serves as a privacy notice for California residents and applies solely to residents of California. Any terms defined in the CCPA have the same meaning when used in this part (C). Note that provision of this CCPA notice is not an admission on our part that we are a “business” within the meaning of the CCPA, and nothing in this policy may be construed as such an admission.
                      </p>
                      <p style={styles.sectionP}>
                        Personal Information we collect
                      </p>
                      <p style={styles.sectionP}>
                  
                      </p>
                    </div>
                  </>
                }
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </div>
      </div>
    );
  }
}

const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: 'auto',
    marginLeft: 'auto',
    maxWidth: '1440px',
    width: '100%'
  },
  content: {
    position: 'relative',
    margin: '0 4.44%',
    paddingBottom: '180px',
    width: '100%'
  },
  title: {
    fontFamily: mainStyles.boldFont,
    fontWeight: 'bold',
    fontSize: '56px',
    lineHeight: '68px', // identical to box height, or 121%
    color: mainStyles.colors.primary,
    marginBottom: '24px',
    marginTop: '80px',
    zIndex: 1,
    maxWidth: '752px',
    width: '52.22%'
  },
  opening: {
    color: mainStyles.colors.primary,
    marginBottom: '80px'
  },
  openingP: {
    color: '#01253D',
    fontSize: '18px',
    lineHeight: '28px',
    marginRight: '10%'
  },
  paragraph: {
    fontSize: '18px',
    lineHeight: '28px'
  },
  sectionNumbers: {
    display: 'flex',
    flexDirection: 'column'
  },
  anchor: {
    textDecoration: 'none',
    color: mainStyles.colors.primary,
    marginBottom: '24px'
  },
  anchorActive: {
    fontFamily: mainStyles.boldFont
  },
  anchorIndent: {
    textDecoration: 'none',
    color: mainStyles.colors.primary,
    paddingLeft: '24px',
    marginBottom: '24px'
  },
  sectionHeading: {
    fontFamily: mainStyles.boldFont,
    fontWeight: 'bold',
    fontSize: '32px',
    lineHeight: '40px',
    color: mainStyles.colors.primary,
    maxWidth: '752px'
  },
  section: {
    marginTop: '32px'
  },
  sectionP: {
    fontSize: '18px',
    lineHeight: '28px',
    color: '#000F23',
    marginBottom: '32px'
  },
  subSectionTitle: {
    fontFamily: mainStyles.boldFont
  },
  list: {
    marginTop: '-24px',
    fontSize: '18px',
    marginBottom: '32px'
  },
  table: { 
    width: '100%',
    marginBottom: '32px'
  },
  tableHead: { 
    fontStyle: 'italic', 
    textDecoration: 'underline' 
  },
  tableCell: {
    fontSize: '18px',
    lineHeight: '32px'
  }
};

// <a href="mailto: sean.gorman@pixel8.earth" target="_blank" rel="noopener noreferrer">sean.gorman@pixel8.earth</a>

export default Privacy;
