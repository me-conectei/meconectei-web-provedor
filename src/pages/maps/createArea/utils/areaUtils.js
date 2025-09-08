import axios from 'axios';
import { baseURL } from 'api';

/**
 * Calcula o centro geométrico de uma lista de features GeoJSON
 * @param {Array} features - Array de features GeoJSON
 * @returns {Object|null} - Objeto com lat e lng do centro, ou null se não conseguir calcular
 */
export const calculateCenterOfFeatures = (features) => {
  if (!features || features.length === 0) return null;

  let totalLat = 0;
  let totalLng = 0;
  let pointCount = 0;

  features.forEach(feature => {
    if (feature.geometry && feature.geometry.coordinates) {
      const coordinates = feature.geometry.coordinates;
      
      if (feature.geometry.type === 'Point') {
        const [lng, lat] = coordinates;
        totalLat += lat;
        totalLng += lng;
        pointCount++;
      } else if (feature.geometry.type === 'LineString') {
        coordinates.forEach(([lng, lat]) => {
          totalLat += lat;
          totalLng += lng;
          pointCount++;
        });
      } else if (feature.geometry.type === 'Polygon') {
        coordinates[0].forEach(([lng, lat]) => {
          totalLat += lat;
          totalLng += lng;
          pointCount++;
        });
      } else if (feature.geometry.type === 'MultiPolygon') {
        coordinates.forEach(polygon => {
          polygon[0].forEach(([lng, lat]) => {
            totalLat += lat;
            totalLng += lng;
            pointCount++;
          });
        });
      }
    }
  });

  if (pointCount === 0) return null;

  return {
    lat: totalLat / pointCount,
    lng: totalLng / pointCount
  };
};

/**
 * Calcula os bounds (limites geográficos) de uma lista de features GeoJSON
 * @param {Array} features - Array de features GeoJSON
 * @returns {Object|null} - Objeto com north, south, east, west e center, ou null se não conseguir calcular
 */
export const calculateBounds = (features) => {
  if (!features || features.length === 0) {
    return null;
  }

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  features.forEach(feature => {
    if (feature.geometry && feature.geometry.coordinates) {
      const coordinates = feature.geometry.coordinates;
      
      if (feature.geometry.type === 'Point') {
        const [lng, lat] = coordinates;
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
      } else if (feature.geometry.type === 'LineString') {
        coordinates.forEach(([lng, lat]) => {
          minLat = Math.min(minLat, lat);
          maxLat = Math.max(maxLat, lat);
          minLng = Math.min(minLng, lng);
          maxLng = Math.max(maxLng, lng);
        });
      } else if (feature.geometry.type === 'Polygon') {
        coordinates[0].forEach(([lng, lat]) => {
          minLat = Math.min(minLat, lat);
          maxLat = Math.max(maxLat, lat);
          minLng = Math.min(minLng, lng);
          maxLng = Math.max(maxLng, lng);
        });
      } else if (feature.geometry.type === 'MultiPolygon') {
        coordinates.forEach(polygon => {
          polygon[0].forEach(([lng, lat]) => {
            minLat = Math.min(minLat, lat);
            maxLat = Math.max(maxLat, lat);
            minLng = Math.min(minLng, lng);
            maxLng = Math.max(maxLng, lng);
          });
        });
      }
    }
  });

  if (minLat === Infinity) {
    return null;
  }

  const padding = 0.01;
  return {
    north: maxLat + padding,
    south: minLat - padding,
    east: maxLng + padding,
    west: minLng - padding,
    center: {
      lat: (minLat + maxLat) / 2,
      lng: (minLng + maxLng) / 2
    }
  };
};

/**
 * Faz parsing de um endereço formatado para extrair cidade e estado
 * @param {string} formattedAddress - Endereço formatado (ex: "Porto Alegre - RS, Brazil")
 * @returns {Object} - Objeto com city e state extraídos
 */
