import React from "react";
import {
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import classnames from "classnames";

import useStyles from "./styles";

import Header from "components/Header";
import Sidebar from "components/Sidebar";

import Dashboard from "pages/Dashboard";
import Users from "pages/Users";
import UserData from "pages/Users/UserData";
import AdSenses from "pages/AdSenses";
import Support from "pages/Support";

import { useLayoutState } from "context/LayoutContext";
import Requests from "pages/Requests";
import RequestsData from "pages/Requests/RequestsData";
import PlanScreen from "pages/Plans";
import PlansData from 'pages/Plans/PlansData'
import Evaluations from "pages/Evaluations";
import Clients from "pages/Clients/index";
import ClientsData from "pages/Clients/ClientsData/index";
import UsersPage from "pages/Users";
import AreaList from "pages/maps/index";
import Maps from 'pages/maps/area/index'
import AdSenseData from "pages/AdSenses/AdSenseData";
import Account from "pages/Account";
import CreateArea from "pages/maps/createArea";


function Layout(props) {
  var classes = useStyles();
  var layoutState = useLayoutState();

  return (
    <div className={classes.root}>
        <>
          <Header history={props.history} />
          <Sidebar />
          <div
            className={classnames(classes.content, {
              [classes.contentShift]: layoutState.isSidebarOpened,
            })}
          >
            <div className={classes.fakeToolbar} />
            <Switch>
              <Route path="/app/indicadores" component={Dashboard} />
              <Route exact path="/app/clientes" component={Clients} />
              <Route path="/app/clientes/:idClientes/:idOrder" component={ClientsData} />
              <Route exact path="/app/planos" component={PlanScreen} />
              <Route path="/app/planos/:idPlans" component={PlansData} />
              <Route exact path="/app/solicitacoes" component={Requests} />
              <Route path="/app/solicitacoes/:idOrder" component={RequestsData} />
              <Route path="/app/avaliacoes" component={Evaluations} />
              <Route path="/app/impulsionamentos" component={AdSenses} />
              <Route exact path="/app/usuarios" component={Users} />
              <Route path="/app/usuarios/:uidUser" component={UserData} />
              <Route path="/app/suporte" component={Support} />
              <Route exact path="/app/avaliacoes" component={Evaluations} />
              <Route exact path="/app/impulsionar" component={AdSenses} />
              <Route path="/app/impulsionar/criar-anuncio" component={AdSenseData} />
              <Route path="/app/impulsionar/:id" component={AdSenseData} />
              <Route exact path="/app/minha-conta" component={Account} />
              <Route exact path="/app/usuarios" component={UsersPage} />
              <Route path="/app/usuarios/:id" component={Users} />
              <Route path="/app/usuarios/convidar-usuário" component={Users} />
              <Route exact path="/app/area" component={AreaList} />
              <Route path="/app/area/:id" component={Maps} />
              <Route exact path="/app/criar-area" component={CreateArea} />
            </Switch>          
          </div>
        </>
    </div>
  );
}

export default withRouter(Layout);
