/**
 * Example Identity Verification Form Component
 */

'use client';

import { useState, useEffect } from 'react';
import { useSubmitVerification } from '@/client/hooks/useVerification';

export function IdentityVerificationForm({
  onSuccess,
  initialData,
}: {
  onSuccess?: () => void;
  initialData?: any;
}) {
  const { submit, submitting, error } = useSubmitVerification();

  const [formData, setFormData] = useState({
    documentType: initialData?.documentType || '',
    documentNumber: initialData?.documentNumber || '',
    documentUrls: initialData?.documentUrls?.length > 0 ? initialData.documentUrls : [''],
    facePhotoUrl: initialData?.facePhotoUrl || '',
  });

  const [initialFormData] = useState({
    documentType: initialData?.documentType || '',
    documentNumber: initialData?.documentNumber || '',
    documentUrls: initialData?.documentUrls?.length > 0 ? initialData.documentUrls : [''],
    facePhotoUrl: initialData?.facePhotoUrl || '',
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(initialFormData);
    setHasChanges(changed);
  }, [formData, initialFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await submit({
        type: 'IDENTITY',
        metadata: {
          ...formData,
          documentUrls: formData.documentUrls.filter((url: string) => url.trim() !== ''),
        },
      });

      alert('Identity verification submitted successfully!');
      onSuccess?.();
    } catch (err) {
      // Error is already set in the hook
      console.error('Failed to submit verification:', err);
    }
  };

  const addDocumentUrl = () => {
    setFormData((prev) => ({
      ...prev,
      documentUrls: [...prev.documentUrls, ''],
    }));
  };

  const updateDocumentUrl = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      documentUrls: prev.documentUrls.map((url: string, i: number) => (i === index ? value : url)),
    }));
  };

  const removeDocumentUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documentUrls: prev.documentUrls.filter((_: string, i: number) => i !== index),
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Identity Verification</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Document Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Document Type *</label>
          <select
            value={formData.documentType}
            onChange={(e) => setFormData((prev) => ({ ...prev, documentType: e.target.value }))}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select document type</option>
            <option value="passport">Passport</option>
            <option value="citizenship_card">CitizenShip Card</option>
            <option value="drivers_license">Driver's License</option>
            <option value="national_id">National ID</option>
          </select>
        </div>

        {/* Document Number */}
        <div>
          <label className="block text-sm font-medium mb-2">Document Number *</label>
          <input
            type="text"
            value={formData.documentNumber}
            onChange={(e) => setFormData((prev) => ({ ...prev, documentNumber: e.target.value }))}
            required
            placeholder="Enter document number"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Document URLs */}
        <div>
          <label className="block text-sm font-medium mb-2">Document URLs *</label>
          <div className="space-y-2">
            {formData.documentUrls.map((url: string, index: number) => (
              <div key={index} className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => updateDocumentUrl(index, e.target.value)}
                  placeholder="https://example.com/document.pdf"
                  className="flex-1 border rounded px-3 py-2"
                  required
                />
                {formData.documentUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDocumentUrl(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addDocumentUrl}
            className="mt-2 text-sm text-green-600 hover:text-green-700"
          >
            + Add another document
          </button>
          <p className="text-xs text-gray-600 mt-1">
            Upload your documents to a secure storage service and paste the URLs here
          </p>
        </div>

        {/* Face Photo URL */}
        <div>
          <label className="block text-sm font-medium mb-2">Face Photo URL (Optional)</label>
          <input
            type="url"
            value={formData.facePhotoUrl}
            onChange={(e) => setFormData((prev) => ({ ...prev, facePhotoUrl: e.target.value }))}
            placeholder="https://example.com/face-photo.jpg"
            className="w-full border rounded px-3 py-2"
          />
          <p className="text-xs text-gray-600 mt-1">
            A clear photo of your face for identity verification
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || (initialData && !hasChanges)}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : initialData ? 'Update & Resubmit' : 'Submit Verification'}
        </button>
        {initialData && !hasChanges && (
          <p className="text-sm text-amber-600 text-center">
            Please make changes before resubmitting
          </p>
        )}
      </form>

      <div className="mt-6 bg-green-50 border border-green-200 rounded p-4">
        <h3 className="font-semibold text-sm mb-2">Important Notes:</h3>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>Ensure all documents are clear and legible</li>
          <li>Documents must be valid and not expired</li>
          <li>Your application will be reviewed by our admin team</li>
          <li>You'll be notified once the review is complete</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Example Role Verification Form for Investors
 */
export function InvestorRoleVerificationForm({
  onSuccess,
  initialData,
}: {
  onSuccess?: () => void;
  initialData?: any;
}) {
  const { submit, submitting, error } = useSubmitVerification();

  const [formData, setFormData] = useState({
    proofType: initialData?.proofType || '',
    proofUrls: initialData?.proofUrls?.length > 0 ? initialData.proofUrls : [''],
    accreditationNumber: initialData?.accreditationNumber || '',
    fundAmount: initialData?.fundAmount?.toString() || '',
  });

  const [initialFormData] = useState({
    proofType: initialData?.proofType || '',
    proofUrls: initialData?.proofUrls?.length > 0 ? initialData.proofUrls : [''],
    accreditationNumber: initialData?.accreditationNumber || '',
    fundAmount: initialData?.fundAmount?.toString() || '',
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(initialFormData);
    setHasChanges(changed);
  }, [formData, initialFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await submit({
        type: 'ROLE',
        metadata: {
          proofType: formData.proofType,
          proofUrls: formData.proofUrls.filter((url: string) => url.trim() !== ''),
          accreditationNumber: formData.accreditationNumber || undefined,
          fundAmount: formData.fundAmount ? parseFloat(formData.fundAmount) : undefined,
        },
      });

      alert('Role verification submitted successfully!');
      onSuccess?.();
    } catch (err) {
      console.error('Failed to submit verification:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Investor Role Verification</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Proof Type *</label>
          <select
            value={formData.proofType}
            onChange={(e) => setFormData((prev) => ({ ...prev, proofType: e.target.value }))}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select proof type</option>
            <option value="proof_of_funds">Proof of Funds</option>
            <option value="accreditation">Accreditation Certificate</option>
            <option value="portfolio">Investment Portfolio</option>
            <option value="tax_documents">Tax Documents</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Proof Document URLs *</label>
          {formData.proofUrls.map((url: string, index: number) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  const newUrls = [...formData.proofUrls];
                  newUrls[index] = e.target.value;
                  setFormData((prev) => ({ ...prev, proofUrls: newUrls }));
                }}
                placeholder="https://example.com/proof.pdf"
                className="flex-1 border rounded px-3 py-2"
                required
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Accreditation Number (Optional)</label>
          <input
            type="text"
            value={formData.accreditationNumber}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, accreditationNumber: e.target.value }))
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Fund Amount (Optional)</label>
          <input
            type="number"
            value={formData.fundAmount}
            onChange={(e) => setFormData((prev) => ({ ...prev, fundAmount: e.target.value }))}
            placeholder="Enter amount in INR"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || (initialData && !hasChanges)}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400"
        >
          {submitting ? 'Submitting...' : initialData ? 'Update & Resubmit' : 'Submit Verification'}
        </button>
        {initialData && !hasChanges && (
          <p className="text-sm text-amber-600 text-center">
            Please make changes before resubmitting
          </p>
        )}
      </form>
    </div>
  );
}

