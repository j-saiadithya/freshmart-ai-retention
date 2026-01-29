import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = 'default',
  hover = true,
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };
  
  const hoverClass = hover ? 'hover:shadow-xl hover:border-emerald-200 transform hover:-translate-y-0.5' : '';
  
  return (
    <div 
      className={`bg-white rounded-2xl shadow-lg border-2 border-gray-100 transition-all duration-300 ${hoverClass} ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;