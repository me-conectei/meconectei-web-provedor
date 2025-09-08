import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  FormControl,
  TextField,
  Select,
  MenuItem,
  InputLabel,
} from "@material-ui/core";

import BackButton from "components/BackButton";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import BasicMap from "./BasicMap";
import { useSessionContext } from "context/UserSessionContext";
import useApiKeys from "hooks/useApiKeys";
import KMLUploader from "components/KMLUploader";
import toast from "utils/toast";

import { useAreaForm } from "./hooks/useAreaForm";
import { useLocationData } from "./hooks/useLocationData";

const useStyles = makeStyles((theme) => ({
  divider: theme.divider,
  buttonSave: theme.button.save,
  card: {
    marginTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    height: 210,
  },
  cardMap: {
    marginTop: 20,
    padding: 10,
    height: 600,
  },
  sectionLabel: {
    fontWeight: "bold",
    fontSize: 16,
    paddingTop: 20,
    paddingBottom: 10,
    "&:first-child": {
      paddingTop: 5,
      paddingBottom: 20,
    },
  },
  attachLabel: {
    fontWeight: "bold",
    fontSize: 14,
  },
  formControl: {
    paddingTop: 10,
  },
  cardPlan: {
    backgroundColor: "#f8f8f8",
    marginBottom: 16,
  },
  formLabel: {
    fontWeight: "bold",
  },
  growFieldLabel: {
    flexGrow: 1,
    color: "#b6b6b6",
  },
  totalPrice: {
    color: "black",
    fontWeight: "bold",
  },
  mapContainer: {
    height: "100%",
  },
}));

export default function CreateArea() {
  const { isLoading, startLoading, finishLoading } = useSessionContext();
  const { keys } = useApiKeys();
  const history = useHistory();
  const styles = useStyles();

  // Hooks customizados
  const {
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
    handleDataParsed,
    clearImportedData,
    saveRegion
  } = useAreaForm();

  const {
    uf,
    city,
    position,
    setPosition,
    loadCities
  } = useLocationData();

  const [mapLoaded, setLoadedMaps] = useState(false);

  // Carrega cidades quando o estado muda
  useEffect(() => {
    if (state) {
      loadCities(state);
    }
  }, [state, loadCities]);

  // Carrega mapa quando as chaves estão disponíveis
  useEffect(() => {
    if (keys?.googleMapsKey) {
      setLoadedMaps(true);
    }
  }, [keys]);

  const goBack = () => {
    history.goBack();
  };

  const handleImportError = (error) => {
    toast.error(`Erro ao processar arquivo: ${error}`);
  };

  const handleCreateRegion = async () => {
    startLoading();
    try {
      await saveRegion();
      finishLoading();
      goBack();
    } catch (error) {
      finishLoading();
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Box display="flex">
        <Box>
          <BackButton onClick={goBack} label="Configurar Área" simpleOnMobile />
        </Box>
        <Box display="flex" justifyContent="flex-end" flexGrow="1">
          {importedData.length > 0 && (
            <Button
              variant="contained"
              onClick={clearImportedData}
              className={styles.buttonSave}
              style={{ backgroundColor: '#ff9800', marginRight: 20 }}
            >
              Limpar Importados
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleCreateRegion}
            className={styles.buttonSave}
          >
            Salvar
          </Button>
        </Box>
      </Box>
      
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <KMLUploader
            onDataParsed={handleDataParsed}
            onError={handleImportError}
          />
        </Grid>
      </Grid>
      
      <Grid container spacing={2}>
        <Grid item lg={8} md={10} sm={12} xs={12}>
          <Card className={styles.card}>
            <CardContent>
              <Box className={styles.sectionLabel}>Informações</Box>
              <Grid container spacing={2}>
                <Grid item container spacing={2}>
                  <Grid item lg={12} xs={12}>
                    <FormControl className={styles.formControl} fullWidth>
                      <TextField
                        label="Nome"
                        variant="outlined"
                        size="small"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item container spacing={2}>
                  <Grid item lg={6} xs={12}>
                    <FormControl className={styles.formControl} fullWidth>
                      <InputLabel>Estado</InputLabel>
                      <Select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        label="Estado"
                        variant="outlined"
                        size="small"
                        disabled={isDetectingLocation}
                      >
                        {uf.map((item) => {
                          return (
                            <MenuItem key={item.id} value={item.sigla}>
                              {item.sigla}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {isDetectingLocation && (
                        <Typography variant="caption" color="primary" style={{ marginTop: 4 }}>
                          🔍 Detectando localização...
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <FormControl className={styles.formControl} fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Cidade
                      </InputLabel>
                      <Select
                        value={cityValue}
                        onChange={(e) => setCityValue(e.target.value)}
                        label="Cidade"
                        variant="outlined"
                        disabled={isDetectingLocation}
                      >
                        {city.map((item) => {
                          return (
                            <MenuItem key={item.id} value={item.nome}>
                              {item.nome}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {isDetectingLocation && (
                        <Typography variant="caption" color="primary" style={{ marginTop: 4 }}>
                          🔍 Detectando localização...
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item lg={4} md={12} sm={12} xs={12}>
          <Card className={styles.card}>
            <CardHeader title="Status" />
            <CardContent>
              <Box display="flex" flexGrow="1">
                A área esta como:
              </Box>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                fullWidth
              >
                <MenuItem value={"ativo"}>
                  <Typography fullWidth>ATIVO</Typography>
                </MenuItem>
                <MenuItem value={"inativo"}>INATIVO</MenuItem>
              </Select>
            </CardContent>
          </Card>
        </Grid>
        {mapLoaded && (
          <Grid container spacing={2}>
            <Grid item lg={12} md={10} sm={12} xs={12}>
              <Card className={styles.cardMap}>
                <div className={styles.mapContainer}>
                  <BasicMap
                    city={cityValue}
                    coords={coords}
                    setCoords={setCoords}
                    position={position}
                    setPosition={setPosition}
                    mapsKey={keys.googleMapsKey}
                    importedData={importedData}
                    mapBounds={mapBounds}
                  />
                </div>
              </Card>
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
}
