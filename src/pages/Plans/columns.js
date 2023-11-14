import masks from '../../utils/masks'

const formatInstalationPrice = (price) => {

    const value = price.toString()

    if (price !== 0 && !price) {
      return null;
    }
  
    if (price === 0) {
      return "Grátis";
    }
  
    return masks.money(value)
  };

const columns = [
    {
        name: "idPlan",
        options: {
            display: "excluded",
            filter: false,
            sort: false,
        }
    },
    {
        name: "planName",
        label: 'Nome do Plano',
        options: {
            filter: false,
            sort: true,
        }
    },
    {
        name: "velocity",
        label: "Velocidade",
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: "expiredAt",
        label: "Validade",
        options: {
            filter: true,
            sort: true,
            customBodyRender:(value) =>{
                console.log('data aqui', new Date(value).getFullYear())
                const date = new Date(value)
                return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
            }
        }
    },
    {
        name: "priceInstallation",
        label: "Preço da instalação",
        options: {
            filter: true,
            sort: true,
            customBodyRender: (value) =>{
                return formatInstalationPrice(value)
            }
        }
    },
   
    {
        name: "price",
        label: "Valor",
        options: {
            filter: true,
            sort: true,
            customBodyRender: (value) =>{
                return formatInstalationPrice(value)
            }
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