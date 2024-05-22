'use client';

import { TableContextType } from '@/lib/definitions';
import { useState, createContext } from 'react';

// create context
const TableContext = createContext<TableContextType | null>(null);

// context provider
const TableProvider = ({ children }: { children: React.ReactNode }) => {
  const [search, setSearch] = useState<string>('fantasy');
  const [records, setRecords] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  return (
    <TableContext.Provider
      value={{ search, setSearch, records, setRecords, page, setPage }}
    >
      {children}
    </TableContext.Provider>
  );
};

export { TableContext, TableProvider };
