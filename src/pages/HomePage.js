import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function HomePage() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to Newspaper Submissions
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Our platform makes it easy to submit your articles and track their status throughout the publication process.
        </p>
        {user ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-800 mb-3">Submit Articles</h2>
              <p className="text-blue-700 mb-4">
                Submit your articles with supporting images. Our editorial team will review your submission and provide feedback.
              </p>
              <Link
                to="/submit"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Start Submission
              </Link>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-green-800 mb-3">My Submissions</h2>
              <p className="text-green-700 mb-4">
                View and track the status of your submissions. Communicate with editors and receive updates.
              </p>
              <Link
                to="/submissions"
                className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                View Submissions
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-800 mb-3">Get Started</h2>
              <p className="text-blue-700 mb-4">
                Create an account to start submitting your articles and tracking their progress through the publication process.
              </p>
              <Link
                to="/register"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Sign Up Now
              </Link>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-green-800 mb-3">Already Registered?</h2>
              <p className="text-green-700 mb-4">
                Sign in to your account to continue working on your submissions and track their status.
              </p>
              <Link
                to="/login"
                className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="text-xl font-bold text-blue-600 mb-2">1. Prepare</div>
            <p className="text-gray-600">
              Write your article and gather any supporting images or documents.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-xl font-bold text-blue-600 mb-2">2. Submit</div>
            <p className="text-gray-600">
              Use our easy submission form to upload your work and provide details.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-xl font-bold text-blue-600 mb-2">3. Track</div>
            <p className="text-gray-600">
              Monitor the status of your submission through our dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
