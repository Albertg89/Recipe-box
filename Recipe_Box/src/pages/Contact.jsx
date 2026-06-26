import PageShell from '../components/PageShell.jsx'
import './Contact.css'

export default function Contact() {
  return (
    <PageShell>
      <div className="contact-body">
        <div className="contact-intro">
          <h2 className="contact-heading">We'd love to hear from you.</h2>
          <p className="contact-subtext">
            Have a question, a suggestion, or just want to say hello? We're always happy to
            hear from our community. Reach out through any of the channels below and we'll
            get back to you as soon as we can.
          </p>
        </div>

        <div className="contact-details">
          <h3 className="contact-details-label">Contact us:</h3>
          <ul className="contact-list">
            <li className="contact-item">
              <span className="contact-icon">✉️</span>
              <div>
                <span className="contact-type">Email</span>
                <a href="mailto:support@recipebox.com" className="contact-value">
                  support@recipebox.com
                </a>
              </div>
            </li>
            <li className="contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <span className="contact-type">Phone</span>
                <a href="tel:5555555555" className="contact-value">555-555-5555</a>
              </div>
            </li>
            <li className="contact-item">
              <span className="contact-icon">💼</span>
              <div>
                <span className="contact-type">GitHub</span>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-value"
                >
                  github.com/recipebox
                </a>
              </div>
            </li>
            <li className="contact-item">
              <span className="contact-icon">🔗</span>
              <div>
                <span className="contact-type">LinkedIn</span>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-value"
                >
                  linkedin.com/in/recipebox
                </a>
              </div>
            </li>
            <li className="contact-item">
              <span className="contact-icon">📸</span>
              <div>
                <span className="contact-type">Instagram</span>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-value"
                >
                  @recipebox
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </PageShell>
  )
}
