import ScoreGuage from "./ScoreGuage";
import ScoreBadge from "./ScoreBadge";

const Category = ({ title, score }: { title: string; score: number }) => {
  const textColor = (() => {
    if (score >= 70) return "text-green-600";
    if (score > 49) return "text-yellow-600";
    return "text-red-600";
  })();

  return (
    <div className="resume-summary">
      <div className="category">
        <div className="flex flex-row items-center justify-center gap-2">
          <p className="text-2xl">{title}</p>
          <ScoreBadge score={score} />
        </div>
        <p className="text-2xl">
          <span className={textColor}>{score}</span> /100
        </p>
      </div>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="w-full rounded-2xl bg-white shadow-md">
      <div className="flex flex-row items-center gap-8 p-4">
        <ScoreGuage score={feedback.overallScore} />

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Your Resume Score</h2>
          <p className="text-sm text-gray-500">
            This score is calculated based on the variables listed below.
          </p>
        </div>
      </div>

      <Category title="Tone & Style" score={feedback?.toneAndStyle?.score} />
      <Category title="Content" score={feedback?.content?.score} />
      <Category title="Structure" score={feedback?.structure?.score} />
      <Category title="Skills" score={feedback?.skills?.score} />
    </div>
  );
};

export default Summary;
