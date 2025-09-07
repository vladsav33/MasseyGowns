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
  // Load saved values on mount
  useEffect(() => {
    const savedCeremony = localStorage.getItem("ceremony");
    const savedCourse = localStorage.getItem("course");

    if (savedCeremony) {
      setCeremony(savedCeremony);
      onCeremonySelect(savedCeremony);
    }

    if (savedCourse) {
      setCourse(savedCourse);
      onCourseSelect(savedCourse);
    }
  }, [setCeremony, setCourse, onCeremonySelect, onCourseSelect]);

  const handleCeremonyChange = (e) => {
    const value = e.target.value;
    setCeremony(value);
    onCeremonySelect(value);
    localStorage.setItem("ceremony", value);
  };

  const handleCourseChange = (e) => {
    const value = e.target.value;
    setCourse(value);
    onCourseSelect(value);
    localStorage.setItem("course", value);
  };

  return (
    <div className="ceremony-course-container">
      {/* Ceremony Section */}
      <h3>Select the ceremony you are reserving robes for</h3>
      <select
        className="dropdown-select"
        value={ceremony || ""}
        onChange={handleCeremonyChange}
      >
        <option value="">Please select a ceremony...</option>
        {Array.isArray(ceremonies) &&
          ceremonies.map((ceremonyOption) => (
            <option key={ceremonyOption.id} value={ceremonyOption.id}>
              {ceremonyOption.name}
            </option>
          ))}
      </select>

      {ceremony &&
        typeof ceremony === "string" &&
        ceremony.includes("Casual Hire") && (
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
        value={course || ""}
        onChange={handleCourseChange}
      >
        <option value="">Please select a course...</option>
        {Array.isArray(courses) &&
          courses.map((courseOption) => (
            <option key={courseOption.id} value={courseOption.id}>
              {courseOption.degreeName}
            </option>
          ))}
      </select>
    </div>
  );
}

export default CeremonyCourseSelection;
