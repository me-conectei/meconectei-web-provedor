import axios from 'axios';
import { createCommandService, APIMethods } from 'services';

/**
 * Busca lista de estados do IBGE
 * @returns {Promise<Array>} - Lista de estados
 */
export const fetchStates = async () => {
  try {
    const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar estados:', error);
    throw error;
  }
};

/**
 * Busca lista de cidades de um estado específico
 * @param {string} stateId - ID do estado
 * @returns {Promise<Array>} - Lista de cidades
 */
export const fetchCities = async (stateId) => {
  try {
    const response = await axios.get(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateId}/municipios`
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
    throw error;
  }
};

/**
 * Cria uma nova região
 * @param {Object} regionData - Dados da região (name, city, state)
 * @returns {Promise<Object>} - Resposta da API
 */
export const createRegion = async (regionData) => {
  const body = {
    name: regionData.name,
    city: regionData.city,
    state: regionData.state,
  };

  return new Promise((resolve, reject) => {
    createCommandService({
      method: APIMethods.POST,
      payload: body,
      url: '/regions',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`
      },
      onSuccess: ({ data }) => {
        if (data.success) {
          resolve(data);
        } else {
          reject(new Error(data.errorMessage || 'Erro ao criar região'));
        }
      },
      onCustomError: (error) => {
        console.error('Erro na requisição de criação de região:', error);
        reject(new Error('Erro interno do servidor. Tente novamente.'));
      },
    });
  });
};

/**
 * Cria coordenadas para uma região
 * @param {string} regionId - ID da região
 * @param {Array} coordinates - Array de coordenadas
 * @returns {Promise<Object>} - Resposta da API
 */
export const createRegionCoordinates = async (regionId, coordinates) => {
  const body = {
    coords: coordinates
  };

  return new Promise((resolve, reject) => {
    createCommandService({
      method: APIMethods.POST,
      payload: body,
      url: `/regions/coords/${regionId}`,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`
      },
      onSuccess: ({ data }) => {
        if (data.success) {
          resolve(data);
        } else {
          reject(new Error(data.errorMessage || 'Erro ao criar coordenadas'));
        }
      },
      onCustomError: (error) => {
        console.error('Erro na requisição de coordenadas:', error);
        reject(new Error('Erro interno do servidor. Tente novamente.'));
      },
    });
  });
};

/**
 * Processa erros da API e retorna mensagens amigáveis
 * @param {Object} errorData - Dados do erro da API
 * @returns {Array} - Array de mensagens de erro
 */
export const processApiError = (errorData) => {
  const errors = [];
  
  if (errorData.camps && Object.keys(errorData.camps).length > 0) {
    Object.entries(errorData.camps).forEach(([field, error]) => {
      const fieldName = getFieldDisplayName(field);
      errors.push(`${fieldName}: ${error.message}`);
    });
  } else if (errorData.errorMessage) {
    errors.push(errorData.errorMessage);
  } else {
    errors.push('Erro desconhecido. Tente novamente.');
  }
  
  return errors;
};

/**
 * Mapeia nomes de campos para exibição em português
 * @param {string} field - Nome do campo
 * @returns {string} - Nome em português para exibição
 */
const getFieldDisplayName = (field) => {
  const fieldNames = {
    name: 'Nome',
    city: 'Cidade',
    state: 'Estado',
    coords: 'Coordenadas'
  };
  return fieldNames[field] || field;
};
