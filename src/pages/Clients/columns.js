import masks from '../../utils/masks'

const phoneMask = value => {
    return value
    .replace(/\D+/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
    .replace(/(-\d{4})\d+?$/, '$1');
}


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
        name: "uidUser",
        options: {
            display: "excluded",
            filter: false,
            sort: false,
        }
    },   
    {
        name: "idOrder",
        options: {
            display: "excluded",
            filter: false,
            sort: false,
        }
    },   
    {
        name: "userName",
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
        name: "phone",
        label: "Telefone",
        options: {
            filter: true,
            sort: true,
            customBodyRender: (value) =>{
                return phoneMask(value)
            }
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
        name: "planName",
        label: "Plano",
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: "priceMonthly",
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