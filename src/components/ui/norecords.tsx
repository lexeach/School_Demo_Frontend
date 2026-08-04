import React from 'react';
import noRecordsImg from '../../assets/table-no-data.png';

interface NoRecordsProps {
  altText?: string;
  message?: string;
  height?: string; // Optional height for customization
}

const NoRecords: React.FC<NoRecordsProps> = ({
  altText = 'No records available',
  message = 'No records available',
  height = 'h-64',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${height}`}>
      <img className="h-10 mb-2" src={noRecordsImg} alt={altText} />
      <span className="text-gray-500">{message}</span>
    </div>
  );
};

export default NoRecords;
