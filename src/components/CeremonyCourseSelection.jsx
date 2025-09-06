import React from "react";
import "./CeremonyCourseSelection.css";

function CeremonyCourseSelection({
  course,
  courses,
  setCourse,
  ceremony,
  ceremonies,
  setCeremony,
  onCeremonySelect,
  onCourseSelect
}) {
  return (
    <div className="ceremony-course-container">
      {/* Ceremony Section */}
      <h3>Select the ceremony you are reserving robes for</h3>
      <select
        className="dropdown-select"
        value={ceremony || ""}
        onChange={(e) => {
          setCeremony(e.target.value);
          onCeremonySelect(e.target.value);
        }}
      >
        <option value="">Please select a ceremony...</option>
        {Array.isArray(ceremonies) &&
          ceremonies.map((ceremonyOption) => (
            <option key={ceremonyOption.id} value={ceremonyOption.id}>
              {ceremonyOption.name}
            </option>
          ))}
      </select>

      {ceremony && ceremony.includes("Casual Hire") && (
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
        onChange={(e) => { 
          setCourse(e.target.value);
          onCourseSelect(e.target.value);
        }}
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
