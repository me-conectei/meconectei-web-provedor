import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  IconButton,
} from '@material-ui/core';
import { CloudUpload, Close, CheckCircle, ErrorOutline } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import JSZip from 'jszip';
import { toGeoJSON } from '@mapbox/togeojson';
import { DOMParser } from 'xmldom';

const useStyles = makeStyles((theme) => ({
  dropzone: {
    border: '3px dashed #1976d2',
    borderRadius: 12,
    padding: 40,
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: '#f8f9ff',
    minHeight: 120,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      borderColor: '#1565c0',
      backgroundColor: '#e3f2fd',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
    },
    '&.active': {
      borderColor: '#1565c0',
      backgroundColor: '#e3f2fd',
      transform: 'scale(1.02)',
    },
  },
  uploadIcon: {
    fontSize: 64,
    color: '#1976d2',
    marginBottom: 16,
  },
  fileInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
    border: '1px solid #e9ecef',
  },
  progressContainer: {
    marginTop: 16,
  },
  successMessage: {
    marginTop: 16,
  },
  errorMessage: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#ffebee',
    border: '1px solid #f44336',
    borderRadius: 4,
    color: '#c62828',
  },
  successMessageBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#e8f5e8',
    border: '1px solid #4caf50',
    borderRadius: 4,
    color: '#2e7d32',
  },
  fileChip: {
    margin: 4,
  },
  clearButton: {
    marginTop: 16,
  },
}));

const KMLUploader = ({ onDataParsed, onError }) => {
  const classes = useStyles();
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState(null);

  const processKMLContent = useCallback((content, filename) => {
    try {
      const parser = new DOMParser();
      const kml = parser.parseFromString(content, 'text/xml');
      const geoJson = toGeoJSON.kml(kml);
      
      return {
        filename,
        type: 'kml',
        data: geoJson,
        features: geoJson.features || [],
      };
    } catch (err) {
      throw new Error(`Erro ao processar arquivo KML: ${err.message}`);
    }
  }, []);

  const processKMZContent = useCallback(async (content, filename) => {
    try {
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(content);
      
      let kmlContent = null;
      let kmlFilename = null;
      
      for (const [filename, file] of Object.entries(zipContent.files)) {
        if (filename.toLowerCase().endsWith('.kml')) {
          kmlContent = await file.async('text');
          kmlFilename = filename;
          break;
        }
      }
      
      if (!kmlContent) {
        throw new Error('Nenhum arquivo KML encontrado no arquivo KMZ');
      }
      
      return processKMLContent(kmlContent, kmlFilename);
    } catch (err) {
      throw new Error(`Erro ao processar arquivo KMZ: ${err.message}`);
    }
  }, [processKMLContent]);

  const onDrop = useCallback(async (acceptedFiles) => {
    setError(null);
    setIsProcessing(true);
    
    try {
      const processedFiles = [];
      
      for (const file of acceptedFiles) {
        const content = await file.arrayBuffer();
        let result;
        
        if (file.name.toLowerCase().endsWith('.kml')) {
          const textContent = new TextDecoder().decode(content);
          result = processKMLContent(textContent, file.name);
        } else if (file.name.toLowerCase().endsWith('.kmz')) {
          result = await processKMZContent(content, file.name);
        } else {
          throw new Error(`Tipo de arquivo não suportado: ${file.name}`);
        }
        
        processedFiles.push({
          ...result,
          originalFile: file,
          size: file.size,
        });
      }
      
      setUploadedFiles(processedFiles);
      
      if (onDataParsed) {
        onDataParsed(processedFiles);
      }
      
    } catch (err) {
      const errorMessage = err.message || 'Erro ao processar arquivo';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [processKMLContent, processKMZContent, onDataParsed, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.kml,.kmz',
    multiple: true,
  });

  const clearFiles = () => {
    setUploadedFiles([]);
    setError(null);
  };

  const getFileIcon = (type) => {
    return type === 'kml' ? '📄' : '📦';
  };

  const getFeatureTypeCount = (features) => {
    const counts = {
      Point: 0,
      LineString: 0,
      Polygon: 0,
      MultiPolygon: 0,
    };
    
    features.forEach(feature => {
      const type = feature.geometry?.type;
      if (counts.hasOwnProperty(type)) {
        counts[type]++;
      }
    });
    
    return counts;
  };

  return (
    <Card style={{ marginBottom: 20 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom style={{ color: '#1976d2', fontWeight: 'bold' }}>
          📁 Importar Arquivos KMZ/KML
        </Typography>
        <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16 }}>
          Faça upload de arquivos geográficos para visualizar no mapa
        </Typography>
        
        <Box
          {...getRootProps()}
          className={`${classes.dropzone} ${isDragActive ? 'active' : ''}`}
        >
          <input {...getInputProps()} />
          <CloudUpload className={classes.uploadIcon} />
          <Typography variant="h6" style={{ color: '#1976d2', marginBottom: 8 }}>
            {isDragActive
              ? '🎯 Solte os arquivos aqui...'
              : '📂 Arraste arquivos KMZ/KML aqui ou clique para selecionar'}
          </Typography>
          <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
            Formatos suportados: .kml, .kmz
          </Typography>
        </Box>

        {isProcessing && (
          <Box className={classes.progressContainer}>
            <Typography variant="body2" gutterBottom>
              Processando arquivos...
            </Typography>
            <LinearProgress />
          </Box>
        )}

        {error && (
          <Box className={classes.errorMessage}>
            <Box display="flex" alignItems="center">
              <ErrorOutline style={{ marginRight: 8 }} />
              {error}
            </Box>
          </Box>
        )}

        {uploadedFiles.length > 0 && (
          <Box className={classes.fileInfo}>
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
              <Typography variant="subtitle1">
                Arquivos Processados ({uploadedFiles.length})
              </Typography>
              <IconButton size="small" onClick={clearFiles}>
                <Close />
              </IconButton>
            </Box>
            
            {uploadedFiles.map((file, index) => {
              const featureCounts = getFeatureTypeCount(file.features);
              return (
                <Box key={index} marginBottom={2}>
                  <Box display="flex" alignItems="center" marginBottom={1}>
                    <Typography variant="body2" style={{ marginRight: 8 }}>
                      {getFileIcon(file.type)} {file.filename}
                    </Typography>
                    <Chip
                      label={`${file.features.length} elementos`}
                      size="small"
                      color="primary"
                      className={classes.fileChip}
                    />
                  </Box>
                  
                  <Box display="flex" flexWrap="wrap">
                    {Object.entries(featureCounts).map(([type, count]) => {
                      if (count > 0) {
                        return (
                          <Chip
                            key={type}
                            label={`${count} ${type}`}
                            size="small"
                            variant="outlined"
                            className={classes.fileChip}
                          />
                        );
                      }
                      return null;
                    })}
                  </Box>
                </Box>
              );
            })}
            
            <Box className={classes.successMessageBox}>
              <Box display="flex" alignItems="center">
                <CheckCircle style={{ marginRight: 8 }} />
                Arquivos processados com sucesso! Os dados estão prontos para visualização no mapa.
              </Box>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default KMLUploader;
