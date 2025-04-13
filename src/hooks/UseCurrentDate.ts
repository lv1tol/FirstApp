import { useState, useEffect } from 'react';

const useCurrentDate = (): string => {
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const formatDate = (date: Date): string => {
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      const day = date.getDate();
      let daySuffix = 'th';
      if (day === 1 || day === 21 || day === 31) daySuffix = 'st';
      else if (day === 2 || day === 22) daySuffix = 'nd';
      else if (day === 3 || day === 23) daySuffix = 'rd';
      let formatted = new Intl.DateTimeFormat('en-GB', options).format(date);
      formatted = formatted.replace(day.toString(), `${day}${daySuffix}`);
      return formatted;
    };

    setCurrentDate(formatDate(new Date()));
  }, []);

  return currentDate;
};

export default useCurrentDate;