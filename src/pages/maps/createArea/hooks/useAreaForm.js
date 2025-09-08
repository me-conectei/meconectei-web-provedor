import { useState, useCallback } from 'react';
import { createRegion, createRegionCoordinates, processApiError } from '../services/areaService';
import { processImportedData, generateAreaName } from '../utils/areaUtils';
import toast from 'utils/toast';

/**
 * Hook customizado para gerenciar o formulário de criação de área
 * @returns {Object} - Estado e funções do formulário
 */
export const useAreaForm = () => {
  const [region, setRegion] = useState('');
  const [state, setState] = useState('');
  const [cityValue, setCityValue] = useState('');
  const [status, setStatus] = useState('');
  const [coords, setCoords] = useState([]);
  const [importedData, setImportedData] = useState([]);
  const [mapBounds, setMapBounds] = useState(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  /**
   * Processa dados importados e atualiza o formulário
   */
  const handleDataParsed = useCallback(async (data) => {
    setImportedData(data);
    toast.success(`Arquivo processado com sucesso! ${data.length} arquivo(s) importado(s).`);
    
    // Define status como ativo e nome padrão
    setStatus('ativo');
    setRegion('Area de Atuacao');
    
    if (data.length > 0) {
      setIsDetectingLocation(true);
      try {
        const { city, state: detectedState, bounds } = await processImportedData(data);
        
        if (bounds) {
          setMapBounds(bounds);
        }
        
        if (city || detectedState) {
          setCityValue(city);
          setState(detectedState);
          setRegion(generateAreaName(city, detectedState));
          
          if (city && detectedState) {
            toast.success(`📍 Localização detectada: ${city}, ${detectedState}`);
          } else if (city) {
            toast.success(`📍 Cidade detectada: ${city}`);
          } else if (detectedState) {
            toast.success(`📍 Estado detectado: ${detectedState}`);
          }
        }
      } catch (error) {
        console.error('Erro ao processar dados importados:', error);
        toast.error('Erro ao detectar localização das coordenadas');
      } finally {
        setIsDetectingLocation(false);
      }
    }
  }, []);

  /**
   * Limpa dados importados e reseta campos
   */
  const clearImportedData = useCallback(() => {
    setImportedData([]);
    setMapBounds(null);
    setCityValue('');
    setState('');
    setRegion('');
    setStatus('');
    toast.info('Dados importados removidos e campos limpos');
  }, []);

  /**
   * Valida campos obrigatórios
   */
  const validateForm = useCallback(() => {
    const errors = [];
    
    if (!region.trim()) {
      errors.push('O campo Nome é obrigatório');
    }
    
    if (!cityValue.trim()) {
      errors.push('O campo Cidade é obrigatório');
    }
    
    if (!state.trim()) {
      errors.push('O campo Estado é obrigatório');
    }
    
    return errors;
  }, [region, cityValue, state]);

  /**
   * Cria a região e suas coordenadas
   */
  const saveRegion = useCallback(async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    try {
      const regionData = await createRegion({
        name: region,
        city: cityValue,
        state: state
      });
      
      if (coords.length > 0) {
        await createRegionCoordinates(regionData.idRegion, coords);
      }
      
      toast.success('Registro salvo com sucesso!');
      return regionData;
    } catch (error) {
      if (error.message.includes(':')) {
        // Erro com campos específicos
        const errors = processApiError({ camps: { [error.message.split(':')[0].toLowerCase()]: { message: error.message.split(':')[1].trim() } } });
        errors.forEach(err => toast.error(err));
      } else {
        toast.error(error.message);
      }
      throw error;
    }
  }, [region, cityValue, state, coords, validateForm]);

  return {
    // Estado
    region,
    setRegion,
    state,
    setState,
    cityValue,
    setCityValue,
    status,
    setStatus,
    coords,
    setCoords,
    importedData,
    mapBounds,
    isDetectingLocation,
    
    // Funções
    handleDataParsed,
    clearImportedData,
    validateForm,
    saveRegion
  };
};
