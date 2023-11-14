import React, { useEffect, useState } from "react";

import {
    Box,
    Grid,
    Card,
    CardContent,
    FormControl,
    Tooltip,
    Button,
    TextField,
} from "@material-ui/core";

import Image from "material-ui-image";

import toast from "utils/toast";
import { createCommandService, APIMethods } from "services";

import ImageOutlined from "@material-ui/icons/ImageOutlined";

import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/styles";


import BackButton from "components/BackButton";

import { useSessionContext } from "context/UserSessionContext";
import firebase from "../../firebase";

const useStyles = makeStyles(theme => ({
    buttonAccess: {
        marginRight: 20,
        ...theme.button.default,
    },
    buttonSave: theme.button.save,
    flexibleBox: {
        display: "flex",
    },
    columnFlexDirection: {
        display: "flex",
        flexDirection: "column",
    },
    expandedField: {
        flexGrow: 1,
    },
    containerCards: {
        display: "flex",
    },
    column: {
        paddingTop: "10px",
    },
    firstColumn: {
        width: "60%",
        paddingRight: "20px",
    },
    secondColumn: {
        width: "40%"
    },
    card: {
        marginTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
    },
    formControl: {
        paddingTop: 10,
    },
    cardContentImage: {
        padding: 10,
    },
    containerImage: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 220,
        minWidth: 220,
        border: "2px dashed #c1c1c2",
        color: "#c1c1c2",
        borderRadius: 10,
        transition: "border 200ms, color 200ms",
        "&:hover": {
            color: "#536dfe",
            border: "2px dashed #536dfe",
            cursor: "pointer",
        },
        "&:nth-child(1)": {
            border: "none",
        }
    },
    labelImage: {
        width: 200,
        height: 200,
    },
    sectionLabel: {
        fontWeight: "bold",
        fontSize: 16,
        paddingTop: 20,
        paddingBottom: 10,
        "&:first-child": {
            paddingTop: 5,
        }
    },
    largeIcon: {
        width: "100%",
        height: "100%",     
    }
}));

const acceptedAttachTypes = [
    "image/png",
    "image/gif",
    "image/jpeg",
];

