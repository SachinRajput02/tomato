import React,{useEffect} from "react";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <div className="privacy-policy">
      <div className="privacy-container">
        <h1 className="privacy-title">Privacy Policy</h1>
        <p className="privacy-date">Effective Date: August 4, 2025</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to Food-Del! We value your privacy and are committed to protecting your personal information.
            This Privacy Policy explains how we collect, use, and share information about you when you use our services.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul>
            <li>Personal details (name, email, phone number, address)</li>
            <li>Order and payment information</li>
            <li>Location data (with your permission)</li>
            <li>Device and browser information</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and improve our food delivery services</li>
            <li>Process your orders and payments</li>
            <li>Communicate with you about your orders</li>
            <li>Send updates, promotions, and support</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Security</h2>
          <p>
            We use industry-standard security measures (encryption, firewalls) to protect your personal data.
            However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access, update, or delete your data</li>
            <li>Withdraw consent at any time</li>
            <li>Request information about how your data is used</li>
          </ul>
        </section>

        <section>
          <h2>6. Contact Us</h2>
          <p>
            If you have questions or concerns about this policy, contact us at:
            <br />
            <strong>Email:</strong> support@food-del.com
            <br />
            <strong>Phone:</strong> +91-12345-67890
          </p>
        </section>
        <section>
          <h2>7. Limitation of Liability</h2>
          <p>
            this platform right now created for the project purpose only, not for commercial use.
            so please add all the demo data only.and we are not responsible for any misuse of this platform.
            <br />
            
          </p>
        </section>

        <p className="privacy-footer">
          By using our service, you agree to the terms of this Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
