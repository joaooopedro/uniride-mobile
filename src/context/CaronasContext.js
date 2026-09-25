import React, { createContext, useContext, useState } from 'react';

const CaronasContext = createContext({});

export function CaronasProvider({ children }) {
  const [usuarioLogado] = useState({
    nome: 'João Pedro Silva',
    curso: 'Ciência da Computação',
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
