import MUIDataTable from "mui-datatables";
import React from "react";

import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

const customizedTheme = (tableProps) => createMuiTheme({
    overrides: {
        MuiTableRow: {
            root: {
                "&$hover:hover": {
                    cursor: (!!tableProps?.options?.onRowClick && "pointer") || "auto",
                },
            },
        },
    },
});

const SafeMUIDataTable = React.forwardRef((props, ref) => {
    const filteredProps = { ...props };
    delete filteredProps.isEmpty;
    delete filteredProps.tickFormatter;
    
    return <MUIDataTable ref={ref} {...filteredProps} />;
});

SafeMUIDataTable.displayName = 'SafeMUIDataTable';

export default function DataTable(props) {
    const { isEmpty, tickFormatter, ...filteredProps } = props;
    
    return (
        <MuiThemeProvider theme={customizedTheme(filteredProps)}>
            <SafeMUIDataTable
                {...filteredProps}
                options={{
                    ...filteredProps.options,
                    selectableRows: "none",
                    textLabels: {
                        body: {
                            noMatch: 'Desculpe, não encontramos nenhum registro!',
                            toolTip: 'Ordenar',
                        },
                        pagination: {
                            next: 'Próxima página',
                            previous: 'Página anterior',
                            rowsPerPage: 'Registros por página:',
                            displayRows: 'de',
                            jumpToPage: 'Pular para página:',
                        },
                        toolbar: {
                            search: 'Pesquisa rápida',
                            downloadCsv: 'Download CSV',
                            print: 'Imprimir',
                            viewColumns: 'Configurar colunas',
                            filterTable: 'Filtros avançados',
                        },
                        filter: {
                            all: "Todos",
                            title: "Filtros avançados",
                            reset: "Limpar filtros",
                        },
                        viewColumns: {
                            title: 'Configurar colunas',
                            titleAria: 'Mostrar/esconder colunas',
                        },
                    }
                }}
            />
        </MuiThemeProvider>
    );
}