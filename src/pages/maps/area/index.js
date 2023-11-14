import React, { useEffect, useState, useRef } from "react";
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

import { useHistory, useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/styles";

import { useSessionContext } from "context/UserSessionContext";

import toast from "utils/toast";
import { createCommandService, APIMethods } from "services";
import axios from "axios";
import { BasicMap } from "./Maps";
import { useJsApiLoader } from "@react-google-maps/api";

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

export default function Maps() {
  const { isLoading, startLoading, finishLoading } = useSessionContext();

  const [uf, setUf] = useState([]);
  const [state, setState] = useState("");
  const [city, setCity] = useState([]);
  const [cityValue, setCityValue] = useState("");
  const [region, setRegion] = useState("");
  const [status, setStatus] = useState("");
  const [newCoords, setNewCoords] = useState([]);
  const { id } = useParams();
  const polygonRef = useRef(null);

  const styles = useStyles();

  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  // eslint-disable-next-line
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyC_o7A8i-8xhsvYvJz9UEk9TagSRZEsvNE",
  });

  const asyncFetch = () => {
    startLoading();
    createCommandService({
      url: `regions/${id}`,
      method: APIMethods.GET,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
      },
      onSuccess: ({ data }) => {
        setState(data.data.state);
        setCityValue(data.data.city);
        setRegion(data.data.name);
        setStatus(data.data.status);
        finishLoading();
      },
      onCustomError: (e) => {
        // debugger;
        console.log(e);
      },
    });
  };
  const getCoords = () => {
    startLoading();
    createCommandService({
      url: `regions/coords/${id}`,
      method: APIMethods.GET,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
      },
      onSuccess: ({ data }) => {
        if(data.data && data.data.length > 0) {
          setNewCoords(data.data.map((item) => ({ lat: item.coordinate.x, lng: item.coordinate.y })));
        }
        finishLoading();
      },
      onCustomError: (e) => {
        // debugger;
        console.log(e);
      },
    });
  };

  const getUfs = () => {
    startLoading();
    axios
      .get("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((res) => {
        setUf(res.data);
        finishLoading();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCity = () => {
    startLoading();
    axios
      .get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`
      )
      .then((res) => {
        setCity(res.data);
        finishLoading();
      })
      .catch((err) => {
        console.log(err);
      });
  };


  useEffect(() => {
    asyncFetch();
    getUfs();
    getCoords();
   
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getCity();
    // eslint-disable-next-line
  }, [state]);

  const updateCoords = () => {
    const body = {
      coords: newCoords,
    };
    startLoading();
    createCommandService({
      method: APIMethods.POST,
      payload: body,
      url: `/regions/coords/${id}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
      },
      onSuccess: ({ data }) => {
        finishLoading();
      },
      onCustomError: (e) => {
        // debugger;
        console.log(e);
      },
    });
  };

  const onSave = () => {
    /*f(polygonRef.current) {
      console.log('path')
      console.log(polygonRef.current.getPath());
    }
    return*/
    startLoading();
    const body = {
      name: region,
      city: cityValue,
      state: state,
      status: status,
    };
    createCommandService({
      method: APIMethods.PUT,
      payload: body,
      url: `/regions/${id}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
      },
      onSuccess: ({ data }) => {
        if(data.success) {
          updateCoords();
          toast.success("Registro atualizado com sucesso!");
          finishLoading();
          goBack();
        } else {
          toast.error(data.errorMessage);
          finishLoading();
        }
      },
      onCustomError: (e) => {
        //debugger;
        console.log(e);
      },
    });
  };

  const onClear = () => {
    setNewCoords([])
  }

  if (isLoading) {
    return null;
  }

  return (
    <>
      {(
        <>
          <Box display="flex">
            <Box>
              <BackButton
                onClick={goBack}
                label="Configurar Área"
                simpleOnMobile
              />
            </Box>
            <Box display="flex" justifyContent="flex-end" flexGrow="1">
              <Button
                variant="contained"
                onClick={onClear}
                className={styles.buttonSave}
                style={{backgroundColor: '#db6f82', marginRight: 20}}
              >
                Limpar
              </Button>
              <Button
                variant="contained"
                onClick={onSave}
                className={styles.buttonSave}
              >
                Salvar
              </Button>
            </Box>
          </Box>
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
                            defaultValue={region}
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
                          >
                            {uf.map((item) => {
                              return (
                                <MenuItem key={item.id} value={item.sigla}>
                                  {item.sigla}
                                </MenuItem>
                              );
                            })}
                          </Select>
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
                          >
                            {city.map((item) => {
                              return (
                                <MenuItem key={item.id} value={item.nome}>
                                  {item.nome}
                                </MenuItem>
                              );
                            })}
                          </Select>
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
            <Grid container spacing={2}>
              <Grid item lg={12} md={10} sm={12} xs={12}>
                <Card className={styles.cardMap}>
                  <div className={styles.mapContainer}>
                    <BasicMap
                      city={cityValue}
                      setNewCoords={setNewCoords}
                      newCoords={newCoords}
                      polygonRef={polygonRef}
                    />
                  </div>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}
