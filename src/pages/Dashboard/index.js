import React, { useEffect, useState } from "react";
import { Card, Grid } from "@material-ui/core";
import CardPlans from "./components/CardPlans";
import {
  ResponsiveContainer,
  YAxis,
  XAxis,
  CartesianGrid,
  AreaChart,
  Tooltip,
  Area,
} from "recharts";
import { useSessionContext } from "context/UserSessionContext";
import useStyles from "./styles";
import OvalRed from "../../assets/Oval-red.svg";
import OvalBlue from "../../assets/Oval-blue.svg";
import Widget from "components/Widget/Widget";
import { Typography } from "components/Wrappers/Wrappers";


import { ReactSVG } from "react-svg";
import InfoIconCard from "components/InfoIconCard";
import Requests from "../../images/requests.svg";
import UsersActives from "../../images/users-actives.svg";
import PlansActive from "../../images/plans-active.svg";
import Revenue from "../../images/receitas.svg";

import { useDashboardContext } from "./context";


export default function Dashboard(props) {
  const [bannerUrl] = useState('https://firebasestorage.googleapis.com/v0/b/ieaqui.appspot.com/o/banner%2FbannerFile?alt=media&token=d19c79a1-fa82-462e-96ed-29996eb13572');
  var classes = useStyles();

  const {
    totals,
    top5CompaniesUsers,
    dataGraphic,
    fetchTotals,
    fetchTop5CompaniesUsers,
    fetchDataGraphic,
  } = useDashboardContext();
  const { isLoading, startLoading, finishLoading } = useSessionContext();


  const asyncFetch = async () => {
    startLoading();
    await Promise.all([
      fetchTotals(),
      fetchTop5CompaniesUsers(),
      fetchDataGraphic(),
    ]);
    finishLoading();
  };

  useEffect(() => {
    asyncFetch();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return null;
  }

  if(!dataGraphic){
    return null;
  }

  const data = dataGraphic? [
    {
      name: 'Jan',
      [dataGraphic[0]?.label]: dataGraphic[0]?.data.Jan ,
      [dataGraphic[1]?.label]: dataGraphic[1]?.data.Jan,
    },
    {
      name: 'Fev',
      [dataGraphic[0]?.label]: dataGraphic[0]?.data.Fev ,
      [dataGraphic[1]?.label]: dataGraphic[1]?.data.Fev ,
    },
    {
      name: 'Mar',
      [dataGraphic[0]?.label]: dataGraphic[0]?.data.Mar, 
      [dataGraphic[1]?.label]: dataGraphic[1]?.data.Mar,
    },
    {
      name: 'Abr',
      [dataGraphic[0]?.label]: dataGraphic[0]?.data.Abr, 
      [dataGraphic[1]?.label]: dataGraphic[1]?.data.Abr,
    },
    {
      name: 'Mai',
      [dataGraphic[0]?.label]: dataGraphic[0]?.data.Mai, 
      [dataGraphic[1]?.label]: dataGraphic[1]?.data.Mai,
    },
    {
      name: 'Jun',
      [dataGraphic[0]?.label]: dataGraphic[0]?.data.Jun, 
      [dataGraphic[1]?.label]: dataGraphic[1]?.data.Jun,
    },
    {
      name: 'Jul',
      [dataGraphic[0]?.label]: dataGraphic[0]?.data.Jul, 
      [dataGraphic[1]?.label]: dataGraphic[1]?.data.Jul,
    },
    {
      name: 'Ago',
      [dataGraphic[0]?.label]: dataGraphic[0]?.data.Ago, 
      [dataGraphic[1]?.label]: dataGraphic[1]?.data.Ago,
    },
    {
      name: 'Set',
      [dataGraphic[0]?.label]: dataGraphic[0]?.data.Set, 
      [dataGraphic[1]?.label]: dataGraphic[1]?.data.Set,
    },
    {
      name: 'Out',
      [dataGraphic[0]?.label]: dataGraphic[0]?.data.Out, 
      [dataGraphic[1]?.label]: dataGraphic[1]?.data.Out,
    },
    {
      name: 'Nov',
      [dataGraphic[0]?.label]: dataGraphic[0]?.data.Nov,
      [dataGraphic[1]?.label]: dataGraphic[1]?.data.Nov,
    },
    {
      name: 'Dez',
      [dataGraphic[0]?.label]: dataGraphic[0]?.data.Dez, 
      [dataGraphic[1]?.label]: dataGraphic[1]?.data.Dez,
    },
    
  ] : [];



  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      <Grid container spacing={4}>
        <Grid container item spacing={1}>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <InfoIconCard
              Icon={UsersActives}
              totalNumber={totals.totalActive || 0}
              description="Usuários Ativos"
            />
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <InfoIconCard
              Icon={Requests}
              totalNumber={totals.totalPending || 0}
              description="Solicitações pendentes"
            />
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <InfoIconCard
              Icon={PlansActive}
              totalNumber={totals.impulsePlans || 0}
              description="Planos impulsionados"
            />
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <InfoIconCard
              Icon={Revenue}
              totalNumber={`R$ ${totals.averageRevenue ? Number(totals.averageRevenue / 100).toFixed(2) : "0.00"}`.replace(".", ",")}
              description="Ticket médio"
            />
          </Grid>
        </Grid>

        <Grid item container spacing={3} >
          <Grid item lg={6} md={4} sm={6} xs={12}>
            <Widget
              bodyClass={classes.mainChartBody}
              header={
                <div className={classes.mainChartHeader}>
                  <Typography variant="h6" color="text">
                    Total de Vendas
                  </Typography>
                  <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ReactSVG src={OvalRed}/>
                      <p style={{marginLeft: 8}}>2021</p>
                    </span>
                    <span
                       style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ReactSVG src={OvalBlue} />
                      <p style={{marginLeft: 8}}>2022</p>
                    </span>
                </div>
              }
            >
             <div >
             <ResponsiveContainer width="100%" minWidth={350} height={350}>
                <AreaChart
                  width={730}
                  height={250}
                  data={data}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0, }}
                >
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e41743" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#e41743" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0054FE" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0054FE" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey={dataGraphic[0].label}
                    stroke="#e41743"
                    fillOpacity={1}
                    fill="url(#colorUv)"
                  />
                  <Area
                    type="monotone"
                    dataKey={dataGraphic[1].label}
                    stroke="#0054fe"
                    fillOpacity={1}
                    fill="url(#colorPv)"
                  />
                </AreaChart>
              </ResponsiveContainer>
             </div>
            </Widget>
          </Grid>
          <Grid item lg={6} md={4} sm={6} xs={12}>
            <Widget
              bodyClass={classes.mainChartBody}
              header={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                  className={classes.mainChartHeader}
                >
                  <Typography variant="h6" color="text">
                    Mais vendidos
                  </Typography>
                  <CardPlans top5={top5CompaniesUsers} />
                </div>
              }
            ></Widget>
          </Grid>
        </Grid>
        <Grid container item spacing={4}>
          <Grid item>
            <Card
              style={{
                background: "#E41743",
                width: "300px",
                height: "300px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "8px",
              }}
            >
              <Typography variant="h5" style={{ color: "#ffffff" }}>
                Solicitações não respondidas
              </Typography>
              <Typography
                variant="h1"
                style={{
                  color: "#ffffff",
                  fontSize: "180px",
                  fontWeight: "500",
                  marginTop: "8px",
                }}
              >
                {totals.totalPending}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <div
        style={{
          maxWidth: "250px",
          width: "250px",
          marginLeft: "8px",
          height: "750px",
        }}
      >
        <Card
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={bannerUrl} alt="banner" style={{width: '250px', height: '750px', objectFit: 'cover'}}/>
        </Card>
      </div>
    </div>
  );
}
