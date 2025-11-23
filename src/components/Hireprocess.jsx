import React, { useEffect, useState } from "react";
import "./Hireprocess.css";

const API_BASE = import.meta.env.VITE_GOWN_API_BASE;

const DEFAULT_STEPS = [
  { num: 1, lines: ["SELECT", "CEREMONY"], blackEnd: "80%" },
  { num: 2, lines: ["SELECT", "DEGREE &", "MEASUREMENT"], blackEnd: "60%" },
  { num: 3, lines: ["ENTER YOUR", "DETAILS"], blackEnd: "40%" },
  { num: 4, lines: ["MAKE A", "PAYMENT"], blackEnd: "20%" },
  { num: 5, lines: ["ORDER", "COMPLETE"], blackEnd: "0%" },
];

export default function Hireprocess() {
  const [title, setTitle] = useState("The Hiring Process");
  const [steps, setSteps] = useState(DEFAULT_STEPS);

  useEffect(() => {
    async function loadCms() {
      try {
        const res = await fetch(`${API_BASE}/api/CmsContent`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            `Failed to load CMS content (${res.status}): ${text}`
          );
        }

        const json = await res.json();
        const blocks = json.data || [];

        const getValue = (key) => {
          const b = blocks.find((x) => x.key === key);
          return b && typeof b.value === "string" ? b.value : null;
        };

        const t = getValue("home.hireprocess.title");
        if (t) setTitle(t);

        const updatedSteps = DEFAULT_STEPS.map((step) => {
          const stepText = getValue(`home.hireprocess.step${step.num}`);
          if (!stepText) return step;
          const lines = stepText
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean);
          return {
            ...step,
            lines: lines.length > 0 ? lines : step.lines,
          };
        });

        setSteps(updatedSteps);
      } catch (err) {
        console.error("Failed to load hire process CMS content", err);
      }
    }

    loadCms();
  }, []);

  return (
    <section className="hire-process">
      <h2 className="HireDressSetTitle">{title}</h2>

      <div className="hire-process__steps">
        {steps.map((step) => (
          <div className="hire-process__step" key={step.num}>
            <div
              className="hire-process__circle"
              style={{ "--blackEnd": step.blackEnd }}
            >
              <div className="hire-process__circle-inner">{step.num}</div>
            </div>

            <div className="hire-process__card">
              <svg
                viewBox="0 0 200 140"
                className="hire-process__svg-box"
                preserveAspectRatio="none"
              >
                <path
                  d="M10 30 L190 10 L190 130 L10 130 Z"
                  fill="none"
                  stroke="#00843d"
                  strokeWidth="4"
                />
              </svg>

              <div className="hire-process__text">
                {step.lines.map((line, i) => (
                  <span key={i}>{line}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
