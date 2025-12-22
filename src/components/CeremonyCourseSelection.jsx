import React, { useEffect } from "react";
import "./CeremonyCourseSelection.css";
import { useCmsContent } from "../api/useCmsContent";

function CeremonyCourseSelection({
  showCeremony,
  course,
  courses,
  setCourse,
  ceremony,
  ceremonies,
  setCeremony,
  onCeremonySelect,
  onCourseSelect,
}) {
  const formatDateToDDMMYY = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-4);

    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const savedCeremonyId = showCeremony?localStorage.getItem("selectedCeremonyId"):
        localStorage.getItem("selectedPhotoCeremonyId")?localStorage.getItem("selectedPhotoCeremonyId"):2;
    const savedCourseId = showCeremony?localStorage.getItem("selectedCourseId"):
        localStorage.getItem("selectedPhotoCourseId");

    if (savedCeremonyId) {
      setCeremony(Number(savedCeremonyId));
    }
    if (savedCourseId) {
      setCourse(Number(savedCourseId));
    }
  }, [showCeremony]);

  const handleCeremonyChange = (e) => {
    const val = e.target.value;
    const id = val ? Number(val) : null;

    setCeremony(id);
    onCeremonySelect(id);
    if (id !== null && showCeremony) localStorage.setItem("selectedCeremonyId", String(id));
    else localStorage.removeItem("selectedCeremonyId");
    if (id !== null && !showCeremony) localStorage.setItem("selectedPhotoCeremonyId", String(id));
    else localStorage.removeItem("selectedPhotoCeremonyId");
  };

  const handleCourseChange = (e) => {
    const val = e.target.value;
    const id = val ? Number(val) : null;
    setCourse(id);
    onCourseSelect(id);
    if (showCeremony)
      if (id !== null) localStorage.setItem("selectedCourseId", String(id));
      else localStorage.removeItem("selectedCourseId");
    else
      if (id !== null) localStorage.setItem("selectedPhotoCourseId", String(id));
      else localStorage.removeItem("selectedPhotoCourseId");
  };

  const selectedCeremonyObj =
      ceremony !== 2?(ceremonies && ceremony != null
      ? ceremonies.find((c) => c.id === Number(ceremony))
      : null):ceremony;

  const { getValue } = useCmsContent();
  const intro =
    getValue("hireRegaliaIntro") ||
    "Hire your robes outside graduation time for photos and family functions. Please put the date of your event in the 'Add a Message box' on Page 3. Please allow 2 weeks for us to process the order and for courier delivery.";

  return (
    <div className="ceremony-course-container">
      {showCeremony && (
        <>
          {/* Ceremony Section */}
          <h3>Select the ceremony you are ordering regalia for</h3>
          <select
            className="dropdown-select"
            value={ceremony != null ? String(ceremony) : ""}
            onChange={handleCeremonyChange}
          >
            <option value="">Please select a ceremony...</option>
            {Array.isArray(ceremonies) &&
              ceremonies
                // .sort((a, b) => a.id - b.id)
                .map((ceremonyOption) => (
                  <option key={ceremonyOption.id} value={String(ceremonyOption.id)}>
                    {ceremonyOption.name}
                  </option>
                ))}
          </select>
        </>
      )}

      {selectedCeremonyObj && (
        <>
          {!showCeremony && (
            <p className="info-text">
              {intro}
            </p>
          )}

          {selectedCeremonyObj.id === 1 && (
            <span className="info-text" style={{ textAlign: "left" }}>
              <strong>{selectedCeremonyObj.name}</strong>
              <div className="order-info">
                <h2>
                  DUE DATE FOR ORDERS:{" "}
                  {formatDateToDDMMYY(selectedCeremonyObj.dueDate)}
                </h2>
                <p>
                  <em>
                    <u>
                      (Late orders will be accepted on a first come first served
                      basis, so please order early)
                    </u>
                  </em>
                </p>

                <ol
                  style={{
                    listStyleType: "disc",
                    paddingLeft: "1.5rem",
                  }}
                >
                  <li>Have your credit card ready</li>
                  <li>
                    Have your full height and head measurement ready{" "}
                    <span className="hint">
                      (measure your head just above your eyebrows)
                    </span>
                  </li>
                  <li>Click your qualification below</li>
                </ol>

                <p>
                  <br></br>
                  Information on Collections and Returns can be :
                  <a
                    href="https://www.massey.ac.nz/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Opening Hours &amp; Map
                  </a>
                </p>
              </div>
            </span>
          )}
        </>
      )}

      {/* Course Section */}
      <h3>Select the qualification</h3>
      <select
        className="dropdown-select"
        value={course != null ? String(course) : ""}
        onChange={handleCourseChange}
      >
        <option value="">Please select a qualification...</option>
        {Array.isArray(courses) &&
          courses.map((courseOption) => (
            <option key={courseOption.id} value={String(courseOption.id)}>
              {courseOption.degreeName}
            </option>
          ))}
      </select>
    </div>
  );
}

export default CeremonyCourseSelection;
