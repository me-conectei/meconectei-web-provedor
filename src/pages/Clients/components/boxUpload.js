import React from "react";
import { useDropzone } from "react-dropzone";
import AttachFile from "@material-ui/icons/AttachFile";
import { Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  dropzone: {
    height: 150,
    background: "#fbfbfd",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    outline: 1,
    border: "2px dashed gray",
    transition: "height 0.2s ease",
    marginBottom: 8,
  },
  icon: {
    marginBottom: 16,
    fontSize: 32,
  },
  typography2: {
    color: "#3d80ff",
    marginTop: 8,
  },
}));

const BoxUpload = ({ onDrop }) => {
  const {
    getRootProps,
    getInputProps,
    open,
    isDragActive,
    isDragReject,
  } = useDropzone({
    onDrop,
  });

  const styles = useStyles();

  return (
    <>
      <div
        className={styles.dropzone}
        {...getRootProps()}
        isDragActive={isDragActive}
        isDragReject={isDragReject}
      >
        <input {...getInputProps()} />
        <AttachFile className={styles.icon} />
        <Button onClick={open} variant="outlined">
          Adicionar arquivo
        </Button>
        <Typography variant="paragraph" className={styles.typography2}>
          Ou arraste e solte os arquivos aqui
        </Typography>
      </div>
    </>
  );
};

export default BoxUpload;
