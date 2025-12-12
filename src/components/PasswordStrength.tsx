
import React from 'react';

interface PasswordStrengthProps {
  password?: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password = '' }) => {
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length > 7) strength++;
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength++;
    if (password.match(/([0-9])/)) strength++;
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength++;
    return strength;
  };

  const strength = getPasswordStrength(password);

  const strengthColors = [
    'bg-slate-500',
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
  ];

  return (
    <div className="flex items-center space-x-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className={`h-2 w-1/4 rounded-full transition-colors duration-300 ${strength > index ? strengthColors[strength] : strengthColors[0]}`}>
        </div>
      ))}
    </div>
  );
};
