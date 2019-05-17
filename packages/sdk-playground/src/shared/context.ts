import { createContext } from 'react';
import { IContextProps } from './interfaces';

export const context = createContext<IContextProps>(null);
