// src/components/HireprocessWrapper.jsx
import React from "react";
import { useParams } from "react-router-dom";
import Hireprocess from "./Hireprocess";

// 不同学位对应的标题 & 流程步骤
const degreeConfig = {
  certificate: {
    title: "Certificate Hire Process",
    steps: [
      "Select Ceremony",
      "Choose Certificate Gown and\nMeasurement",
      "Enter Your Details",
      "Pay",
      "Collect Before or On Graduation Day",
    ],
  },
  diploma: {
    title: "Diploma / Graduate Diploma / Post Grad Diploma Hire Process",
    steps: [
      "Select Ceremony",
      "Choose Diploma Regalia",
      "Enter Your Details",
      "Pay",
      "Collect Before or On Graduation Day",
    ],
  },
  bachelor: {
    title: "Bachelor Degree Hire Process",
    steps: [
      "Select Ceremony",
      "Select Bachelor Gown, Hood,\nMeasurement",
      "Enter Your Details",
      "Pay",
      "Collect Before or On Graduation Day",
    ],
  },
  master: {
    title: "Master Degree Hire Process",
    steps: [
      "Select Ceremony",
      "Select Master Gown, Hood,\nMeasurement",
      "Enter Your Details",
      "Pay",
      "Collect Before or On Graduation Day",
    ],
  },
  phd: {
    title: "PhD Degree Hire Process",
    steps: [
      "Select Ceremony",
      "Select PhD Gown and\nMeasurement",
      "Enter Your Details",
      "Pay",
      "Collect Before or On Graduation Day",
    ],
  },
  doctoral: {
    title: "Doctoral Degree (DEd, DBusAdmin, DClinPsych, DSW) Hire Process",
    steps: [
      "Select Ceremony",
      "Select Doctoral Regalia",
      "Enter Your Details",
      "Pay",
      "Collect Before or On Graduation Day",
    ],
  },
  "higher-doctoral": {
    title: "Higher Doctoral Degree Hire Process",
    steps: [
      "Select Ceremony",
      "Select Higher Doctoral Regalia",
      "Enter Your Details",
      "Pay",
      "Collect Before or On Graduation Day",
    ],
  },
};

export default function HireprocessWrapper() {
  const { degree } = useParams();

  // 根据 URL 参数找对应配置
  const config = degreeConfig[degree] || {
    title: "Hire Process",
    steps: [
      "Select Ceremony",
      "Select Degree and\nMeasurement",
      "Enter Your Details",
      "Pay",
      "Collect Before or On Graduation Day",
    ],
  };

  return <Hireprocess title={config.title} steps={config.steps} />;
}
