'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, X } from 'lucide-react';
import FundingRequestForm from './FundingRequestForm';

interface CreateFundingButtonProps {
  userId: string;
  userName: string;
  userRole: 'INVESTOR' | 'STARTUP';
  variant?: 'primary' | 'secondary' | 'icon';
  className?: string;
}

/**
 * Reusable button to initiate a funding agreement
 * Can be used in profiles, posts, messages, etc.
 */
export function CreateFundingButton({
  userId,
  userName,
  userRole,
  variant = 'primary',
  className = '',
}: CreateFundingButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors ${className}`}
          title={`Create funding agreement with ${userName}`}
        >
          <DollarSign className="w-5 h-5" />
        </button>

        {showModal && (
          <FundingModal
            userId={userId}
            userName={userName}
            userRole={userRole}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }

  if (variant === 'secondary') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`flex items-center gap-2 px-4 py-2 text-green-600 bg-white border border-green-600 rounded-lg hover:bg-green-50 transition-colors ${className}`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Create Funding Agreement</span>
        </button>

        {showModal && (
          <FundingModal
            userId={userId}
            userName={userName}
            userRole={userRole}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ${className}`}
      >
        <DollarSign className="w-4 h-4" />
        <span>Create Funding Agreement</span>
      </button>

      {showModal && (
        <FundingModal
          userId={userId}
          userName={userName}
          userRole={userRole}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

interface FundingModalProps {
  userId: string;
  userName: string;
  userRole: 'INVESTOR' | 'STARTUP';
  onClose: () => void;
}

function FundingModal({ userId, userName, userRole, onClose }: FundingModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Create Funding Agreement</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <FundingRequestForm
            counterpartyId={userId}
            counterpartyName={userName}
            counterpartyRole={userRole}
          />
        </div>
      </div>
    </div>
  );
}
