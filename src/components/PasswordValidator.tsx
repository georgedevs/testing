import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface ValidationState {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

interface Requirement {
  key: keyof ValidationState;
  label: string;
}

interface PasswordValidatorProps {
  password: string;
  className?: string;
}

const PasswordValidator = ({ password, className = '' }: PasswordValidatorProps) => {
  const [validations, setValidations] = useState<ValidationState>({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  });

  const [strength, setStrength] = useState(0);

  useEffect(() => {
    const newValidations: ValidationState = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    setValidations(newValidations);

    // Calculate strength
    const strengthScore = Object.values(newValidations).filter(Boolean).length;
    setStrength(strengthScore);
  }, [password]);

  const getStrengthColor = (): string => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const requirements: Requirement[] = [
    { key: 'minLength', label: 'Minimum 8 characters' },
    { key: 'hasUppercase', label: 'One uppercase letter' },
    { key: 'hasLowercase', label: 'One lowercase letter' },
    { key: 'hasNumber', label: 'One number' },
    { key: 'hasSpecial', label: 'One special character' },
  ];

  // Only render the component if password has at least one character
  if (!password) {
    return null;
  }

  return (
    <div className={`mt-2 ${className}`}>
      {/* Password Strength Bar */}
      <div className="h-1.5 w-full bg-gray-200 rounded-full mb-3">
        <div 
          className={`h-full rounded-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: `${(strength / 5) * 100}%` }}
        />
      </div>
      
      {/* Strength Label */}
      <div className="text-sm mb-2">
        <span className="font-medium">Password Strength: </span>
        <span className={strength <= 2 ? 'text-red-500' : strength <= 4 ? 'text-yellow-500' : 'text-green-500'}>
          {strength <= 2 ? 'Weak' : strength <= 4 ? 'Medium' : 'Strong'}
        </span>
      </div>

      {/* Requirements List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {requirements.map(({ key, label }) => (
          <div 
            key={key}
            className="flex items-center space-x-2 text-sm"
          >
            {validations[key] ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <X className="w-4 h-4 text-red-500" />
            )}
            <span className={validations[key] ? 'text-green-500' : 'text-gray-500'}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordValidator;