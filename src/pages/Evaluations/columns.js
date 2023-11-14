const columns = styles => {    
    return [
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
            name: "general",
            label: "Ava. Geral",
            options: {
                filter: true,
                sort: true,
                customBodyRender: data => (
                    <p className={styles.general}>
                        {data}
                    </p>
                )
            }
        },
        {
            name: "instaltion",
            label: "Ava. Instalação",
            options: {
                filter: true,
                sort: true,
                customBodyRender: data => (
                    <p className={styles.instaltion}>
                        {data}
                    </p>
                )
            }
        },
        {
            name: "wifi",
            label: "Ava. WIFI",
            options: {
                filter: true,
                sort: true,
                customBodyRender: data => (
                    <p className={styles.wifi}>
                        {data}
                    </p>
                ),
            }
        },
        {
            name: "support",
            label: "Ava. Suporte",
            options: {
                filter: true,
                sort: true,
                customBodyRender: data => (
                    <p className={styles.support}>
                        {data}
                    </p>
                ),
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
}

export default columns;