import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta() {
  return [
    { title: "Resumind" },
    {
      name: "description",
      content: "Resume analyzer that helps you find the best job for you.",
    },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated, navigate]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const items = (await kv.list("resume:*")) as
        | (string | KVItem)[]
        | undefined;

      if (!items || items.length === 0) {
        setResumes([]);
        setLoadingResumes(false);
        return;
      }

      const parsedResumes = await Promise.all(
        items.map(async (item) => {
          const key = typeof item === "string" ? item : item.key;
          if (!key) return null;

          const value = await kv.get(key);
          if (!value) return null;

          try {
            const data = JSON.parse(value) as unknown;
            if (!data || typeof data !== "object") return null;

            const resume = data as Partial<Resume>;
            if (!resume.id || !resume.imagePath || !resume.feedback)
              return null;
            if (typeof resume.feedback.overallScore !== "number") return null;

            return resume as Resume;
          } catch {
            return null;
          }
        })
      );

      const validResumes = parsedResumes.filter(
        (resume): resume is Resume => resume !== null
      );

      console.error(
        "Home resumes from KV",
        validResumes.map((resume) => ({
          id: resume.id,
          imagePath: resume.imagePath,
          hasFeedback: !!resume.feedback,
        }))
      );

      setResumes(validResumes);
      setLoadingResumes(false);
    };

    loadResumes();
  }, [kv]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track Your Applications & Resume Ratings</h1>
          {!loadingResumes && resumes?.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get started</h2>
          ) : (
            <h2 className="text-lg">
              Review your submissions and get feedback
            </h2>
          )}
        </div>
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" alt="" className="w-[200px]" />
          </div>
        )}
        {!loadingResumes && resumes.length > 0 && (
          <div className="resume-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!loadingResumes && resumes?.length === 0 && (
          <div className="mt-10 flex flex-col items-center justify-center gap-4">
            <Link
              to="/upload"
              className="primary-button w-fit text-xl font-semibold"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
