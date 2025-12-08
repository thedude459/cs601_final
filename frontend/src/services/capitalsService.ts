export interface Capital {
  id: number;
  capital: string;
  state: string;
}

const capitalsData: Capital[] = [
  { id: 1, capital: 'Augusta', state: 'Maine' },
  { id: 2, capital: 'Concord', state: 'New Hampshire' },
  { id: 3, capital: 'Montpelier', state: 'Vermont' },
  { id: 4, capital: 'Boston', state: 'Massachusetts' },
  { id: 5, capital: 'Providence', state: 'Rhode Island' },
  { id: 6, capital: 'Hartford', state: 'Connecticut' },
];

export const getCapitals = async (): Promise<Capital[]> => {
  // Return a copy of the data
  return Promise.resolve([...capitalsData]);
};
