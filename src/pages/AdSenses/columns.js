const columns = [
    {
        name: "idCompany",
        options: {
            display: "excluded",
            filter: false,
            sort: false,
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
        name: "city",
        label: "Cidade",
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: "state",
        label: "Estado",
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: "quantity",
        label: "Usuários",
        options: {
            filter: true,
            sort: true,
        }
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