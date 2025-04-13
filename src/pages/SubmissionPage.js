import React from 'react';
import SubmissionForm from '../components/SubmissionForm';

function SubmissionPage() {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Submit Your Article</h1>
          <p className="text-gray-600">
            Please fill out the form below to submit your article for review. Make sure to include all required information and any supporting files.
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-8">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Submission Guidelines</h2>
          <ul className="list-disc list-inside text-blue-700 space-y-2">
            <li>Articles should be original and unpublished work</li>
            <li>Supported file formats: PDF for articles, JPEG/PNG for images</li>
            <li>Maximum file size: 10MB per file</li>
            <li>Include a clear and concise description of your article</li>
          </ul>
        </div>

        <SubmissionForm />

        <div className="mt-8 text-sm text-gray-500">
          <p>
            By submitting your article, you agree to our terms and conditions regarding content publication and distribution.
            Our editorial team will review your submission and respond within 5 business days.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SubmissionPage;
