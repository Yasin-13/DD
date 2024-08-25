import React, { useState } from 'react';

export default function PredictPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [predictionResult, setPredictionResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      setError('Please select a file before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);
    setError(null);
    setPredictionResult(null);
    setConfidence(null);

    try {
      const res = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to get prediction from the server.');
      }

      const data = await res.json();
      setPredictionResult(data.label);
      setConfidence(parseFloat(data.confidence)); // Assuming confidence is returned as a string percentage (e.g., "85.76%")
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Deepfake Detection</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
          disabled={!selectedFile || loading}
        >
          {loading ? 'Processing...' : 'Detect Now'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {predictionResult && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <p className="text-lg">
            Prediction Result: <strong>{predictionResult}</strong>
          </p>
          {confidence !== null && (
            <>
              <p className="text-lg text-black mt-2">Confidence: {confidence.toFixed(2)}%</p>
              <div className="relative pt-1">
                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-blue-200">
                  <div
                    style={{ width: `${confidence}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  ></div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
