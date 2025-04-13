import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { submissionService } from '../services/api';

function SubmissionForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);
  const [touchedFields, setTouchedFields] = useState({});

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxSize: 10485760, // 10MB
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
      setError(null);
    },
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0]?.message || 'File upload failed';
      setError(`Upload error: ${error}`);
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const getFieldError = (fieldName) => {
    if (!touchedFields[fieldName]) return null;
    
    switch (fieldName) {
      case 'title':
        return !formData.title.trim() ? 'Title is required' : null;
      case 'author':
        return !formData.author.trim() ? 'Author is required' : null;
      case 'description':
        return !formData.description.trim() ? 'Description is required' : null;
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form
      if (!formData.title.trim() || !formData.author.trim() || !formData.description.trim()) {
        throw new Error('Please fill in all required fields');
      }

      if (files.length === 0) {
        throw new Error('Please attach at least one file');
      }

      // Submit to API using the submission service
      const response = await submissionService.createSubmission(formData, files);
      
      // Clear form on success
      setFormData({ title: '', author: '', description: '' });
      setFiles([]);
      
      // Show success message
      const message = document.createElement('div');
      message.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg';
      message.textContent = 'Submission successful!';
      document.body.appendChild(message);
      
      // Remove message after 3 seconds
      setTimeout(() => {
        document.body.removeChild(message);
      }, 3000);

      // Navigate to submissions page
      navigate('/submissions');
      
    } catch (err) {
      setError(err.message || 'Failed to submit the form. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup preview URLs on unmount
  React.useEffect(() => {
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onBlur={() => setTouchedFields(prev => ({ ...prev, title: true }))}
            className={`w-full border rounded p-2 transition-colors ${
              getFieldError('title')
                ? 'border-red-500 bg-red-50'
                : touchedFields.title && formData.title.trim()
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300'
            }`}
            required
          />
          {getFieldError('title') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('title')}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Author <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            onBlur={() => setTouchedFields(prev => ({ ...prev, author: true }))}
            className={`w-full border rounded p-2 transition-colors ${
              getFieldError('author')
                ? 'border-red-500 bg-red-50'
                : touchedFields.author && formData.author.trim()
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300'
            }`}
            required
          />
          {getFieldError('author') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('author')}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            onBlur={() => setTouchedFields(prev => ({ ...prev, description: true }))}
            className={`w-full border rounded p-2 transition-colors ${
              getFieldError('description')
                ? 'border-red-500 bg-red-50'
                : touchedFields.description && formData.description.trim()
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300'
            }`}
            rows="4"
            required
          />
          {getFieldError('description') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('description')}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700">Files</label>
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed p-6 text-center cursor-pointer transition-colors
              ${files.length ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400'}`}
          >
            <input {...getInputProps()} />
            <p>Drag and drop your files here, or click to select files</p>
            <p className="text-sm text-gray-500 mt-1">Supported formats: PDF, JPEG, PNG (max 10MB)</p>
          </div>
          
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map(file => (
                <div key={file.name} className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end mt-6">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`
              flex items-center px-6 py-2 rounded text-white
              ${isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
              }
            `}
          >
            {isSubmitting && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isSubmitting ? 'Submitting...' : 'Submit Article'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SubmissionForm;
