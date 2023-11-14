import moment from "moment";

const columns = [
    {
        name: "idSupport",
        label: "Chamado N°",
        options: {
            filter: false,
            sort: true,
        }
    },
    {
        name: "fantasyName",
        label: "Nome Provedor",
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: "userName",
        label: "Cliente",
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: "createdAt",
        label: "Data Início",
        options: {
            filter: true,
            sort: true,
            customBodyRender: data => {
                const date = moment(data);
                const formattedDate = date.utc().format("DD/MM/YYYY - HH:mm");
                
                return (
                    <p>
                        {formattedDate}
                    </p>
                );
            },
        },
    },
    {
        name: "closedAt",
        label: "Data Final",
        options: {
            filter: true,
            sort: true,
            customBodyRender: data => {
                const date = moment(data);
                const formattedDate = date.utc().format("DD/MM/YYYY HH:mm");

                return (
                    <p>
                        {formattedDate}
                    </p>
                );
            },
        },
    },
    {
        name: "status",
        label: "Status",
        options: {
            filter: true,
            sort: true,
        }
    },
];

export default columns;