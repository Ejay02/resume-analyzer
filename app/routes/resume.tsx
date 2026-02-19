import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Summary from "~/components/Summary";
import { convertPdfToImages } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "Resumind | Review Resume" },
  { name: "description", content: "Detailed review of your resume" },
];

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      const next = id ? `/resume/${id}` : "/resume";
      navigate(`/auth?next=${next}`);
    }
  }, [auth.isAuthenticated, id, isLoading, navigate]);

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);
      if (!resume) return;
      const data = JSON.parse(resume);

      const resumeBlob = await fs.read(data.resumePath);

      if (!resumeBlob) return;

      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const resumeUrl = URL.createObjectURL(pdfBlob);
      setResumeUrl(resumeUrl);

      const pdfFile = new File([resumeBlob], "resume.pdf", {
        type: "application/pdf",
      });
      const conversion = await convertPdfToImages(pdfFile);
      if (conversion.error) return;
      setImageUrls(conversion.imageUrls);

      setFeedback(data.feedback);
    };

    loadResume();
  }, [fs, id, kv]);

  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="logo" className="h-2.5 w-2.5" />
          <span className="text-sm font-semibold text-gray-800">
            Back to Homepage
          </span>
        </Link>
      </nav>

      <div className="flex w-full flex-row max-lg:flex-col-reverse">
        <section className="feedback-section sticky top-0 h-screen items-center justify-center bg-[url('/images/bg-small.svg')] bg-cover">
          {imageUrls.length > 0 && resumeUrl && (
            <div className="animate-in fade-in gradient-border max-wxl:h-fit flex h-[90%] w-fit flex-col gap-4 overflow-auto duration-1000 max-sm:m-0">
              {imageUrls.map((url, index) => (
                <a href={resumeUrl} key={url} target="_blank" rel="noreferrer">
                  <img
                    src={url}
                    alt={`Resume page ${index + 1}`}
                    className="w-full rounded-2xl object-contain"
                    title={`Resume page ${index + 1}`}
                  />
                </a>
              ))}
            </div>
          )}
        </section>

        <section className="feedback-section">
          <h2 className="text-4xl font-bold text-black">Resume Review</h2>
          {feedback ? (
            <div className="animate-in fade-in flex flex-col gap-8 duration-1000">
              <Summary feedback={feedback} />
              <ATS
                score={feedback.ATS.score || 0}
                suggestions={feedback.ATS.tips || []}
              />
              <Details feedback={feedback} />
            </div>
          ) : (
            <img
              src="/images/resume-scan-2.gif"
              alt="scan"
              className="w-full"
            />
          )}
        </section>
      </div>
    </main>
  );
};

export default Resume;
