import React from "react";
import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in mb-4 duration-1000"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          <h2 className="wrap-break-words font-bold text-black!">
            {companyName}
          </h2>
          <h3 className="break-word text-lg">{jobTitle}</h3>
        </div>

        <div className="shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>

      <div className="gradient-border animate-in fade-in duration-1000">
        <div className="h-full w-full">
          <img
            src={imagePath}
            alt="resume"
            className="h-[350px] w-full object-cover object-top max-sm:h-[200px]"
          />
        </div>
      </div>
    </Link>
  );
};

export default ResumeCard;
