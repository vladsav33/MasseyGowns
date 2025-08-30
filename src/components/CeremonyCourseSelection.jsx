import React from "react";
import "./CeremonyCourseSelection.css";

function CeremonyCourseSelection({
  course,
  courses,
  setCourse,
  ceremony,
  ceremonies,
  setCeremony,
}) {
  return (
    <div className="ceremony-course-container">
      {/* Ceremony Section */}
      <h3>Select the ceremony you are reserving robes for</h3>
      <select
        className="dropdown-select"
        value={ceremony || ""}
        onChange={(e) => setCeremony(e.target.value)}
      >
        <option value="">Please select a ceremony...</option>
        {ceremonies.map((ceremonyOption, index) => (
          <option key={index} value={ceremonyOption}>
            {ceremonyOption}
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
        onChange={(e) => setCourse(e.target.value)}
      >
        <option value="">Please select a course...</option>
        {courses.map((courseOption, index) => (
          <option key={index} value={courseOption}>
            {courseOption}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CeremonyCourseSelection;
