import * as React from "react";
import "./Hireprocess.css";

export default function Hireprocess() {
  return (
    <section>
      <h2 className="HireDressSetTitle">The Hiring Process</h2>
      <div className="HireDressSetImg">
        <img src="/process.png" alt="hire process" />
      </div>
    </section>
  );
}
{
  /*

import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const ChevronStep = styled("div")(({ theme }) => ({
  position: "relative",
  flex: 1,
  minHeight: 48,
  padding: "10px 14px",
  background: theme.palette.common.white,
  borderRadius: 6,
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1.2,
  fontSize: 14,

  clipPath:
    "polygon(0% 0%, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0% 100%, 12px 50%)",
  overflow: "hidden",
  userSelect: "none",
}));

export default function Hireprocess({
  active = -1,
  title = "Quick Hiring Process",
  steps = [
    "Select Ceremony",
    "Select Degree and\nMeasurement",
    "Enter Your Details",
    "Pay",
    "Collect Day Before or\nOn Graduation Day",
  ],
}) {
  return (
    <Box sx={{ bgcolor: "primary.main", p: 1.5, borderRadius: 1 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: { xs: "wrap", sm: "nowrap" },
        }}
      >
        <Box
          sx={{
            border: "2px solid #fff",
            borderRadius: 1,
            px: 1.5,
            py: 0.5,
            color: "#fff",
            fontWeight: 700,
            width: "fit-content",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Box>

        <Box
          role="list"
          aria-label="Hiring process steps"
          sx={{ display: "flex", gap: 1, flex: 1, minWidth: 260 }}
        >
          {steps.map((label, i) => (
            <ChevronStep
              role="listitem"
              key={i}
              aria-current={i === active ? "step" : undefined}
              sx={
                i === active
                  ? { fontWeight: 700, background: "#f7f7f7" }
                  : undefined
              }
            >
              <Typography
                component="span"
                sx={{ whiteSpace: "pre-line", color: "text.primary" }}
              >
                {label}
              </Typography>
            </ChevronStep>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

Hireprocess.propTypes = {
  active: PropTypes.number,
  title: PropTypes.string,
  steps: PropTypes.arrayOf(PropTypes.string),
};

*/
}
