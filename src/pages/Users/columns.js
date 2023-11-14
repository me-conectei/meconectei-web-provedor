
const columns = [
    {
        name: "uidUser",
        options: {
            display: "excluded",
            filter: false,
            sort: false,
        }
    },
   
    {
        name: "name",
        label: "Usuário",
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: "email",
        label: "E-mail",
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