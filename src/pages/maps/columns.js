const columns = [
    {
        name: "idRegion",
        options: {
            display: "excluded",
            filter: false,
            sort: false,
        }
    },
    {
      name: "state",
      label: "Estado",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "city",
      label: "Cidade",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "name",
      label: "Nome da área",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        sort: true,
      },
    },
  ];

  export default columns;