import { useEffect, useState } from "react";
import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { usePuterStore } from "~/lib/puter";
import { convertPdfToImage } from "~/lib/pdf2img";

const ResumeCard = ({ resume }: { resume: Resume }) => {
  const { id, companyName, jobTitle, feedback, imagePath, resumePath } = resume;
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    let active = true;

    const loadResume = async () => {
      if (!imagePath && !resumePath) return;

      if (
        imagePath &&
        (imagePath.startsWith("/images/") ||
          imagePath.startsWith("http://") ||
          imagePath.startsWith("https://"))
      ) {
        if (active) {
          setResumeUrl(imagePath);
        }
        return;
      }

      if (imagePath && !imagePath.toLowerCase().endsWith(".pdf")) {
        const blob = await fs.read(imagePath);
        if (!blob || !active) return;

        const url = URL.createObjectURL(blob);
        if (active) {
          setResumeUrl(url);
        }
        return;
      }

      if (!resumePath) return;

      const pdfBlob = await fs.read(resumePath);
      if (!pdfBlob || !active) return;

      const pdfFile = new File([pdfBlob], "resume.pdf", {
        type: "application/pdf",
      });

      const conversion = await convertPdfToImage(pdfFile);
      if (!conversion.imageUrl || conversion.error || !active) return;

      if (active) {
        setResumeUrl(conversion.imageUrl);
      }
    };

    loadResume();

    return () => {
      active = false;
    };
  }, [fs, imagePath, resumePath]);

  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in mb-4 duration-1000"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          {companyName && (
            <h2 className="wrap-break-words font-bold text-black!">
              {companyName}
            </h2>
          )}
          {jobTitle && <h3 className="break-word text-lg">{jobTitle}</h3>}
          {!companyName && !jobTitle && (
            <h2 className="wrap-break-words font-bold text-black!">Resume</h2>
          )}
        </div>

        <div className="shrink-0">
          <ScoreCircle
            score={
              typeof feedback?.overallScore === "number"
                ? feedback.overallScore
                : 0
            }
          />
        </div>
      </div>

      {resumeUrl && (
        <div className="gradient-border animate-in fade-in duration-1000">
          <div className="h-full w-full">
            <img
              src={resumeUrl}
              alt="resume"
              className="h-[350px] w-full object-cover object-top max-sm:h-[200px]"
            />
          </div>
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
