import React from 'react';
import { MDBCol, MDBRow, MDBContainer } from 'mdbreact';

import mainStyles from '../styles';


class Terms extends React.Component {
  constructor() {
    super();
    this.state = {
      section: 'definitions'
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
          <div style={styles.title}>Pixel8Earth Terms of Use</div>
          <div style={styles.opening}>
            <p style={styles.openingP}>
              In pursuit of our dream to create the first scalable, open and freely accessible 3D map of the world, we have prepared these Terms of Use in support of our Pixel8 community—in order to promote transparency, preserve user rights and freedoms, and minimize disputes. We would like to assure the community that nothing in these Terms requires transfer of your ownership of images or content you contribute, and that your contributions are made publicly available by us only in accordance with these Terms.
            </p>
            <p style={styles.openingP}>
              Your acceptance of these Terms is required for use of the Pixel8 Solution. By registering with Pixel8, or by using the Pixel8 Solution in whole or in part, these Terms become a legally binding agreement with us, so please read them carefully. We reserve the right at our discretion to propose modifications to these Terms periodically. We will notify you of such changes via an email sent to the email address we have on file for you or via other notification mechanisms. Your continued use of the Pixel8 Solution after such notice indicates your acceptance of and agreement to the modified Terms.
            </p>
          </div>
          <MDBContainer fluid style={{ padding: 0, margin: 0 }}>
            <MDBRow style={{ margin: 0, padding: 0 }}>
              <MDBCol size="3" style={{ justifyContent: 'left', alignContent: 'center', padding: '0' }}>
                <div style={styles.sectionNumbers} id="termsList">
                  <a
                    className={`${(section === 'definitions' || section === '' || section === '#/terms') ? 'is-active' : ''}`}
                    href="#/terms#definitions"
                  >Defined Terms</a>
                  <a className={`${~section.indexOf('1.') ? 'is-active' : ''}`} href="#/terms#1.0">1. Access and Licensed Rights</a>
                  <div style={{ ...styles.sectionNumbers, display: ~section.indexOf('1.') ? 'flex' : 'none' }}>
                    <a style={styles.anchorIndent} onClick={this.goTo('1.1')}>1.1 Pixel8 Solution Access</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('1.2')}>1.2 Pixel8 User Licenses to Us</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('1.3')}>1.3 Pixel8 Software</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('1.4')}>1.4 Reservation of Rights</a>
                  </div>
                  <a className={`${~section.indexOf('2.') ? 'is-active' : ''}`} href="#/terms#2.0">2. Terms Applicable to Content</a>
                  <div style={{ ...styles.sectionNumbers, display: ~section.indexOf('2.') ? 'flex' : 'none' }}>
                    <a style={styles.anchorIndent} onClick={this.goTo('2.1')}>2.1 Specific Prohibited Uses</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('2.2')}>2.2 Handling of Your Content</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('2.3')}>2.3 Propriety of Content</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('2.4')}>2.4 Prohibited Content</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('2.5')}>2.5 Use of Content</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('2.6')}>2.6 Third Party Sites</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('2.7')}>2.7 Prerequisites</a>
                  </div>
                  <a className={`${~section.indexOf('3.') ? 'is-active' : ''}`} href="#/terms#3.0">3. Sign-On Credentials</a>
                  <div style={{ ...styles.sectionNumbers, display: ~section.indexOf('3.') ? 'flex' : 'none' }}>
                    <a style={styles.anchorIndent} onClick={this.goTo('3.1')}>3.1 Sign-On Credentials</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('3.2')}>3.2 Change of Username</a>
                  </div>
                  <a className={`${~section.indexOf('4.') ? 'is-active' : ''}`} href="#/terms#4.0">4. Site Integrity</a>
                  <div style={{ ...styles.sectionNumbers, display: ~section.indexOf('4.') ? 'flex' : 'none' }}>
                    <a style={styles.anchorIndent} onClick={this.goTo('4.1')}>4.1 Prohibited Uses</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('4.2')}>4.2 No Harvesting or Crawling</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('4.3')}>4.3 No Framing</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('4.4')}>4.4 Account Data</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('4.5')}>4.5 Notifications to Us</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('4.6')}>4.6 Notifications to You</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('4.7')}>4.7 Network Security Rules</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('4.8')}>4.8 Analyticals</a>
                  </div>
                  <a className={`${~section.indexOf('5.') ? 'is-active' : ''}`} href="#/terms#5.0">5. Disclaimer of Warranties, Limitations of Liability and Indemnification</a>
                  <div style={{ ...styles.sectionNumbers, display: ~section.indexOf('5.') ? 'flex' : 'none' }}>
                    <a style={styles.anchorIndent} onClick={this.goTo('5.1')}>5.1 Disclaimer</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('5.2')}>5.2 Liability Limitation</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('5.3')}>5.3 Indemnification</a>
                  </div>
                  <a className={`${~section.indexOf('6.') ? 'is-active' : ''}`} style={styles.anchor} href="#/terms#6.0">6. General Provisions</a>
                  <div style={{ ...styles.sectionNumbers, display: ~section.indexOf('6.') ? 'flex' : 'none', visibility: ~section.indexOf('6.') ? 'visible' : 'hidden' }}>
                    <a style={styles.anchorIndent} onClick={this.goTo('6.1')}>6.1 Force Majeure</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('6.2')}>6.2 Service Discontinuance/Modification</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('6.3')}>6.3 Account Termination</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('6.4')}>6.4 US Government Restricted Rights</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('6.5')}>6.5 Trademarks</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('6.6')}>6.6 US DCMA</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('6.7')}>6.7 Governing Law</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('6.8')}>6.8 Dispute Resolution</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('6.9')}>6.9 Service Assignment</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('6.10')}>6.10 Injunctive Relief</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('6.11')}>6.11 Delaware-Based</a>
                    <a style={styles.anchorIndent} onClick={this.goTo('6.12')}>6.12 General</a>
                  </div>
                </div>
              </MDBCol>
              <MDBCol size="6" style={{ justifyContent: 'center', alignContent: 'center', padding: '0', marginLeft: '10vw' }}>
                {(section === 'definitions' || section === '' || section === '#/terms') &&
                  <>
                    <div id="definitions" style={styles.sectionHeading}>Defined Terms</div>
                    <div style={styles.section}>
                      <p style={styles.sectionP}>"Content": images, maps, photos, video, audio, and any other text, content, information or data, including Metadata, created, derived from or accessible via use of the Pixel8 Solution, or otherwise made available by and to Pixel8 Users and us.</p>
                      <p style={styles.sectionP}>"Pixel8": Pixel8Earth, Inc., a corporation organized under the laws of Delaware. In these Terms, Pixel8 is referred to by "us", "we" or "our", as applicable</p>
                      <p style={styles.sectionP}>"Pixel8 App": the Pixel8 smartphone application available for download on third party application stores such as iTunes and Google Play.</p>
                      <p style={styles.sectionP}>"Pixel8 Content": the published derived Content we make available and present on the Site or via the Service that results from the compilation, processing, and stitching together of Content submitted by Pixel8 Users.</p>
                      <p style={styles.sectionP}>"Pixel8 Software": software applications and tools, documentation, and application programming interfaces that we may make available to Customer for use with the Services, and as may be updated or modified by us on one or more occasions.</p>
                      <p style={styles.sectionP}>"Pixel8 Solution": the Pixel8 App, the Pixel8 Software, the Pixel8 Content, the Site, and the Services.</p>
                      <p style={styles.sectionP}>"Pixel8 User": you and any other user of the Pixel8 Solution.</p>
                      <p style={styles.sectionP}>"Metadata": data and information associated with or related to Content, including numerical latitude or longitude or similar coordinates, imagery, data derived from within images (such as without limitation street signs, landmarks, building names, etc.), and data generated by the capture of images (such as without limitation geolocation, time and date, network and system information).</p>
                      <p style={styles.sectionP}>"Services": the network-provisioned services, features, application programming interfaces (APIs), and functionality we make available, including via the Site, Pixel8 Software, and/or the Pixel8 App (including functionality for the provision, modification, display, and management of Content), and any new updates, versions, and changes to any of the foregoing as released by us.</p>
                      <p style={styles.sectionP}>"Site": pixel8.earth and any web pages that are a part of pixel8.earth.</p>
                      <p style={styles.sectionP}>"Terms": these Terms of Use Pixel8as may be modified from time to time.</p>
                      <p style={styles.sectionP}>"You" or "your": the individual using the Pixel8 Solution, or clicking "accept" or "agree" where indicated, and thereby becoming bound by these Terms, and the company or other legal entity represented by such individual, or for whom such individual uses the Pixel8 Solution, and all affiliates thereto.</p>
                    </div>
                  </>
                }
                {section.indexOf('1.') > -1 &&
                  <>
                    <div id="1.0" style={styles.sectionHeading}>Access and Licensed Rights</div>
                    <div style={styles.section}>
                      <p id="1.1" style={styles.sectionP}>
                        1.1 <span style={styles.subSectionTitle}>Pixel8 Solution Access.</span> Subject to your compliance with these Terms, we grant to you: (a) access to the Pixel8 Solution and (b) rights to Content displayed by us for the general public under license terms that we specify from time-to-time (the current outbound license terms are set forth in the Site's Legal Page) ("Outbound Terms"). You will comply with the Developer Usage Policy. Access and rights to the App (if any) are as set forth in the end user license terms made available on the App distribution site or service or that are contained with the terms of use/service applicable to such distribution sites or services. Breach of such license terms or the Outbound Terms will result in automatic termination of your access to the Pixel8 Solution and Content, unless waived by us in writing in our sole discretion.
                      </p>
                      <p id="1.2" style={styles.sectionP}>
                        1.2 <span style={styles.subSectionTitle}>Pixel8 User Licenses to Us.</span> You and each Pixel8 user hereby grant to us the perpetual, irrevocable, worldwide, royalty-free, fully paid-up, sub-licensable, non-exclusive right and license to use, reproduce, modify, create derivative works of, perform, display and distribute without restriction (including via any medium) Content, in whole or in part, for commercial and non-commercial purposes, including (a) for purposes of providing, developing, improving, making available, promoting and marketing the Pixel8 Solution and (b) making available Content under the Outbound Terms. Further, you agree that we are free to use and implement in perpetuity without compensation, attribution or obligation to you any feedback, benchmarks, requirements, suggestions, criticisms, improvements, recommendations, ideas, and error corrections provided by you to us relating to the Pixel8 Solution.
                      </p>
                      <p id="1.3" style={styles.sectionP}>
                        1.3 <span style={styles.subSectionTitle}>Pixel8 Software.</span> Subject to your compliance with the obligations of this Agreement, we hereby grants to you a worldwide, non-sublicensable, non-transferable, and non-exclusive license to install and use, solely in support of your use of the Services, the applicable components of the Pixel8 Software on any computing device on which the Pixel8 Software is intended to run. You will not (a) make more than the number of copies of Pixel8 Software reasonably required for authorized use and distribution as permitted by this section; (b) modify, or create derivative works or improvements of, the Pixel8 Software; or (c) sublicense, rent, lease, or host the Pixel8 Software. The license in this section may be superseded or modified via separate license terms from us. All rights not expressly granted in this section, or stated in separate license terms from us, are reserved to us. You will have no right or license to the Pixel8 Software other than the rights set forth in this section or in separate license terms from us. Certain components or libraries included in or bundled with the Pixel8 Software may be covered by open source licenses. To the extent required by such open source licenses, the terms of such licenses will apply in lieu of the terms of this section, solely with respect to those libraries or components that are licensed under such open source licenses.
                      </p>
                      <p id="1.4" style={styles.sectionP}>
                        1.4 <span style={styles.subSectionTitle}>Reservation of Rights.</span> No other right or license to the Pixel8 Solution or Content is provided, and no other license will be implied, by course of conduct or otherwise. We grant no right or license with respect to our patents. Each Pixel8 User retains all right, title and interest in and to such Pixel8 User's Content, and all associated intellectual property rights, subject to these Terms. Subject to these Terms, we retain all right, title and interest in and to the Pixel8 Solution, and all associated intellectual property rights. Except as expressly authorized by these Terms and the Outbound Terms, you will not use, reproduce, or distribute Content not authored by you. The user interface, user experience, icons, presentation layer and elements, terminology, reports, layouts, and screen displays of or generated by the Pixel8 Solution are our copyrightable content, our trade dress and our trademarks and service marks, and will not be reproduced, distributed, or displayed except for your internal use and not for external use or exploitation.
                      </p>
                    </div>
                  </>
                }
                {section.indexOf('2.') > -1 &&
                  <>
                    <div id="2.0" style={styles.sectionHeading}>Terms Applicable to Content</div>
                    <div style={styles.section}>
                      <p id="2.1" style={styles.sectionP}>
                        2.1 <span style={styles.subSectionTitle}>Specific Prohibited Uses.</span> You will not (a) use the Pixel8 Solution in a manner that gives you or any other person access to mass downloads or bulk feeds of any Content, including Metadata; (b) delete, obscure, or in any manner alter any message, warning or link that appears in the Pixel8 Solution or the Content; or (c) use the Pixel8 Solution or Content in whole or in part with any products, systems, or applications for or in connection with a visual positioning system, including but not limited to turn-by-turn route real-time navigation or guidance that is synchronized to the position of a user's sensor-enabled device.
                      </p>
                      <p id="2.2" style={styles.sectionP}>
                        2.2 <span style={styles.subSectionTitle}>Handling of Your Content.</span>  We may at any time filter, alter, modify, crop, or delete Content in whole or in part before making it available on the Site and via the Service in our sole discretion, including in order to render the Content suitable for use on or with the Pixel8 Solution. We are under no obligation to publicly display Content that is posted to private repositories, or that is hidden by election of the contributing Pixel8 User. You hereby waive any moral, neighboring or other rights you may have (including rights in the nature of attribution, integrity, privacy, paternity, and rights to object to derogatory treatment) that would otherwise preclude us from filtering, altering, deleting, or using, copying or distributing, your Content in accordance with these Terms. You acknowledge and agree that we may continue to store, display and otherwise exercise the rights set forth in section 1.2 above with respect to your Content even after termination, deactivation, or archiving of your account.
                      </p>
                      <p id="2.3" style={styles.sectionP}>
                        2.3 <span style={styles.subSectionTitle}>Propriety of Content.</span> All Content, whether publicly posted on or privately transmitted within private groups, is the sole responsibility of the Pixel8 User from which such Content originated. No Pixel8 User will transmit Content or otherwise conduct or participate in any activities on or via the Pixel8 Solution which, in our sole judgment, is likely to be prohibited by law, or is violative or in breach of third party rights in any applicable jurisdiction, including without limitation laws governing libel and defamation, encryption of software, the export of technology, the transmission of obscenity or the permissible uses of intellectual property. You represent and warrant that all Content you submit is accurate and not misleading to the best of your knowledge, is not confidential or privileged, and is not in violation of third party rights. We may, in our sole discretion, terminate the Services as to any Content that we believe in our sole judgment is not in compliance with these Terms. We may preserve and disclose Content if required to do so by law or judicial or governmental mandate or as reasonably determined useful by us to protect the rights, property or safety of Pixel8 Users or the public.
                      </p>
                      <p id="2.4" style={styles.sectionP}>
                        2.4 <span style={styles.subSectionTitle}>Prohibited Content.</span> You agree not to upload, download, display, perform, transmit, or otherwise distribute any Content, or otherwise engage in any activity in connection with the Pixel8 Solution, that: (a) is hateful, offensive, libelous, defamatory, obscene, abusive, pornographic, lewd, erroneous, stalking, or threatening; (b) depicts injured or severely sick people, or acts of violence; (c) advocates or encourages conduct that could constitute a criminal offense, give rise to civil liability, or otherwise violate any applicable local, state, national, or foreign law or regulation; (d) constitutes infringement of the intellectual property rights of any party, including rights to the use of name and likeness, or violation of a right of privacy; (e) creates an impression that is incorrect, misleading, or deceptive, including without limitation by impersonating others or by otherwise misrepresenting identity or affiliation with a person or entity; or  (f) divulges other people's private or personally identifiable information without their express authorization and permission.
                      </p>
                      <p id="2.5" style={styles.sectionP}>
                        2.5 <span style={styles.subSectionTitle}>Use of Content.</span> Each Pixel8 User, by using the Pixel8 Solution, may be exposed to Content that is offensive, indecent, objectionable, illegal, infringing, false or erroneous. Each Pixel8 User must evaluate, and will bear all risks associated with, the use of any Content, including any reliance on the quality, integrity, accuracy, completeness, or usefulness of such Content. We do not guarantee the accuracy, integrity or quality of any Content. Under no circumstances will we be liable in any way for any Content, including, but not limited to, liability for any errors, inaccuracies, or omissions in any Content, or for any loss or damage of any kind incurred as a result of the use of any Content. We will have no obligation or liability to you or any Pixel8 User to maintain, store, or license Content, protect and maintain Content owners' intellectual property rights, or to enforce these Terms. You hereby waive and release any claims you may have against us arising or resulting from use or misuse of Content or your inability to effectively use Content, your failure to comply with these Terms, or for any act, omission, or conduct of any Pixel8 User. If you as a user of the Pixel8 Solution, discovers Content that you consider inappropriate in any way, please inform us and identify how the Content in question fails to comply with these Terms by sending an e-mail to <a href="mailto: sean.gorman@pixel8.earth" target="_blank" rel="noopener noreferrer">sean.gorman@pixel8.earth</a> and we will look in to the issue.
                      </p>
                      <p id="2.6" style={styles.sectionP}>
                        2.6 <span style={styles.subSectionTitle}>Third Party Sites.</span> The Pixel8 Solution, Pixel8 Users, or a third party may provide links to other websites or login access via such links. Such links will not be construed as an endorsement, sponsorship, or affiliation by us. We exercise no control over such other websites and web-based resources and are not responsible or liable for the availability thereof or the content, advertising, products or other materials thereon. We will not be responsible or liable for any damage or loss incurred or suffered in connection such other sites and resources.
                      </p>
                      <p id="2.7" style={styles.sectionP}>
                        2.7 <span style={styles.subSectionTitle}>Prerequisites.</span> You acknowledge that use of the Pixel8 Solution requires connection to, and data transfers over, the network and therefore may impact your data usage charges imposed by your wireless operator or other service provider. It is your responsibility to obtain at your cost all equipment, software and internet access necessary to use the Pixel8 Solution.
                      </p>
                    </div>
                  </>
                }
                {section.indexOf('3.') > -1 &&
                  <>
                    <div id="3.0" style={styles.sectionHeading}>Sign-On Credentials</div>
                    <div style={styles.section}>
                      <p id="3.1" style={styles.sectionP}>
                        3.1 <span style={styles.subSectionTitle}>Sign-On Credentials.</span> When creating an account, you will receive or will be permitted to create or use existing online user name and password information ("Sign-On Credentials"), and are responsible for maintaining the confidentiality thereof and liable for all activities occurring under such Sign-On Credentials. You will not transfer to any party your Sign-On Credentials, or use the Sign-On Credentials of another, without our prior written consent. You will immediately notify us at <a href="mailto: sean.gorman@pixel8.earth" target="_blank" rel="noopener noreferrer">sean.gorman@pixel8.earth</a> of any unauthorized use of Sign-On Credentials or any other breach of security. We will not be liable for any loss or damage arising from a Pixel8 User's failure to comply with this section or from unauthorized use of the Sign-On Credentials.
                      </p>
                      <p id="3.2" style={styles.sectionP}>
                        3.2 <span style={styles.subSectionTitle}>Change of Username.</span> We may require you, as a condition of membership, to change your username if we believe appropriate (such as when a trademark owner complains about a username that does not closely relate to a user’s actual name).
                      </p>
                    </div>
                  </>
                }
                {section.indexOf('4.') > -1 &&
                  <>
                    <div id="4.0" style={styles.sectionHeading}>Site Integrity</div>
                    <div style={styles.section}>
                      <p id="4.1" style={styles.sectionP}>
                        4.1 <span style={styles.subSectionTitle}>Prohibited Uses.</span> You will not use the Pixel8 Solution in any manner that could damage, disable, overburden, or impair any Pixel8-controlled server, or the network(s) connected to any such server, or interfere with any other party's use and enjoyment of the Pixel8 Solution, including without limitation falsifying or altering Content posted by others except via normal and intended operation of the Services. You may not attempt to gain unauthorized access to other accounts, computer systems or networks connected to any of our servers or to any of the Services, including through hacking, password mining or any other means, or exploit bugs or vulnerabilities in the Pixel8 Solution. You are prohibited from violating or attempting to violate any security features of the Pixel8 Solution, including, without limitation, (a) accessing Content not intended for you, or logging onto a server or account that you are not authorized to access; (b) attempting to probe, scan, or test the vulnerability of the Pixel8 Solution, or any associated system or network, or to breach security or authentication measures without proper authorization; (c) interfering or attempting to interfere with Services to any Pixel8 User, user, host, or network, including, without limitation, by means of submitting a virus to the Site or Service, overloading, “flooding,” “spamming,” “mail bombing,” or “crashing”; (d) sending unsolicited email or messages, including, without limitation, promotions, or advertisements for products or services; (e) publishing or linking to malicious Content intended to damage or disrupt another Pixel8 User’s browser or computer or to compromise a Pixel8 User’s privacy or anonymity; (f) forging any TCP/IP packet header or any part of the header information in any email or in any posting; (g) accessing or tampering with non-public areas of the Site or Service, our computer systems, or the technical delivery systems of our providers; (h) accessing or searching or attempting to access or search the Pixel8 Solution by any means (automated or otherwise) other than through the currently available, published interfaces that are provided by us (and only pursuant to these Terms), unless you have been specifically allowed to do so in a separate agreement with us; (i) deep-linking to the Site for any purpose (ie, posting a link to a Site web page other than the home page) except as otherwise expressly permitted by us on the Site; or (j) removing or obscuring any form of advertising or messaging displayed via the Pixel8 Solution.
                      </p>
                      <p id="4.2" style={styles.sectionP}>
                        4.2 <span style={styles.subSectionTitle}>No Harvesting or Crawling.</span> You will not engage in harvesting or other collection of information about other Pixel8 Users, including email addresses, without our prior and each such Pixel8 User's prior written consent. You agree not to "crawl" the Pixel8 Solution or use or launch any automated system, including without limitation, "robots", "spiders", etc. that accesses the Pixel8 Solution or pulls Content therefrom (other than those used by public search engine providers for the sole purpose of creating publicly available searchable indices), except as otherwise enabled or permitted by us.
                      </p>
                      <p id="4.3" style={styles.sectionP}>
                        4.3 <span style={styles.subSectionTitle}>No Framing.</span> You may not obtain or attempt to obtain any materials or information through any means not intentionally made available through the Services or the Site. Without limiting the generality of the foregoing, you will not publish, distribute or transmit to the general public via any medium, whether via print, online, or otherwise, the Services, except through the Site or as otherwise authorized by these Terms or by us, you will not engage in “framing,” “mirroring,” or otherwise simulating the appearance or function of the Pixel8 Solution, and you will not send messages purporting to be from us. You will not remove or attempt to obscure any copyright, trademark or other proprietary rights notices contained in or on the Site or associated with the Services, including ours and our licensors.
                      </p>
                      <p id="4.4" style={styles.sectionP}>
                        4.4 <span style={styles.subSectionTitle}>Account Data.</span> While we will endeavor to back up Site and Service data and make such data available in the event of loss or deletion, we have no responsibility or liability for the deletion or failure to store any Content. You acknowledge and agree that your Content shall not be retrievable or accessible except via your authorized use of the Services and that we are under no obligation to compile and return to you your Content, including if Services terminate for any reason or if you elect to deactivate your account.
                      </p>
                      <p id="4.5" style={styles.sectionP}>
                        4.5 <span style={styles.subSectionTitle}> Notifications to Us.</span> If you believe that you are entitled or obligated to act contrary to these Terms under any mandatory or applicable law, you agree to provide us with detailed and substantiated explanation of your reasons in writing at least thirty days before you so act, to allow us to assess whether we may, at our sole discretion, provide an alternative remedy for the situation, though we are under no obligation to do so.
                      </p>
                      <p id="4.6" style={styles.sectionP}>
                        4.6 <span style={styles.subSectionTitle}>Notifications to You.</span> For purposes of service messages and notices about the Services to you, we may place a banner notice across Site pages to alert you to certain changes such as modifications to these Terms. Alternatively, notice may consist of an email from us to an email address associated with your account, even if we have other contact information. You also agree that we may communicate with you in relation to your account and otherwise in relation to these Terms through your account or through other contact information you have provided to us, including email, mobile number, telephone, or delivery services including the postal service. You agree that all agreements, notices, disclosures and other communications that we provide to you electronically satisfy any legal requirement that such communications be in writing.
                      </p>
                      <p id="4.7" style={styles.sectionP}>
                        4.7 <span style={styles.subSectionTitle}>Network Security Risks.</span> Because no online system is perfectly secure or reliable, the internet is an inherently insecure medium, and the reliability of hosting services, internet intermediaries, your internet service provider, and other service providers cannot be assured, you accept security risks associated with or arising from your use of the Pixel8 Solution, and the responsibility for choosing to use a technology that does not provide perfect security or reliability.
                      </p>
                      <p id="4.8" style={styles.sectionP}>
                        4.8	<span style={styles.subSectionTitle}>Analyticals.</span> Customer acknowledges the collection, storage, generation, processing, and use by or for us of anonymized or non-personally identifying data (including Metadata, testing, analytical, diagnostic and technical data, predictive analytics models, AI, machine learning, and usage statistics) concerning or arising from use of, or generated by, the Pixel8 Solution, in whole or in part, including without limitation: (a) in order to provide the functionality of, improve, and maintain the Pixel8 Solution, (b) for processing transactions and payments, (c) for solution development, and (d) for verifying compliance.
                      </p>
                    </div>
                  </>
                }
                {section.indexOf('5.') > -1 &&
                  <>
                    <div id="5.0" style={styles.sectionHeading}>Disclaimer of Warranties, Limitations of Liability and Indemnification</div>
                    <div style={styles.section}>
                      <p id="5.1" style={styles.sectionP}>
                        5.1 <span style={styles.subSectionTitle}>Disclaimer.</span> EACH PIXEL8 USER'S USE OF THE PIXEL8 SOLUTION AND CONTENT IS AT HIS OR HER SOLE RISK. THE PIXEL8 SOLUTION AND CONTENT IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS AND WE ASSUME NO RESPONSIBILITY FOR THE ACCURACY, CURRENCY, TIMELINESS, DELETION, MIS-DELIVERY OR FAILURE TO STORE OR DISPLAY ANY CONTENT, PIXEL8 USER COMMUNICATIONS, PERSONALIZATION SETTINGS, OR OTHER INFORMATION OR DATA. EACH PIXEL8 USER IS SOLELY RESPONSIBLE FOR ANY DAMAGE TO HIS OR HER COMPUTER SYSTEM AND WE WILL HAVE NO LIABILITY FOR ANY LOSS OF PROFIT, OPPORTUNITY, REVENUE, ADVANTAGE, INFORMATION OR DATA THAT RESULTS FROM USE OF THE PIXEL8 SOLUTION OR CONTENT. TO THE MAXIMUM EXTENT POSSIBLE UNDER APPLICABLE LAW, <span style={styles.subSectionTitle}>WE EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.</span> Specifically, we make no warranty that (a) the Pixel8 Solution or Content will meet your requirements, goals or needs, (b) Pixel8 Solution or Content access will be uninterrupted, timely, secure or error-free, or (c) any errors or deficiencies in the Pixel8 Solution or Content will be corrected. Further, scheduled and preventive maintenance, required and emergency maintenance work, or disruption of services from internet service and hosting providers, may interrupt the functioning of or access to the Pixel8 Solution.
                      </p>
                      <p id="5.2" style={styles.sectionP}>
                        5.2 <span style={styles.subSectionTitle}>Liability Limitation.</span> EXCLUDING ONLY DAMAGES ARISING OUT OF OUR LIABILITY FOR OUR FRAUD, DEATH OR PERSONAL INJURY CAUSED BY OUR NEGLIGENCE, OR ANY OTHER LOSS FOR WHICH WE CANNOT LAWFULLY EXCLUDE LIABILITY, WE WILL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF REVENUE, PROFITS, GOODWILL, USE, DATA OR OTHER INTANGIBLE LOSSES (EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES), RESULTING FROM THE USE OF OR INABILITY TO USE THE PIXEL8 SOLUTION AND ANY CONTENT; THE COST OF PROCUREMENT OF SUBSTITUTE SERVICES; UNAUTHORIZED DISPLAY, ACCESS TO OR DELETION OR ALTERATION OF CONTENT, INFORMATION OR DATA; STATEMENTS OR CONDUCT OF ANY THIRD PARTY; OR ANY OTHER MATTER RELATING TO US, THE CONTENT OR THE PIXEL8 SOLUTION. EXCLUDING ONLY OUR LIABILITY FOR OUR FRAUD, DEATH OR PERSONAL INJURY CAUSED BY OUR NEGLIGENCE, OR ANY OTHER LOSS FOR WHICH WE CANNOT LAWFULLY LIMIT LIABILITY, ANY LIABILITY TO YOU OR ANY THIRD PARTY IN ANY CIRCUMSTANCE IS LIMITED IN THE AGGREGATE TO THE GREATER OF $10 OR ALL AMOUNTS PAID BY YOU TO US DURING THE TWELVE-MONTH PERIOD PRECEDING THE OCCURRENCE OF THE CLAIM OR INCIDENT. The foregoing limitations and exclusions apply to the maximum extent permitted by applicable law.
                      </p>
                      <p id="5.3" style={styles.sectionP}>
                        5.3 <span style={styles.subSectionTitle}>Indemnification.</span> You agree to defend, indemnify, release and hold harmless us, our suppliers, and all officers, directors, employees, consultants, agents, and representatives of any of the foregoing (collectively "Protected Parties") in full from and against any and all claims (including third party claims), losses, liability, damages, and/or costs of every kind and nature, known and unknown, suspected and unsuspected, disclosed and undisclosed, arising out of or in any way connected with: (a) your unauthorized access to or use of, the Pixel8 Solution or Content, (b) your breach of these Terms, (c) your use of Content or conduct engendered thereby, and any activities you conduct on or through the Pixel8 Solution, or (d) your infringement, or infringement by any other user of your account, of any intellectual property rights or other rights of any person or entity. Further, in the event you have a dispute with one or more Pixel8 Users, you hereby release the Protected Parties from claims, demands and damages (actual, direct and consequential) of every kind and nature, known and unknown, suspected and unsuspected, disclosed and undisclosed, foreseeable and unforeseeable, arising out of or in any way connected with such disputes.
                        <br/><br/>
                        FOR CALIFORNIA, USA RESIDENTS: You further agree that these Terms waive and release any claims that would otherwise be preserved by operation of section 1542 of the California Civil Code, which provides: “A general release does not extend to claims that the creditor or releasing party does not know or suspect to exist in his or her favor at the time of executing the release and that, if known by him or her, would have materially affected his or her settlement with the debtor or released party." You understand that you are releasing us from all claims, whether known or unknown to you, and whether or not you suspect that those claims may exist at this time.
                      </p>
                    </div>
                  </>
                }
                {section.indexOf('6.') > -1 &&
                  <>
                    <div id="6.0" style={styles.sectionHeading}>General Provisions</div>
                    <div style={styles.section}>
                      <p id="6.1" style={styles.sectionP}>
                        6.1 <span style={styles.subSectionTitle}>Force Majeure.</span> Except for obligations to pay money hereunder, no delay, failure or omission by either party to carry out or observe any of its obligations hereunder will give rise to any claim against such party or be deemed to be a breach of this Agreement if and for as long as such failure or omission arises from any cause beyond the reasonable control of that party.
                      </p>
                      <p id="6.2" style={styles.sectionP}>
                        6.2 <span style={styles.subSectionTitle}>Service Discontinuance/Modification.</span> We may from time to time modify or discontinue access to, temporarily or permanently, the Pixel8 Solution (or any part, feature, or functionality thereof, as well as internal rules of operation, eligibility, visibility to or accessibility of the public, and other aspects). We will not be liable for any such modification, suspension or discontinuance, even if certain features or functions, your settings, and/or any Content are permanently lost.
                      </p>
                      <p id="6.3" style={styles.sectionP}>
                        6.3 <span style={styles.subSectionTitle}>Account Termination.</span> We may terminate your or any other Pixel8 User’s account for cause, including without limitation for: (a) violation of these Terms; (b) abuse of Pixel8 resources or any attempt to gain unauthorized entry to the Pixel8 Solution; (c) use of the Pixel8 Solution in a manner inconsistent with its purpose; (d) such Pixel8 User's request for such termination; or (e) requirements of or for failure to comply with applicable law, regulation, court or governing agency order, or ethical requirements. We may in addition terminate the availability of the Pixel8 Solution for our own business reasons, including if we elect to cease being in the business of providing it. Our termination of any Pixel8 User's access to the Pixel8 Solution may be without notice and, on such termination, we may immediately deactivate or delete any Pixel8 User's account and Content, and/or bar any further access. We will not be liable for any termination of Pixel8 User's access. After account termination, you will not attempt to register a new account without our permission.
                      </p>
                      <p id="6.4" style={styles.sectionP}>
                        6.4 <span style={styles.subSectionTitle}>US Government Restricted Rights.</span> Services are provided with "RESTRICTED RIGHTS." Use, duplication, or disclosure by the U.S. Government is subject to restrictions as set forth in applicable laws and regulations. Use of the Pixel8 Solution and related materials by the U.S. Government constitutes acknowledgment of our proprietary rights.
                      </p>
                      <p id="6.5" style={styles.sectionP}>
                        6.5 <span style={styles.subSectionTitle}>Trademarks.</span> You are granted no right, title or license to any third party trademarks by these Terms, or to any of our trademarks or servicemarks. We reserve all right, title and interest in and to our trademarks, servicemarks, trade names, trade dress, domain names, and similar identifiers, including without limitation Pixel8TM.
                      </p>
                      <p id="6.6" style={styles.sectionP}>
                        6.6 <span style={styles.subSectionTitle}>US DMCA.</span> If you believe that your work has been copied and is accessible via the Pixel8 Solution in a way that constitutes copyright infringement in the United States, you may notify us by providing our copyright agent with the following in writing: (a) identification of the copyrighted work that you claim has been infringed; (b) identification of the material that is claimed to be infringing and information reasonably sufficient to permit us to locate the material; (c) your name, address, telephone number, and email address; (d) a statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law; and (e) a statement, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright owner or are authorized to act on the copyright owner's behalf. The above writing must be electronically or physically signed by you. If we receive such a claim, we may refuse or delete Content, or terminate a Pixel8 User's account in accordance with these Terms. Our designated agent to receive notification of claimed infringement under the Digital Millennium Copyright Act of 1998 (Pixel8 DMCA Agent, available via <a href="mailto: sean.gorman@pixel8.earth" target="_blank" rel="noopener noreferrer">sean.gorman@pixel8.earth</a>. In addition to forwarding your notice to the person who provided the allegedly illegal Content, we may send a copy of your notice (with your personal information removed) to Lumen (<a href="https://lumendatabase.org/" target="_blank" rel="noopener noreferrer">https://lumendatabase.org/</a>) for publication and/or annotation. We reserve the right to remove Content alleged to be infringing or otherwise illegal without prior notice and at our sole discretion. In appropriate circumstances, we will also terminate a Pixel8 User account if the Member is determined to be a repeat infringer.
                        <br/><br/>
                        If you believe that a notice of infringement has been improperly submitted against you, you may submit a counter-notice, electronically or physically signed by you, and containing the following:
                        f) identification of the material that has been removed or to which access has been disabled and the location at which the material appeared before it was removed or access to it was disabled;
                        g) your name, address, and telephone number;
                        h) a statement, made under penalty of perjury, that you have a good faith belief that the removal of the material was a mistake or misidentified, or that your use of the material is fair; and
                        i) a statement that you consent to the jurisdiction of Federal District Court (1) in the judicial district where your address is located if the address is in the United States, or (2) for the US District of Colorado, if your address is located outside the United States, and that you will accept service of process from the complainant submitting the infringement notice or his/her authorized agent.
                      </p>
                      <p id="6.7" style={styles.sectionP}>
                        6.7 <span style={styles.subSectionTitle}>Governing Law.</span> These Terms, the Pixel8 Solution, Content, and any disputes related to or concerning any of the foregoing (including tort as well as contract claims, and whether pre-contractual or extra-contractual), will be governed by and settled in accordance with the laws of Delaware, notwithstanding the choice of laws rules of any jurisdiction to the contrary. You agree that regardless of any statute or law to the contrary, any claim or cause of action arising out of or related to these Terms, the Pixel8 Solution, or Content, must be filed within one year after such claim or cause of action arose, or be forever barred.
                      </p>
                      <p id="6.8" style={styles.sectionP}>
                        6.8 <span style={styles.subSectionTitle}>Dispute Resolution.</span> Any disputes between or claims brought by you or us arising out of or related to these Terms, the Pixel8 Solution, or Content (including tort as well as contract claims, and whether pre-contractual or extra-contractual, as well as the arbitrability of any disputes) will be referred to and finally settled by binding arbitration before the JAMS (<a href="https://jamsadr.com" target="_blank" rel="noopener noreferrer">jamsadr.com</a>) in accordance with JAMS streamlined rules and procedures (available at <a href="https://www.jamsadr.com/rules-streamlined-arbitration/" target="_blank" rel="noopener noreferrer">https://www.jamsadr.com/rules-streamlined-arbitration/</a>) in effect at the time of arbitration except as inconsistent with this section. The arbitration will be conducted by telephone, on-line and/or based solely upon written submissions where no in-person appearance is required. If in-person appearance is required, such hearings will be held in Denver, Colorado unless another location is mutually agreed upon by the parties. In all such cases, the arbitration will be administered by JAMS in accordance with their applicable rules. The arbitrator will apply the law specified in section 6.7 above. All awards may if necessary be enforced by any court having jurisdiction. The existence of any dispute, the existence or details of the arbitration proceeding, and all related documents, materials, evidence, judgments and awards therein, will be kept confidential. Except as required by law, no party will make any public announcements with respect to the proceeding or the award, except as required to enforce same. The parties hereby waive the right to a trial by jury and agree to only bring claims in an individual capacity and not as a plaintiff or class member in any purported class or representative proceeding. Notwithstanding the foregoing, nothing in this section will preclude the right and ability to file and maintain at any time an action for recovery of injunctive or provisional relief in any court of competent jurisdiction under the laws applicable thereto. All claims (excluding requests for injunctive or equitable relief) between the parties must be resolved using arbitration in accordance with this section. Should either party file an action contrary to this section, the other party may recover lawyers' fees and costs, provided that the party seeking the award has notified the other party in writing of the improperly filed claim, and the other party has failed to withdraw the claim in timely fashion.
                      </p>
                      <p id="6.9" style={styles.sectionP}>
                        6.9 <span style={styles.subSectionTitle}>Assignment.</span> These Terms will not be assigned, delegated, or transferred by you, in whole or in part, whether voluntary, involuntary, by merger, consolidation, dissolution, sale of assets, or otherwise, without our prior written consent. Any such purported assignment, delegation or transfer without such written consent will be void. We may at any time assign these Terms without prior consent or notice. These Terms will be binding on, and inure to the benefit of, the parties and their respective and permitted successors and assigns.
                      </p>
                      <p id="6.10" style={styles.sectionP}>
                        6.10 <span style={styles.subSectionTitle}>Injunctive Relief.</span> You acknowledge and agree that breach of these Terms, or any unauthorized use, disclosure or distribution of the Pixel8 Solution or Content, may cause irreparable harm to us, the extent of which would be difficult to ascertain, and that we will be entitled to seek immediate injunctive relief (in addition to any other available remedies), in any court of competent jurisdiction under the applicable laws thereto.
                      </p>
                      <p id="6.11" style={styles.sectionP}>
                        6.11 <span style={styles.subSectionTitle}>Delaware-Based.</span> Your use of the Pixel8 Solution will not be construed as our purposefully availing ourselves of the benefits or privileges of doing business in any other country, state or jurisdiction other than Delaware.
                      </p>
                      <p id="6.12" style={styles.sectionP}>
                        6.12 <span style={styles.subSectionTitle}>General.</span> The Terms constitute the entire agreement between us and govern each Pixel8 User's use of the Pixel8 Solution, superseding any prior agreements. Each Pixel8 User may be subject to additional terms and conditions that may apply in the use of affiliate services, third party content or third party software. If any provision of the Terms is found by a court of competent jurisdiction to be invalid, the parties nevertheless agree that the court should endeavor to give effect to the parties' intentions as reflected in the provision, and the other provisions of the Terms remain in full force and effect. No waiver of any provision of these Terms will be deemed a further waiver or continuing waiver or such provision or any other provision, and our failure to assert any right or provision under these Terms will not constitute a waiver of such right or provision. Nothing herein will be deemed to create an agency, partnership, joint venture, employee-employer or franchisor-franchisee relationship of any kind between us and any user or other person or entity, nor do these terms extend rights to any third party. The parties hereto confirm that they have requested that these Terms and all attachments and related documents, if any, be drafted in English.
                      </p>
                      <p>End of Terms</p>
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
  }
};

export default Terms;
