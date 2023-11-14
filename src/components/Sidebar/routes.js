import {
    PieChart as PieChartIcon,
} from "@material-ui/icons";

import { ReactSVG } from "react-svg";
// import Dot from "./components/Dot";
import Clients from '../../images/clients.svg'
import PlansIcon from '../../images/plans.svg'
import Eval from '../../images/eval.svg'
import Marketing from '../../images/digital-marketing.svg'
import Account from '../../images/account.svg'
import User from '../../images/user.svg'
import Area from '../../images/map.svg'
import Sent from '../../images/sent.svg'

const routes = [
    {
        id: "INDICADORES",
        label: "Indicadores",
        link: "/app/indicadores",
        icon: <PieChartIcon />
    },
    {
        id: "SOLICITACOES",
        label: "Solicitações",
        link: "/app/solicitacoes",
        icon: <ReactSVG src={Sent} />
    },
    {
        id: "CLIENTES",
        label: "Clientes",
        link: "/app/clientes",
        icon: <ReactSVG src={Clients} />
    },
    {
        id: "PLANOS",
        label: "Planos",
        link: "/app/planos",
        icon: <ReactSVG src={PlansIcon} />
    },
    
    {
        id: "AVALIACOES",
        label: "Avaliações",
        link: "/app/avaliacoes",
        icon: <ReactSVG src={Eval} />
    },
     {
         id: "ADS",
         label: "Impulsionar",
         link: "/app/impulsionamentos",
         icon: <ReactSVG src={Marketing} />,
     },
    {
        id: "Conta",
        label: "Minha Conta",
        link: "/app/minha-conta",
        icon: <ReactSVG src={Account} />
    },
    {
        id: "USUARIOS",
        label: "Usuários",
        link: "/app/usuarios",
        icon: <ReactSVG src={User} />
    },
    {
        id: "ÁREA",
        label: "Área de atuação",
        link: "/app/area",
        icon: <ReactSVG src={Area} />
    },
];

export default routes;