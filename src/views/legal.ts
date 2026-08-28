import { contact } from '../content';
import { pageShell } from './layout';

const EFFECTIVE_DATE = 'August 28, 2026';

export function renderTermsPage(): string {
  const body = `
    <a class="back-link" href="/">&larr; Back to Skylar Technology LLC</a>
    <section class="legal">
      <h1>Terms of Service</h1>
      <p class="updated">Effective ${EFFECTIVE_DATE}</p>

      <h2>1. Agreement to Terms</h2>
      <p>These Terms of Service ("Terms") govern your use of the website located at
      www.skylar.technology (the "Site"), operated by Skylar Technology LLC, a limited
      liability company registered in the State of Texas ("Skylar Technology," "we," "us,"
      or "our"). By accessing or using the Site, you agree to be bound by these Terms. If
      you do not agree, please do not use the Site.</p>

      <h2>2. Informational Purpose</h2>
      <p>The Site is provided to describe the consulting services offered by Skylar
      Technology LLC and to facilitate contact with us. Nothing on the Site constitutes an
      offer capable of acceptance, a binding proposal, or professional advice. Any actual
      engagement for services is governed exclusively by a separate signed agreement
      between Skylar Technology LLC and the client.</p>

      <h2>3. Intellectual Property</h2>
      <p>All content on the Site, including text, graphics, logos, and images, is the
      property of Skylar Technology LLC or its licensors and is protected by applicable
      intellectual property laws. You may view and share content from the Site for personal,
      non-commercial purposes, but may not reproduce, modify, or distribute it for
      commercial purposes without our prior written consent.</p>

      <h2>4. Acceptable Use</h2>
      <p>You agree not to use the Site in any way that could damage, disable, or impair it,
      or interfere with any other party's use of the Site, including attempting to gain
      unauthorized access to any systems or networks connected to the Site.</p>

      <h2>5. No Warranty</h2>
      <p>The Site is provided "as is" and "as available" without warranties of any kind,
      whether express or implied, including but not limited to implied warranties of
      merchantability, fitness for a particular purpose, and non-infringement. We do not
      warrant that the Site will be uninterrupted, error-free, or free of harmful
      components.</p>

      <h2>6. Limitation of Liability</h2>
      <p>To the fullest extent permitted by law, Skylar Technology LLC shall not be liable
      for any indirect, incidental, special, consequential, or punitive damages, or any
      loss of profits or revenues, arising out of or related to your use of the Site.</p>

      <h2>7. External Links</h2>
      <p>The Site may contain links to third-party websites, such as LinkedIn and GitHub.
      We are not responsible for the content, accuracy, or practices of any linked
      third-party sites.</p>

      <h2>8. Governing Law</h2>
      <p>These Terms are governed by the laws of the State of Texas, without regard to its
      conflict of laws principles. Any disputes arising under these Terms shall be subject
      to the exclusive jurisdiction of the state and federal courts located in Texas.</p>

      <h2>9. Changes to These Terms</h2>
      <p>We may update these Terms from time to time. The "Effective" date above reflects
      the date of the most recent revision. Continued use of the Site after changes take
      effect constitutes acceptance of the revised Terms.</p>

      <h2>10. Contact</h2>
      <p>Questions about these Terms may be sent to
      <a class="contact-email" href="mailto:${contact.email}">${contact.email}</a>.</p>
    </section>`;

  return pageShell('Terms of Service — Skylar Technology LLC', body);
}

export function renderPrivacyPage(): string {
  const body = `
    <a class="back-link" href="/">&larr; Back to Skylar Technology LLC</a>
    <section class="legal">
      <h1>Privacy Policy</h1>
      <p class="updated">Effective ${EFFECTIVE_DATE}</p>

      <h2>1. Overview</h2>
      <p>This Privacy Policy explains how Skylar Technology LLC ("Skylar Technology," "we,"
      "us," or "our") handles information in connection with your use of
      www.skylar.technology (the "Site"). This is an informational website; it does not
      have user accounts, does not use cookies, and does not run analytics or advertising
      trackers.</p>

      <h2>2. Information We Collect</h2>
      <p>We do not require you to submit any personal information to browse the Site. If
      you choose to contact us by email, we receive whatever information you include in
      that message, such as your name, email address, and the contents of your message.</p>
      <p>Our hosting infrastructure and network providers may automatically log standard
      technical information for security and operational purposes, such as IP address,
      browser type, and request timestamps. We do not use this data to identify individual
      visitors or to build browsing profiles.</p>

      <h2>3. How We Use Information</h2>
      <ul>
        <li>To respond to inquiries you send us by email.</li>
        <li>To operate, secure, and maintain the Site.</li>
        <li>To comply with legal obligations, if applicable.</li>
      </ul>
      <p>We do not sell, rent, or share your personal information with third parties for
      their own marketing purposes.</p>

      <h2>4. Cookies and Tracking</h2>
      <p>The Site does not set cookies and does not use third-party analytics, advertising,
      or tracking technologies.</p>

      <h2>5. Third-Party Links</h2>
      <p>The Site links to third-party services such as LinkedIn and GitHub. Those sites
      have their own privacy policies, and we encourage you to review them; we are not
      responsible for their privacy practices.</p>

      <h2>6. Data Retention</h2>
      <p>Emails you send us are retained only as long as reasonably necessary to respond to
      your inquiry and to maintain our business records.</p>

      <h2>7. Your Rights</h2>
      <p>Depending on your jurisdiction, you may have rights to access, correct, or request
      deletion of personal information you have sent us. To make such a request, contact us
      using the details below.</p>

      <h2>8. Children's Privacy</h2>
      <p>The Site is not directed to children under 13, and we do not knowingly collect
      personal information from children.</p>

      <h2>9. Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. The "Effective" date above
      reflects the date of the most recent revision.</p>

      <h2>10. Contact</h2>
      <p>Questions about this Privacy Policy may be sent to
      <a class="contact-email" href="mailto:${contact.email}">${contact.email}</a>.</p>
    </section>`;

  return pageShell('Privacy Policy — Skylar Technology LLC', body);
}