export default function Account() {
    const { isLoading, startLoading, finishLoading } = useSessionContext();
    const [companies, setCompanies] = useState({})

   const asyncFetch =  () => {
        startLoading();
        createCommandService({
            url: "company",
            method: APIMethods.GET,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("sessionToken")}`
              },
            onSuccess: ({ data }) => {
                setCompanies(data.data)
                finishLoading();
            },
            onCustomError: e => {
                debugger;
            }
        });
        
    } 

    useEffect(() => {
        asyncFetch();
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps 
    
    const styles = useStyles();

    const history = useHistory();

    const goBack = () => {
        history.goBack()
    }

    if (isLoading) {
        return null;
    }

    const handleImage = ({ target: { files } }) => {
        const image = files?.[0];        

        if (!acceptedAttachTypes.includes(image.type)) {
            alert("Selecione apenas arquivos de imagem!");

            return null;
        }

        //fulfillImage(image);
        onChangeData({ image });
    };

    let imageComponent = <ImageOutlined className={styles.largeIcon} />;

    if (companies?.image) {
        let formattedURL = companies.image;

        if (typeof formattedURL === "object") {
            formattedURL = URL.createObjectURL(formattedURL);
        }

        imageComponent = (
            <Image
                src={formattedURL}
                disableTransition
                loading={null}
                imageStyle={{ borderRadius: 5, }}

            />
        );
    }

    const onChangeData = (json) => {
        setCompanies({ ...companies, ...json })
    }

    const onChangeDataBind = (key) => {
        return (data) => {
            console.log({key, data: data.target.value})
            onChangeData({ [key]: data.target.value })
        }
    };

    const uploadFiles = (files) => {
        return new Promise((resolve, reject) => {
            const filename = `${(new Date()).getTime()}_${files.name}`;
            const uploadTask = firebase
            .storage()
            .ref(`imageCompany/${filename}`)
            .put(files);
        
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                },
                (error) => {
                    console.log(error);
                    reject(error);
                },
                () => {
                    firebase
                    .storage()
                    .ref("imageCompany")
                    .child(`${filename}`)
                    .getDownloadURL()
                    .then((url) => {
                        console.log('URL', url)
                        resolve(url);
                    });
                },
            );
        });
    };

    const onSave = async () => {
        startLoading();
        if (typeof companies.image === "object") {
            companies.image = await uploadFiles(companies.image);
        }
        createCommandService({
            url: "company",
            method: APIMethods.PUT,
            payload: companies,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("sessionToken")}`
              },
            onSuccess: ({ data }) => {
                toast.success("Dados salvos com sucesso!");
                finishLoading();
            },
            onCustomError: e => {
                console.log({ e })
            }
        });
    };

    return (
        <>
            <Box display="flex">
                <Box>
                    <BackButton
                        onClick={goBack}
                        label="Conta"
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
                <Grid item lg={3} md={12} sm={12} xs={12}>
                    <Card className={styles.card}>
                        <CardContent className={styles.cardContentImage}>
                            <Box className={styles.sectionLabel}>
                                Minha logo
                            </Box>
                            <Tooltip title="Buscar imagem">
                                <Box className={styles.containerImage}>
                                    <label htmlFor="image" className={styles.labelImage}>
                                        <div>                                            
                                            {imageComponent}
                                        </div>
                                    </label>
                                    <input
                                        id="image"
                                        type="file"
                                        hidden
                                        accept={acceptedAttachTypes.toString()}
                                        onChange={handleImage}
                                    />
                                </Box>
                            </Tooltip>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item lg={9} md={12} sm={12} xs={12}>
                    <Card className={styles.card}>
                        <CardContent>
                            <Box className={styles.sectionLabel}>
                                Meus dados
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item lg={12} xs={12}>
                                    <FormControl className={styles.formControl} fullWidth>
                                        <TextField
                                            label="Nome Fantasia"
                                            variant="outlined"
                                            size="small"
                                            defaultValue={companies?.fantasyName}
                                            onChange={onChangeDataBind("fantasyName")}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={12} xs={12}>
                                    <FormControl className={styles.formControl} fullWidth>
                                        <TextField
                                            label="Razão social"
                                            variant="outlined"
                                            size="small"
                                            defaultValue={companies?.socialReason}
                                            onChange={onChangeDataBind("socialReason")}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={6} xs={12}>
                                    <FormControl className={styles.formControl} fullWidth>
                                        <TextField
                                            label="CNPJ"
                                            variant="outlined"
                                            size="small"
                                            defaultValue={companies?.CNPJ}
                                            onChange={onChangeDataBind("CNPJ")}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={6} xs={12}>
                                    <FormControl className={styles.formControl} fullWidth>
                                        <TextField
                                            label="Inscrição Estadual"
                                            variant="outlined"
                                            size="small"
                                            defaultValue={companies?.IE}
                                            onChange={onChangeDataBind("IE")}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Box className={styles.sectionLabel}>
                                Contato
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item lg={6} xs={12}>
                                    <FormControl className={styles.formControl} fullWidth>
                                        <TextField
                                            label="E-mail"
                                            variant="outlined"
                                            size="small"
                                            defaultValue={companies?.emailCommercial}
                                            onChange={onChangeDataBind("emailCommercial")}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={6} xs={12}>
                                    <FormControl className={styles.formControl} fullWidth>
                                        <TextField
                                            label="Telefone"
                                            variant="outlined"
                                            defaultValue={companies?.phoneCommercial}
                                            onChange={onChangeDataBind("phoneCommercial")}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Box className={styles.sectionLabel}>
                                Responsável pelo Provedor
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item lg={6} xs={12}>
                                    <FormControl className={styles.formControl} fullWidth>
                                        <TextField
                                            label="E-mail"
                                            variant="outlined"
                                            size="small"
                                            defaultValue={companies?.emailProvider}
                                            onChange={onChangeDataBind("emailProvider")}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={6} xs={12}>
                                    <FormControl className={styles.formControl} fullWidth>
                                        <TextField
                                            label="Telefone"
                                            variant="outlined"
                                            size="small"
                                            defaultValue={companies?.phoneProvider}
                                            onChange={onChangeDataBind("phoneProvider")}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Card className={styles.card}>
                        <CardContent>
                            <Box className={styles.sectionLabel}>
                                Suporte
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item lg={6} xs={12}>
                                    <FormControl className={styles.formControl} fullWidth>
                                        <TextField
                                            label="E-mail"
                                            variant="outlined"
                                            size="small"
                                            defaultValue={companies?.emailSupport}
                                            onChange={onChangeDataBind("emailSupport")}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={6} xs={12}>
                                    <FormControl className={styles.formControl} fullWidth>
                                        <TextField
                                            label="Telefone"
                                            variant="outlined"
                                            size="small"
                                            defaultValue={companies?.phoneSupport}
                                            onChange={onChangeDataBind("phoneSupport")}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={12} xs={12}>
                                    <FormControl className={styles.formControl} fullWidth>
                                        <TextField
                                            label="Whatsapp de suporte"
                                            variant="outlined"
                                            size="small"
                                            defaultValue={companies?.whatsapp}
                                            onChange={onChangeDataBind("whatsapp")}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Card className={styles.card}>
                        <CardContent>
                            <Box className={styles.sectionLabel}>
                                Endereço
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item lg={6} xs={12}>
                                    <FormControl className={styles.formControl} fullWidth>
                                        <TextField
                                            label="CEP"
                                            variant="outlined"
                                            size="small"
                                            defaultValue={companies?.CEP}
                                            onChange={onChangeDataBind("CEP")}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={6} xs={12}>
                                    <FormControl className={styles.formControl} fullWidth>
                                        <TextField
                                            label="Rua"
                                            variant="outlined"
                                            size="small"
                                            defaultValue={companies?.street}
                                            onChange={onChangeDataBind("street")}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} xs={12}>
                                    <FormControl className={styles.formControl} fullWidth>
                                        <TextField
                                            label="Número"
                                            variant="outlined"
                                            size="small"
                                            defaultValue={companies?.addressNumber}
                                            onChange={onChangeDataBind("addressNumber")}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} xs={12}>
                                    <FormControl className={styles.formControl} fullWidth>
                                        <TextField
                                            label="Complemento"
                                            variant="outlined"
                                            size="small"
                                            defaultValue={companies?.addressComplement}
                                            onChange={onChangeDataBind("addressComplement")}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} xs={12}>
                                    <FormControl className={styles.formControl} fullWidth>
                                        <TextField
                                            label="Cidade"
                                            variant="outlined"
                                            size="small"
                                            defaultValue={companies?.city}
                                            onChange={onChangeDataBind("city")}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} xs={12}>
                                    <FormControl className={styles.formControl} fullWidth>
                                        <TextField
                                            label="Estado"
                                            variant="outlined"
                                            size="small"
                                            defaultValue={companies?.addressDistrict}
                                            onChange={onChangeDataBind("addressDistrict")}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
  );
}
