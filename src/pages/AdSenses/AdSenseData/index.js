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
  Divider,
  FormControlLabel,
  FormGroup,
  Checkbox,
} from "@material-ui/core";
import { createCommandService, APIMethods } from "services";

import BackButton from "components/BackButton";

import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/styles";

import { useSessionContext } from "context/UserSessionContext";

import masks from "utils/masks";

import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  divider: theme.divider,
  buttonSave: theme.button.save,
  card: {
    marginTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 16,
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
    color: "#868686",
  },
  totalPrice: {
    color: "black",
    fontWeight: "bold",
  },
}));



export default function AdSenseData() {
  const [title, setTitle] = useState("");
  const [effectedAt, setEffectedAt] = useState('');
  const [expiredAt, setExpiredAt] = useState('');
  const [days, setDays] = useState(0);
  const [pricePerDay] = useState(500);
  const [plans, setPlans] = useState([]);
  const [plansSetted, setPlansSetted] = useState({});
  const { isLoading, startLoading, finishLoading } = useSessionContext();

  const asyncFetch = async () => {
    startLoading();
    //await fetchUserData(uidUser);
    loadPlans();
  };


  useEffect(() => {
    asyncFetch();
    loadPlans();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPlans = () => {
    createCommandService({
      url: "/plans",
      method: APIMethods.GET,
      onSuccess: ({ data }) => {
        const plansSetted = {}
        data.data.forEach(plan => {
          plansSetted[plan.idPlan] = false;
        })
        setPlans(data.data);
        setPlansSetted(plansSetted);
        finishLoading();
      },
      onCustomError: () => {
        debugger;
      },
    });
  };

  useEffect(() => {
    if(!effectedAt || !expiredAt) {
      setDays(0);
      return;
    }
    const effected = (new Date(effectedAt)).getTime();
    const expired = (new Date(expiredAt)).getTime();
    if(effected >= expired) {
      setDays(0);
      return;
    }
    setDays((expired-effected)/86400000);
  }, [effectedAt, expiredAt]);

  const onSave = async () => {
    if(!title) {
      toast.error("Por favor preencha o nome");
      return;
    }
    if(!effectedAt) {
      toast.error("Por favor preencha a data de início");
      return;
    }
    if(!expiredAt) {
      toast.error("Por favor preencha a data final");
      return;
    }
    if(days <= 0) {
      toast.error("A data de início deve ser menor que a data final");
      return;
    }
    const plansKey = [];
    Object.keys(plansSetted).forEach(key => {
      if(plansSetted[key])
        plansKey.push(key)
    })
    if(plansKey.length === 0) {
      toast.error("Você precisa setar pelo menos um plano");
      return;
    }

    startLoading();
    createCommandService({
      method: APIMethods.POST,
      payload: {
        title,
        plans: plansKey,
        effectedAt: effectedAt,
        expiredAt: expiredAt,
        quantityPlan: days*pricePerDay
      },
      url: `impulse/new`,
      onSuccess: () => {
        toast.success("Plano atualizado com sucesso!");
        finishLoading();
        history.goBack();
      },
      onCustomError: (e) => {
        debugger;
        toast.error("Por favor preencha todos os campos")
        console.log("Esse é o erro", e);
        finishLoading();
      },
    });
  };

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
          <BackButton onClick={goBack} label="Campanha" simpleOnMobile />
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
            <CardContent>
              <Box className={styles.sectionLabel}>Campanha</Box>
              <Grid container spacing={2}>
                <Grid item container spacing={2}>
                  <Grid item lg={12} xs={12}>
                    <FormControl className={styles.formControl} fullWidth>
                      <TextField
                        label="Nome da campanha"
                        variant="outlined"
                        size="small"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item container spacing={2}>
                  <Grid item lg={6} xs={12}>
                    <FormControl className={styles.formControl} fullWidth>
                      <label style={{marginBottom: 5}}>Data de início</label>
                      <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        onChange={(e) => setEffectedAt(e.target.value)}
                        value={effectedAt}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <FormControl className={styles.formControl} fullWidth>
                      <label style={{marginBottom: 5}}>Data final</label>
                      <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        onChange={(e) => setExpiredAt(e.target.value)}
                        value={expiredAt}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                {/*<Grid item container spacing={2}>
                  <Grid item lg={6} xs={12}>
                    <FormControl className={styles.formControl} fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Estado
                      </InputLabel>
                      <Select
                        value="Santa Catarina"
                        //onChange={fulfillData.bind(null, "status")}
                        label="Estado"
                        fullWidth
                      >
                        <MenuItem value={"fibra"}>
                          <Typography fullWidth>Santa Catarina</Typography>
                        </MenuItem>
                        <MenuItem value={"radio"}>Rio de Janeiro</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <FormControl className={styles.formControl} fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Cidade
                      </InputLabel>
                      <Select
                        value="Joinville"
                        //onChange={fulfillData.bind(null, "status")}
                        label="WIFI"
                        fullWidth
                      >
                        <MenuItem value={"incluso"}>
                          <Typography fullWidth>Joinville</Typography>
                        </MenuItem>
                        <MenuItem value={"não incluso"}>Florianópolis</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>*/}
                <Grid item container spacing={2} direction="column">
                  <CardHeader title="Planos" />
                  <Divider />
                  <Grid>
                    {plans.map(plan => (
                      <>
                        <Box display="flex">
                          <FormGroup>
                            <FormControlLabel
                              control={<Checkbox color="primary"
                                onChange={(e, checked) => {
                                  plansSetted[plan.idPlan] = checked;
                                  setPlansSetted({...plansSetted})
                                }}
                                checked={plansSetted[plan.idPlan]}
                              />}
                              label={plan.planName}
                            />
                          </FormGroup>
                        </Box>
                        <Divider />
                      </>
                    ))}
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
                A campanha está como:
              </Box>
              <Typography
                variant="h4"
                style={{ color: "#0073FF", marginTop: 8 }}
              >
                Pendente de aprovação
              </Typography>
            </CardContent>
          </Card>
          <Card className={styles.cards}>
            <CardHeader title="Detalhes do pagamento" />
            <CardContent>
              <Box display="flex">
                <Typography className={styles.growFieldLabel}>
                  Custo por dia:
                </Typography>
                <Typography>{masks.money(`${pricePerDay}`)}</Typography>
              </Box>
              <Box display="flex">
                <Typography className={styles.growFieldLabel}>
                  Quantidade
                </Typography>
                <Typography>{days} {days !== 1 ? 'dias' : 'dia'}</Typography>
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
                <Typography>{masks.money(`${days*pricePerDay}`)}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
