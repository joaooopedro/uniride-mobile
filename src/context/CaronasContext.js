import React, { createContext, useContext, useState } from 'react';

const CaronasContext = createContext({});

export function CaronasProvider({ children }) {
  const [usuarioLogado] = useState({
    nome: 'João Pedro Silva',
    curso: 'Ciência da Computação',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    matricula: '202301842',
  });

  return (
    <CaronasContext.Provider value={{ usuarioLogado }}>
      {children}
    </CaronasContext.Provider>
  );
}

export function useCaronas() {
  return useContext(CaronasContext);
}
