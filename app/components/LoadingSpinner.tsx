const LoadingSpinner = () => {
  return (
    <span className="relative -top-[7px] inline-flex items-center gap-0.5">
      <span
        className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500/80"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500/80"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500/80"
        style={{ animationDelay: "300ms" }}
      />
    </span>
  );
};

export default LoadingSpinner;
