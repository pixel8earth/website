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
                  <a className={`${~section.indexOf('#M') ? 'is-active' : ''}`} href="#/privacy#M">CALIFORNIA PRIVACY RIGHTS</a>  
                  <a className={`${~section.indexOf('#N') ? 'is-active' : ''}`} href="#/privacy#N">EU-US PRIVACY POLICY</a>
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
                {section.indexOf('#M') > -1 &&
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
                      <p style={{ ...styles.sectionP, fontStyle: 'italic' }}>
                        Personal Information we collect
                      </p>
                      <p style={styles.sectionP}>
                        We collect certain “Personal Information,” as defined by the CCPA and as listed in section B of the main body of the Policy and have done so within the last 12 months.
                      </p>
                      <p style={styles.sectionP}>
                        Personal Information does not include: (a) publicly available information from government records; (b) deidentified information or aggregate consumer information.
                      </p>
                      <p style={styles.sectionP}>
                        We obtain the categories of Personal Information listed in section B of the main body of the Policy listed above from the following categories of sources:
                      </p>
                      <ul style={styles.list}>
                        <li>directly from you or publicly available sources;</li>
                        <li>indirectly when you use our services (eg cookies when using our Site); and</li>
                        <li>from the sources listed in this policy.</li>
                      </ul>
                      <p style={{ ...styles.sectionP, fontStyle: 'italic' }}>
                        Our use of Personal Information
                      </p>
                      <p style={styles.sectionP}>
                        We may use and have disclosed the Personal Information we collect for the following purposes:
                      </p>
                      <ul style={styles.list}>
                        <li>to fulfill or meet the reason you provided the Personal Information. For example, if you share your name and contact information to request a price quote or ask a question about our offerings, we will use that Personal Information to respond to your inquiry. If you provide your Personal Information to purchase a access to our service, we will use that information to process your payment and facilitate delivery.</li>
                        <li>to provide, support, personalize, and develop our Site and Services.</li>
                        <li>to create, maintain, customize, and secure your account with us.</li>
                        <li>to process your requests, transactions, and payments.</li>
                        <li>to provide you with support and to respond to your inquiries, including to investigate and address your concerns and monitor and improve our responses.</li>
                        <li>to help maintain the safety, security, and integrity of our Site, products and services, databases and other technology assets, and business.</li>
                        <li>for testing, research, analysis, and product development.</li>
                        <li>to respond to law enforcement requests and as required by applicable law, court order, or governmental regulations.</li>
                        <li>as described to you when collecting your Personal Information or as otherwise set forth in the CCPA.</li>
                        <li>detecting security incidents, protecting against malicious, deceptive, fraudulent, or illegal activity, and prosecuting those responsible for that activity.</li>
                        <li>debugging to identify and repair errors that impair existing intended functionality.</li>
                        <li>to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which Personal Information held by us is among the assets transferred.</li>
                      </ul>
                      <p style={styles.sectionP}>
                        We will not collect additional categories of Personal Information or use the Personal Information we collected for materially different, unrelated, or incompatible purposes as those set out above, or in section D in the main body of the Policy above, without providing you notice.
                      </p>
                      <p style={styles.sectionP}>
                        We do not sell Personal Information as the term “sell” is defined in the CCPA.
                      </p>
                      <p style={{ ...styles.sectionP, fontStyle: 'italic' }}>
                        Sharing Personal Information
                      </p>
                      <p style={styles.sectionP}>
                        We may disclose any or all of the categories above of your Personal Information to third parties for a business purpose, as set forth in this policy, and we have done so in the last 12 months.
                      </p>
                      <p style={styles.sectionP}>
                        We disclose your Personal Information for a business purpose to the categories of third parties set out in section E in the main body of the Policy above.
                      </p>
                      <p style={{ ...styles.sectionP, fontStyle: 'italic' }}>
                        Your rights and choices
                      </p>
                      <p style={styles.sectionP}>
                        You have the right to request that we disclose certain information to you about our collection and use of your Personal Information over the past 12 months. Once we receive and confirm your verifiable consumer request, we will disclose to you (unless an exception applies):
                      </p>
                      <ul style={styles.list}>
                        <li>the categories of Personal Information we collected about you.</li>
                        <li>the categories of sources for the Personal Information we collected about you.</li>
                        <li>our business or commercial purpose for collecting that Personal Information.</li>
                        <li>the categories of third parties with whom we share that Personal Information.</li>
                        <li>the specific pieces of Personal Information we collected about you (also called a Personal Data portability request).</li>
                        <li>if we disclosed your Personal Information for a business purpose, a list of disclosures for a business purpose, identifying the Personal Information categories that each category of recipient obtained.</li>
                      </ul>
                      <p style={styles.sectionP}>
                        We do not provide these Personal Data access and portability rights for B2B Personal Information to the extent such an exception remains in effect under the CCPA.
                      </p>
                      <p style={{ ...styles.sectionP, fontStyle: 'italic' }}>
                        Deletion request rights
                      </p>
                      <p style={styles.sectionP}>
                        California residents have the right under the CCPA to request that we delete any of their Personal Information that we have collected and retained, subject to certain exceptions. Once we receive and confirm a verifiable consumer request (see below), we will delete (and direct our service providers to delete) relevant Personal Information from our records, unless an exception applies (such as the B2B exception referenced above).
                      </p>
                      <p style={styles.sectionP}>
                        We may deny California residents’ deletion request if doing so is permitted or required by applicable law, or if retaining the Personal Information is necessary for us or our service provider(s) to:
                      </p>
                      <ul style={styles.list}>
                        <li>complete the transaction for which we collected the Personal Information, provide a good or service that you requested, take actions reasonably anticipated within the context of our ongoing business relationship with the requesting individual, or otherwise perform our contract with a requesting individual.</li>
                        <li>detect security incidents, protect against malicious, deceptive, fraudulent, or illegal activity, or prosecute those responsible for such activities.</li>
                        <li>debug products to identify and repair errors that impair existing intended functionality.</li>
                        <li>exercise free speech, ensure the right of another to exercise their free speech rights, or exercise another right provided for by law.</li>
                        <li>engage in public or peer-reviewed scientific, historical, or statistical research in the public interest that adheres to all other applicable ethics and privacy laws, when the Personal Information's deletion may likely render impossible or seriously impair the research's achievement, if you previously provided informed consent.</li>
                        <li>enable solely internal uses that are reasonably aligned with consumer expectations.</li>
                        <li>comply with a legal obligation.</li>
                        <li>make other internal and lawful uses of that Personal Information that are compatible with the context in which you provided it.</li>
                      </ul>
                      <p style={{ ...styles.sectionP, fontStyle: 'italic' }}>
                        Verifiable consumer request
                      </p>
                      <p style={styles.sectionP}>
                        To exercise the access, Personal Data portability, and deletion rights under the CCPA described above, please submit to us a verifiable consumer request as set forth above.
                      </p>
                      <p style={styles.sectionP}>
                        Only a California resident may make a verifiable consumer request related to their Personal Information. A California resident may also make a verifiable consumer request on behalf of their minor child.
                      </p>
                      <p style={styles.sectionP}>
                        A verifiable consumer request for Personal Data access or portability can only be made twice within a 12-month period. The verifiable consumer request must provide sufficient information that allows us to reasonably verify the California resident about whom we collected Personal Information or an authorized representative, and contain sufficient detail that allows us to properly understand, evaluate, and respond to it. We cannot respond to your request or provide Personal Information if we cannot verify your identity or authority to make the request and confirm the Personal Information relates to you.
                      </p>
                      <p style={styles.sectionP}>
                        Making a verifiable consumer request does not require you to create an account on our Site. However, we do consider requests made through your password protected account sufficiently verified when the request relates to Personal Information associated with that specific account. We will only use Personal Information provided in a verifiable consumer request to verify the requestor's identity or authority to make the request.
                      </p>
                      <p style={styles.sectionP}>
                        We will endeavour to respond to a verifiable consumer request within 45 days of its receipt. If we require more time (up to 90 days), we will inform you of the reason and extension period in writing. If you have an account with us, we will deliver our written response to that account. If you do not have an account with us, we will deliver our written response by mail or electronically.
                      </p>
                      <p style={styles.sectionP}>
                        Any disclosures we provide will only cover the 12-month period preceding the verifiable consumer request’s receipt. The response we provide will also explain the reasons we cannot comply with a request, if applicable. For Personal Data portability requests, we will select a format to provide your Personal Information that is readily useable and should allow you to transmit the Personal Information from one entity to another entity without hindrance.
                      </p>
                      <p style={styles.sectionP}>
                        We do not charge a fee to process or respond to your verifiable consumer request unless it is excessive, repetitive, or manifestly unfounded. If we determine that the request warrants a fee, we will tell you why we made that decision and provide you with a cost estimate before completing your request.
                      </p>
                      <p style={{ ...styles.sectionP, fontStyle: 'italic' }}>
                        Non-discrimination
                      </p>
                      <p style={styles.sectionP}>
                        We will not discriminate against you for exercising any of your CCPA rights. Except as permitted by the CCPA, we will not:
                      </p>
                      <ul style={styles.list}>
                        <li>deny you goods or services.</li>
                        <li>charge you different prices or rates for goods or services, including through granting discounts or other benefits, or imposing penalties.</li>
                        <li>provide you a different level or quality of goods or services.</li>
                        <li>suggest that you may receive a different price or rate for goods or services or a different level or quality of goods or services.</li>
                      </ul>
                    </div>
                  </>
                }
                {section.indexOf('#N') > -1 &&
                  <>
                    <div id="L" style={styles.sectionHeading}>EU-US PRIVACY POLICY</div>
                    <div style={styles.section}>
                      <p style={styles.sectionP}>
                        This EU-US Privacy Policy explains how we adhere to the privacy principles of the EU-US Privacy Shield Framework and Swiss-US Privacy Shield Framework with respect to transfers of personal information from the <a href="https://europa.eu/european-union/about-eu/countries_en" target="_blank" rel="noopener noreferrer">European Union</a>, as well as the United Kingdom, Norway, Lichtenstein and Iceland (collectively, ”EU”), and from Switzerland, to the United States. We are subject to the investigatory and enforcement powers of the Federal Trade Commission (FTC).
                      </p>
                      <p style={styles.sectionP}>
                        The United States Department of Commerce and the European Commission have agreed on a set of <a href="https://www.privacyshield.gov/eu-us-framework" target="_blank" rel="noopener noreferrer">Privacy Shield Principles and Supplemental Principles</a>, to enable U.S. companies to satisfy the requirement under European Union law that adequate protection be given to personal information transferred from the EU to the United States (the “EU-US Privacy Shield”). The EU also has recognized the EU-US Privacy Shield as providing adequate data protection. The United States Department of Commerce and the government of Switzerland have agreed on a similar set of <a href="https://www.privacyshield.gov/eu-us-framework" target="_blank" rel="noopener noreferrer">Privacy Shield Principles and Supplemental Principles</a>, to enable U.S. companies to satisfy the requirement under applicable Swiss law that adequate protection be given to personal information transferred from Switzerland to the United States (the “Swiss-US Privacy Shield”).
                      </p>
                      <p style={styles.sectionP}>
                        We comply with the EU-US Privacy Shield Framework and Swiss-US Privacy Shield Framework as set forth by the U.S. Department of Commerce regarding the collection, use, and retention of personal information transferred f to the United States. We have certified to the Department of Commerce that we adhere to the Privacy Shield Principles.
                      </p>
                      <p style={{ ...styles.sectionP, fontFamily: mainStyles.boldFont }}>
                        A. Scope
                      </p>  
                      <p style={styles.sectionP}>
                        This EU-US Privacy Policy applies to all personal information received by us in the United States from the EU and from Switzerland, in any format, including electronic, paper or verbal.
                      </p>
                      <p style={{ ...styles.sectionP, fontFamily: mainStyles.boldFont }}>
                        B. Definitions
                      </p>
                      <p style={styles.sectionP}>
                        For purposes of this EU-US Privacy Policy, the following definitions will apply:
                      </p>
                      <ul style={styles.list}>
                        <li>“agent” means any third party that collects or uses personal information under our instructions and for us, or to which we disclose personal information for use on our behalf.</li>
                        <li>“personal information” and “personal data” means any data, information or data/information set(s) that identifies or could be used by or on behalf of us to identify an individual. Personal information does not include information that is encoded or anonymized, or publicly available information that has not been combined with non-public personal information.</li>
                        <li>“sensitive personal information” means personal information that reveals race, ethnic origin, political opinions, religious or philosophical beliefs, trade union membership, views or activities, that concerns health or sex life, ideological views or activities, information on social security measures or benefits, or information on criminal or administrative proceedings and sanctions other than in the context of pending proceedings. In addition, we will treat as sensitive personal information any information received from a third party where that third party treats and explicitly identifies the information as sensitive within the same meaning as used here.</li>
                      </ul>
                      <p style={{ ...styles.sectionP, fontFamily: mainStyles.boldFont }}>
                        C. Privacy Shield Principles
                      </p>
                      <p style={styles.sectionP}>
                        The privacy principles in this EU-US Privacy Policy have been developed based on the Privacy Shield Principles and Supplemental Principles. For purposes of these principles and this section C, the term “EU” includes Switzerland.
                      </p>
                      <p style={styles.sectionP}>
                        (i) Notice. Where we collect personal information directly from individuals in the EU, we will inform such individuals about the purposes for which we collect and use personal information about them, the types of non–agent third parties to which we disclose that information, the choices and means, if any, we offer individuals for limiting the use and disclosure of personal information about them, and how to contact us. Notice will be provided in clear and conspicuous language when individuals are first asked to provide personal information, or as soon as practicable thereafter, and in any event before we use or disclose the information for a purpose other than that for which it was originally collected.
                      </p>
                      <p style={styles.sectionP}>
                        Where we receive personal information from our subsidiaries, affiliates or other entities in the EU, we will use and disclose such information in accordance with the notices provided by such entities and the choices made by the individuals to whom such personal information relates.
                      </p>
                      <p style={styles.sectionP}>
                        (ii) Choice. We will offer individuals the opportunity to choose (opt-out) whether their personal information is (a) to be disclosed to a non-agent third party, or (b) to be used for a purpose that is materially different than the purpose for which it was originally collected or subsequently authorized by the individual.
                      </p>
                      <p style={styles.sectionP}>
                        For sensitive personal information, we don't solicit such information and there's no need to disclose such information in order to use our services or sites. If we elect in the future to solicit such information, we will give individuals the opportunity to affirmatively and explicitly (opt-in) consent to the disclosure of such solicited information to a non-agent third party or the use of the information for a purpose other than the purpose for which it was originally collected or subsequently authorized by the individual.
                      </p>
                      <p style={styles.sectionP}>
                        We will provide individuals with reasonable mechanisms to exercise their choices.
                      </p>
                      <p style={styles.sectionP}>
                        (iii) Data Integrity. We will use personal information only in ways that are compatible with and relevant to the purposes for which it was collected or subsequently authorized by the individual. We will take reasonable steps to ensure that personal information is reliable to its intended use, accurate, complete, and current. We will remain compliant for as long as we retain personal information. Personal information will be retained in a form identifying or making identifiable an individual only for so long as necessary to process such information, subject to our right to retain such information for longer periods for the time and to the extent such processing reasonably serves the purposes of archiving in the public interest, journalism, literature and art, scientific or historical research, and statistical analysis.
                      </p>
                      <p style={styles.sectionP}>
                        (iv) Accountability for Onward Transfer. To transfer personal data to an agent, we will: (a) transfer such data only for limited and specified purposes; (b) ascertain that the agent is obligated to provide at least the same level of privacy protection as is required by the Privacy Shield Principles; (c) take reasonable and appropriate steps to ensure that the agent effectively processes the personal information transferred in a manner consistent with our obligations under the Privacy Shield Principles; (d) require the agent to notify us if it makes a determination that it can no longer meet its obligation to provide the same level of protection as is required by the Privacy Shield Principles; (e) upon notice, including under (d), take reasonable and appropriate steps to stop and remediate unauthorized processing; (f) provide a summary or a representative copy of the relevant privacy provisions of its contract with that agent to the Department of Commerce upon request; and (g) enter into enforceable contracts with agents consistent with this policy.
                      </p>
                      <p style={styles.sectionP}>
                        We will undertake to obtain assurances from our agents that they will safeguard personal information consistent with this policy. Examples of appropriate assurances that may be provided by agents include: (h) a contract obligating the agent to provide at least the same or substantially similar level of protection as is required by the relevant Privacy Shield Principles, (i) such agent being certified as Privacy Shield Principles-compliant, (j) such agent being subject to the EU Data Protection Directive, or (k) such agent being subject to another EU or Swiss adequacy finding (e.g., companies located in Canada). Where we have knowledge that an agent is using or disclosing personal information in a manner contrary to this policy, we will take reasonable steps to prevent or stop such use or disclosure.
                      </p>
                      <p style={styles.sectionP}>
                        (v) Access and Correction. Upon request, we will grant individuals reasonable access to personal information that it holds about them. In addition, we will take reasonable steps to permit individuals to correct, amend, or delete information that is demonstrated to be inaccurate or incomplete, or that has been processed in violation of the Privacy Shield Principles, except where the burden or expense of providing access would be disproportionate to the risks to the individual’s privacy in the case in question, or where the rights of persons other than the individual would be violated.
                      </p>
                      <p style={styles.sectionP}>
                        (vi) Security. We will take reasonable and appropriate measures to protect personal information in our possession from loss, misuse and unauthorized access, disclosure, alteration and destruction, taking into account the risks involved in the processing and nature of the personal data.
                      </p>
                      <p style={styles.sectionP}>
                        (vii) Enforcement. We will conduct compliance reviews of our relevant privacy practices to verify adherence to this EU-US Privacy Policy and appropriate employee and agent training as necessary. Any employee or agent of ours that we determine is in violation of this policy will be subject to disciplinary action up to and including termination of employment or service. We will be responsible if our agent processes personal information in a manner inconsistent with the Privacy Shield Principles, unless we prove that we are not responsible for the event giving rise to the damage.
                      </p>
                      <p style={styles.sectionP}>
                        (viii) Dispute Resolution. Any questions or concerns regarding the use or disclosure of personal information should be directed to the Data Processing Officer. We will investigate and attempt to resolve complaints and disputes regarding use and disclosure of personal information by reference to this policy in an expeditious manner, and at no cost to the individual.
                      </p>
                      <p style={styles.sectionP}>
                        We have further committed to refer unresolved Privacy Shield complaints to JAMS (jamsadr.com), an alternative dispute resolution provider located in the United States, which serves as our third-party dispute resolution provider for Privacy Shield Principles-related disputes. If you do not receive timely acknowledgment of your complaint from us, or if we have not addressed your complaint to your satisfaction, please contact or visit JAMS for more information or to file a complaint. The services of JAMS are provided at no cost to you.
                      </p>
                      <p style={styles.sectionP}>
                        Individuals may submit complaints on an individualized basis (and not purporting to be acting in a representative capacity or on behalf of a class) to <a href="https://www.jamsadr.com/eu-us-privacy-shield" target="_blank" rel="noopener noreferrer">JAMS</a>. No damages, fees, or other remedies are available. Arbitrators will have the authority only to award individual-specific non-monetary equitable relief (such as access, correction, deletion, or return of the individual data's in question). Each party will bear its own attorneys fees, subject to the rules of JAMS.
                      </p>
                      <p style={styles.sectionP}>
                        In addition, individuals may submit disputes to binding arbitration who first comply with <a href="https://www.privacyshield.gov/article?id=C-Pre-Arbitration-Requirements" target="_blank" rel="noopener noreferrer">pre-arbitration requirements</a>. Arbitration may not be invoked and is not available if the individual’s same claimed violation of the Privacy Shield Principles: (a) has previously been subject to binding arbitration; (b) was the subject of a final judgment entered in a court action to which the individual was a party; or (c) was previously settled by the parties. In addition, arbitration is not available if an EU Data Protection Authority: (d) has authority under sections III.5 or III.9 of the Privacy Shield Principles; or (e) has the authority to resolve the claimed violation directly with us.
                      </p>
                      <p style={{ ...styles.sectionP, fontFamily: mainStyles.boldFont }}>
                        D. Limitation
                      </p>  
                      <p style={styles.sectionP}>
                        Adherence to this EU-US Privacy Policy is limited to the extent (i) required to respond to a legal or ethical obligation; (ii) necessary to meet national security, public interest or law enforcement obligations; and (iii) expressly permitted by an applicable law, rule or regulation.
                      </p>
                      <p style={{ ...styles.sectionP, fontFamily: mainStyles.boldFont }}>
                        E. Privacy Policy
                      </p>
                      <p style={styles.sectionP}>
                        We recognize the importance of maintaining the privacy of information collected online and via applications, and have created this policy governing the treatment of personal information collected through web sites, services, operations and applications that we operate. The policy reflects additional legal requirements and evolving standards with respect to privacy, and in fact, we utilize this policy in facilitating adherence to the Privacy Shield Principles and applicable EU data protection laws. As such, this EU-US Privacy Policy and the Policy should be construed harmoniously wherever possible; however, with respect to personal information that is transferred from the EU or Switzerland to the US, the Policy is subordinate to this EU-US Privacy Policy.
                      </p>
                      <p style={{ ...styles.sectionP, fontFamily: mainStyles.boldFont }}>
                        F. Contact Information
                      </p>
                      <p style={styles.sectionP}>
                        Questions or comments regarding this policy may be submitted to us via <a href="mailto: sean.gorman@pixel8.earth" target="_blank" rel="noopener noreferrer">sean.gorman@pixel8.earth</a>.
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

export default Privacy;
