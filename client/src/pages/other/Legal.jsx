import React from 'react';
import Navbar from '../../components/layout/Navbar';

const Legal = () => {
  const Section = ({ title, children }) => (
    <div className="mb-10">
      <h2 className="text-xl font-black text-slate-900 mb-4 border-b-2 border-slate-100 pb-2 flex items-center gap-2">
        {title}
      </h2>
      <div className="text-slate-600 leading-relaxed whitespace-pre-line text-sm md:text-base space-y-3">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar title={"Legal & Policies"} />

      <div className="max-w-4xl mx-auto p-8 my-10 bg-white shadow-sm rounded-3xl border border-slate-100">
        
        <Section title="Privacy Policy">
          <p><strong>1. Data Collection:</strong> We collect personal information including your name, email address, shop name, and phone number to provide account management services. We also automatically collect device identifiers and app usage patterns for analytics and service improvement.</p>
          
          <p><strong>2. Data Usage:</strong> Your data is used strictly for app functionality, account management, and providing technical support. We do not sell your personal information to third parties.</p>
          
          <p><strong>3. Data Sharing:</strong> We only share data with essential service providers, such as Razorpay for payment processing and cloud hosting services. These partners are legally bound to protect your data.</p>
          
          <p><strong>4. Security:</strong> We use industry-standard encryption (HTTPS) to protect your data during transmission and at rest on our secure servers.</p>
          
          <p><strong>5. User Rights:</strong> You have the right to access, correct, or request the permanent deletion of your data at any time through the app settings.</p>
        </Section>

        <Section title="Terms & Conditions">
          <p>1. <strong>Service Use:</strong> Billing Habit is a SaaS tool for business record-keeping. Users are responsible for the accuracy of all data entered.</p>
          <p>2. <strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and 4-digit security PIN.</p>
          <p>3. <strong>Prohibited Use:</strong> Users may not use the platform for any illegal transactions or to violate intellectual property rights.</p>
          <p>4. <strong>Subscription:</strong> Fees are transparently disclosed. We reserve the right to modify pricing with 30-day prior notice to active subscribers.</p>
        </Section>

        <Section title="Refund & Cancellation Policy">
          <p>1. <strong>Cancellations:</strong> You may cancel your subscription at any time. Your access will remain active until the end of the current billing cycle.</p>
          <p>2. <strong>Refunds:</strong> We offer a 7-day money-back guarantee for technical failures. Beyond this period, refunds are evaluated on a case-by-case basis.</p>
          <p>3. <strong>Processing:</strong> Approved refunds are processed via Razorpay within 5-7 working days back to the original payment source.</p>
        </Section>

        <Section title="Contact & Data Officer">
          <p>For privacy inquiries or to exercise your data rights, contact our support team:</p>
          <p><strong>Entity:</strong> Billing Habit Solutions</p>
          <p><strong>Email:</strong> billinghabit@gmail.com</p>
          <p><strong>Address:</strong> Jabalpur, MP India - 482001</p>
        </Section>

        <div className="text-center text-slate-400 text-xs mt-12 pt-8 border-t border-slate-50">
          Last Updated: December 22, 2025
        </div>
      </div>
    </div>
  );
};

export default Legal;