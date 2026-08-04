import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useEffect, useRef, useState } from 'react';

import SearchInput from '../Elements/Input/search';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const entityToModel = {
  glossaries: 'business-glossary',
  data_sources: 'data-source',
  users: 'users',
  data_dictionaries: 'data-catalog',
  service_catalogs: 'catalog',
  notification_templates: 'notification-template',
  notification_flows: 'notification-flow',
  departments: 'administration/departments',
  data_classifications: 'classification',
};

const SearchWithPopover = ({ size = 'small', filters = [] }) => {
  const [search, setSearch] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // const { data: searchResults } = useGetGlobalSearchQuery({ search, filters });

  const inputRef = useRef(null);
  const navigate = useNavigate();
  const popoverRef = useRef(null);
  const { t, i18n } = useTranslation();
  const handleFocusOutside = event => {
    // Check if the click is outside of the popover
    if (popoverRef.current && !popoverRef.current.contains(event.target)) {
      setIsTyping(false);
      setSearch('');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleFocusOutside);
    document.addEventListener('touchstart', handleFocusOutside);

    return () => {
      document.removeEventListener('mousedown', handleFocusOutside);
      document.removeEventListener('touchstart', handleFocusOutside);
    };
  }, []);


  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setIsTyping(Boolean(search)); // Trigger search only after debounce delay
    }, 300); // 300ms delay
  
    return () => clearTimeout(debounceTimer); // Cleanup the timer
  }, [search]);

  // Ensure inputRef is always focused when Popover is open
  useEffect(() => {
    if (isTyping && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTyping]);

  // Handle case where no results are found
  useEffect(() => {
    if (isTyping && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTyping]);

  // const handleNavigation = result => {
  //   if (entityToModel[result.table_name]) {
  //     navigate(`/${entityToModel[result.table_name]}/${result.id}`);
  //   }
  // };

  const highlightMatch = (text, query) => {
    if (!query) return text; // No query, return original text
  
    try {
      // Escape special characters in the query to prevent RegExp errors
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedQuery})`, 'gi'); // Case-insensitive match
  
      // Split the text based on the query and wrap matches in a span
      const parts = text.split(regex);
      return parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={index} className="text-[#2563eb] font-bold">
            {part}
          </span>
        ) : (
          part
        )
      );
    } catch (error) {
      console.error('Error in highlightMatch:', error);
      return text; // Fallback to original text on error
    }
  };


  return (
    <Popover open={isTyping}>
      <PopoverTrigger asChild>
        <div className={`${size === 'small' ? 'w-[253px]' : 'w-[443px]'}`}>
          <SearchInput
            search={search}
            ref={inputRef}
            setSearch={setSearch}
            placeholder={t('search')}
          />
        </div>
      </PopoverTrigger>
      {search !== '' && (
        <PopoverContent
          ref={popoverRef}
          align="start"
          sideOffset={4}
          className={` h-full p-0 ${
            size === 'small' ? 'w-[404px]' : 'w-[563px]'
          }`}
        >
        </PopoverContent>
      )}
    </Popover>
  );
};

export default SearchWithPopover;
