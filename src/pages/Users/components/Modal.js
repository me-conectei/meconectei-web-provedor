import * as React from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import axios from "axios";
import toast from "utils/toast";
import firebase from '../../../firebase'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  CardContent,
  Divider,
  FormGroup,
  CardHeader,
  TextField,
  Checkbox,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonBtn: {
    backgroundColor: "#0147E9",
    color: "#ffffff",
    width: 262,
    height: 48,
  },
  sendBtn: {
    backgroundColor: "#46CE7D",
    color: "#ffffff",
    width: 177,
    height: Box,
    borderRadius: 8,
  },
  cancelBtn: {
    backgroundColor: "#a7a7a7",
    color: "#ffffff",
    width: 177,
    height: Box,
    borderRadius: 8,
  },
}));

const checkedOptions = (value) => {
  if (value === false) {
    return 0;
  } else if (value === true) {
    return 1;
  }
};

export default function ModalDialog() {
 // const { isLoading, startLoading, finishLoading } = useSessionContext();
  const [open, setOpen] = React.useState(false);
  const [order, setOrder] = useState(false);
  const [client, setClient] = useState(false);
  const [plan, setPlan] = useState(false);
  const [support] = useState(false);
  const [evaluation, setEvaluation] = useState(false);
  const [impulse, setImpulse] = useState(false);
  const [myaccount, setMyaccount] = useState(false);
  const [user, setUser] = useState(false);
  const [occupationArea, setOccupationArea] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password]= useState('adminpassword')

  const styles = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addUser = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((users) => {
        firebase.auth().sendPasswordResetEmail(email).then(()=>{
          console.log('email enviado')
          const body = {
            uidUser: users.user.uid,
            name: name,
            surname: ' ',
            email: email,
            order: checkedOptions(order),
            client: checkedOptions(client),
            plan: checkedOptions(plan),
            support: checkedOptions(support),
            evaluation: checkedOptions(evaluation),
            impulse: checkedOptions(impulse),
            myaccount: checkedOptions(myaccount),
            user: checkedOptions(user),
            occupationArea: checkedOptions(occupationArea),
          };  
          axios.post(
            `https://api-ieaqui.avamobile.com.br/company/users/`,
            body,{
              headers: {
                Authorization: `Bearer ${localStorage.getItem("sessionToken")}`
              }
            }).then(()=>{
              toast.success("Registro salvo com sucesso!");
              console.log('Convite enviado')
              handleClose()
            }).catch((err)=>{
              console.log(err)
            })  
        }).catch((err)=>{
          console.log(err)
        })      
      })
      .catch((err) => {
        console.log(err);
      });
   
  };

  
  return (
    <React.Fragment>
      <Button className={styles.buttonBtn} onClick={handleClickOpen}>
        Convidar Usuário
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Convidar usuário para acesso a plataforma</DialogTitle>
        <DialogContent>
          <Grid item>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item container spacing={2}>
                  <Grid item lg={12} xs={12}>
                    <FormControl className={styles.formControl} fullWidth>
                      <TextField
                        label="Nome"
                        variant="outlined"
                        size="small"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item container spacing={2}>
                  <Grid item lg={12} xs={12}>
                    <FormControl className={styles.formControl} fullWidth>
                      <TextField
                        label="E-mail"
                        variant="outlined"
                        size="small"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item container spacing={2} direction="column">
                  <CardHeader title="Opções de acesso" />
                  <Divider />
                  <Grid>
                    <Box display="flex">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="primary"
                              value={order}
                              onChange={() => setOrder(!order)}
                            />
                          }
                          label="Solicitações"
                        />
                      </FormGroup>
                    </Box>
                    <Divider />
                    <Box display="flex">
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox color="primary" value={client}
                          onChange={() => setClient(!client)} />}
                          label="Clientes"
                        />
                      </FormGroup>
                    </Box>
                    <Divider />
                    <Box display="flex">
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox color="primary" value={plan}
                          onChange={() => setPlan(!plan)} />}
                          label="Planos"
                        />
                      </FormGroup>
                    </Box>
                    <Divider />
                    <Box display="flex">
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox color="primary" value={support}
                          onChange={() => setOrder(!support)} />}
                          label="Suporte"
                        />
                      </FormGroup>
                    </Box>
                    <Divider />
                    <Box display="flex">
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox color="primary" value={evaluation}
                          onChange={() => setEvaluation(!evaluation)}/>}
                          label="Avaliações"
                        />
                      </FormGroup>
                    </Box>
                    <Divider />
                    <Box display="flex">
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox color="primary" value={impulse}
                          onChange={() => setImpulse(!impulse)} />}
                          label="Impulsionar"
                        />
                      </FormGroup>
                    </Box>
                    <Divider />
                    <Box display="flex">
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox color="primary" value={myaccount}
                          onChange={() => setMyaccount(!myaccount)}/>}
                          label="Minha Conta"
                        />
                      </FormGroup>
                    </Box>
                    <Divider />
                    <Box display="flex">
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox color="primary" value={user}
                          onChange={() => setUser(!user)} />}
                          label="Usuários"
                        />
                      </FormGroup>
                    </Box>
                    <Divider />
                    <Box display="flex">
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox color="primary" value={occupationArea}
                          onChange={() => setOccupationArea(!occupationArea)}/>}
                          label="Área de atuação"
                        />
                      </FormGroup>
                    </Box>
                    <Divider />
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button className={styles.cancelBtn} onClick={handleClose}>
            Cancelar
          </Button>
          <Button className={styles.sendBtn} onClick={addUser}>
            Enviar Convite
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
