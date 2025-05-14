export const categoryMap = {
    convenience: 'コンビニ',
    drugstore: 'ドラッグストア',
    mart: 'スーパー',
  } as const;
  
  export type CategoryKey = keyof typeof categoryMap;
  export type CategoryLabel = (typeof categoryMap)[CategoryKey];
  