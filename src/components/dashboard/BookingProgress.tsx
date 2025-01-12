import React from 'react';
import { Check, Clock } from 'lucide-react';

const BookingProgress = ({ status }) => {
  const steps = [
    { key: 'request_pending', label: 'Pending' },
    { key: 'counselor_assigned', label: 'Counselor Assigned' },
    { key: 'time_selected', label: 'Time Selected' },
    { key: 'confirmed', label: 'Confirmed' },
  ];

  // Get current step index
  const getCurrentStepIndex = () => {
    if (status === 'cancelled' || status === 'abandoned') return -1;
    return steps.findIndex(step => step.key === status);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="w-full py-4">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.key}>
            {/* Step Circle */}
            <div className="flex flex-col items-center relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                  ${index <= currentStepIndex 
                    ? 'border-blue-500 bg-blue-50 text-blue-500' 
                    : 'border-gray-300 bg-gray-50 text-gray-500'}`}
              >
                {index < currentStepIndex ? (
                  <Check className="w-5 h-5" />
                ) : index === currentStepIndex ? (
                  <Clock className="w-5 h-5 animate-pulse" />
                ) : (
                  <span className="text-sm">{index + 1}</span>
                )}
              </div>
              
              {/* Step Label */}
              <div className="absolute w-max -bottom-6 text-xs font-medium text-center 
                transform -translate-x-1/2 left-1/2
                ${index <= currentStepIndex ? 'text-blue-500' : 'text-gray-500'}">
                {step.label}
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4">
                <div
                  className={`h-full ${
                    index < currentStepIndex
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Special States */}
      {(status === 'cancelled' || status === 'abandoned') && (
        <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-600 text-center font-medium">
            {status === 'cancelled' ? 'Booking Cancelled' : 'Booking Abandoned'}
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingProgress;