import React, { useEffect } from "react";

import {
    Card,
    CardContent,
    CardHeader,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    Typography,
} from "@material-ui/core";

import { useSessionContext } from "context/UserSessionContext";
import { usePessoasInteressadasContext } from "./context";

import PageTitle from "components/PageTitle";
import masks from "utils/masks";

const STATUS_OPCOES = [
    { value: "novo", label: "Novo" },
    { value: "contatado", label: "Contatado" },
    { value: "em_negociacao", label: "Em negociação" },
    { value: "convertido", label: "Convertido" },
    { value: "descartado", label: "Descartado" },
];

function formatPhone(value) {
    if (!value) return "-";
    return masks.phone(value.replace(/\D/g, ""));
}

function formatDate(value) {
    if (!value) return "-";
    const d = new Date(value);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export default function PessoasInteressadas() {
    const { plans, fetchPlanosInteressados, updateInteressadoStatus } = usePessoasInteressadasContext();
    const { isLoading, startLoading, finishLoading } = useSessionContext();

    useEffect(() => {
        startLoading();
        fetchPlanosInteressados().finally(() => finishLoading());
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (isLoading) {
        return null;
    }

    return (
        <>
            <PageTitle title="Pessoas interessadas" />
            <Grid container spacing={4}>
                {plans.length === 0 && (
                    <Grid item xs={12}>
                        <Typography color="textSecondary">Nenhum plano com pessoas interessadas no momento.</Typography>
                    </Grid>
                )}
                {plans.map(plan => (
                    <Grid item xs={12} key={plan.idPlan}>
                        <Card>
                            <CardHeader
                                title={plan.planName || `Plano #${plan.idPlan}`}
                                subheader={`${plan.velocity || "-"} MB · ${(plan.interessados || []).length} interessado(s)`}
                            />
                            <CardContent>
                                {(plan.interessados || []).length === 0 ? (
                                    <Typography color="textSecondary">Nenhum interessado neste plano.</Typography>
                                ) : (
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>E-mail</TableCell>
                                                <TableCell>Telefone</TableCell>
                                                <TableCell>Data</TableCell>
                                                <TableCell>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {plan.interessados.map(row => (
                                                <TableRow key={row.id}>
                                                    <TableCell>{row.email || "-"}</TableCell>
                                                    <TableCell>{formatPhone(row.phone)}</TableCell>
                                                    <TableCell>{formatDate(row.createdAt)}</TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={row.status || "novo"}
                                                            onChange={e => updateInteressadoStatus(row.id, e.target.value)}
                                                            displayEmpty
                                                            size="small"
                                                            style={{ minWidth: 160 }}
                                                        >
                                                            {STATUS_OPCOES.map(op => (
                                                                <MenuItem key={op.value} value={op.value}>
                                                                    {op.label}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}
