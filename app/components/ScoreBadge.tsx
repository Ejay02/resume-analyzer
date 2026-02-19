interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge = ({ score }: ScoreBadgeProps) => {
  const getBadgeStyles = () => {
    if (score > 69)
      return { classes: "bg-badge-green text-green-600 ", label: "Strong" };
    if (score > 49)
      return {
        classes: "bg-badge-yellow text-yellow-600 ",
        label: "Good Start",
      };
    return { classes: "bg-badge-red text-red-600 ", label: "Needs Work" };
  };

  const { classes, label } = getBadgeStyles();

  return (
    <div
      className={`${classes} inline-flex items-center rounded-full px-3 py-1`}
    >
      <p className="text-xs font-medium">{label}</p>
    </div>
  );
};

export default ScoreBadge;
