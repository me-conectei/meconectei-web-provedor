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
  Divider,
} from "@material-ui/core";
import toast from "utils/toast";
import MaskedTextField from "components/MaskedTextField";
import FieldLabel from "components/FieldLabel";
import BackButton from "components/BackButton";
import { createCommandService, APIMethods } from "services";
import firebase from "../../../firebase";
import { useHistory, useParams } from "react-router-dom";
import ReactLoading from 'react-loading';
import pdfIcon from '../../../assets/pdf-icon.jpeg';

import { makeStyles } from "@material-ui/styles";
import { useSessionContext } from "context/UserSessionContext";

import masks from "utils/masks";
import BoxUpload from "../components/boxUpload";

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
}));

const planDetailsWIFI = {
  1: "Incluso",
  2: "Não incluso",
};

// eslint-disable-next-line
const formatInstalationPrice = (price) => {

  const value = price.toString()

  if (price !== 0 && !price) {
    return null;
  }

  if (price === 0) {
    return "Grátis";
  }

  return masks.money(value)
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

export default function ClientsData() {
  const { isLoading, startLoading, finishLoading } = useSessionContext();
  const [clientData, setClientData] = useState({});
  const [contract, setContract] = useState([]);
  const [invoice, setInvoice] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [status, setStatus] = useState("");
  const [phone, setPhone] = useState('')
  const [cpf, setCpf] = useState('')
  // eslint-disable-next-line
  const [imageLoading, setImageLoading] = useState(false);
  const [price, setPrice] = useState('')
  const [priceInstallation, setPriceInstallation] = useState('')
  const [total, setTotal] = useState('')

  const { idClientes, idOrder } = useParams();

  const asyncFetch = async () => {
    startLoading();
    createCommandService({
      url: `/orders/clients/${idClientes}`,
      method: APIMethods.GET,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
      },
      onSuccess: ({ data }) => {
        setClientData(data.data[0]);
        setCep(data.data[0].CEP);
        setStreet(data.data[0].street);
        setNumber(data.data[0].addressNumber);
        setComplement(data.data[0].addressComplement);
        setCity(data.data[0].city);
        setState(data.data[0].state);
        setStatus(data.data[0].status);
        setPhone(data.data[0].phone)
        setCpf(data.data[0].CPF)
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

  const getContracts = async () => {
    createCommandService({
      url: `/orders/contracts/${idOrder}`,
      method: APIMethods.GET,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
      },
      onSuccess: ({ data }) => {
        const { contracts } = data;
        setContracts(contracts)
      },
      onCustomError: (e) => {
        debugger;
      },
    });
  };

  const handleContractFiles = (_files) => {
    setImageLoading(true);
    const files = []
    _files.forEach((file) => {
      const name = file.name;
      if(name.substr(name.length-4) === '.pdf') {
        files.push(file);
      } else {
        alert("Somente arquivos do tipo PDF são aceitos");
      }
    });
    files.forEach((file) => {
      const fileReader = new FileReader();
      loadingFiles.push(1)
      setLoadingFiles([ ...loadingFiles ])

      fileReader.onload = (e) => {
        setContract((s) => [
          ...s,
          {
            url: e.target.result,
            fileEvent: file,
          },
        ]);
        updloadOneFile({
          url: e.target.result,
          fileEvent: file,
        })
        setImageLoading(false);
      };

      fileReader.readAsDataURL(file);
    });
  };
  // eslint-disable-next-line
  const handleInvoiceFiles = (files) => {
    setImageLoading(true);
    files.forEach((file) => {
      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        setInvoice((s) => [
          ...s,
          {
            url: e.target.result,
            fileEvent: file,
          },
        ]);
        setImageLoading(false);
      };

      fileReader.readAsDataURL(file);
    });
  };

  async function uploadTaskPromiseContract(file, path) {
    return new Promise((resolve, reject) => {
      const storageRef = firebase.storage().ref();
      const mountainRef = storageRef.child(path);
      const uploadTask = mountainRef.put(file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (err) => {
          console.log("error", err);
          reject();
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            const body = {
              file: downloadURL,
            };

            createCommandService({
              method: APIMethods.POST,
              payload: body,
              url: `orders/contract/${idOrder}`,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
              },
              onSuccess: ({ data }) => {
                toast.success("Arquivo salvo com sucesso!");
                console.log({data})
                resolve({ url: downloadURL, insertId: data.insertId });
              },
              onCustomError: (e) => {
                debugger;
                reject()
                console.log("Error aqui", e);
              },
            });
          });
        }
      );
    });
  }
  async function uploadTaskPromiseInvoice(file, path) {
    startLoading();
    return new Promise((resolve, reject) => {
      const storageRef = firebase.storage().ref();
      const mountainRef = storageRef.child(path);
      const uploadTask = mountainRef.put(file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (err) => {
          console.log("error", err);
          reject();
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            resolve(downloadURL);
            console.log("Down", downloadURL);
            const body = {
              file: downloadURL,
            };

            createCommandService({
              method: APIMethods.POST,
              payload: body,
              url: `orders/invoice/${idOrder}`,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
              },
              onSuccess: ({ data }) => {
                toast.success("Arquivo salvo com sucesso!");
                finishLoading();
              },
              onCustomError: (e) => {
                debugger;
                console.log("Error aqui", e);
              },
            });
          });
        }
      );
    });
  }

  const updloadOneFile = async (upload) => {
    if (upload.fileEvent) {
      const date = new Date();
      const pathFile = `/orders/${idOrder}/contract/${`${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()}-${upload.fileEvent.name}`}`;
      const { url, insertId } = await uploadTaskPromiseContract(upload.fileEvent, pathFile );
      contracts.push({
        idContract: insertId,
        file: url,
        createdAt: new Date()
      })
      loadingFiles.pop()
      setLoadingFiles([ ...loadingFiles ])
      setContracts([...contracts])
    }
  };

  // eslint-disable-next-line
  const updloadFile = async () => {
    const date = new Date();

    if (invoice.length > 0) {
      const files = [];
      for (const key in invoice) {
        let upload = invoice[key];
        if (upload.fileEvent) {
          const pathFile = `/orders/${idOrder}/invoice/${`${date.getDate()}-${
            date.getMonth() + 1
          }-${date.getFullYear()}-${upload.fileEvent.name}`}`;
          const url = await uploadTaskPromiseInvoice(
            upload.fileEvent,
            pathFile
          );
          upload = {
            name: upload.fileEvent.name,
            title: upload.title || "",
            url,
          };
        }
        files.push(upload);
      }
    }
  };

  const onSave = () => {
    if (contract.length === 0 && invoice.length === 0) {
      console.log("Nada de arquivo segue!");
    }

    startLoading();
    const date = new Date();
    date.setMonth(date.getMonth() + clientData.fidelity);
    const body = {
      email: clientData.email,
      phone: clientData.phone,
      priceMonthly: clientData.priceMonthly,
      priceInstallation: clientData.priceInstallation,
      expiredAt: status === "Contratado" ? date : " ",
      effectedAt: new Date(),
      closedAt: status === "Finalizado" ? new Date() : " ",
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
        toast.success("Registro salvo com sucesso!");
        finishLoading();
      },
      onCustomError: (e) => {
        debugger;
        console.log("Error aqui", e);
      },
    });

    if (contract.length > 0 || invoice.length > 0) {
      //updloadFile();
    }
  };

  useEffect(() => {
    asyncFetch();
    getContracts()
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const styles = useStyles();

  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Box display="flex">
        <Box>
          <BackButton
            onClick={goBack}
            label={`${clientData?.userName} ${clientData?.userSurname}`}
            simpleOnMobile
          />
        </Box>
        <Box display="flex" justifyContent="flex-end" flexGrow="1">
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
        <Grid item lg={8} md={12} sm={12} xs={12}>
          <Card className={styles.card}>
            <CardHeader title="Detalhes do plano" />
            <Divider />
            <CardContent>
              <Card className={styles.cardPlan}>
                <CardContent>
                  <Typography variant="h6">{clientData?.planName}</Typography>
                  <Box display="flex">
                    <span className={styles.divider} />
                  </Box>
                  <Box display="flex">
                    <Typography className={styles.growFieldLabel}>
                      Tecnologia:
                    </Typography>
                    <Typography>{clientData?.technology}</Typography>
                  </Box>
                  <Box display="flex">
                    <Typography className={styles.growFieldLabel}>
                      WIFI:
                    </Typography>
                    <Typography>{planDetailsWIFI[clientData?.wifi]}</Typography>
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
                      {formatFidelity(clientData?.fidelity)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
          <Card className={styles.card}>
            <CardContent>
              <Box className={styles.sectionLabel}>
                Informações do comprador
              </Box>
              <Grid container spacing={2}>
                <Grid item container spacing={2}>
                  <Grid item lg={6} xs={12}>
                    <FieldLabel
                      fullWidth
                      label="Nome do cliente"
                      fieldValue={`${clientData?.userName} ${clientData?.userSurname}`}
                    />
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <FieldLabel label="E-mail" fieldValue={clientData?.email} />
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
                    <FieldLabel
                      label="CPF"
                      fieldValue={cpfMask(cpf)}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Typography className={styles.sectionLabel}>Endereço</Typography>
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
                        onChange={(e) => setCep(e.target.value)}
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
                        // onChange={fulfillData.bind(null, "street")}
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
                        //onChange={fulfillData.bind(null, "addressNumber")}
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
                        //onChange={fulfillData.bind(null, "state")}
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
            <CardHeader title="Status" />
            <CardContent>
              <Box display="flex" flexGrow="1">
                O usuário se encontra:
              </Box>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                defaultValue={status}
                fullWidth
              >
                <MenuItem value="solicitado">
                  <Typography fullWidth>Solicitado</Typography>
                </MenuItem>
                <MenuItem value="contratado">Contratado</MenuItem>
                <MenuItem value="finalizado">Cancelado</MenuItem>
              </Select>
            </CardContent>
          </Card>
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
            <CardHeader title="Anexos" />
            <CardContent>
              <Box>
                <Typography className={styles.attachLabel}>
                  Contratos
                </Typography>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                  {loadingFiles.map((i, idx) => (
                    <div key={`key_${idx}`} style={{width:70, height:90, marginRight:10, display:'flex', justifyContent:'center', alignItems:'center', border: '1px solid', borderRadius: 10}}>
                      <ReactLoading type={'spin'} color={'blue'} height={40} width={40} />
                    </div>
                  ))}
                  {contracts.map(item => {
                    const date = new Date(item.createdAt)
                    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
                    const month = (date.getMonth()+1) < 10 ? `0${(date.getMonth()+1)}` : (date.getMonth()+1);
                    return (
                      <div key={`key_${item.idContract}`} onClick={() => window.open(item.file)} style={{width:70, height:90, marginRight:10, display:'flex', flexDirection: 'column', justifyContent:'center', alignItems:'center', border: '1px solid', borderRadius: 10}}>
                        <img src={pdfIcon} alt="Logo" height={40} width={40} />
                        <span style={{fontSize: 11, textAlign: 'center'}}>Contrato {day}/{month}/{date.getFullYear()}</span>
                      </div>
                  )})}
                </div>
                <Box>
                  <BoxUpload onDrop={handleContractFiles} />
                </Box>
              </Box>
              {/*<Box>
                <Typography className={styles.attachLabel}>Faturas</Typography>
                <Box>
                  <BoxUpload onDrop={handleInvoiceFiles} />
                </Box>
              </Box>*/}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
