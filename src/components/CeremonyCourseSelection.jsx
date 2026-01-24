import React, { useEffect } from "react";
import "./CeremonyCourseSelection.css";

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
  useEffect(() => {
    const savedCeremonyId = showCeremony
      ? localStorage.getItem("selectedCeremonyId")
      : localStorage.getItem("selectedPhotoCeremonyId")
      ? localStorage.getItem("selectedPhotoCeremonyId")
      : 2;
    const savedCourseId = showCeremony
      ? localStorage.getItem("selectedCourseId")
      : localStorage.getItem("selectedPhotoCourseId");

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
    if (id !== null && showCeremony)
      localStorage.setItem("selectedCeremonyId", String(id));
    else localStorage.removeItem("selectedCeremonyId");
    if (id !== null && !showCeremony)
      localStorage.setItem("selectedPhotoCeremonyId", String(id));
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
    else if (id !== null)
      localStorage.setItem("selectedPhotoCourseId", String(id));
    else localStorage.removeItem("selectedPhotoCourseId");
  };

  const selectedCeremonyObj =
    ceremony != null && Array.isArray(ceremonies)
      ? ceremonies.find((c) => c.id === Number(ceremony))
      : null;

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
                  <option
                    key={ceremonyOption.id}
                    value={String(ceremonyOption.id)}
                  >
                    {ceremonyOption.name}
                  </option>
                ))}
          </select>
        </>
      )}

      {selectedCeremonyObj?.content && (
        <div
          className="ceremony-content"
          dangerouslySetInnerHTML={{
            __html: selectedCeremonyObj.content,
          }}
        />
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