export const parseFormattedAddress = (formattedAddress) => {
  console.log('Parsing endereço:', formattedAddress);
  
  let city = '';
  let state = '';
  
  try {
    // Primeiro, tenta extrair estado usando regex
    const stateMatch = formattedAddress.match(/([A-Z]{2}),\s*Brazil/);
    if (stateMatch) {
      state = stateMatch[1];
    }
    
    // Se não encontrou, tenta outro padrão
    if (!state) {
      const stateMatch2 = formattedAddress.match(/([A-Z]{2})/);
      if (stateMatch2) {
        state = stateMatch2[1];
      }
    }
    
    // Agora tenta extrair a cidade
    if (state) {
      // Procura por padrão: "Cidade - Estado"
      const cityMatch = formattedAddress.match(/([^,]+)\s*-\s*([A-Z]{2})/);
      if (cityMatch) {
        city = cityMatch[1].trim();
      } else {
        // Procura por padrão: "Cidade, Estado"
        const cityMatch2 = formattedAddress.match(/([^,]+),\s*([A-Z]{2})/);
        if (cityMatch2) {
          city = cityMatch2[1].trim();
        }
      }
    }
    
    // Se ainda não encontrou a cidade, tenta extrair das partes do endereço
    if (!city) {
      const parts = formattedAddress.split(', ');
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part.includes(' - ') && !part.match(/^\d/)) {
          const cityPart = part.split(' - ')[0].trim();
          if (cityPart && !cityPart.match(/^\d/) && cityPart.length > 2) {
            city = cityPart;
            break;
          }
        }
      }
    }
    
    console.log('Cidade extraída:', city, 'Estado extraído:', state);
    
  } catch (error) {
    console.error('Erro ao fazer parsing do endereço:', error);
  }
  
  return { city, state };
};

/**
 * Faz geocoding reverso usando o proxy do backend
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} - Objeto com city e state extraídos do endereço
 */
export const getLocationFromCoordinates = async (lat, lng) => {
  try {
    const query = `${lat},${lng}`;
    console.log('Fazendo geocoding reverso para:', query);
    
    const response = await axios.get(
      `${baseURL}/proxy?query=${encodeURIComponent(query)}`
    );
    
    console.log('Resposta do proxy:', response.data);

    if (response.data && response.data.success && response.data.data && response.data.data.results && response.data.data.results.length > 0) {
      const result = response.data.data.results[0];
      const formattedAddress = result.formatted_address;
      
      console.log('Endereço formatado:', formattedAddress);
      
      if (formattedAddress) {
        return parseFormattedAddress(formattedAddress);
      }
    } else {
      console.warn('Resposta do proxy não contém dados válidos:', response.data);
    }
    
    return { city: '', state: '' };
  } catch (error) {
    console.error('Erro ao obter localização das coordenadas:', error);
    throw error;
  }
};

/**
 * Gera um nome automático para a área baseado na localização
 * @param {string} city - Nome da cidade
 * @param {string} state - Sigla do estado
 * @returns {string} - Nome gerado para a área
 */
export const generateAreaName = (city, state) => {
  if (city && state) {
    return `Area de Atuacao ${state} - ${city}`;
  } else if (city) {
    return `Area de Atuacao - ${city}`;
  } else if (state) {
    return `Area de Atuacao ${state}`;
  } else {
    return 'Area de Atuacao';
  }
};

/**
 * Mapeia nomes de campos para exibição em português
 * @param {string} field - Nome do campo
 * @returns {string} - Nome em português para exibição
 */
export const getFieldDisplayName = (field) => {
  const fieldNames = {
    name: 'Nome',
    city: 'Cidade',
    state: 'Estado',
    coords: 'Coordenadas'
  };
  return fieldNames[field] || field;
};

/**
 * Processa dados importados e extrai informações de localização
 * @param {Array} importedData - Dados importados dos arquivos KML/KMZ
 * @returns {Promise<Object>} - Objeto com informações de localização extraídas
 */
export const processImportedData = async (importedData) => {
  if (!importedData || importedData.length === 0) {
    return { city: '', state: '', bounds: null };
  }

  const allFeatures = importedData.flatMap(file => file.features);
  if (allFeatures.length === 0) {
    return { city: '', state: '', bounds: null };
  }

  const bounds = calculateBounds(allFeatures);
  const centerCoords = calculateCenterOfFeatures(allFeatures);
  
  let city = '';
  let state = '';
  
  if (centerCoords) {
    try {
      const locationData = await getLocationFromCoordinates(centerCoords.lat, centerCoords.lng);
      city = locationData.city;
      state = locationData.state;
    } catch (error) {
      console.error('Erro ao processar localização:', error);
    }
  }

  return { city, state, bounds };
};

// Função de teste para debug (pode ser chamada no console)
if (typeof window !== 'undefined') {
  window.testAddressParsing = parseFormattedAddress;
  window.testGeocoding = getLocationFromCoordinates;
}
