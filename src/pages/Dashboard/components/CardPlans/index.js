import React from "react";
import { Typography } from "components/Wrappers/Wrappers";

const CardPlans = ({ top5 }) => {
  return (
    <>
      {top5.map((item, index) => {
        return (
          <div
            key={item.name}
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: "5px",
              width: "100%",
              padding: "8px",
              marginTop: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: 'space-between'
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50px",
                background: "#054BEB",
              }}
            >
              <Typography
                variant="h6"
                style={{ color: "#fff", fontSize: "24px", textAlign: "center" }}
              >
                {index + 1}
              </Typography>
            </div>
            <Typography
              variant="h6"
              style={{ color: "#000", fontSize: "16px", marginLeft: "8px" }}
            >
              {item.name}
            </Typography>
            <Typography
              variant="h6"
              style={{
                color: "#000",
                fontSize: "16px",
              }}
            >
              Qtd.: {item.sales}
            </Typography>
          </div>
        );
      })}
    </>
  );
};

export default CardPlans;
