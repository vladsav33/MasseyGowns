import React, { useEffect } from "react";
import "./CeremonyCourseSelection.css";

function CeremonyCourseSelection({
  course,            // selectedCourseId (number | null)
  courses,           // array of courses
  setCourse,         // setSelectedCourseId
  ceremony,          // selectedCeremonyId (number | null)
  ceremonies,        // array of ceremonies
  setCeremony,       // setSelectedCeremonyId
  onCeremonySelect,  // (id) => ...
  onCourseSelect,    // (id) => ...
}) {
  // Restore saved IDs into parent state on mount.
  // IMPORTANT: we do NOT call onCeremonySelect/onCourseSelect here
  // so that the parent doesn't think the user actively changed anything.
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

  // For the "Casual Hire" info text we need the ceremony object (not id)
  const selectedCeremonyObj = ceremonies && ceremony != null
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

      {selectedCeremonyObj &&
        selectedCeremonyObj.name &&
        selectedCeremonyObj.name.includes("Casual Hire") && (
          <p className="info-text">
            Hire your robes outside graduation time for photos and family
            functions.
            <br />
            Please put the date of your event in the 'Add a Message box' on Page
            3.
            <br />
            Please allow 2 weeks for us to process the order and for courier
            delivery.
          </p>
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
