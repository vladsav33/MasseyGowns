import React, { useEffect } from "react";
import "./CeremonyCourseSelection.css";

function CeremonyCourseSelection({
  course,
  courses,
  setCourse,
  ceremony,
  ceremonies,
  setCeremony,
  onCeremonySelect,
  onCourseSelect,
}) {
  
  useEffect(() => {
    const savedCeremonyId = localStorage.getItem("selectedCeremonyId");
    const savedCourseId = localStorage.getItem("selectedCourseId");

    if (savedCeremonyId) {
      setCeremony(Number(savedCeremonyId));
    }
    if (savedCourseId) {
      setCourse(Number(savedCourseId));
    }
  }, [setCeremony, setCourse]);

  const handleCeremonyChange = (e) => {
    const val = e.target.value;
    const id = val ? Number(val) : null;
    // update parent state + call parent handler (this is a user action)
    setCeremony(id);
    onCeremonySelect(id);
    if (id !== null) localStorage.setItem("selectedCeremonyId", String(id));
    else localStorage.removeItem("selectedCeremonyId");
  };

  const handleCourseChange = (e) => {
    const val = e.target.value;
    const id = val ? Number(val) : null;
    setCourse(id);
    onCourseSelect(id);
    if (id !== null) localStorage.setItem("selectedCourseId", String(id));
    else localStorage.removeItem("selectedCourseId");
  };

  const selectedCeremonyObj =
    ceremonies && ceremony != null
      ? ceremonies.find((c) => c.id === Number(ceremony))
      : null;

  return (
    <div className="ceremony-course-container">
      {/* Ceremony Section */}
      <h3>Select the ceremony you are reserving robes for</h3>
      <select
        className="dropdown-select"
        value={ceremony != null ? String(ceremony) : ""}
        onChange={handleCeremonyChange}
      >
        <option value="">Please select a ceremony...</option>
        {Array.isArray(ceremonies) &&
          ceremonies.map((ceremonyOption) => (
            <option key={ceremonyOption.id} value={String(ceremonyOption.id)}>
              {ceremonyOption.name}
            </option>
          ))}
      </select>
      {selectedCeremonyObj && (
        <>
          {selectedCeremonyObj.id === 2 && (
            <p className="info-text">
              Hire your robes outside graduation time for photos and family
              functions. Please put the date of your event in the 'Add a Message
              box' on Page 3. Please allow 2 weeks for us to process the order
              and for courier delivery.
            </p>
          )}

          {selectedCeremonyObj.id === 1 && (
            <p className="info-text" style={{ textAlign: "left" }}>
              <strong>{selectedCeremonyObj.name}</strong>
              <div class="order-info">
                <h2>DUE DATE FOR ORDERS: {selectedCeremonyObj.dueDate}</h2>
                <p>
                  <em>
                    <u>
                      (Late orders will be accepted on a first come first served
                      basis, so please order asap)
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
                    Have your full height and head measurement ready
                    <span class="hint">
                      (measure your head just above your eyebrows, approximately
                      57–59cm)
                    </span>
                  </li>
                  <li>Click your qualification below</li>
                </ol>

                <p>
                  <br></br>
                  Collections and Returns are from our rooms at Massey
                  University. Further information:
                  <a
                    href="https://www.massey.ac.nz/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Opening Hours &amp; Map
                  </a>
                </p>
              </div>
            </p>
          )}
        </>
      )}

      {/* Course Section */}
      <h3>Select the course</h3>
      <select
        className="dropdown-select"
        value={course != null ? String(course) : ""}
        onChange={handleCourseChange}
      >
        <option value="">Please select a course...</option>
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