/**
 * Example Role Verification Form for Startups
 */
export function StartupRoleVerificationForm({
  onSuccess,
  initialData,
}: {
  onSuccess?: () => void;
  initialData?: any;
}) {
  const { submit, submitting, error } = useSubmitVerification();

  const [formData, setFormData] = useState({
    proofType: initialData?.proofType || '',
    proofUrls: initialData?.proofUrls?.length > 0 ? initialData.proofUrls : [''],
    incorporationNumber: initialData?.incorporationNumber || '',
    incorporationDate: initialData?.incorporationDate || '',
    gstNumber: initialData?.gstNumber || '',
  });

  const [initialFormData] = useState({
    proofType: initialData?.proofType || '',
    proofUrls: initialData?.proofUrls?.length > 0 ? initialData.proofUrls : [''],
    incorporationNumber: initialData?.incorporationNumber || '',
    incorporationDate: initialData?.incorporationDate || '',
    gstNumber: initialData?.gstNumber || '',
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(initialFormData);
    setHasChanges(changed);
  }, [formData, initialFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await submit({
        type: 'ROLE',
        metadata: {
          proofType: formData.proofType,
          proofUrls: formData.proofUrls.filter((url: string) => url.trim() !== ''),
          incorporationNumber: formData.incorporationNumber || undefined,
          incorporationDate: formData.incorporationDate || undefined,
          gstNumber: formData.gstNumber || undefined,
        },
      });

      alert('Role verification submitted successfully!');
      onSuccess?.();
    } catch (err) {
      console.error('Failed to submit verification:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Startup Role Verification</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Proof Type *</label>
          <select
            value={formData.proofType}
            onChange={(e) => setFormData((prev) => ({ ...prev, proofType: e.target.value }))}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select proof type</option>
            <option value="incorporation_certificate">Incorporation Certificate</option>
            <option value="business_registration">Business Registration</option>
            <option value="pitch_deck">Pitch Deck</option>
            <option value="gst_certificate">GST Certificate</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Proof Document URLs *</label>
          {formData.proofUrls.map((url: string, index: number) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  const newUrls = [...formData.proofUrls];
                  newUrls[index] = e.target.value;
                  setFormData((prev) => ({ ...prev, proofUrls: newUrls }));
                }}
                placeholder="https://example.com/proof.pdf"
                className="flex-1 border rounded px-3 py-2"
                required
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Incorporation Number (Optional)</label>
          <input
            type="text"
            value={formData.incorporationNumber}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, incorporationNumber: e.target.value }))
            }
            placeholder="e.g., U12345AB2024PTC123456"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Incorporation Date (Optional)</label>
          <input
            type="date"
            value={formData.incorporationDate}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, incorporationDate: e.target.value }))
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">GST Number (Optional)</label>
          <input
            type="text"
            value={formData.gstNumber}
            onChange={(e) => setFormData((prev) => ({ ...prev, gstNumber: e.target.value }))}
            placeholder="e.g., 29ABCDE1234F1Z5"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || (initialData && !hasChanges)}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting
            ? 'Submitting...'
            : initialData
              ? 'Update & Resubmit'
              : 'Submit Role Verification'}
        </button>
        {initialData && !hasChanges && (
          <p className="text-sm text-amber-600 text-center">
            Please make changes before resubmitting
          </p>
        )}
      </form>
    </div>
  );
}
