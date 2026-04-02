// src/features/patient/profile/DeleteAccountModal.tsx
import React, { useState } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [confirmText, setConfirmText] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState<'confirm' | 'reason' | 'feedback'>('confirm');
  const [deleteReason, setDeleteReason] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');

  if (!isOpen) return null;

  const handleConfirmDelete = () => {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }
    setError('');
    setStep('reason');
  };

  const handleReasonSubmit = () => {
    if (!deleteReason) {
      setError('Please select a reason');
      return;
    }
    setError('');
    setStep('feedback');
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');

    try {
      // API call will go here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Send reason and feedback to backend
      console.log('Delete reason:', deleteReason);
      console.log('Feedback:', feedback);
      
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setConfirmText('');
    setError('');
    setStep('confirm');
    setDeleteReason('');
    setFeedback('');
    onClose();
  };

  const reasons = [
    { value: 'privacy', label: 'Privacy concerns' },
    { value: 'not_useful', label: 'Service not useful' },
    { value: 'too_expensive', label: 'Too expensive' },
    { value: 'technical_issues', label: 'Technical issues' },
    { value: 'found_alternative', label: 'Found alternative service' },
    { value: 'no_longer_need', label: 'No longer need' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Delete Account</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'confirm' && (
            <>
              <div className="mb-6">
                <p className="text-gray-700 mb-2">
                  This action <span className="font-semibold text-red-600">cannot be undone</span>. 
                  This will permanently delete your:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mt-3">
                  <li>Personal information and medical history</li>
                  <li>Appointment history and prescriptions</li>
                  <li>All uploaded documents and reports</li>
                  <li>Account access and associated data</li>
                </ul>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="font-mono font-bold text-red-600">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  autoFocus
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>

              <button
                onClick={handleConfirmDelete}
                disabled={confirmText !== 'DELETE'}
                className={`
                  w-full py-2.5 rounded-lg font-medium transition-all
                  ${confirmText === 'DELETE'
                    ? 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                Continue
              </button>
            </>
          )}

          {step === 'reason' && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please tell us why you're leaving
                </label>
                <div className="space-y-2">
                  {reasons.map((reason) => (
                    <label
                      key={reason.value}
                      className={`
                        flex items-center p-3 border rounded-lg cursor-pointer transition-all
                        ${deleteReason === reason.value
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="deleteReason"
                        value={reason.value}
                        checked={deleteReason === reason.value}
                        onChange={(e) => setDeleteReason(e.target.value)}
                        className="w-4 h-4 text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-3 text-gray-700">{reason.label}</span>
                    </label>
                  ))}
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('confirm')}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleReasonSubmit}
                  disabled={!deleteReason}
                  className={`
                    flex-1 py-2.5 rounded-lg font-medium transition-all
                    ${deleteReason
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {step === 'feedback' && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Any additional feedback? (Optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Help us improve by sharing your thoughts..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('reason')}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isDeleting}
                >
                  Back
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </span>
                  ) : (
                    'Permanently Delete'
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            This action is irreversible. All your data will be permanently removed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;