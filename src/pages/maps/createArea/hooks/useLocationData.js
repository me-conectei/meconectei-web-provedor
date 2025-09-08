import { useState, useEffect, useCallback } from 'react';
import { fetchStates, fetchCities } from '../services/areaService';

/**
 * Hook customizado para gerenciar dados de localização (estados e cidades)
 * @returns {Object} - Estado e funções de localização
 */
export const useLocationData = () => {
  const [uf, setUf] = useState([]);
  const [city, setCity] = useState([]);
  const [position, setPosition] = useState({ lat: 0, lng: 0 });

  /**
   * Busca lista de estados do IBGE
   */
  const loadStates = useCallback(async () => {
    try {
      const states = await fetchStates();
      setUf(states);
    } catch (error) {
      console.error('Erro ao carregar estados:', error);
    }
  }, []);

  /**
   * Busca lista de cidades de um estado específico
   */
  const loadCities = useCallback(async (stateId) => {
    if (!stateId) return;
    
    try {
      const cities = await fetchCities(stateId);
      setCity(cities);
    } catch (error) {
      console.error('Erro ao carregar cidades:', error);
    }
  }, []);

  /**
   * Obtém localização atual do usuário
   */
  const getCurrentLocation = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log('Localização obtida:', pos);
          setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (error) => {
          console.error('Erro ao obter localização:', error.message);
        }
      );
    } else {
      console.warn('Geolocalização não suportada pelo navegador');
    }
  }, []);

  /**
   * Carrega dados iniciais
   */
  useEffect(() => {
    loadStates();
    getCurrentLocation();
  }, [loadStates, getCurrentLocation]);

  return {
    // Estado
    uf,
    city,
    position,
    setPosition,
    
    // Funções
    loadStates,
    loadCities
  };
};
