import React, { useEffect, useState } from "react";
import { createCommandService, APIMethods } from "services";
import toast from "utils/toast";
import { useSessionContext } from "context/UserSessionContext";
import {
  Box,
  Typography,
  Modal,
  Card,
  Button,
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
import { makeStyles } from "@material-ui/styles";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import masks from '.././../../utils/masks'
import { baseURL } from "api";
import { formatAxiosErrorMessage } from "utils/apiErrorHandler";
const styled = {
  //position: "absolute",

  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  height: '100%'
};

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
  buttonCancel: {
    background: "#A7A7A7",
    color: "#fff",
    marginRight: "16px",
  },
}));


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

const technologyValues = [
  {
    value: "Fibra",
    label: "Fibra",
  },
  {
    value: "Satélite",
    label: "Satélite",
  },
  {
    value: "Rádio",
    label: "Rádio",
  },
  {
    value: "4G",
    label: "4G",
  },
  {
    value: "Cabo",
    label: "Cabeamento",
  },
];

const statusValue = [
  {
    value: "Ativo",
    label: "Ativo",
  },
  {
    value: "Inativo",
    label: "Inativo",
  },
];


export default function AddPlans({
  open,
  handleClose,
  planName,
  wifi,
  fidelity,
  camera,
  phone,
  
  expiredAt,
  technology,
  description,
  status, 
  setPlanName,
  setWifi,
  setCamera,
  setPhone,
  setTechnology,
  setExpiredAt,
  setFidelity,

  setDescription,
  setStatus,
  velocity,
  setVelocity,
}) {
  // eslint-disable-next-line
  const { _isLoading, _startLoading, finishLoading } = useSessionContext();
  const styles = useStyles();
  const [regions, setRegions] = useState([])
  const [checked, setChecked] = useState([])
  const [price, setPrice] = useState('')
  const [priceInstallation, setPriceInstallation] = useState('')
  const [fidelityFree, setFidelityFree] = useState(false)
  const [noInstall, setNoInstall] = useState(false)


  const handleChangeArea = (event, index) => {
    checked[index] = event.target.checked
    setChecked([...checked])
    
  };

  const getRegions = () => {
    createCommandService({
      url: "regions",
      method: APIMethods.GET,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("sessionToken")}`
      },
      onSuccess: ({ data }) => {
        const checked = []
        // eslint-disable-next-line
        for(const key in data.data){
          checked.push(false)        
        }
        setChecked(checked)
        setRegions(data.data)
        finishLoading();
      },
      onCustomError: e => {
        debugger;
      }
    });
  }

  const saveArea = (idRegion) => {
    const newArray = []

    for(const index in checked){
      if(checked[index]){
        newArray.push(regions[index].idRegion)
      }
    }
    console.log("Array", newArray)
    createCommandService({
      method: APIMethods.POST,
      payload: {regions: newArray},
      url: `plans/regions/${idRegion}`,
      onSuccess: ({ data }) => {      
        handleClose()
      },
      onCustomError: e => {
        debugger;
        console.log('Esse é o erro', e)
      }
    })

  }

  const addNewPlan = () => {
    createCommandService({
      url: `${baseURL}/plans/add`,
      method: APIMethods.POST,
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
        priceInstallation: priceInstallation ? priceInstallation.replace(/\D/g, "") : 0,
        expiredAt: expiredAt,
        status: status
      },     
      onSuccess: ({ data }) => {
        toast.success("Registro criado com sucesso!");
        console.log('Sucesso!!!', data.data)
        saveArea(data.data)        
        handleClose()
        window.location.reload();
      },
      onCustomError: e => {
        formatAxiosErrorMessage(e).forEach((textError) => toast.error(textError));
      }
    })
  }

  useEffect(() => {
    getRegions()    
    // eslint-disable-next-line
  }, [])

 
  return (
    <div >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ display: "flex",
        justifyContent: "center", 
        alignItems: 'center',      
      }}
      >
        <div
          sx={styled}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: '100vh',
            padding: '24px',            
          }}
        >
        <Grid
          item
          container
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#fcfcfc",
              width: "70%",
              borderRadius: "10px",
              padding: "8px",
              height: '100%',
              overflow: 'auto'
            }}
          >
            <Grid item>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h6">Adicionar um novo plano</Typography>
                <Grid
                  style={{
                    marginTop: "24px",
                    width: "50%",
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "16px",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleClose}
                    className={styles.buttonCancel}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    onClick={addNewPlan}
                    className={styles.buttonSave}
                  >
                    Adicionar
                  </Button>
                </Grid>
              </Box>
              <Divider />
              <Grid container spacing={2} style={{overflow: 'auto'}}>
                <Grid item lg={8} md={12} sm={12} xs={12}>
                  <Card className={styles.card}>
                    <CardContent>
                      <Box className={styles.sectionLabel}>Plano</Box>
                      <Grid container spacing={2}>
                        <Grid item container spacing={2}>
                          <Grid
                            style={{ boder: "1px solid black", width: "100%" }}
                          >
                            <FormControl
                              className={styles.formControl}
                              fullWidth
                            >
                              <TextField
                                label="Nome do Plano"
                                variant="outlined"
                                size="small"
                                value={planName}
                                onChange={(event) =>
                                  setPlanName(event.target.value)
                                }
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
                            <FormControl
                              className={styles.formControl}
                              fullWidth
                            >
                              <TextField
                                id="technology"
                                //variant="outlined"
                                size="small"
                                select
                                label="Tecnologia"
                                value={technology}
                                onChange={(event) =>
                                  setTechnology(event.target.value)
                                }
                                fullWidth
                              >
                                {technologyValues.map((option) => {
                                  return (
                                    <MenuItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </MenuItem>
                                  );
                                })}
                              </TextField>
                            </FormControl>
                          </Grid>
                          <Grid item style={{ width: "45%" }}>
                            <FormControl
                              className={styles.formControl}
                              fullWidth
                            >
                              <TextField
                                id="wifi"
                               // variant="outlined"
                                size="small"
                                select
                                label="Wifi"
                                value={wifi}
                                onChange={(event) =>
                                  setWifi(event.target.value)
                                }
                                fullWidth
                              >
                                {valueWifi.map((option) => {
                                  return (
                                    <MenuItem
                                      key={option.value}
                                      value={option.value}
                                    >
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
                            <FormControl
                              className={styles.formControl}
                              fullWidth
                            >
                              <TextField
                                id="camera"
                               // variant="outlined"
                                size="small"
                                select
                                label="Câmera de monitoramento"
                                value={camera}
                                onChange={(event) =>
                                  setCamera(event.target.value)
                                }
                                fullWidth
                              >
                                {valueWifi.map((option) => {
                                  return (
                                    <MenuItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </MenuItem>
                                  );
                                })}
                              </TextField>
                            </FormControl>
                          </Grid>
                          <Grid item style={{ width: "45%" }}>
                            <FormControl
                              className={styles.formControl}
                              fullWidth
                            >
                              <TextField
                                id="phone"
                               // variant="outlined"
                                size="small"
                                select
                                label="Telefone"
                                value={phone}
                                onChange={(event) =>
                                  setPhone(event.target.value)
                                }
                                fullWidth
                              >
                                {valueWifi.map((option) => {
                                  return (
                                    <MenuItem
                                      key={option.value}
                                      value={option.value}
                                    >
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
                            <FormControl
                              className={styles.formControl}
                              fullWidth
                            >
                              <TextField
                                disabled={fidelityFree}
                                label="Fidelidade (em meses)"
                                variant="outlined"
                                size="small"
                                value={fidelity}
                                onChange={(e) => setFidelity(e.target.value)}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item style={{ width: "50%" }}>
                            <FormControl
                              className={styles.formControl}
                              fullWidth
                            >
                              <TextField
                                disabled={noInstall}
                                label="Instalação R$"
                                variant="outlined"
                                size="small"
                                value={masks.money(priceInstallation)}
                                onChange={(e) =>
                                  setPriceInstallation(e.target.value)}
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
                            <FormControl
                              className={styles.formControl}
                              fullWidth
                            >
                              <TextField
                                label="Valor"
                                variant="outlined"
                                size="small"
                                value={masks.money(price)}
                                onChange={(e) => setPrice(e.target.value)}
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
                              size="small"
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
                              placeholder="Descrição"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              style={{ height: "250px", fontSize: "16px" }}
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
                        fullWidth
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        {statusValue.map((option) => {
                          return (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          );
                        })}
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
                            <FormControlLabel key={item.idRegion}
                              control={
                                <Checkbox
                                  checked={checked[index]}
                                  color="primary"
                                  value={item.idRegion}
                                  onChange={(event)=>{handleChangeArea(event, index)}}
                                />
                              }
                              label={item.name}
                            />
                          )
                        })}

                      </FormGroup>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Modal>
    </div>
  );
}
