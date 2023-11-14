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
} from "@material-ui/core";

import toast from "utils/toast";
import { createCommandService, APIMethods } from "services";
import { useHistory, useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/styles";

import masks from "utils/masks";

import MaskedTextField from "components/MaskedTextField";
import BackButton from "components/BackButton";
import FieldLabel from "components/FieldLabel";
import firebase from "../../../firebase";
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

const planDetailsWIFI = {
  1: "Incluso",
  2: "Não incluso",
};

const formatFidelity = (data) => {
  if (data === 0) {
    return "Sem fidelidade";
  }
  if (data > 0) {
    return `${data} meses`;
  }
};

const cpfMask = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

const phoneMask = (value) => {
  return value
    .replace(/\D+/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(\d{4})-(\d)(\d{4})/, "$1$2-$3")
    .replace(/(-\d{4})\d+?$/, "$1");
};

export default function RequestsData() {
  /* const {
    requestData,
    fetchRequestData,
    // fulfillSpecificData,
    // fulfillImage,
    //saveData,
  } = useRequestContext(); */
  const { isLoading, startLoading, finishLoading } = useSessionContext();
  const [requestData, setRequestData] = useState({});
  const [status, setStatus] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [uid, setUid] = useState("");
  const [frontImage, setFrontImage] = useState("https://decathlonpro.vtexassets.com/arquivos/ids/2446149-588-752/no-image.jpg?v=637140178423230000");
  const [versImage, setVersImage] = useState("https://decathlonpro.vtexassets.com/arquivos/ids/2446149-588-752/no-image.jpg?v=637140178423230000");
  const [price, setPrice] = useState('')
  const [priceInstallation, setPriceInstallation] = useState('')
  const [total, setTotal] = useState('')

  const storage = firebase.storage();

  const { idOrder } = useParams();

  const asyncFetch = () => {
    startLoading();
    createCommandService({
      url: `/orders/data/${idOrder}`,
      method: APIMethods.GET,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
      },
      onSuccess: ({ data }) => {
        console.log({ data: data.data[0]})
        //dispatch(fulfillRequestData(data.data[0]));
        console.log('DATA', data.data[0])
        setRequestData(data.data[0]);
        setStatus(data.data[0].status);
        setCep(data.data[0].CEP);
        setStreet(data.data[0].street);
        //console.log('Street22', data.data[0].street)
        setUid(data.data[0].uidUser);
        console.log(data.data[0].uidUser);
        setNumber(data.data[0].addressNumber);
        setCity(data.data[0].city);
        setComplement(data.data[0].addressComplement);
        setState(data.data[0].state);
        setCpf(data.data[0].CPF);
        setPhone(data.data[0].phone);
        setPrice(data.data[0].priceMonthly.toString())
        setPriceInstallation(data.data[0].priceInstallation.toString())
        setTotal(masks.money((data.data[0].priceMonthly + data.data[0].priceInstallation).toString()))
        finishLoading();
      },
      onCustomError: (e) => {
        debugger;
      },
    });
  };

  useEffect(() => {
    asyncFetch();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  console.log("O que temos", uid);

  useEffect(() => {
    const pathReference = storage.ref(
      `/users/${uid}/documents/documento-frente`
    );
    console.log({uid})

    pathReference
      .getDownloadURL()
      .then((url) => {
        console.log("url", url);
        setFrontImage(url);
      })
      .catch((err) => {
        console.log("err", err);
        setFrontImage("https://decathlonpro.vtexassets.com/arquivos/ids/2446149-588-752/no-image.jpg?v=637140178423230000");
      });
      
    const path = storage.ref(`/users/${uid}/documents/documento-verso`);

    path
      .getDownloadURL()
      .then((url) => {
        console.log("url", url);
        setVersImage(url);
      })
      .catch((err) => {
        console.log("err", err);
        setVersImage("https://decathlonpro.vtexassets.com/arquivos/ids/2446149-588-752/no-image.jpg?v=637140178423230000");
      });
  }, [uid, storage]);

  const styles = useStyles();

  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  if (isLoading) {
    return null;
  }

  const onSave = () => {
    startLoading();
    const date = new Date();
    date.setMonth(date.getMonth() + requestData.fidelity);
    const body = {
      email: requestData.email,
      phone: requestData.phone,
      priceMonthly: requestData.priceMonthly,
      priceInstallation: requestData.priceInstallation,
      expiredAt: date,
      effectedAt: new Date(),
      closedAt: null,
      status: status,
    };

    createCommandService({
      method: APIMethods.PUT,
      payload: body,
      url: `orders/data/${idOrder}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
      },
      onSuccess: ({ data }) => {
        if(status === 'contratado') {
          toast.success("Solicitação aceita com sucesso!");
          finishLoading();
          window.history.back();
        } else {
          toast.success("Registro salvo com sucesso!");
          finishLoading();
        }
      },
      onCustomError: (e) => {
        debugger;
        console.log("Error aqui", e);
      },
    });
    finishLoading();
  };

  const convertDate = (value) => {
    const date = new Date(value);

    return `${date.getDate()}/${date.getMonth() + 1}/${date.getUTCFullYear()}`;
  };

  console.log('total',total)
  

  return (
    <>
      <Box display="flex">
        <Box>
          <BackButton onClick={goBack} label="Pedido" simpleOnMobile />
        </Box>
      </Box>
      <Grid container spacing={2}>
        <>
          <Grid item lg={8} md={12} sm={12} xs={12}>
            <Card className={styles.card}>
              <CardHeader title="Detalhes do plano" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item container spacing={2}>
                    <Grid item lg={6} xs={12}>
                      <Box display="flex">
                        <Typography>Número do pedido:</Typography>
                        <Typography>N° #{idOrder}</Typography>
                      </Box>
                    </Grid>
                    <Grid item lg={6} xs={12}>
                      <Box display="flex">
                        <Typography>Data início do plano:</Typography>
                        <Typography>
                          {convertDate(requestData?.createdAt)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                <Card className={styles.cardPlan}>
                  <CardContent>
                    <Typography variant="h6">
                      {requestData?.planName}
                    </Typography>
                    <Box display="flex">
                      <span className={styles.divider} />
                    </Box>
                    <Box display="flex">
                      <Typography className={styles.growFieldLabel}>
                        Tecnologia:
                      </Typography>
                      <Typography>{requestData?.technology}</Typography>
                    </Box>
                    <Box display="flex">
                      <Typography className={styles.growFieldLabel}>
                        WIFI:
                      </Typography>
                      <Typography>
                        {planDetailsWIFI[requestData?.wifi]}
                      </Typography>
                    </Box>
                    <Box display="flex">
                      <Typography className={styles.growFieldLabel}>
                        Instalação:
                      </Typography>
                      <Typography>
                        {masks.money(priceInstallation)}
                      </Typography>
                    </Box>
                    <Box display="flex">
                      <Typography className={styles.growFieldLabel}>
                        Tempo de fidelidade:
                      </Typography>
                      <Typography>
                        {formatFidelity(requestData?.fidelity)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
            <Card className={styles.card}>
              <CardContent>
                <Box className={styles.sectionLabel}>
                  Informações do Usuário
                </Box>
                <Grid container spacing={2}>
                  <Grid item container spacing={2}>
                    <Grid item lg={6} xs={12}>
                      <FieldLabel
                        fullWidth
                        label="Nome do cliente"
                        fieldValue={requestData?.userName}
                      />
                    </Grid>
                    <Grid item lg={6} xs={12}>
                      <FieldLabel
                        label="E-mail"
                        fieldValue={requestData?.email}
                      />
                    </Grid>
                  </Grid>
                  <Grid item container spacing={2}>
                    <Grid item lg={6} xs={12}>
                      <FieldLabel
                        fullWidth
                        label="Telefone"
                        fieldValue={phoneMask(phone)}
                      />
                    </Grid>
                    <Grid item lg={6} xs={12}>
                      <FieldLabel label="CPF" fieldValue={cpfMask(cpf)} />
                    </Grid>
                  </Grid>
                </Grid>
                <Typography className={styles.sectionLabel}>
                  Endereço
                </Typography>
                <Grid container spacing={2}>
                  <Grid item container spacing={2}>
                    <Grid item lg={4} xs={12}>
                      <FormControl className={styles.formControl} fullWidth>
                        <MaskedTextField
                          label="CEP"
                          variant="outlined"
                          size="small"
                          mask={masks.CEP}
                          defaultValue={cep}
                          //value={cep}
                          //onChange={fulfillData.bind(null, "CEP")}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item lg={8} xs={12}>
                      <FormControl className={styles.formControl} fullWidth>
                        <TextField
                          label="Rua"
                          variant="outlined"
                          size="small"
                          defaultValue={street}
                          value={street}
                          //onChange={fulfillData.bind(null, "street")}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid item container spacing={2}>
                    <Grid item lg={4} xs={12}>
                      <FormControl className={styles.formControl} fullWidth>
                        <TextField
                          label="Número"
                          variant="outlined"
                          size="small"
                          defaultValue={number}
                          value={number}
                          // onChange={fulfillData.bind(null, "addressNumber")}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item lg={4} xs={12}>
                      <FormControl className={styles.formControl} fullWidth>
                        <TextField
                          label="Complemento"
                          variant="outlined"
                          size="small"
                          defaultValue={complement}
                          value={complement}
                          //onChange={fulfillData.bind(null, "addressComplement")}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid item container spacing={2}>
                    <Grid item lg={4} xs={12}>
                      <FormControl className={styles.formControl} fullWidth>
                        <TextField
                          label="Cidade"
                          variant="outlined"
                          size="small"
                          defaultValue={city}
                          value={city}
                          //onChange={fulfillData.bind(null, "city")}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item lg={4} xs={12}>
                      <FormControl className={styles.formControl} fullWidth>
                        <TextField
                          label="Estado"
                          variant="outlined"
                          size="small"
                          defaultValue={state}
                          value={state}
                          // onChange={fulfillData.bind(null, "state")}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Card className={styles.card}>
              <CardHeader title="Detalhes do pagamento" />
              <CardContent>
                <Box display="flex">
                  <Typography className={styles.growFieldLabel}>
                    Subtotal:
                  </Typography>
                  <Typography>
                    {masks.money(price)}
                  </Typography>
                </Box>
                <Box display="flex">
                  <Typography className={styles.growFieldLabel}>
                    Instalação:
                  </Typography>
                  <Typography>
                    {masks.money(priceInstallation)}
                  </Typography>
                </Box>
                <Box display="flex">
                  <span className={styles.divider} />
                </Box>
                <Box display="flex">
                  <Typography
                    className={`${styles.growFieldLabel} ${styles.totalPrice}`}
                  >
                    TOTAL
                  </Typography>
                  <Typography>
                    {total}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            <Card className={styles.card}>
              <CardHeader title="Conferir documentos" />
              <CardContent>
                <Typography style={{ marginBottom: "8px" }}>Frente</Typography>
                <div
                  style={{
                    heigth: "250px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    display="flex"
                    style={{
                      width: "100px",
                      height: "80px",
                    }}
                  >
                    <img alt="logo" src={frontImage} />
                  </Box>
                  <Button
                    variant="outlined"
                    style={{
                      height: "40px",
                      width: "150px",
                      marginLeft: "8px",
                    }}
                    target="_blank"
                    href={frontImage}
                  >
                    Visualizar
                  </Button>
                </div>
              </CardContent>
              <CardContent>
                <Typography style={{ marginBottom: "8px" }}>Verso</Typography>
                <div
                  style={{
                    heigth: "250px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    display="flex"
                    style={{
                      width: "100px",
                      height: "80px",
                    }}
                  >
                    <img alt="logo" src={versImage} />
                  </Box>
                  <Button
                    variant="outlined"
                    style={{
                      height: "40px",
                      width: "150px",
                      marginLeft: "8px",
                    }}
                    href={versImage}
                    target="_blank"
                  >
                    Visualizar
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className={styles.card}>
              <CardHeader title="Finalizar compra" />
              <CardContent>
                <Box display="flex" flexGrow="1">
                  Como o pedido será fechado:
                </Box>
                <Select
                  value={status}
                  defaultValue={status}
                  onChange={(e) => setStatus(e.target.value)}
                  fullWidth
                >
                  <MenuItem value={"solicitado"}>
                    <Typography fullWidth>Solicitado</Typography>
                  </MenuItem>
                  <MenuItem value={"contratado"}>Contratado</MenuItem>
                  <MenuItem value={"finalizado"}>Cancelado</MenuItem>
                </Select>
              </CardContent>
              <Box display="flex" justifyContent="center" flexGrow="1">
                <Button
                  variant="contained"
                  onClick={onSave}
                  style={{
                    width: "100%",
                    height: "46px",
                    marginTop: "16px",
                    marginBottom: "16px",
                  }}
                  className={styles.buttonSave}
                >
                  Salvar
                </Button>
              </Box>
            </Card>
          </Grid>
        </>
      </Grid>
    </>
  );
}
