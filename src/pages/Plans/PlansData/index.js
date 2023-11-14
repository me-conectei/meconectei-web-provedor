import React, { useEffect, useState } from "react";
import { createCommandService, APIMethods } from "services";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

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
  Divider,
  TextareaAutosize,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";

import toast from "utils/toast";

import { useHistory, useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/styles";

import masks from "utils/masks";

import BackButton from "components/BackButton";

import { useSessionContext } from "context/UserSessionContext";

const useStyles = makeStyles((theme) => ({
  divider: theme.divider,
  buttonSave: theme.button.save,
  card: {
    marginTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
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
    width: "100%",
  },
  cardPlan: {
    marginTop: 15,
    backgroundColor: "#f8f8f8",
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
}));

const formatFidelity = (data) => {
  if (data === 0) {
    return "Sem fidelidade";
  }
  if (data > 0) {
    return `${data} meses`;
  }
};

const valueWifi = [
  {
    value: 1,
    label: "Incluso",
  },
  {
    value: 0,
    label: "Não incluso",
  },
];

export default function PlansData() {

  const [planData, setPlanData] = useState({});
  const { isLoading, startLoading, finishLoading } = useSessionContext();

  const { idPlans } = useParams();

  const [planName, setPlanName] = useState("");
  const [technology, setTechnology] = useState("");
  const [wifi, setWifi] = useState("");
  const [camera, setCamera] = useState("");
  const [phone, setPhone] = useState("");
  const [fidelity, setFidelity] = useState("");
  const [priceInstallation, setPriceInstallation] = useState();
  const [price, setPrice] = useState("");
  const [expiredAt, setExpiredAt] = useState();
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [area] = useState([]);
  const [velocity, setVelocity] = useState("");
  const [regions, setRegions] = useState([]);
  const [checked, setChecked] = useState([]);
  const [fidelityFree, setFidelityFree] = useState(false)
  const [noInstall, setNoInstall] = useState(false)

  const handleChangeArea = (event, index) => {
    checked[index] = event.target.checked;
    setChecked([...checked]);
  };

  const FetchPlanData = () => {
    startLoading();
    createCommandService({
      url: `/plans/${idPlans}`,
      method: APIMethods.GET,
      onSuccess: ({ data }) => {
        //dispatch(fulfillPlanData(data.data));
        const expiredAt = new Date(data.data.expiredAt);
        setPlanData(data.data);
        setPlanName(data.data.name);
        setTechnology(data.data.technology);
        setWifi(data.data.wifi);
        setCamera(data.data.camera);
        setPhone(data.data.phone);
        setFidelity(data.data.fidelity);
        setPriceInstallation(masks.money(data.data.priceInstallation.toString()));
        setPrice(masks.money(data.data.price.toString()));
        setExpiredAt(expiredAt);
        setDescription(data.data.description);
        setVelocity(data.data.velocity);
        setStatus(data.data.status);
        finishLoading();
      },
      onCustomError: (e) => {
        debugger;
      },
    });
  };

  const getRegions = () => {
    startLoading();
    createCommandService({
      url: "regions",
      method: APIMethods.GET,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
      },
      onSuccess: ({ data }) => {
        setRegions(data.data);
        console.log("Regions", data.data);
        getArea(data.data);
      },
      onCustomError: (e) => {
        debugger;
      },
    });
  };
  const getArea = (regions) => {
    startLoading();
    createCommandService({
      url: `plans/regions/${idPlans}`,
      method: APIMethods.GET,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
      },
      onSuccess: ({ data }) => {
    
        console.log(data.regions);
        const check = [];
        for (let index in regions) {
          const idRegion = regions[index].idRegion;
          const verify = data.regions.find((id) => id === idRegion);
          check.push(Boolean(verify));
        }
        setChecked([...check]);
        console.log("CHecked", check);
        finishLoading();
      },
      onCustomError: (e) => {
        console.log(e);
        debugger;
      },
    });
  };

  useEffect(() => {
    FetchPlanData();
    getRegions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const styles = useStyles();

  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  if (isLoading) {
    return null;
  }



  const changeArea = () => {
    const newArray = [];

    for (const index in checked) {
      if (checked[index]) {
        newArray.push(regions[index].idRegion, ...area);
      }
      if (area[index]) {
        // eslint-disable-next-line
        const removeArea = area.filter((item) => {
          for (let i = 0; area.length >= i; i++) {
            if (area[index] !== item) {
              console.log("item", item);
              return item;
            }
          }
        });

        newArray.push(...removeArea);
      }
    }

    createCommandService({
      method: APIMethods.POST,
      payload: { regions: newArray },
      url: `plans/regions/${idPlans}`,
      onSuccess: ({ data }) => {
        console.log("Sucesso!");
      },
      onCustomError: (e) => {
        debugger;
        console.log("Esse é o erro", e);
      },
    });
  };

  const updatePlan = () => {
    createCommandService({
      method: APIMethods.PUT,
      payload: {
        name: planName,
        technology: technology,
        wifi: wifi,
        camera,
        phone,
        velocity,
        fidelity: fidelity ? parseInt(fidelity) : 0,
        description: description,
        price: price.replace(/\D/g, ""),
        priceInstallation:priceInstallation ? priceInstallation.replace(/\D/g, "") : 0,
        expiredAt: expiredAt,
        status: status
      },
      url: `plans/${idPlans}`,
      onSuccess: ({ data }) => {
        changeArea();
        toast.success("Plano atualizado com sucesso!");
        console.log("Sucesso!!!");
        history.goBack();
      },
      onCustomError: (e) => {
        debugger;
        toast.error("Por favor preencha todos os campos")
        console.log("Esse é o erro", e);
      },
    });
  };

  

  console.log("price", price);
  //console.log(typeof price);


  return (
    <>
      <Box display="flex">
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <BackButton onClick={goBack} label="Plano" simpleOnMobile />

          <Button
            variant="contained"
            onClick={updatePlan}
            className={styles.buttonSave}
          >
            Salvar
          </Button>
        </Box>
      </Box>
      <Grid container spacing={2}>
        <Grid item lg={8} md={12} sm={12} xs={12}>
          <Card className={styles.card}>
            <CardContent>
              <Box className={styles.sectionLabel}>Plano</Box>
              <Grid container spacing={2}>
                <Grid item container spacing={2}>
                  <Grid style={{ boder: "1px solid black", width: "100%" }}>
                    <FormControl className={styles.formControl} fullWidth>
                      <TextField
                        label="Nome do Plano"
                        variant="outlined"
                        size="small"
                        value={planName}
                        onChange={(event) => setPlanName(event.target.value)}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid
                  item
                  container
                  spacing={2}
                  style={{ justifyContent: "space-between" }}
                >
                  <Grid item style={{ width: "45%" }}>
                    <FormControl className={styles.formControl} fullWidth>
                      <TextField
                        value={technology}
                        select
                        label="Tecnologia"
                        onChange={(e) => setTechnology(e.target.value)}
                        defaultValue={planData?.technology}
                        /*</CardContent>onChange={fulfillData.bind(null, "status")} */ fullWidth
                      >
                        <MenuItem value={"Fibra"}>Fibra</MenuItem>
                        <MenuItem value={"Cabeamento"}>Cabeamento</MenuItem>
                        <MenuItem value={"4G"}>4G</MenuItem>
                        <MenuItem value={"Satelite"}>Satelite</MenuItem>
                      </TextField>
                    </FormControl>
                  </Grid>
                  <Grid item style={{ width: "45%" }}>
                    <FormControl className={styles.formControl} fullWidth>
                      <TextField
                        select
                        label="Wifi"
                        value={wifi}
                        defaultValue={planData?.wifi}
                        onChange={(event) => setWifi(event.target.value)}
                        fullWidth
                      >
                        {valueWifi.map((option) => {
                          return (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid
                  item
                  container
                  spacing={2}
                  style={{ justifyContent: "space-between" }}
                >
                  <Grid item style={{ width: "45%" }}>
                    <FormControl className={styles.formControl} fullWidth>
                      <TextField
                        select
                        label="Câmera de monitoramento"
                        value={camera}
                        defaultValue={planData?.camera}
                        onChange={(event) => setCamera(event.target.value)}
                        fullWidth
                      >
                        {valueWifi.map((option) => {
                          return (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    </FormControl>
                  </Grid>
                  <Grid item style={{ width: "45%" }}>
                    <FormControl className={styles.formControl} fullWidth>
                      <TextField
                        select
                        label="Telefone"
                        value={phone}
                        defaultValue={planData?.phone}
                        onChange={(event) => setPhone(event.target.value)}
                        fullWidth
                      >
                        {valueWifi.map((option) => {
                          return (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid
                  item
                  container
                  spacing={2}
                  style={{ justifyContent: "space-between" }}
                >
                  <Grid item style={{ width: "50%" }}>
                    <FormControlLabel
                      className={styles.formControl}
                      fullWidth
                      label="Sem fidelidade"
                      control={
                        <Checkbox 
                          checked={fidelityFree}
                          onChange={(event) => {
                            setFidelity('')
                            setFidelityFree(event.target.checked)
                          }}
                        />
                      }
                    />
                  </Grid>
                  <Grid item style={{ width: "50%" }}>
                    <FormControlLabel
                      className={styles.formControl}
                      fullWidth
                      label="Instalação gratuita"
                      control={
                        <Checkbox 
                          checked={noInstall}
                          onChange={(event) => {
                            setNoInstall(event.target.checked)
                            setPriceInstallation('')
                          }}
                        />
                      }
                    />
                  </Grid>
                </Grid>
                <Grid
                  item
                  container
                  spacing={2}
                  style={{ justifyContent: "space-between" }}
                >
                  <Grid item style={{ width: "50%" }}>
                    <FormControl className={styles.formControl} fullWidth>
                      <TextField
                        disabled={fidelityFree}
                        label="Fidelidade (em meses)"
                        variant="outlined"
                        size="small"
                        value={formatFidelity(fidelity)}
                        onChange={(e) => setFidelity(e.target.value)}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item style={{ width: "50%" }}>
                    <FormControl className={styles.formControl} fullWidth>
                      <TextField
                        disabled={noInstall}
                        label="Instalação R$"
                        variant="outlined"
                        size="small"
                        value={priceInstallation}
                        onChange={(e) => setPriceInstallation(masks.money(e.target.value))}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid
                  item
                  container
                  spacing={2}
                  style={{ justifyContent: "space-between" }}
                >
                  <Grid item style={{ width: "50%" }}>
                    <FormControl className={styles.formControl} fullWidth>
                      <TextField
                        label="Valor"
                        variant="outlined"
                        size="small"
                        //defaultValue={currencyMoney(planData?.price)}
                        value={price}
                        onChange={(e) => setPrice(masks.money(e.target.value))}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item style={{ width: "50%" }}>
                    <FormControl>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          value={expiredAt}
                          label="Validade do plano"
                          variant="inline"
                          size="small"
                          inputVariant="outlined"
                          clearable
                          animateYearScrolling
                          lang="pt-BR"
                          format="dd/MM/yyyy"
                          onChange={(date) => setExpiredAt(date)}
                        />
                      </MuiPickersUtilsProvider>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid
                  item
                  container
                  spacing={2}
                  style={{ justifyContent: "space-between" }}
                ></Grid>
                <Grid item style={{ width: "45%" }}>
                  <FormControl className={styles.formControl} fullWidth>
                    <TextField
                      label="Velocidade (em MB)"
                      variant="outlined"
                      defaultValue={planData?.velocity}
                      value={velocity}
                      onChange={(e) => setVelocity(e.target.value)}
                      fullWidth
                    />
                  </FormControl>
                </Grid>
                <Grid
                  item
                  container
                  spacing={2}
                  style={{ justifyContent: "space-between" }}
                ></Grid>
                <Grid item style={{ width: "100%" }}>
                  <FormControl className={styles.formControl} fullWidth>
                    <TextareaAutosize
                      style={{ height: "250px", fontSize: "16px" }}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </FormControl>
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
                O plano está:
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
          <Card className={styles.card}>
            <CardHeader title="Área abrangente" />
            <Divider />
            <CardContent>
              <FormGroup>
                {regions.map((item, index) => {
                  return (
                    <FormControlLabel
                      key={item.idRegion}
                      control={
                        <Checkbox
                          checked={checked[index]}
                          color="primary"
                          value={item.idRegion}
                          onChange={(event) => {
                            handleChangeArea(event, index);
                          }}
                        />
                      }
                      label={item.name}
                    />
                  );
                })}
              </FormGroup>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
