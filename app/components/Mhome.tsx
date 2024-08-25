"use client";
import React, { useState } from 'react';
import { IoCloudUploadOutline } from "react-icons/io5";

export default function Homee() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file)); // Set image preview
  };

  const handleDetect = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    const res = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setResult(data.label);
    setConfidence(data.confidence); // Set confidence from the response
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-1">
      <header className="w-full max-w-5xl mx-auto px-1 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <h1 className="text-4xl text-gray-700 font-Oswald font-semibold">
            Deepfake<span className="text-blue-500">Detector</span>
          </h1>
          <nav>
            <a href="/" className="text-gray-700 font-Oswald font-semibold hover:text-blue-400">Home</a>
          </nav>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center flex-1 w-full px-20 text-center">
        <h2 className="text-4xl font-Oswald font-semibold mb-4 text-gray-700">
          Protect Yourself from the danger of deepfakes
        </h2>
        <p className="text-lg font-Oswald font-semibold mb-6 text-gray-700">
          We offer an AI tool that can identify if an audio or video is a deepfake or not with 88% model accuracy.
        </p>

        <div className="w-full max-w-md">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <IoCloudUploadOutline size={50} />
            </div>
            <input
              type="file"
              className="block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              accept="image/*"
              onChange={handleFileChange}
            />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Uploaded preview"
                  className="w-full h-auto max-w-xs mx-auto rounded-lg"
                />
              </div>
            )}
            <button
              onClick={handleDetect}
              className="mt-4 px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Detect Now
            </button>

            {result && (
              <div className="mt-4 text-lg">
                <p>The image is classified as: <strong>{result}</strong></p>
                {confidence !== null && (
                  <p>Confidence: <strong>{confidence.toFixed(2)}%</strong></p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-6">
            <div className="text-xl font-semibold text-blue-500">Step 1</div>
            <div className="text-gray-700">Get the image file to classify as Real or Fake</div>
          </div>
          <div className="p-6">
            <div className="text-xl font-semibold text-blue-500">Step 2</div>
            <div className="text-gray-700">Upload your image file</div>
          </div>
          <div className="p-6">
            <div className="text-xl font-semibold text-blue-500">Step 3</div>
            <div className="text-gray-700">Get the results</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
